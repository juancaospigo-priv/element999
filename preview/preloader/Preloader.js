export const PRELOADER_CONFIG = Object.freeze({
  colors: ['#050807', '#173021', '#72b63b', '#d2ff9d'],
  speed: {rest: 0.075, loaded: 0.27},
  turbulence: 1.05,
  depth: 1.15,
  minDurationMs: 1800,
  revealDurationMs: 1200,
  revealBezier: [0.22, 1, 0.36, 1],
  counterLerp: 7.5,
  mouseLerp: 8,
  maxDPR: 2,
  maxRenderPixels: 1500000,
  minResolutionScale: 0.42,
  lowFPSThreshold: 45,
  fpsSampleMs: 500,
  maxFPS: 60,
  assetTimeoutMs: 9000,
  sessionKey: 'element999:fluid-preloader:v1',
  force: false,
  forceParam: 'preloader', // ?preloader=force (or =1); =0 disables it for development.
  brand: 'element999',
  criticalAssets: [],
});

const root = document.documentElement;
const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));
const mix = (a,b,t) => a + (b-a)*t;
const smooth = (a,b,n) => {const t=clamp((n-a)/(b-a));return t*t*(3-2*t);};
const hex = value => value.replace('#','').match(/.{2}/g).map(v=>parseInt(v,16)/255);
const emit = (name, detail) => document.dispatchEvent(new CustomEvent(`element999:preloader:${name}`, {detail}));
function bezier(t, [x1,y1,x2,y2]) {
  const cubic=(s,a,b)=>3*(1-s)*(1-s)*s*a+3*(1-s)*s*s*b+s*s*s;
  let lo=0,hi=1,s=t;
  for(let i=0;i<12;i++){s=(lo+hi)/2;if(cubic(s,x1,x2)<t)lo=s;else hi=s;}
  return cubic(s,y1,y2);
}

class AssetTracker {
  constructor(config, signal, onProgress) {this.config=config;this.signal=signal;this.onProgress=onProgress;this.results=[];this.total=0;}
  async run(tasks) {
    this.total=tasks.length;
    if(!tasks.length){this.onProgress(1);return [];}
    await Promise.all(tasks.map(async task=>{
      let timer;
      try {
        await Promise.race([task.run(),new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('timeout')),this.config.assetTimeoutMs);})]);
        this.results.push({asset:task.name,status:'ready'});
      } catch(error) {this.results.push({asset:task.name,status:error.message==='timeout'?'timeout':'error'});}
      finally {clearTimeout(timer);if(!this.signal.aborted)this.onProgress(this.results.length/this.total);}
    }));
    return this.results;
  }
}

export class FluidPreloader {
  constructor(config = {}) {
    this.config={...PRELOADER_CONFIG,...config,speed:{...PRELOADER_CONFIG.speed,...config.speed}};
    this.abort=new AbortController();this.signal=this.abort.signal;this.startAt=performance.now();
    this.actual=0;this.displayed=0;this.flowTime=0;this.revealAt=0;this.reveal=0;this.raf=0;
    this.lastAt=this.startAt;this.lastDraw=0;this.frames=[];this.sample=[];this.scale=1;this.adaptations=[];
    this.mouse={x:.5,y:.5};this.targetMouse={x:.5,y:.5};this.drag={x:0,y:0};this.pointerAt=0;
    this.origin={x:.5,y:.5};this.pointerUsed=false;this.gl=null;this.glResources=null;
    this.disposed=false;this.allSettled=false;this.initializingGL=false;this.mode='css';this.liveMilestone=-1;
    this.reduced=matchMedia('(prefers-reduced-motion: reduce)');
    this.done=new Promise(resolve=>{this.resolve=resolve;});
  }

  start() {
    this.mount();this.lock();
    this.mode=this.reduced.matches?'reduced':'css';this.node.dataset.mode=this.mode;
    this.node.classList.add('is-ready');
    const tracker=new AssetTracker(this.config,this.signal,p=>{this.actual=Math.max(this.actual,p);this.node.dataset.progress=String(Math.round(this.actual*100));});
    this.tracker=tracker;
    const tasks=this.assetTasks();
    this.totalAssets=tasks.length;
    tracker.run(tasks).then(()=>{if(!this.disposed){this.actual=1;this.allSettled=true;}});
    this.listen();this.resize();this.raf=requestAnimationFrame(now=>this.tick(now));
    emit('start',{mode:this.mode,totalAssets:tasks.length});
    return this.done;
  }

  mount() {
    this.node=document.createElement('div');this.node.className='fluid-preloader';this.node.id='element999-preloader';
    this.node.setAttribute('aria-label','Preparando Element999');
    this.node.innerHTML=`<div class="fluid-backdrop" aria-hidden="true"></div><canvas aria-hidden="true"></canvas><div class="fluid-ui"><div class="fluid-topline"><span>ELEMENT999</span><span>EL ELEMENTO QUE FALTA</span></div><p class="fluid-brand"></p><div class="fluid-lower"><div class="fluid-counter" role="status" aria-live="polite" aria-atomic="true"><span class="fluid-number" aria-hidden="true">000</span><span class="fluid-sr-only">Preparando la experiencia, 0 por ciento.</span></div><p>PROCESO / DATO / DECISIÓN</p><div class="fluid-progress-track" aria-hidden="true"><div class="fluid-progress-fill"></div></div><div class="fluid-bottomline"><span>INTELIGENCIA EN ESTADO LÍQUIDO</span><span class="fluid-load-state">PREPARANDO LA EXPERIENCIA</span></div></div></div>`;
    this.node.querySelector('.fluid-brand').textContent=this.config.brand;
    this.canvas=this.node.querySelector('canvas');this.counter=this.node.querySelector('.fluid-number');
    this.live=this.node.querySelector('.fluid-sr-only');this.ui=this.node.querySelector('.fluid-ui');
    this.savedFocus=document.activeElement;
    document.body.prepend(this.node);
    root.classList.add('preloader-pending','preloader-mounted');
  }

  lock() {
    this.scroll={x:scrollX,y:scrollY};this.bodyStyles={};
    const names=['position','top','left','right','width','overflow','padding-right'];
    for(const name of names)this.bodyStyles[name]=[document.body.style.getPropertyValue(name),document.body.style.getPropertyPriority(name)];
    const scrollbar=innerWidth-root.clientWidth;
    Object.assign(document.body.style,{position:'fixed',top:`-${this.scroll.y}px`,left:`-${this.scroll.x}px`,right:'0',width:'100%',overflow:'hidden'});
    if(scrollbar>0)document.body.style.paddingRight=`${scrollbar}px`;
    this.inertNodes=[...document.body.children].filter(el=>el!==this.node&&!['SCRIPT','STYLE','LINK'].includes(el.tagName)).map(el=>[el,el.inert]);
    this.inertNodes.forEach(([el])=>el.inert=true);
  }

  watch(element, success, isReady) {
    return new Promise((resolve,reject)=>{
      let ended=false;
      const finish=(error)=>{if(ended)return;ended=true;cleanup();error?reject(error):resolve();};
      const ready=()=>finish();const error=()=>finish(new Error('asset failed'));
      const aborted=()=>finish(new Error('aborted'));
      const pageLoaded=()=>{if(element.tagName==='LINK'&&!element.sheet)error();else if(element.tagName==='IMG'&&!element.naturalWidth)error();else ready();};
      const cleanup=()=>{element.removeEventListener(success,ready);element.removeEventListener('error',error);window.removeEventListener('load',pageLoaded);this.signal.removeEventListener('abort',aborted);};
      element.addEventListener(success,ready,{once:true});element.addEventListener('error',error,{once:true});
      this.signal.addEventListener('abort',aborted,{once:true});
      if(isReady()){ready();return;}
      if(element.tagName==='IMG'&&element.complete){error();return;}
      if(['SCRIPT','LINK','IMG'].includes(element.tagName)){
        if(document.readyState==='complete')pageLoaded();else window.addEventListener('load',pageLoaded,{once:true});
      }
      if(element.tagName==='VIDEO'&&element.preload==='none'){element.preload='auto';element.load();}
    });
  }

  assetTasks() {
    const tasks=[];
    tasks.push({name:'document.fonts.ready',run:async()=>{if(document.fonts)await document.fonts.ready;if(this.glResources)this.createBrandMask();}});
    for(const img of document.images){if(!img.currentSrc&&!img.srcset&&!img.getAttribute('src'))continue;if(img.loading==='lazy'&&!img.hasAttribute('data-critical'))continue;tasks.push({name:img.currentSrc||img.src||'image',run:()=>this.watch(img,'load',()=>img.complete&&img.naturalWidth>0)});}
    for(const video of document.querySelectorAll('video[data-critical],video[data-preload]'))tasks.push({name:video.currentSrc||video.getAttribute('src')||'critical video',run:()=>this.watch(video,'loadeddata',()=>video.readyState>=2)});
    for(const link of document.querySelectorAll('link[rel=stylesheet]'))tasks.push({name:link.href,run:()=>this.watch(link,'load',()=>Boolean(link.sheet))});
    for(const script of document.querySelectorAll('script[data-critical]'))tasks.push({name:script.src,run:()=>this.watch(script,'load',()=>document.readyState==='complete')});
    for(const url of this.config.criticalAssets)tasks.push({name:url,run:async()=>{const response=await fetch(url,{signal:this.signal});if(!response.ok)throw new Error('asset HTTP error');await response.arrayBuffer();}});
    if(!this.reduced.matches){
      for(const [name,property] of [['fluid.vert','vertexSource'],['fluid.frag','fragmentSource']])tasks.push({name,run:async()=>{const response=await fetch(new URL(name,import.meta.url),{signal:this.signal});if(!response.ok)throw new Error('shader HTTP error');this[property]=await response.text();this.maybeInitGL();}});
    }
    return tasks;
  }

  maybeInitGL() {
    if(this.disposed||this.reduced.matches||this.initializingGL||!this.vertexSource||!this.fragmentSource)return;
    this.initializingGL=true;
    let gl;
    try {
      gl=this.canvas.getContext('webgl',{alpha:true,antialias:false,depth:false,stencil:false,premultipliedAlpha:false,powerPreference:'low-power'});
      if(!gl)return;
      this.gl=gl;this.glResources={shaders:[],program:null,buffer:null,texture:null,uniforms:{}};
      const compile=(type,source)=>{const shader=gl.createShader(type);this.glResources.shaders.push(shader);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(shader));return shader;};
      const derivative=Boolean(gl.getExtension('OES_standard_derivatives'));
      const prefix=derivative?'#extension GL_OES_standard_derivatives : enable\n#define USE_DERIVATIVES\n':'';
      const vertex=compile(gl.VERTEX_SHADER,this.vertexSource),fragment=compile(gl.FRAGMENT_SHADER,prefix+this.fragmentSource);
      const program=gl.createProgram();this.glResources.program=program;gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));
      gl.useProgram(program);
      const buffer=gl.createBuffer();this.glResources.buffer=buffer;gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
      const position=gl.getAttribLocation(program,'aPosition');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
      for(const name of ['uResolution','uTime','uProgress','uBrand','uReveal','uTurbulence','uDepth','uMouse','uDrag','uMouseStrength','uOrigin','uBrandRect','uBrandMask','uColor0','uColor1','uColor2','uColor3'])this.glResources.uniforms[name]=gl.getUniformLocation(program,name);
      gl.disable(gl.DEPTH_TEST);gl.disable(gl.BLEND);gl.clearColor(0,0,0,0);
      this.mode='webgl';this.node.dataset.mode='webgl';this.createBrandMask();this.resize();
    } catch(error) {
      this.shaderError=error.message;this.releaseGL(false);this.mode='css';this.node.dataset.mode='css';
    }
  }

  createBrandMask() {
    if(!this.gl||!this.glResources||this.disposed)return;
    const gl=this.gl,mask=document.createElement('canvas');mask.width=2048;mask.height=512;
    const context=mask.getContext('2d');context.fillStyle='#000';context.fillRect(0,0,mask.width,mask.height);
    let size=320;context.font=`500 ${size}px Arial,Helvetica,sans-serif`;
    size*=Math.min(1,(mask.width-90)/context.measureText(this.config.brand).width);
    context.font=`500 ${size}px Arial,Helvetica,sans-serif`;context.fillStyle='#fff';context.textAlign='center';context.textBaseline='middle';context.fillText(this.config.brand,1024,256);
    if(this.glResources.texture)gl.deleteTexture(this.glResources.texture);
    const texture=gl.createTexture();this.glResources.texture=texture;gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,mask);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);mask.width=mask.height=1;
  }

  resize() {
    if(this.disposed)return;
    this.width=innerWidth;this.height=innerHeight;
    const dpr=Math.min(devicePixelRatio||1,this.config.maxDPR);
    const pixelLimit=Math.sqrt(this.config.maxRenderPixels/(this.width*this.height));
    this.effectiveDPR=Math.min(dpr,pixelLimit)*this.scale;
    this.canvas.width=Math.max(1,Math.round(this.width*this.effectiveDPR));this.canvas.height=Math.max(1,Math.round(this.height*this.effectiveDPR));
    if(this.gl)this.gl.viewport(0,0,this.canvas.width,this.canvas.height);
    this.node.dataset.renderScale=this.scale.toFixed(3);
  }

  listen() {
    const options={passive:true,signal:this.signal};
    const point=(x,y)=>{this.targetMouse={x:clamp(x/innerWidth),y:clamp(1-y/innerHeight)};this.pointerUsed=true;this.pointerAt=performance.now();};
    this.node.addEventListener('pointermove',event=>point(event.clientX,event.clientY),options);
    this.node.addEventListener('pointerdown',event=>point(event.clientX,event.clientY),options);
    this.node.addEventListener('touchmove',event=>{if(event.touches[0])point(event.touches[0].clientX,event.touches[0].clientY);},options);
    addEventListener('resize',()=>this.resize(),options);
    document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(this.raf);this.raf=0;}else if(!this.disposed){this.lastAt=performance.now();this.lastDraw=0;this.raf=requestAnimationFrame(now=>this.tick(now));}},{signal:this.signal});
    this.reduced.addEventListener('change',()=>{if(this.reduced.matches){this.releaseGL(true);this.mode='reduced';this.node.dataset.mode='reduced';}},{signal:this.signal});
    this.canvas.addEventListener('webglcontextlost',event=>{if(this.disposed)return;event.preventDefault();this.releaseGL(false);this.mode=this.reduced.matches?'reduced':'css';this.node.dataset.mode=this.mode;},{signal:this.signal});
    addEventListener('pagehide',()=>this.destroy(false),{once:true,signal:this.signal});
  }

  draw(now) {
    const gl=this.gl,r=this.glResources;if(!gl||!r)return;
    const u=r.uniforms,c=this.config;gl.useProgram(r.program);
    gl.uniform2f(u.uResolution,this.canvas.width,this.canvas.height);gl.uniform1f(u.uTime,this.flowTime);gl.uniform1f(u.uProgress,this.displayed);gl.uniform1f(u.uReveal,this.reveal);
    gl.uniform1f(u.uBrand,smooth(.65,1,this.displayed)*smooth(.35,1.45,(now-this.startAt)/1000));gl.uniform1f(u.uTurbulence,c.turbulence);gl.uniform1f(u.uDepth,c.depth);
    gl.uniform2f(u.uMouse,this.mouse.x,this.mouse.y);gl.uniform2f(u.uDrag,this.drag.x,this.drag.y);gl.uniform1f(u.uMouseStrength,clamp(Math.hypot(this.drag.x,this.drag.y)*40,.15,2));gl.uniform2f(u.uOrigin,this.origin.x,this.origin.y);
    const textWidth=Math.min(this.width*.86,1180),textHeight=textWidth/4;
    gl.uniform4f(u.uBrandRect,.5,.51,textWidth/this.width,textHeight/this.height);
    gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,r.texture);gl.uniform1i(u.uBrandMask,0);
    c.colors.forEach((color,index)=>gl.uniform3fv(u[`uColor${index}`],hex(color)));
    gl.drawArrays(gl.TRIANGLES,0,6);
  }

  tick(now) {
    if(this.disposed)return;
    const dt=Math.min(.08,Math.max(.001,(now-this.lastAt)/1000));this.lastAt=now;
    this.displayed=Math.min(this.actual,mix(this.displayed,this.actual,1-Math.exp(-dt*this.config.counterLerp)));
    if(this.actual===1&&1-this.displayed<.0008)this.displayed=1;
    const old={...this.mouse},lerp=1-Math.exp(-dt*this.config.mouseLerp);
    this.mouse.x=mix(this.mouse.x,this.targetMouse.x,lerp);this.mouse.y=mix(this.mouse.y,this.targetMouse.y,lerp);
    this.drag.x=mix(this.drag.x,(this.mouse.x-old.x)/dt*.045,.2);this.drag.y=mix(this.drag.y,(this.mouse.y-old.y)/dt*.045,.2);
    this.flowTime+=dt*mix(this.config.speed.rest,this.config.speed.loaded,this.displayed);
    const value=this.displayed===1?100:Math.floor(this.displayed*100);
    this.counter.textContent=String(value).padStart(3,'0');this.node.style.setProperty('--load-progress',String(this.displayed));this.node.dataset.visualProgress=String(value);
    const milestone=Math.floor(value/20);if(milestone!==this.liveMilestone){this.liveMilestone=milestone;this.live.textContent=value===100?'Carga completada. Element999 está listo.':`Preparando la experiencia, ${milestone*20} por ciento.`;}
    if(this.displayed>.78)this.node.classList.add('brand-ready');
    if(!this.revealAt&&this.allSettled&&this.displayed===1&&now-this.startAt>=this.config.minDurationMs)this.beginReveal(now);
    if(this.revealAt){const duration=this.mode==='reduced'?300:this.config.revealDurationMs;const fraction=clamp((now-this.revealAt)/duration);this.reveal=bezier(fraction,this.config.revealBezier);if(this.mode!=='webgl')this.node.style.setProperty('--cutout',`${this.reveal*Math.hypot(this.width,this.height)*1.15}px`);if(fraction>=1){this.destroy(true);return;}}
    if(now-this.lastDraw>=1000/this.config.maxFPS-1){
      if(this.lastDraw&&now-this.startAt>250){const delta=now-this.lastDraw;this.frames.push(delta);this.sample.push(delta);const sum=this.sample.reduce((a,b)=>a+b,0);if(sum>=this.config.fpsSampleMs){const fps=this.sample.length*1000/sum;if(this.gl&&fps<this.config.lowFPSThreshold&&this.scale>this.config.minResolutionScale+.001){this.scale=Math.max(this.config.minResolutionScale,this.scale*.78);this.adaptations.push({fps:Math.round(fps),scale:this.scale});this.resize();}this.sample=[];}}
      this.lastDraw=now;this.draw(now);
    }
    this.raf=requestAnimationFrame(time=>this.tick(time));
  }

  beginReveal(now) {
    this.revealAt=now;
    this.origin=this.pointerUsed?{...this.mouse}:{x:.5,y:.5};
    this.node.style.setProperty('--reveal-x',`${this.origin.x*100}%`);this.node.style.setProperty('--reveal-y',`${(1-this.origin.y)*100}%`);
    this.node.querySelector('.fluid-load-state').textContent='ELEMENT999 / LISTO';
    this.node.classList.add('is-exiting');root.classList.add('preloader-revealing');
    emit('reveal',{elapsedMs:now-this.startAt,origin:this.origin});
  }

  releaseGL(loseContext) {
    const gl=this.gl,r=this.glResources;this.gl=null;this.glResources=null;
    if(!gl||!r)return;
    try {if(r.texture)gl.deleteTexture(r.texture);if(r.buffer)gl.deleteBuffer(r.buffer);if(r.program)gl.deleteProgram(r.program);r.shaders.forEach(shader=>gl.deleteShader(shader));if(loseContext)gl.getExtension('WEBGL_lose_context')?.loseContext();}catch{}
  }

  destroy(markSeen) {
    if(this.disposed)return;this.disposed=true;
    cancelAnimationFrame(this.raf);this.abort.abort();
    this.releaseGL(true);
    this.node?.remove();
    for(const [name,[value,priority]] of Object.entries(this.bodyStyles||{})){if(value)document.body.style.setProperty(name,value,priority);else document.body.style.removeProperty(name);}
    this.inertNodes?.forEach(([node,wasInert])=>{if(node.isConnected)node.inert=wasInert;});
    root.classList.remove('preloader-pending','preloader-mounted','preloader-revealing');
    if(this.scroll)scrollTo({top:this.scroll.y,left:this.scroll.x,behavior:'instant'});
    if(this.savedFocus?.isConnected&&this.savedFocus!==document.body)this.savedFocus.focus({preventScroll:true});
    if(markSeen){try{sessionStorage.setItem(this.config.sessionKey,'seen');}catch{}}
    const sorted=[...this.frames].sort((a,b)=>a-b),average=this.frames.length?this.frames.reduce((a,b)=>a+b,0)/this.frames.length:0;
    const result={completed:markSeen,mode:this.mode,elapsedMs:Math.round(performance.now()-this.startAt),assetCount:this.totalAssets,assets:this.tracker?.results||[],shaderError:this.shaderError||null,averageFPS:average?Math.round(1000/average):null,steadyFPS:this.frames.length?Math.round(1000/(this.frames.slice(-30).reduce((a,b)=>a+b,0)/Math.min(30,this.frames.length))):null,p95FrameMs:sorted.length?Math.round(sorted[Math.floor((sorted.length-1)*.95)]):null,adaptations:this.adaptations,finalScale:this.scale,effectiveDPR:this.effectiveDPR,resourcesDisposed:true};
    emit('complete',result);this.resolve(result);
  }
}

export function startPreloader(config={}) {
  const c={...PRELOADER_CONFIG,...config},params=new URLSearchParams(location.search);
  if(root.dataset.preloaderWatchdog){clearTimeout(Number(root.dataset.preloaderWatchdog));delete root.dataset.preloaderWatchdog;}
  if(document.querySelector('#element999-preloader'))return Promise.resolve({skipped:true,reason:'already mounted'});
  let seen=false;try{seen=sessionStorage.getItem(c.sessionKey)==='seen';}catch{}
  const flag=params.get(c.forceParam),force=c.force||flag==='force'||flag==='1';
  if(flag==='0'||(seen&&!force)){
    root.classList.remove('preloader-pending','preloader-mounted','preloader-revealing');emit('complete',{skipped:true});return Promise.resolve({skipped:true});
  }
  const instance=new FluidPreloader(config);
  try{return instance.start();}catch(error){instance.destroy(false);return Promise.resolve({completed:false,error:error.message});}
}

startPreloader();
