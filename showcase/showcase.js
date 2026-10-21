const DATA_URL=new URL('./projects.json',import.meta.url);
const NS='http://www.w3.org/2000/svg';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const make=(tag,className,text)=>{const e=document.createElement(tag);if(className)e.className=className;if(text)e.textContent=text;return e;};
const url=(value,base=DATA_URL)=>{const u=new URL(value,base);if(!['https:','http:'].includes(u.protocol))throw Error('Unsupported project URL');return u;};
let dialog=null,returnFocus=null,bodyOverflow='',frameResize=null;
function closePreview(){if(!dialog?.open)return;dialog.close();}
function makeDialog(){if(dialog)return;dialog=make('dialog','work-dialog');dialog.setAttribute('aria-label','Vista interactiva del proyecto');
 const head=make('div','work-dialog-head'),title=make('strong'),actions=make('div','work-dialog-actions');
 const desktop=make('button','','Escritorio'),mobile=make('button','','Móvil'),external=make('a','','Abrir web ↗'),close=make('button','','Cerrar ×');
 for(const b of [desktop,mobile,close])b.type='button';external.target='_blank';external.rel='noopener noreferrer';
 const area=make('div','work-frame-area'),shell=make('div','work-frame-shell'),note=make('p','work-preview-note','Vista en directo. Si la web limita su visualización aquí, ábrela en una pestaña nueva.');
 let device='desktop',iframe=null;
 const layout=()=>{if(!iframe)return;const width=device==='mobile'?390:1440,height=device==='mobile'?844:960;const scale=Math.min(1,(area.clientWidth-32)/width,(innerHeight*.72-32)/height);shell.style.width=width*scale+'px';shell.style.height=height*scale+'px';iframe.style.width=width+'px';iframe.style.height=height+'px';iframe.style.transform=`scale(${scale})`;};
 const choose=value=>{device=value;desktop.setAttribute('aria-pressed',String(value==='desktop'));mobile.setAttribute('aria-pressed',String(value==='mobile'));layout();};
 desktop.addEventListener('click',()=>choose('desktop'));mobile.addEventListener('click',()=>choose('mobile'));close.addEventListener('click',closePreview);
 actions.append(desktop,mobile,external,close);head.append(title,actions);area.append(shell);dialog.append(head,area,note);document.body.append(dialog);
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closePreview();}});
 dialog.addEventListener('close',()=>{frameResize?.disconnect();frameResize=null;iframe?.remove();iframe=null;document.body.style.overflow=bodyOverflow;returnFocus?.focus();});
 dialog.openProject=(project,trigger)=>{returnFocus=trigger;bodyOverflow=document.body.style.overflow;document.body.style.overflow='hidden';title.textContent=project.name;external.href=project.url;
  iframe=document.createElement('iframe');iframe.title='Web de '+project.name;iframe.referrerPolicy='no-referrer';iframe.setAttribute('sandbox','allow-scripts allow-forms allow-same-origin allow-popups');iframe.src=project.url;shell.replaceChildren(iframe);dialog.showModal();choose('desktop');frameResize=new ResizeObserver(layout);frameResize.observe(area);close.focus();};
}
function picture(project,index,scope){const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 720 480');svg.setAttribute('preserveAspectRatio','none');svg.setAttribute('aria-hidden','true');
 const defs=document.createElementNS(NS,'defs'),clip=document.createElementNS(NS,'clipPath'),shape=document.createElementNS(NS,'path');const clipId=`work-${scope}-${index}`;clip.id=clipId;const path='M24 40 Q360 -20 696 40 Q720 42 720 66 L720 414 Q720 438 696 441 Q360 500 24 441 Q0 438 0 414 L0 66 Q0 42 24 40 Z';shape.setAttribute('d',path);clip.append(shape);
 const grad=document.createElementNS(NS,'linearGradient');grad.id=clipId+'-shade';grad.setAttribute('x1','0');grad.setAttribute('y1','0');grad.setAttribute('x2','0');grad.setAttribute('y2','1');for(const[o,color]of [['0%','#0000'],['58%','#0000'],['100%','#000e']]){const stop=document.createElementNS(NS,'stop');stop.setAttribute('offset',o);stop.setAttribute('stop-color',color);grad.append(stop);}defs.append(clip,grad);
 const fill=document.createElementNS(NS,'path');fill.setAttribute('d',path);fill.setAttribute('fill','#162016');
 const image=document.createElementNS(NS,'image');image.setAttribute('href',url(project.cover).href);image.setAttribute('width','720');image.setAttribute('height','480');image.setAttribute('preserveAspectRatio','xMidYMin slice');image.setAttribute('clip-path',`url(#${clipId})`);
 const shade=document.createElementNS(NS,'path');shade.setAttribute('d',path);shade.setAttribute('fill',`url(#${grad.id})`);shade.setAttribute('stroke','#a7ff5233');shade.setAttribute('stroke-width','1');svg.append(defs,fill,image,shade);return svg;}
export async function mountShowcase(host,scope=0){
 const abort=new AbortController(),opts={signal:abort.signal};let disposed=false,raf=0,visible=false,drag=null,suppressClick=0,current=-1,resize;
 const stage=make('div','work-stage'),track=make('div','work-track');track.tabIndex=0;track.setAttribute('role','region');track.setAttribute('aria-roledescription','carrusel');track.setAttribute('aria-label','Webs seleccionadas. Usa las flechas o arrastra para explorar.');
 const loading=make('p','work-loading','Preparando el trabajo seleccionado…');loading.setAttribute('role','status');track.append(loading);stage.append(track);host.append(stage);
 try{
  const response=await fetch(DATA_URL,{signal:abort.signal});if(!response.ok)throw Error('Project catalog not available');const data=await response.json();
  const projects=(data.projects||[]).filter(p=>p.featured!==false).map(p=>({...p,url:url(p.url).href,cover:url(p.cover).href}));if(disposed)return;
  track.replaceChildren();if(!projects.length){track.append(make('p','work-empty','Próximamente, nuevos proyectos.'));return;}
  const nav=make('div','work-nav'),actions=make('div','work-actions'),previous=make('button','','←'),next=make('button','','→'),count=make('span','work-count'),hint=make('span','work-hint','ARRASTRA PARA EXPLORAR');
  previous.type=next.type='button';previous.setAttribute('aria-label','Proyecto anterior');next.setAttribute('aria-label','Proyecto siguiente');count.setAttribute('aria-live','polite');count.setAttribute('aria-atomic','true');actions.append(previous,count,next);nav.append(actions,hint);
  if(host.dataset.allProjects){const all=make('a','work-all','Ver todos los proyectos ↗');all.href=host.dataset.allProjects;nav.append(all);}host.append(nav);
  const cards=projects.map((project,index)=>{const card=make('article','work-card'),link=make('a','work-card-link');link.href=project.url;link.target='_blank';link.rel='noopener noreferrer';link.setAttribute('aria-label',project.name+' — abrir web en una pestaña nueva');
   link.append(picture(project,index,scope));const caption=make('div','work-card-caption'),text=make('div'),category=make('small','',project.category||'Web'),name=make('strong','',project.name),arrow=make('span','work-card-arrow','↗');arrow.setAttribute('aria-hidden','true');text.append(category,name);caption.append(text,arrow);link.append(caption);card.append(link);
   if(project.embed===true){const preview=make('button','work-live','Explorar aquí ↗');preview.type='button';preview.setAttribute('aria-label','Ver '+project.name+' dentro del portafolio');preview.addEventListener('click',()=>{makeDialog();dialog.openProject(project,preview);},opts);card.append(preview);}track.append(card);return card;});
  function update(){raf=0;if(disposed||!visible)return;let closest=0,distance=Infinity;cards.forEach((card,index)=>{const x=card.offsetLeft+card.offsetWidth/2-track.scrollLeft-track.clientWidth/2;const ratio=Math.max(-1.6,Math.min(1.6,x/(card.offsetWidth+22)));card.style.transform=reduced.matches?'none':`perspective(1400px) rotateY(${-ratio*23}deg) rotateZ(${ratio*.8}deg) scale(${1-Math.abs(ratio)*.07})`;if(Math.abs(x)<distance){distance=Math.abs(x);closest=index;}});
   cards.forEach((card,index)=>card.classList.toggle('is-current',index===closest));if(current!==closest){current=closest;count.textContent=String(current+1).padStart(2,'0')+' / '+String(cards.length).padStart(2,'0');previous.disabled=current===0;next.disabled=current===cards.length-1;host.dataset.current=String(current);}}
  const schedule=()=>{if(!raf)raf=requestAnimationFrame(update);};
  function go(index){const card=cards[Math.max(0,Math.min(cards.length-1,index))];track.scrollTo({left:card.offsetLeft-(track.clientWidth-card.offsetWidth)/2,behavior:reduced.matches?'instant':'smooth'});schedule();}
  previous.addEventListener('click',()=>go(current-1),opts);next.addEventListener('click',()=>go(current+1),opts);track.addEventListener('scroll',schedule,{...opts,passive:true});
  track.addEventListener('keydown',e=>{const target={ArrowLeft:current-1,ArrowRight:current+1,Home:0,End:cards.length-1}[e.key];if(target!==undefined){e.preventDefault();go(target);}},opts);
  track.addEventListener('pointerdown',e=>{if(e.button!==0||e.target.closest('button'))return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,left:track.scrollLeft,moved:false};},opts);
  track.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(!drag.moved&&Math.abs(dy)>Math.abs(dx)+8){drag=null;return;}if(Math.abs(dx)>7){drag.moved=true;track.classList.add('is-dragging');if(!track.hasPointerCapture(e.pointerId))track.setPointerCapture(e.pointerId);e.preventDefault();track.scrollLeft=drag.left-dx;schedule();}},opts);
  function endDrag(e){if(!drag)return;const ended=drag;drag=null;let nearest=0,best=Infinity;cards.forEach((card,index)=>{const distance=Math.abs(card.offsetLeft+card.offsetWidth/2-track.scrollLeft-track.clientWidth/2);if(distance<best){best=distance;nearest=index;}});if(track.hasPointerCapture(ended.id))track.releasePointerCapture(ended.id);track.classList.remove('is-dragging');if(ended.moved){suppressClick=performance.now()+300;go(nearest);schedule();}}
  track.addEventListener('pointerup',endDrag,opts);track.addEventListener('pointercancel',endDrag,opts);track.addEventListener('lostpointercapture',e=>{if(e.target===track)endDrag(e);},opts);
  track.addEventListener('click',e=>{if(performance.now()<suppressClick){e.preventDefault();e.stopPropagation();}},{...opts,capture:true});track.addEventListener('dragstart',e=>e.preventDefault(),opts);
  reduced.addEventListener('change',schedule,opts);resize=new ResizeObserver(schedule);resize.observe(track);
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)schedule();});observer.observe(host);
  function cleanup(){disposed=true;cancelAnimationFrame(raf);resize.disconnect();observer.disconnect();abort.abort();}
  window.addEventListener('pagehide',e=>{if(!e.persisted)cleanup();},opts);host.dataset.showcaseReady='true';
 }catch(error){if(error.name==='AbortError')return;track.replaceChildren(make('p','work-empty','No se pudo cargar el portafolio. Recarga la página para intentarlo de nuevo.'));host.dataset.showcaseReady='error';}
}
const pending=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){pending.unobserve(entry.target);mountShowcase(entry.target,entry.target.dataset.showcaseScope);}}},{rootMargin:'400px'});
[...document.querySelectorAll('[data-showcase]')].forEach((host,index)=>{host.dataset.showcaseScope=String(index);pending.observe(host);});
