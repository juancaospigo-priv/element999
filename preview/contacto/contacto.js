import { REQUESTS_CONFIG } from '../requests-config.js';
import { validEndpoint, requestPayload, sendRequest } from '../requests/requests.js';
const form = document.querySelector('#contact-form');
const submit = form.querySelector('[type="submit"]');
const status = document.querySelector('#contact-status');
const receipt = document.querySelector('#contact-receipt');
const restart = document.querySelector('#contact-restart');
let busy = false, sent = false, reference = null;
if (!validEndpoint(REQUESTS_CONFIG.endpoint)) {
 submit.disabled = true;
 status.textContent = 'La recepción de consultas no está disponible en este momento.';
} else form.action = REQUESTS_CONFIG.endpoint;
form.addEventListener('submit', async event => {
 event.preventDefault();
 if (busy || sent || !form.reportValidity() || !validEndpoint(REQUESTS_CONFIG.endpoint)) return;
 const fields = new FormData(form);
 if (fields.get('_gotcha')) return;
 const contact = { name: String(fields.get('name') || '').trim(), email: String(fields.get('email') || '').trim() };
 const need = String(fields.get('need') || '').trim();
 if (contact.name.length < 2 || need.length < 12) { status.textContent = 'Indica tu nombre y describe tu necesidad con al menos 12 caracteres.'; return; }
 reference ||= `E999-C-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
 const payload = requestPayload(contact, { service: 'custom', business: String(fields.get('business') || '').trim() || 'Por confirmar', need, tools: 'Por confirmar', review: true }, { review: true }, reference, `${location.origin}${location.pathname}`);
 payload._subject = `Element999 · Consulta de contacto · ${reference}`;
 const controls = [...form.elements];
 busy = true;controls.forEach(control => control.disabled = true);submit.textContent = 'Enviando…';form.setAttribute('aria-busy', 'true');
 status.textContent = 'Estamos enviando tu consulta. Espera la confirmación.';
 try {
  await sendRequest(payload);
  sent = true;form.hidden = true;receipt.hidden = false;
  document.querySelector('#contact-reference').textContent = `Referencia: ${reference}`;
  status.textContent = '';document.querySelector('#receipt-title').focus();
 } catch (error) {
  status.textContent = error.message === 'limit'
   ? 'El servicio no admite más envíos en este momento. Conserva tu mensaje y vuelve a intentarlo más tarde.'
   : 'No hemos podido confirmar la recepción. Tus datos siguen aquí para reintentar. Si el envío anterior llegó a completarse, tendrá la misma referencia.';
 } finally {
  busy = false;controls.forEach(control => control.disabled = false);submit.disabled = sent;
  submit.textContent = 'Enviar mi consulta ↗';form.removeAttribute('aria-busy');
 }
});
restart.addEventListener('click', () => {
 if (busy) return;
 form.reset();sent = false;reference = null;submit.disabled = false;receipt.hidden = true;form.hidden = false;status.textContent = '';
 form.elements.namedItem('name').focus();
});
