// One explicitly labelled live test. Sends one real notification to the form owner.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const base=process.env.BASE_URL||'https://juancaospigo-priv.github.io/element999/?revision=0f4f426';
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const errors=[];
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}});page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);await page.waitForFunction(()=>!document.documentElement.classList.contains('preloader-pending')&&!document.querySelector('#element999-preloader'),{},{timeout:25000});
  await page.locator('a[href="#diagnostico"]').first().click();
  await page.locator('[name=service][value=landing]').check();await page.locator('[name=need]').fill('PRUEBA TÉCNICA de recepción Element999. No es una solicitud comercial ni requiere respuesta.');await page.locator('#next').click();
  await page.locator('[name=business]').fill('Element999 — prueba técnica');await page.locator('[name=tools]').fill('GitHub Pages y Formspree');await page.locator('[name=validated]').selectOption('yes');await page.locator('#next').click();await page.locator('[name=confirmed]').check();await page.locator('#next').click();
  await page.locator('#request-form [name=name]').fill('Prueba técnica Element999');await page.locator('#request-form [name=email]').fill('test@example.com');await page.locator('#request-form [name=consent]').check();
  assert.equal(await page.locator('#request-status').textContent(),'');
  const responsePromise=page.waitForResponse(r=>r.url()==='https://formspree.io/f/xgaogjpp'&&r.request().method()==='POST');
  await page.locator('#request-form [type=submit]').click();
  const response=await responsePromise;const body=await response.json();
  console.log(JSON.stringify({httpStatus:response.status(),body}));
  assert(response.ok());await page.locator('#request-receipt').waitFor({state:'visible',timeout:25000});
  assert.deepEqual(errors,[]);
  const result={checkedAt:new Date().toISOString(),url:base,endpoint:'https://formspree.io/f/xgaogjpp',httpStatus:response.status(),providerResponse:body,receipt:await page.locator('#request-receipt').textContent(),pageErrors:errors,realSubmissions:1,mailboxDeliveryConfirmed:false,passed:true};
  await fs.writeFile('qa-requests/live-result.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
