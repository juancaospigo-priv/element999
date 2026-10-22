const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const base=process.env.BASE_URL||'http://127.0.0.1:4181/';
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const result={},errors=[];
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}});page.on('pageerror',e=>errors.push(e.message));
  async function diagnosis(){
   await page.goto(base+'?preloader=0');await page.locator('a[href="#diagnostico"]').first().click();
   await page.locator('[name=service][value=landing]').check();await page.locator('[name=need]').fill('Necesito una landing para mi nuevo servicio.');await page.locator('#next').click();
   await page.locator('[name=business]').fill('Proyecto de prueba');await page.locator('[name=tools]').fill('CRM por definir');await page.locator('[name=validated]').selectOption('yes');await page.locator('#next').click();await page.locator('[name=confirmed]').check();await page.locator('#next').click();
   await page.locator('#result').waitFor({state:'visible'});assert.match(await page.locator('#price').textContent(),/1[.]?600.*1[.]?850/);
  }
  await diagnosis();assert(await page.evaluate(async()=>{const {validEndpoint}=await import('./requests/requests.js');return validEndpoint('https://formspree.io/f/abcdefgh') && !validEndpoint('https://evil.example/f/abcdefgh') && !validEndpoint('https://formspree.io/f/abcdefgh?redirect=bad') && !validEndpoint('https://user@formspree.io/f/abcdefgh');}));result.endpointAllowlist=true;assert(await page.locator('#request-form button').isDisabled());assert.match(await page.locator('#request-status').textContent(),/aún no está activada/);result.unconfiguredSafe=true;
  await page.route('**/requests-config.js',route=>route.fulfill({contentType:'text/javascript',body:'export const REQUESTS_CONFIG={endpoint:"https://formspree.io/f/testendpoint",timeoutMs:300};'}));
  let count=0,mode='failure',payloads=[];
  await page.route('https://formspree.io/f/testendpoint',async route=>{
   count++;payloads.push(route.request().postDataJSON());
   if(mode==='timeout'){await new Promise(r=>setTimeout(r,500));return route.abort().catch(()=>{});}
   if(mode==='offline')return route.abort();
   if(mode==='pending')await new Promise(r=>setTimeout(r,120));
   return route.fulfill({status:mode==='failure'?500:mode==='limit'?429:200,contentType:'application/json',body:JSON.stringify(mode==='failure'||mode==='limit'?{errors:[{message:'Test'}]}:{ok:true})});
  });
  await diagnosis();
  await page.locator('#request-form [type=submit]').click();assert.equal(count,0);result.requiredFields=true;
  await page.locator('#request-form [name=name]').fill('Cliente Prueba');await page.locator('#request-form [name=email]').fill('cliente@example.com');await page.locator('#request-form [name=consent]').check();
  await page.locator('#request-form [name=website]').evaluate(e=>e.value='bot');await page.locator('#request-form [type=submit]').click();assert.equal(count,0);await page.locator('#request-form [name=website]').evaluate(e=>e.value='');result.trap=true;
  await page.locator('#request-form [type=submit]').click();await page.waitForFunction(()=>document.querySelector('#request-status').textContent.includes('No hemos podido'));assert.equal(await page.locator('#request-form [name=email]').inputValue(),'cliente@example.com');assert(await page.locator('#request-receipt').isHidden());result.failurePreservesData=true;
  mode='limit';await page.locator('#request-form [type=submit]').click();await page.waitForFunction(()=>document.querySelector('#request-status').textContent.includes('no admite'));result.quotaError=true;
  mode='timeout';await page.locator('#request-form [type=submit]').click();await page.waitForFunction(()=>document.querySelector('#request-status').textContent.includes('No hemos podido'));assert(!(await page.locator('#request-form [type=submit]').isDisabled()));result.timeout=true;
  mode='offline';await page.locator('#request-form [type=submit]').click();await page.waitForFunction(()=>document.querySelector('#request-status').textContent.includes('No hemos podido'));result.offline=true;
  mode='pending';await page.locator('#request-form [type=submit]').click();assert(await page.locator('#restart').isDisabled());await page.locator('#request-form').evaluate(f=>f.dispatchEvent(new Event('submit',{cancelable:true})));await page.locator('#request-receipt').waitFor({state:'visible'});assert.equal(count,5);assert.equal(new Set(payloads.map(p=>p.reference)).size,1);assert.equal(payloads[4].rate,'80 EUR/h');assert.equal(payloads[4].email,'cliente@example.com');assert(!payloads[4].source.includes('?'));result.successAndDuplicateGuard=true;result.referenceStable=true;
  const download=page.waitForEvent('download');await page.locator('#download').click();const d=await download;const summary=await fs.readFile(await d.path(),'utf8');assert(summary.includes(payloads[4].reference));result.downloadReceipt=true;
  await page.locator('#restart').click();assert.equal(await page.locator('#request-form [name=email]').inputValue(),'');result.resetClearsContact=true;
  await diagnosis();await page.setViewportSize({width:390,height:844});await page.locator('#request-title').scrollIntoViewIfNeeded();assert(!(await page.locator('#diagnosis').evaluate(e=>e.scrollWidth>e.clientWidth)));await page.screenshot({path:process.env.SCREENSHOT||'/private/tmp/element999-requests-mobile.png'});result.mobile=true;
  assert.deepEqual(errors,[]);result.pageErrors=errors;result.liveDeliveryTested=false;result.passed=true;console.log(JSON.stringify(result,null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
