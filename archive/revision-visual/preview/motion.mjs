import {clamp,smooth,storyState,scrollProgress} from './motion-state.mjs';
import {sculptureRenderer} from './sculpture-gl.mjs?v=3';

const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const fine=matchMedia('(hover: hover) and (pointer: fine)');
const hero=document.querySelector('.hero');
const scene=document.querySelector('.element-scene');
const canvas=document.querySelector('#element-canvas');
const story=document.querySelector('.connection-story');
const stage=story?.querySelector('.assembly-stage');
const cards=[...document.querySelectorAll('.assembly-card')];
const chapters=[...document.querySelectorAll('.connection-chapter')];
const chapterButtons=[...document.querySelectorAll('[data-chapter-target]')];
let width=1,height=1,heroVisible=true,storyVisible=false,animation=0,lastFrame=-Infinity,start=performance.now(),scrollFrame=0;
let pointer={x:0,y:0},smoothed={x:0,y:0},heroProgress=0,currentChapter=-1;
const ctx=canvas?.getContext('2d',{alpha:true});

// A toroidal C and its detached element are shaded and projected from actual 3D geometry.
const mesh=[];
const norm=(x,y,z)=>{const d=Math.hypot(x,y,z)||1;return [x/d,y/d,z/d];};
const light=norm(-.7,-.8,1.5),halfLight=norm(light[0],light[1],light[2]+1);
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
function torusPoint(a,b){const R=1.06,r=.205;return {p:[(R+r*Math.cos(b))*Math.cos(a),(R+r*Math.cos(b))*Math.sin(a),r*Math.sin(b)],n:[Math.cos(b)*Math.cos(a),Math.cos(b)*Math.sin(a),Math.sin(b)]};}
for(let i=0;i<100;i++){const a=.57+(Math.PI*2-1.14)*i/100,aa=.57+(Math.PI*2-1.14)*(i+1)/100;for(let j=0;j<16;j++){const b=j/16*Math.PI*2,bb=(j+1)/16*Math.PI*2;mesh.push({v:[torusPoint(a,b).p,torusPoint(aa,b).p,torusPoint(aa,bb).p,torusPoint(a,bb).p],n:torusPoint((a+aa)/2,(b+bb)/2).n,group:Math.floor(i/10),a:(a+aa)/2,sphere:false});}}
function spherePoint(a,b){const n=[Math.sin(a)*Math.cos(b),Math.cos(a),Math.sin(a)*Math.sin(b)];return {p:[1.07+n[0]*.215,n[1]*.215,n[2]*.215+.1],n};}
for(let i=0;i<14;i++){for(let j=0;j<20;j++){const a=i/14*Math.PI,aa=(i+1)/14*Math.PI,b=j/20*Math.PI*2,bb=(j+1)/20*Math.PI*2;mesh.push({v:[spherePoint(a,b).p,spherePoint(aa,b).p,spherePoint(aa,bb).p,spherePoint(a,bb).p],n:spherePoint((a+aa)/2,(b+bb)/2).n,group:10,a:0,sphere:true});}}
for(const [angle,direction,group]of [[.57,-1,0],[Math.PI*2-.57,1,9]]){const center=[Math.cos(angle)*1.06,Math.sin(angle)*1.06,0];for(let j=0;j<16;j++){const a=torusPoint(angle,j/16*Math.PI*2).p,b=torusPoint(angle,(j+1)/16*Math.PI*2).p;mesh.push({v:[center,a,b,center],n:[-Math.sin(angle)*direction,Math.cos(angle)*direction,0],group,a:angle,sphere:false,cap:true});}}
let glRenderer=null;
const glCanvas=document.createElement('canvas');glCanvas.className='gl-sculpture';glCanvas.setAttribute('aria-hidden','true');canvas.after(glCanvas);
try{glRenderer=sculptureRenderer(glCanvas,mesh);}catch(error){console.warn('Symbol lighting fallback enabled.',error.message);}
if(!glRenderer)glCanvas.hidden=true;
glCanvas.addEventListener('webglcontextlost',event=>{event.preventDefault();glRenderer=null;glCanvas.hidden=true;canvas.dataset.renderer='canvas';});
function rotate(v,rx,ry,rz){let [x,y,z]=v;let c=Math.cos(rx),s=Math.sin(rx);[y,z]=[y*c-z*s,y*s+z*c];c=Math.cos(ry);s=Math.sin(ry);[x,z]=[x*c+z*s,-x*s+z*c];c=Math.cos(rz);s=Math.sin(rz);return [x*c-y*s,x*s+y*c,z];}
function project(v,scale,cx,cy){const perspective=4.8/(4.8-v[2]);return [cx+v[0]*scale*perspective,cy+v[1]*scale*perspective];}
function render(time,settled=false){if(!ctx)return;const mobile=width<500;const seconds=time/1000;const intro=settled?1:clamp((time-start)/2100);const steady=reduced.matches?0:seconds;const rx=-.23+Math.sin(steady*.19)*.14-smoothed.y*.28,ry=-.42+Math.sin(steady*.13)*.23+smoothed.x*.35+heroProgress*.6,rz=-.27+Math.sin(steady*.1)*.09+heroProgress*.48;
  const scale=Math.min(width*.31,height*.325)*(1+heroProgress*.1),cx=width*.5,cy=height*.485;
  ctx.clearRect(0,0,width,height);
  const halo=ctx.createRadialGradient(cx,cy,scale*.25,cx,cy,scale*1.9);halo.addColorStop(0,'#a7ff5212');halo.addColorStop(.5,'#355e2110');halo.addColorStop(1,'#080b0900');ctx.fillStyle=halo;ctx.fillRect(0,0,width,height);
  // Sparse particles provide depth; no full-screen particle layer or external media.
  const particleCount=mobile?36:64;for(let i=0;i<particleCount;i++){const angle=i*2.39996+steady*(i%2?.014:-.011),r=1.45+(i%9)/13;const p=project(rotate([Math.cos(angle)*r,Math.sin(angle)*r,(i%7-3)*.13],rx*.5,ry*.5,rz*.5),scale,cx,cy);ctx.globalAlpha=(.14+(i%5)*.07)*smooth(0,.8,intro);ctx.fillStyle=i%7===0?'#c9ff9b':'#729960';ctx.beginPath();ctx.arc(p[0],p[1],i%7===0?1.5:.7,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
  function orbit(front){ctx.beginPath();for(let i=0;i<=180;i++){const a=i/180*Math.PI*2+steady*.025;const v=rotate([Math.cos(a)*1.7,Math.sin(a)*1.7,0],1.04,front?.66:-.74,front?-.65:.8);const p=project(v,scale,cx,cy);if(i===0)ctx.moveTo(...p);else ctx.lineTo(...p);}ctx.strokeStyle=front?'#a7ff5236':'#728d4930';ctx.lineWidth=.7;ctx.stroke();}
  orbit(false);
  if(!glRenderer){
  const projected=[];
  for(const face of mesh){const arrival=smooth(face.group*.028,.65+face.group*.028,intro);const separation=(1-arrival);const offset=[Math.cos(face.a)*separation*.95,Math.sin(face.a)*separation*.95,separation*(face.group%2?1.9:-1.2)];const normal=rotate(face.n,rx,ry,rz);const vertices=face.v.map(v=>rotate([v[0]+offset[0],v[1]+offset[1],v[2]+offset[2]],rx,ry,rz+(1-arrival)*.75));const depth=vertices.reduce((sum,v)=>sum+v[2],0)/4;if(normal[2]<-.35&&intro>.9)continue;const diffuse=Math.max(0,dot(normal,light)),spec=Math.pow(Math.max(0,dot(normal,halfLight)),25),rim=Math.pow(1-Math.abs(normal[2]),3);const r=Math.round(16+diffuse*92+spec*168+rim*13),g=Math.round(30+diffuse*156+spec*80+rim*25),b=Math.round(9+diffuse*22+spec*145+rim*5);projected.push({points:vertices.map(v=>project(v,scale,cx,cy)),depth,color:`rgb(${Math.min(255,r)},${Math.min(255,g)},${Math.min(255,b)})`,alpha:smooth(0,.22,intro)*(.35+.65*arrival)});}
  projected.sort((a,b)=>a.depth-b.depth);
  for(const face of projected){ctx.globalAlpha=face.alpha;ctx.beginPath();face.points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fillStyle=face.color;ctx.fill();ctx.strokeStyle=face.color;ctx.lineWidth=.7;ctx.stroke();}
  }else{glRenderer.draw({rx,ry,rz,scaleX:2*scale/width,scaleY:2*scale/height,arrival:intro});}
  ctx.globalAlpha=1;orbit(true);
  // A restrained moving highlight reveals the sculptural surface.
  const sparkAngle=steady*.36+1.1;const spark=project(rotate([Math.cos(sparkAngle)*1.7,Math.sin(sparkAngle)*1.7,0],1.04,.66,-.65),scale,cx,cy);const sparkGlow=ctx.createRadialGradient(...spark,0,...spark,10);sparkGlow.addColorStop(0,'#d9ffad88');sparkGlow.addColorStop(1,'#a7ff5200');ctx.fillStyle=sparkGlow;ctx.fillRect(spark[0]-10,spark[1]-10,20,20);
  canvas.dataset.renderer=glRenderer?'webgl':'canvas';canvas.dataset.rendered='true';canvas.dataset.assembled=String(intro>=1);
}
function awaitingPreloader(){return document.documentElement.classList.contains('preloader-pending')&&!document.documentElement.classList.contains('preloader-revealing');}
function loop(now){animation=0;if(!heroVisible||reduced.matches||document.hidden||awaitingPreloader())return;const fps=width<500?24:30;if(now-lastFrame>1000/fps){smoothed.x+=(pointer.x-smoothed.x)*.07;smoothed.y+=(pointer.y-smoothed.y)*.07;render(now);lastFrame=now;}animation=requestAnimationFrame(loop);}
function startLoop(){if(ctx&&heroVisible&&!animation&&!reduced.matches&&!document.hidden&&!awaitingPreloader())animation=requestAnimationFrame(loop);}
function resize(){if(!canvas||!ctx)return;const rect=canvas.getBoundingClientRect();width=Math.max(1,rect.width);height=Math.max(1,rect.height);const dpr=Math.min(devicePixelRatio||1,width<500?1.25:1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);if(glRenderer)glRenderer.resize(canvas.width,canvas.height);scene.classList.add('sculpture-ready');render(performance.now(),reduced.matches);}
function paintStory(){if(!story||!stage)return;const rect=story.getBoundingClientRect();const p=reduced.matches?1:scrollProgress(rect.top,rect.height,innerHeight);const state=storyState(p);const w=stage.clientWidth,h=stage.clientHeight;const xScale=w/600,yScale=h/500;story.style.setProperty('--story-p',String(p));story.style.setProperty('--hub-scale',String(.55+state.connect*.45));story.style.setProperty('--hub-angle',String(-32*(1-state.connect)));story.style.setProperty('--hub-opacity',String(.1+state.connect*.9));story.style.setProperty('--line-opacity',String(state.connect));story.style.setProperty('--wire-offset',String(300*(1-state.connect)));story.style.setProperty('--orbit-scale',String(.7+.3*state.connect));story.style.setProperty('--result-opacity',String(state.resolve));
  const scattered=[[-225,-150,-20,25],[-155,165,15,-25],[55,-195,9,30],[235,-150,-18,-20],[200,170,23,20],[-15,165,-11,-15]];
  const targets=[[-195,-100],[-195,100],[0,-175],[195,-100],[195,100],[0,175]];
  cards.forEach((card,i)=>{const from=scattered[i],target=targets[i];const x=(from[0]*(1-state.connect)+target[0]*state.connect)*xScale;const y=(from[1]*(1-state.connect)+target[1]*state.connect)*yScale;card.style.setProperty('--card-x',`${x.toFixed(2)}px`);card.style.setProperty('--card-y',`${y.toFixed(2)}px`);card.style.setProperty('--card-z',`${(1-state.connect)*(i%2?65:-55)}px`);card.style.setProperty('--card-rz',`${from[2]*(1-state.connect)}deg`);card.style.setProperty('--card-ry',`${from[3]*(1-state.connect)}deg`);card.style.setProperty('--card-rx',`${(i%2?-12:12)*(1-state.connect)}deg`);card.style.setProperty('--card-scale',String(1-state.resolve*.06));});
  const chapter=state.chapter;if(chapter!==currentChapter){currentChapter=chapter;chapters.forEach((item,i)=>{item.classList.toggle('is-current',i===chapter);if(reduced.matches)item.removeAttribute('aria-hidden');else item.setAttribute('aria-hidden',String(i!==chapter));item.inert=!reduced.matches&&i!==chapter;});chapterButtons.forEach((button,i)=>{if(i===chapter)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');});const index=story.querySelector('.chapter-index');if(index)index.textContent=`0${chapter+1} / 03`;}
  const heroRect=hero.getBoundingClientRect();heroProgress=clamp(-heroRect.top/(heroRect.height||1));if(!reduced.matches)hero.style.setProperty('--hero-copy-y',`${-heroProgress*60}px`);else hero.style.removeProperty('--hero-copy-y');
}
function requestPaint(){if(scrollFrame)return;scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;paintStory();});}
function sync(){if(reduced.matches||document.hidden||awaitingPreloader()){if(animation)cancelAnimationFrame(animation);animation=0;}story?.classList.toggle('is-static',reduced.matches);story?.classList.add('static-rendered');if(story)story.classList.toggle('story-running',storyVisible&&!reduced.matches&&!document.hidden);currentChapter=-1;requestPaint();if(reduced.matches){pointer={x:0,y:0};smoothed={x:0,y:0};render(performance.now(),true);}else startLoop();}
if('IntersectionObserver' in window){new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;if(heroVisible)startLoop();else if(animation){cancelAnimationFrame(animation);animation=0;}},{rootMargin:'100px'}).observe(hero);new IntersectionObserver(entries=>{storyVisible=entries[0].isIntersecting;story.classList.toggle('story-running',storyVisible&&!reduced.matches&&!document.hidden);},{threshold:0}).observe(story);}
scene?.addEventListener('pointermove',event=>{if(!fine.matches||reduced.matches)return;const rect=scene.getBoundingClientRect();pointer={x:(event.clientX-rect.left)/rect.width-.5,y:(event.clientY-rect.top)/rect.height-.5};},{passive:true});scene?.addEventListener('pointerleave',()=>{pointer={x:0,y:0};});
document.querySelector('.replay-sequence')?.addEventListener('click',()=>{if(reduced.matches)return;start=performance.now();const elements=[...hero.querySelectorAll('.hero-line>span,.hero .eyebrow,.hero-description,.hero-actions,.hero-footnote')];elements.forEach((element,i)=>{element.getAnimations().forEach(animation=>animation.cancel());element.animate([{opacity:0,transform:`translateY(${i<2?'110%':'18px'})`},{opacity:1,transform:'translateY(0)'}],{duration:1100,delay:i*90,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});});startLoop();});
chapterButtons.forEach((button,i)=>button.addEventListener('click',()=>{if(reduced.matches)return;const positions=[.1,.5,.96];const rect=story.getBoundingClientRect();window.scrollTo({top:scrollY+rect.top+(rect.height-innerHeight)*positions[i],behavior:'smooth'});}));
addEventListener('scroll',requestPaint,{passive:true});addEventListener('resize',()=>{resize();requestPaint();},{passive:true});reduced.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);if('ResizeObserver' in window)new ResizeObserver(()=>{resize();requestPaint();}).observe(scene);resize();sync();requestPaint();

let preloaderRevealed=false;
document.addEventListener("element999:preloader:reveal",()=>{preloaderRevealed=true;start=performance.now();sync();});
document.addEventListener("element999:preloader:complete",()=>{if(!preloaderRevealed)start=performance.now();sync();});
