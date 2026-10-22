import {clamp,storyState,scrollProgress} from './motion-state.mjs';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const hero=document.querySelector('.hero');
const story=document.querySelector('.connection-story');
const stage=story?.querySelector('.assembly-stage');
const cards=[...document.querySelectorAll('.assembly-card')];
const chapters=[...document.querySelectorAll('.connection-chapter')];
const chapterButtons=[...document.querySelectorAll('[data-chapter-target]')];
let scrollFrame=0,currentChapter=-1,heroProgress=0,storyVisible=false;
function paintStory(){if(!story||!stage)return;const rect=story.getBoundingClientRect();const p=reduced.matches?1:scrollProgress(rect.top,rect.height,innerHeight);const state=storyState(p);const w=stage.clientWidth,h=stage.clientHeight;const xScale=w/600,yScale=h/500;story.style.setProperty('--story-p',String(p));story.style.setProperty('--hub-scale',String(.55+state.connect*.45));story.style.setProperty('--hub-angle',String(-32*(1-state.connect)));story.style.setProperty('--hub-opacity',String(.1+state.connect*.9));story.style.setProperty('--line-opacity',String(state.connect));story.style.setProperty('--wire-offset',String(300*(1-state.connect)));story.style.setProperty('--orbit-scale',String(.7+.3*state.connect));story.style.setProperty('--result-opacity',String(state.resolve));
  const scattered=[[-225,-150,-20,25],[-155,165,15,-25],[55,-195,9,30],[235,-150,-18,-20],[200,170,23,20],[-15,165,-11,-15]];
  const targets=[[-195,-100],[-195,100],[0,-175],[195,-100],[195,100],[0,175]];
  cards.forEach((card,i)=>{const from=scattered[i],target=targets[i];const x=(from[0]*(1-state.connect)+target[0]*state.connect)*xScale;const y=(from[1]*(1-state.connect)+target[1]*state.connect)*yScale;card.style.setProperty('--card-x',`${x.toFixed(2)}px`);card.style.setProperty('--card-y',`${y.toFixed(2)}px`);card.style.setProperty('--card-z',`${(1-state.connect)*(i%2?65:-55)}px`);card.style.setProperty('--card-rz',`${from[2]*(1-state.connect)}deg`);card.style.setProperty('--card-ry',`${from[3]*(1-state.connect)}deg`);card.style.setProperty('--card-rx',`${(i%2?-12:12)*(1-state.connect)}deg`);card.style.setProperty('--card-scale',String(1-state.resolve*.06));});
  const chapter=state.chapter;if(chapter!==currentChapter){currentChapter=chapter;chapters.forEach((item,i)=>{item.classList.toggle('is-current',i===chapter);if(reduced.matches)item.removeAttribute('aria-hidden');else item.setAttribute('aria-hidden',String(i!==chapter));item.inert=!reduced.matches&&i!==chapter;});chapterButtons.forEach((button,i)=>{if(i===chapter)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');});const index=story.querySelector('.chapter-index');if(index)index.textContent=`0${chapter+1} / 03`;}
  const heroRect=hero.getBoundingClientRect();heroProgress=clamp(-heroRect.top/(heroRect.height||1));if(!reduced.matches)hero.style.setProperty('--hero-copy-y',`${-heroProgress*60}px`);else hero.style.removeProperty('--hero-copy-y');
}
function requestPaint(){if(scrollFrame)return;scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;paintStory();});}

function sync(){story?.classList.toggle('is-static',reduced.matches);story?.classList.add('static-rendered');story?.classList.toggle('story-running',storyVisible&&!reduced.matches&&!document.hidden);currentChapter=-1;requestPaint();}
const observer=new IntersectionObserver(entries=>{storyVisible=entries[0].isIntersecting;sync();},{threshold:0});if(story)observer.observe(story);
chapterButtons.forEach((button,i)=>button.addEventListener('click',()=>{if(reduced.matches)return;const rect=story.getBoundingClientRect();window.scrollTo({top:scrollY+rect.top+(rect.height-innerHeight)*[.1,.5,.96][i],behavior:'smooth'});}));
addEventListener('scroll',requestPaint,{passive:true});addEventListener('resize',requestPaint,{passive:true});reduced.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);document.addEventListener('element999:preloader:complete',sync);sync();
