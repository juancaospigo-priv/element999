const {chromium}=require('/Users/juancamilo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');const fs=require('node:fs/promises');
const out='/private/tmp/element999-revision-visual/qa-preloader';
async function instrument(page){await page.addInitScript(()=>{
  window.preloaderResults=[];window.preloaderReveals=[];window.preloaderResources={created:{},deleted:{},lost:0,mouse:[]};
  document.addEventListener('element999:preloader:complete',event=>window.preloaderResults.push(event.detail));
  document.addEventListener('element999:preloader:reveal',event=>window.preloaderReveals.push(event.detail));
  const original=HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext=function(type,...args){const gl=original.call(this,type,...args);if(type==='webgl'&&gl&&this.closest('.fluid-preloader')&&!gl.__instrumented){gl.__instrumented=true;const stats=window.preloaderResources;for(const kind of ['Buffer','Program','Shader','Texture']){for(const [prefix,bucket]of [['create','created'],['delete','deleted']]){const name=prefix+kind,method=gl[name].bind(gl);gl[name]=(...args)=>{stats[bucket][kind]=(stats[bucket][kind]||0)+1;return method(...args);};}}const names=new Map(),get=gl.getUniformLocation.bind(gl);gl.getUniformLocation=(...args)=>{const location=get(...args);names.set(location,args[1]);return location;};const two=gl.uniform2f.bind(gl);gl.uniform2f=(location,x,y)=>{if(names.get(location)==='uMouse')stats.mouse=[x,y];return two(location,x,y);};const extension=gl.getExtension.bind(gl);gl.getExtension=name=>{const value=extension(name);if(name==='WEBGL_lose_context'&&value){return {loseContext:()=>{stats.lost++;value.loseContext();}};}return value;};}return gl;};
});}
async function completion(page,timeout=25000){await page.waitForFunction(()=>window.preloaderResults.some(x=>x.completed),{},{timeout});return page.evaluate(()=>window.preloaderResults.find(x=>x.completed));}
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));await instrument(page);
await page.goto('http://127.0.0.1:4173/?preloader=force',{waitUntil:'domcontentloaded'});
await page.waitForSelector('.fluid-preloader[data-mode=webgl]');
assert.equal(await page.locator('#main').evaluate(el=>el.inert),true);
await page.mouse.move(1036,280);
await page.waitForTimeout(650);
await page.screenshot({path:out+'/fluido-carga.png'});
const progress=await page.locator('.fluid-preloader').evaluate(e=>({real:Number(e.dataset.progress),visual:Number(e.dataset.visualProgress),mode:e.dataset.mode}));assert(progress.visual<=progress.real);
await page.waitForFunction(()=>document.querySelector('.fluid-preloader')?.classList.contains('brand-ready'));
await page.screenshot({path:out+'/marca-emergiendo.png'});
const normal=await completion(page);assert(normal.elapsedMs>=2950);assert.equal(normal.mode,'webgl');assert.equal(normal.shaderError,null);assert(normal.assets.every(a=>a.status==='ready'));
await page.waitForSelector('#element999-preloader',{state:'detached'});
assert.equal(await page.locator('#main').evaluate(el=>el.inert),false);assert.equal(await page.evaluate(()=>document.body.style.position),'');
const resources=await page.evaluate(()=>window.preloaderResources);for(const kind of ['Buffer','Program','Shader','Texture'])assert.equal(resources.created[kind],resources.deleted[kind],kind);assert.equal(resources.lost,1);assert(resources.mouse[0]>.65&&resources.mouse[1]>.6);
await page.goto('http://127.0.0.1:4173/?session-test=1');await page.waitForFunction(()=>window.preloaderResults.some(x=>x.skipped));assert.equal(await page.locator('#element999-preloader').count(),0);

const reduced=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await instrument(reduced);await reduced.goto('http://127.0.0.1:4173/?preloader=force');await reduced.waitForSelector('.fluid-preloader[data-mode=reduced]');await reduced.screenshot({path:out+'/reducido-movil.png'});const reducedResult=await completion(reduced);assert.equal(reducedResult.mode,'reduced');assert.equal((await reduced.evaluate(()=>window.preloaderResources)).created.Program,undefined);

const fallback=await browser.newPage({viewport:{width:390,height:844}});await instrument(fallback);await fallback.addInitScript(()=>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){if(type==='webgl'&&this.closest('.fluid-preloader'))return null;return get.call(this,type,...args);};});await fallback.goto('http://127.0.0.1:4173/?preloader=force');await fallback.waitForSelector('.fluid-preloader[data-mode=css]');await fallback.waitForTimeout(500);await fallback.screenshot({path:out+'/fallback-movil.png'});const fallbackResult=await completion(fallback);assert.equal(fallbackResult.mode,'css');

const delayed=await browser.newPage({viewport:{width:1000,height:800}});await instrument(delayed);let release;const gate=new Promise(resolve=>release=resolve);await delayed.route('**/critical-test.svg',async route=>{await gate;await route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10" fill="green"/></svg>'});});await delayed.route('**/?asset-test=1',async route=>{const response=await route.fetch();const text=await response.text();await route.fulfill({response,body:text.replace('<body>','<body><img data-critical src="/critical-test.svg" width="10" height="10" alt="Test">')});});await delayed.goto('http://127.0.0.1:4173/?asset-test=1',{waitUntil:'domcontentloaded'});await delayed.waitForTimeout(2100);assert.equal(await delayed.locator('#element999-preloader').count(),1);const held=await delayed.locator('.fluid-preloader').evaluate(e=>({real:Number(e.dataset.progress),visual:Number(e.dataset.visualProgress)}));assert(held.real<100&&held.visual<=held.real);release();const delayedResult=await completion(delayed);assert(delayedResult.assets.some(a=>a.asset.includes('critical-test.svg')&&a.status==='ready'));

assert.deepEqual(errors,[]);const report={normal,resources,sessionSkip:true,reduced:reducedResult.mode,fallback:fallbackResult.mode,realAssetGate:held,pageErrors:errors,passed:true};await fs.writeFile(out+'/resultado.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();})().catch(error=>{console.error(error);process.exit(1);});
