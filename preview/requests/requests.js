import { REQUESTS_CONFIG } from '../requests-config.js';

export function validEndpoint(value) {
  try {
    const url = new URL(value);
    return url.origin === 'https://formspree.io' && /^\/f\/[a-zA-Z0-9]+$/.test(url.pathname) && !url.search && !url.hash && !url.username && !url.password;
  } catch { return false; }
}

// Keep this readable in the recipient's email and in the provider inbox.
export function requestPayload(contact, record, quote, reference, source) {
  return {
    name: contact.name.trim(), email: contact.email.trim(),
    _subject: `Element999 · Nueva solicitud · ${reference}`,
    reference, business: record.business, service: record.service,
    need: record.need, tools: record.tools,
    scope: [record.language && 'Segundo idioma', record.extra && 'Integración adicional validada', record.urgent && 'Urgencia: revisar capacidad', (record.review || record.service === 'custom') && 'Revisión de alcance pendiente'].filter(Boolean).join('; ') || 'Estándar con integración validada',
    estimate: quote.low ? `${quote.low}–${quote.high} EUR, antes de impuestos y costes externos; sujeto a revisión` : 'Pendiente de revisión de alcance',
    rate: '80 EUR/h', source, consent: 'Solicita contacto para valorar su proyecto. Sin suscripción comercial.',
    _gotcha: contact.website || '',
  };
}

export async function sendRequest(payload, { endpoint = REQUESTS_CONFIG.endpoint, timeoutMs = REQUESTS_CONFIG.timeoutMs, fetcher = fetch } = {}) {
  if (!validEndpoint(endpoint)) throw new Error('configuration');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetcher(endpoint, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: controller.signal, credentials: 'omit', referrerPolicy: 'no-referrer' });
    const body = await response.json().catch(() => null);
    if (!response.ok || !body || body.error || body.errors || body.ok === false) throw new Error(response.status === 429 ? 'limit' : 'rejected');
    return body;
  } finally { clearTimeout(timeout); }
}

export function initRequests({ getRecord, getQuote, onReceipt }) {
  const form = document.querySelector('#request-form');
  const submit = form.querySelector('[type="submit"]');
  const status = document.querySelector('#request-status');
  const receipt = document.querySelector('#request-receipt');
  const configured = validEndpoint(REQUESTS_CONFIG.endpoint);
  let busy = false, sent = false, reference = null;
  submit.disabled = !configured;
  if (!configured) status.textContent = 'La recepción online aún no está activada. Puedes descargar tu resumen.';

  const reset = () => {
    if (busy) return false;
    form.reset(); sent = false; reference = null; receipt.hidden = true;
    form.hidden = false; submit.disabled = !configured;
    status.textContent = configured ? '' : 'La recepción online aún no está activada. Puedes descargar tu resumen.';
    return true;
  };
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy || sent || !configured || !form.reportValidity()) return;
    const record = getRecord(), quote = getQuote();
    if (!record || !quote) return;
    const values = new FormData(form);
    // Hidden trap must never produce a false success or a network request.
    if (values.get('website')) return;
    reference ||= `E999-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const payload = requestPayload({ name: String(values.get('name') || ''), email: String(values.get('email') || ''), website: '' }, record, quote, reference, `${location.origin}${location.pathname}`);
    busy = true; submit.disabled = true; submit.textContent = 'Enviando…';
    form.setAttribute('aria-busy', 'true');
    const controls = [...form.elements]; controls.forEach(control => control.disabled = true);
    document.querySelector('#restart').disabled = true;
    status.textContent = 'Estamos enviando tu solicitud. Espera la confirmación.';
    try {
      await sendRequest(payload);
      sent = true; form.hidden = true; receipt.hidden = false;
      receipt.textContent = `Solicitud recibida · ${reference}. Contactaremos contigo en el correo indicado. La estimación queda pendiente de confirmar.`;
      status.textContent = ''; onReceipt(reference);
    } catch (error) {
      status.textContent = error.message === 'limit'
        ? 'El servicio no admite más envíos en este momento. Conserva el resumen y vuelve a intentarlo más tarde.'
        : 'No hemos podido confirmar la recepción. Tu información sigue aquí: puedes reintentar o descargar el resumen. Si el envío anterior llegó a completarse, tendrá la misma referencia.';
    } finally {
      busy = false; controls.forEach(control => control.disabled = false);
      submit.disabled = sent; submit.textContent = 'Enviar solicitud ↗';
      form.removeAttribute('aria-busy'); document.querySelector('#restart').disabled = false;
    }
  });
  return { reset, isBusy: () => busy };
}
