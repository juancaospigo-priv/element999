export const clamp = (value,min=0,max=1) => Math.min(max,Math.max(min,Number.isFinite(value)?value:min));
export function smooth(a,b,value){const t=clamp((value-a)/(b-a||1));return t*t*(3-2*t);}
export function storyState(progress){const p=clamp(progress);return {progress:p,connect:smooth(.14,.55,p),resolve:smooth(.56,.91,p),chapter:p<.34?0:p<.72?1:2};}
export function scrollProgress(top,height,viewport){return clamp(-top/Math.max(1,height-viewport));}
