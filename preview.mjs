import { initRequests } from './requests/requests.js';
const $=selector=>document.querySelector(selector);
const $$=selector=>[...document.querySelectorAll(selector)];
const dialog=$('#diagnosis');
const form=$('#diagnosis-form');
let step=1,record=null,quote=null,receiptReference=null;
const requests=initRequests({getRecord:()=>record,getQuote:()=>quote,onReceipt:reference=>{receiptReference=reference;}});
const names={landing:'Landing de captación',agent:'Agente comercial conectado a CRM',custom:'Solución a medida'};
const money=n=>new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n);
function data(){const disabled=$$('fieldset:disabled');disabled.forEach(f=>f.disabled=false);const d=new FormData(form);disabled.forEach(f=>f.disabled=true);return {industry:form.dataset.industry||'',service:d.get('service'),need:String(d.get('need')||'').trim(),business:String(d.get('business')||'').trim(),tools:String(d.get('tools')||'').trim(),language:d.has('language'),extra:d.has('extra'),urgent:d.has('urgent'),review:d.has('review')||d.get('validated')!=='yes'};}
function setStep(n,focus=true){step=n;$$('[data-step]').forEach(f=>{f.hidden=Number(f.dataset.step)!==n;f.disabled=f.hidden;});$('#form-body').hidden=false;$('#result').hidden=true;$('#step-label').textContent=`PASO 0${n} / 03`;$('#back').hidden=n===1;$('#next').textContent=n===3?'Ver mi estimación ↗':'Continuar ↗';$('#error').textContent='';if(focus){const legend=$(`[data-step="${n}"] legend`);legend.tabIndex=-1;legend.focus();}}
function fields(d){return [...(d.industry?[['INDUSTRIA',d.industry]]:[]),['SOLUCIÓN',names[d.service]],['NECESIDAD',d.need],['NEGOCIO',d.business],['HERRAMIENTAS',d.tools],['ALCANCE',`${d.language?'Segundo idioma con traducción aportada. ':''}${d.extra?'Integración adicional validada. ':''}${d.urgent?'Urgencia solicitada. ':''}${d.review||d.service==='custom'?'Revisión de alcance o integración pendiente.':'Configuración estándar con integración validada.'}`]];}
function summary(target,d){target.replaceChildren(...fields(d).map(([key,value])=>{const row=document.createElement('div');const a=document.createElement('dt');a.textContent=key;const b=document.createElement('dd');b.textContent=value;row.append(a,b);return row;}));}
function open(service){if(requests.isBusy()){if(!dialog.open)dialog.showModal();return;}if(service){form.dataset.industry='';form.elements.service.value=service;form.elements.confirmed.checked=false;requests.reset();receiptReference=null;setStep(1,false);}if(!dialog.open)dialog.showModal();syncLanguage();}
function syncLanguage(){const hide=form.elements.service.value!=='landing';$('#language').hidden=hide;if(hide)form.elements.language.checked=false;}
$$('[href="#diagnostico"]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();open(link.dataset.service);if(!requests.isBusy()&&link.dataset.industry){form.dataset.industry=link.dataset.industry;form.elements.need.value=link.dataset.need||'';}$('#main-nav').classList.remove('is-open');$('#menu').setAttribute('aria-expanded','false');}));
form.addEventListener('change',event=>{if(event.target.name==='service')syncLanguage();if(event.target.name!=='confirmed')form.elements.confirmed.checked=false;});
form.addEventListener('input',event=>{if(event.target.name!=='confirmed')form.elements.confirmed.checked=false;});
form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;const d=data();if(step===1&&d.need.length<12){$('#error').textContent='Describe tu necesidad con al menos 12 caracteres.';return;}if(step===2&&(!d.tools||!d.business)){$('#error').textContent='Completa el negocio y las herramientas; puedes indicar que todavía no están definidos.';return;}if(step<3){if(step===2)summary($('#confirmation'),d);setStep(step+1);return;}record=d;quote=calculate(d);summary($('#result-summary'),d);$('#price').textContent=quote.low?`${money(quote.low)} – ${money(quote.high)}`:'Revisión de alcance';$('#quote-note').textContent=quote.low?`${d.urgent?'La urgencia requiere revisar la capacidad. ':''}Antes de impuestos y costes externos. Rango sujeto a confirmar requisitos y disponibilidad.`:'El alcance necesita revisión antes de estimar precio o plazo.';$('#quote-details').textContent=quote.low?`Base de cálculo: 80 €/h · ${quote.hours} h estimadas · Reserva del 15 % y redondeo hacia arriba a 50 €. Vigencia propuesta: 15 días naturales.`:'Siguiente paso: confirmar alcance e integraciones.';$('#form-body').hidden=true;$('#result').hidden=false;$('#result-title').tabIndex=-1;$('#result-title').focus();});
export function calculate(d){if(d.service==='custom'||d.review||(d.language&&d.service!=='landing'))return {review:true};if(!['landing','agent'].includes(d.service))throw new Error('Servicio inválido');const hours=(d.service==='landing'?20:40)+(d.language?4:0)+(d.extra?8:0);const base=hours*80*(d.urgent?1.25:1);return {hours,low:Math.ceil(base/50)*50,high:Math.ceil(base*1.15/50)*50,review:d.urgent};}
$('#back').addEventListener('click',()=>setStep(step-1));
$('#restart').addEventListener('click',()=>{if(!requests.reset())return;form.reset();form.dataset.industry='';record=null;quote=null;receiptReference=null;setStep(1);syncLanguage();});
$('#close-diagnosis').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
$('#download').addEventListener('click',()=>{if(!record||!quote)return;const text=['ELEMENT999 — RESUMEN DE PROYECTO','',...fields(record).map(([key,value])=>`${key}: ${value}`),'',`Estimación: ${$('#price').textContent}`,$('#quote-note').textContent,$('#quote-details').textContent,receiptReference?`Recepción confirmada: ${receiptReference}`:'Resumen generado. No confirma el envío de una solicitud.', 'Sin contratación ni reserva de agenda.'].join('\n');const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='Element999-resumen.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
$('#menu').addEventListener('click',()=>{const opened=$('#main-nav').classList.toggle('is-open');$('#menu').setAttribute('aria-expanded',String(opened));});$$('#main-nav a').forEach(link=>link.addEventListener('click',()=>{$('#main-nav').classList.remove('is-open');$('#menu').setAttribute('aria-expanded','false');}));
$('#skip').addEventListener('click',event=>{event.preventDefault();$('#main').focus();$('#main').scrollIntoView();});setStep(1,false);

// Case-study CTAs are scoped projects, not automatic standard landing quotes.
if(location.hash==='#diagnostico'){
 const needs={
  'terence-crudo':'Quiero un recorrido de venta para cursos o tickets de alto valor, con landings, combos, cross-sell y upsell.',
  "shortlist":"Quiero crear un producto web propio con datos, contenido y un diagnóstico para captar solicitudes.",
  "almacen-de-loza":"Quiero revisar la migración y el rediseño completo de mi ecommerce.",
  "hola-pepa":"Quiero rediseñar e implementar mi sistema completo en Shopify.",
 };
 const project=new URLSearchParams(location.search).get('project');
 const need=Object.hasOwn(needs,project)?needs[project]:null;
 open(need?'custom':undefined);
 if(need)form.elements.need.value=need;
}
