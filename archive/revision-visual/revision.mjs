const scene = document.querySelector('.element-scene');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
let inView = false;
let frame = 0;

function resetScene(){if(frame)cancelAnimationFrame(frame);frame=0;if(scene){scene.style.removeProperty('--scene-x');scene.style.removeProperty('--scene-y');}}
function syncMotion(){if(scene)scene.classList.toggle('scene-active',inView&&!reduced.matches&&!document.hidden);if(reduced.matches||!finePointer.matches||!inView)resetScene();}
if(scene&&'IntersectionObserver' in window){new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;syncMotion();},{threshold:.1}).observe(scene);}
if(scene){scene.addEventListener('pointermove',event=>{if(reduced.matches||!finePointer.matches||!inView||frame)return;const rect=scene.getBoundingClientRect();const x=(event.clientX-rect.left)/rect.width-.5;const y=(event.clientY-rect.top)/rect.height-.5;frame=requestAnimationFrame(()=>{scene.style.setProperty('--scene-x',`${-y*5}deg`);scene.style.setProperty('--scene-y',`${x*5}deg`);frame=0;});},{passive:true});scene.addEventListener('pointerleave',resetScene);}
reduced.addEventListener('change',syncMotion);finePointer.addEventListener('change',syncMotion);document.addEventListener('visibilitychange',syncMotion);

const explorer=document.querySelector('.studio-section');
if(explorer){const tabs=[...explorer.querySelectorAll('[role=tab]')];const panels=[...explorer.querySelectorAll('[role=tabpanel]')];function choose(tab,focus=false){tabs.forEach(button=>{const selected=button===tab;button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1;});panels.forEach(panel=>panel.hidden=panel.id!==tab.getAttribute('aria-controls'));if(focus)tab.focus();}tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>choose(tab));tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%tabs.length;else if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();choose(tabs[next],true);});});choose(tabs[0]);explorer.classList.add('studio-ready');}

if('IntersectionObserver' in window&&!reduced.matches){const sections=[...document.querySelectorAll('.studio-heading,.studio-panel,.section-intro,.solution-row,.case-copy,.method-steps article,.closing')];const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.08});sections.forEach(section=>{section.classList.add('reveal');observer.observe(section);});document.body.classList.add('motion-ready');reduced.addEventListener('change',()=>{if(reduced.matches){document.body.classList.remove('motion-ready');sections.forEach(section=>section.classList.add('is-visible'));observer.disconnect();}},{once:true});}
