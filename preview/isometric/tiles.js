// A single draw call, no framework, downloaded texture, video or shader runtime.
export const TILE_CONFIG = Object.freeze({
  colors: { background:'#070908', face:'#111411', edge:'#252b24', forest:'#236631', green:'#a7ff52', highlight:'#edffd9' },
  tileWidth:220, tileHeight:126, radius:3.2, response:9, colorSpeed:.7,
  maxDPR:1.5, maxPixels:1200000, maxFPS:60, minScale:.55,
});
const VERTEX='attribute vec2 aPosition;void main(){gl_Position=vec4(aPosition,0.,1.);}';
const FRAGMENT=`precision highp float;
uniform vec2 uResolution,uSize,uMouse;uniform float uTime,uRadius;uniform sampler2D uIcons;
uniform vec3 uBackground,uFace,uEdge,uForest,uGreen,uHighlight;
float box(vec2 p,vec2 b,float r){vec2 d=abs(p)-b+r;return length(max(d,0.))+min(max(d.x,d.y),0.)-r;}
vec2 grid(vec2 p){return vec2(p.x/uSize.x+p.y/uSize.y,p.y/uSize.y-p.x/uSize.x);}
void main(){
 vec2 p=vec2(gl_FragCoord.x,uResolution.y-gl_FragCoord.y);p-=uResolution*.5;
 vec2 q=grid(p)+vec2(.32,.68),id=floor(q),local=fract(q)-.5;
 vec2 m=grid(uMouse-uResolution*.5)+vec2(.32,.68)-.5;
 float d=box(local,vec2(.477),.115),aa=1.4/uSize.y;
 float face=1.-smoothstep(-aa,aa,d);
 // Slight vertical extrusion separates the bevel from the deep gaps.
 vec2 underLocal=fract(grid(p-vec2(0.,6.))+vec2(.32,.68))-.5;
 float under=1.-smoothstep(-aa,aa,box(underLocal,vec2(.477),.115));
 float dist=abs(id.x-m.x)+abs(id.y-m.y);
 float power=1.-smoothstep(uRadius-.9,uRadius+.65,dist);
 power=power*power*(3.-2.*power);
 float wave=sin(local.x*4.2+id.y*.6+uTime*.7)+cos(local.y*4.6-id.x*.5-uTime*.5);
 float flow=clamp(.5+wave*.24,0.,1.);
 vec3 ink=mix(uForest,uGreen,smoothstep(.08,.85,flow));
 ink=mix(ink,uHighlight,smoothstep(.45,1.,power)*(.43+.3*smoothstep(.55,1.,flow)));
 float topLight=pow(max(0.,1.-length(local-vec2(-.32,-.3))*.95),5.);
 ink+=uHighlight*topLight*.22;
 vec3 base=uFace+vec3(.009)*(local.x+local.y)+uEdge*topLight*.06;
 vec3 surface=mix(base,ink,power);
 float bevel=1.-smoothstep(0.,.027,abs(d+.012));
 surface+=mix(uEdge*.22,uHighlight*.2,power)*bevel;
 vec3 color=mix(uBackground,vec3(.035,.043,.031)+uForest*power*.24,under);
 color=mix(color,surface,face);
 float kind=mod(id.x+id.y*2.,3.);if(kind<0.)kind+=3.;
 vec2 glyphUV=(local/vec2(.44,.44)+.5);float mask=0.;
 if(all(greaterThan(glyphUV,vec2(0.)))&&all(lessThan(glyphUV,vec2(1.))))mask=texture2D(uIcons,vec2((glyphUV.x+floor(kind))/3.,1.-glyphUV.y)).a;
 vec3 glyph=mix(vec3(.35,.39,.33),mix(uForest,uHighlight,.44),power);
 color=mix(color,glyph,mask*face*.88);
 // Edges remain dark while the responsive light stays concentrated.
 vec2 uv=gl_FragCoord.xy/uResolution;float vignette=1.-.22*smoothstep(.2,.8,length((uv-.5)*vec2(1.,.8)));
 gl_FragColor=vec4(color*vignette,1.);
}`;
const rgb=hex=>hex.match(/[a-f\d]{2}/gi).map(n=>parseInt(n,16)/255);
export function mountTiles(host,config={}){
 const c={...TILE_CONFIG,...config,colors:{...TILE_CONFIG.colors,...config.colors}};
 const canvas=host.querySelector('canvas');if(!canvas)return()=>{};
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const abort=new AbortController(),opts={signal:abort.signal};
 let gl,program,buffer,texture,shaders=[],uniforms={},frame=0,visible=false,disposed=false,lost=false;
 let w=1,h=1,scale=1,mouse={x:.5,y:.5},target={x:.5,y:.5},inside=false,lastInput=0;
 let last=0,clock=0,samples=[],sampleStart=0,frames=0,since=0;
 const report={renderer:'webgl',frames:0,averageFPS:null,resolutionScale:1,adaptations:0};host.tileMetrics=report;
 const fallback=()=>{report.renderer='css';host.dataset.tiles='fallback';canvas.hidden=true;};
 function shader(type,source){const s=gl.createShader(type);shaders.push(s);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
 function release(lose=false){if(!gl)return;gl.deleteTexture(texture);gl.deleteBuffer(buffer);gl.deleteProgram(program);shaders.forEach(s=>gl.deleteShader(s));if(lose)gl.getExtension('WEBGL_lose_context')?.loseContext();}
 try{
  gl=canvas.getContext('webgl',{alpha:false,antialias:false,depth:false,powerPreference:'low-power',preserveDrawingBuffer:false});
  if(!gl)throw Error('WebGL unavailable');program=gl.createProgram();
  gl.attachShader(program,shader(gl.VERTEX_SHADER,VERTEX));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,FRAGMENT));gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);
  buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const position=gl.getAttribLocation(program,'aPosition');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
  for(const name of ['Resolution','Size','Mouse','Time','Radius','Icons','Background','Face','Edge','Forest','Green','Highlight'])uniforms[name]=gl.getUniformLocation(program,'u'+name);
  for(const [name,value]of Object.entries(c.colors))gl.uniform3fv(uniforms[name[0].toUpperCase()+name.slice(1)],rgb(value));
  // Tiny monochrome icon atlas generated in memory from the Element999 mark.
  const atlas=document.createElement('canvas');atlas.width=384;atlas.height=128;const ctx=atlas.getContext('2d');ctx.strokeStyle='#fff';ctx.fillStyle='#fff';ctx.lineWidth=9;ctx.lineCap='round';ctx.lineJoin='round';
  ctx.beginPath();ctx.moveTo(83,34);ctx.lineTo(57,34);ctx.bezierCurveTo(26,34,26,94,57,94);ctx.lineTo(83,94);ctx.stroke();ctx.beginPath();ctx.arc(85,63,9,0,Math.PI*2);ctx.fill();
  ctx.save();ctx.translate(192,64);for(let i=0;i<12;i++){ctx.rotate(Math.PI/6);ctx.beginPath();ctx.moveTo(0,13);ctx.lineTo(0,34);ctx.lineWidth=i%2?3:4;ctx.stroke();}ctx.restore();
  ctx.font='bold 41px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('999',320,65);
  texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,atlas);gl.uniform1i(uniforms.Icons,0);
  host.dataset.tiles='webgl';
 }catch(error){release();fallback();return()=>abort.abort();}
 function resize(){const r=host.getBoundingClientRect();w=Math.max(1,r.width);h=Math.max(1,r.height);const dpr=Math.min(devicePixelRatio||1,c.maxDPR,Math.sqrt(c.maxPixels/(w*h)))*scale;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);gl.viewport(0,0,canvas.width,canvas.height);render();}
 function render(){if(disposed||lost)return;const sx=canvas.width/w,sy=canvas.height/h;const unit=w<600?.72:1;gl.uniform2f(uniforms.Resolution,canvas.width,canvas.height);gl.uniform2f(uniforms.Size,c.tileWidth*unit*sx,c.tileHeight*unit*sy);gl.uniform2f(uniforms.Mouse,mouse.x*canvas.width,mouse.y*canvas.height);gl.uniform1f(uniforms.Time,clock*c.colorSpeed);gl.uniform1f(uniforms.Radius,c.radius);gl.drawArrays(gl.TRIANGLES,0,6);}
 function allowed(){return visible&&!document.hidden&&!disposed&&!lost&&!document.documentElement.classList.contains('preloader-pending');}
 function tick(now){frame=0;if(!allowed()||reduced.matches)return;frame=requestAnimationFrame(tick);if(now-last<1000/c.maxFPS-1)return;const dt=Math.min(.1,(now-last)/1000||.016);if(last&&now-last<250)samples.push(now-last);last=now;clock+=dt;
  if(!inside&&now-lastInput>1800){target.x=.5+Math.sin(clock*.34)*.19;target.y=.5+Math.cos(clock*.29)*.18;}
  const ease=1-Math.exp(-c.response*dt);mouse.x+=(target.x-mouse.x)*ease;mouse.y+=(target.y-mouse.y)*ease;
  render();report.frames=++frames;report.resolutionScale=scale;
  if(!since)since=now;if(!sampleStart)sampleStart=now;
  if(now-sampleStart>1000&&samples.length>15){const avg=samples.reduce((a,b)=>a+b,0)/samples.length;report.averageFPS=Math.round(1000/avg);if(report.averageFPS<45&&scale>c.minScale){scale=Math.max(c.minScale,scale*.8);report.adaptations++;resize();}samples=[];sampleStart=now;}
 }
 function sync(){cancelAnimationFrame(frame);frame=0;last=0;sampleStart=0;samples=[];if(allowed()){if(reduced.matches){clock=0;mouse={x:.5,y:.5};render();}else frame=requestAnimationFrame(tick);}}
 function pointer(e){if(reduced.matches)return;const r=host.getBoundingClientRect();target.x=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));target.y=Math.max(0,Math.min(1,(e.clientY-r.top)/r.height));inside=e.pointerType!=='touch';lastInput=performance.now();host.dataset.interaction=e.pointerType||'mouse';}
 host.addEventListener('pointermove',pointer,opts);host.addEventListener('pointerdown',pointer,opts);host.addEventListener('pointerleave',()=>{inside=false;lastInput=performance.now();},opts);host.addEventListener('pointerup',e=>{if(e.pointerType==='touch')inside=false;},opts);
 host.addEventListener('focus',()=>{inside=true;target={x:.5,y:.5};},opts);host.addEventListener('blur',()=>{inside=false;},opts);
 host.addEventListener('keydown',e=>{const delta={ArrowLeft:[-.08,0],ArrowRight:[.08,0],ArrowUp:[0,-.08],ArrowDown:[0,.08]}[e.key];if(!delta||reduced.matches)return;e.preventDefault();inside=true;target.x=Math.max(0,Math.min(1,target.x+delta[0]));target.y=Math.max(0,Math.min(1,target.y+delta[1]));host.dataset.interaction='keyboard';},opts);
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;sync();fallback();},opts);
 document.addEventListener('visibilitychange',sync,opts);document.addEventListener('element999:preloader:complete',sync,opts);reduced.addEventListener('change',sync,opts);
 const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{rootMargin:'0px'});intersection.observe(host);
 const observer=new ResizeObserver(resize);observer.observe(host);resize();
 function dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(frame);intersection.disconnect();observer.disconnect();abort.abort();release(!lost);canvas.width=canvas.height=1;report.disposed=true;}
 window.addEventListener('pagehide',e=>{if(!e.persisted)dispose();else{cancelAnimationFrame(frame);frame=0;}},opts);window.addEventListener('pageshow',sync,opts);
 return dispose;
}
for(const host of document.querySelectorAll('[data-isometric]'))mountTiles(host);
