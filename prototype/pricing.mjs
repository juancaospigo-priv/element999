export const RATE = 80;
export const round50 = value => Math.ceil(value / 50) * 50;

// Reglas locales de demostración. En producción se validarán en el servidor.
export function estimate({service, language = false, integration = false, urgent = false, custom = false}) {
  if (!['landing', 'agent', 'custom'].includes(service)) throw new Error('Selecciona un servicio válido.');
  if (service === 'custom' || custom) return {review: true, reason: 'El alcance necesita una revisión antes de estimar su inversión.'};
  if (language && service !== 'landing') return {review: true, reason: 'El agente en varios idiomas requiere definir su alcance.'};
  const hours = (service === 'landing' ? 20 : 40) + (language ? 4 : 0) + (integration ? 8 : 0);
  const base = hours * RATE * (urgent ? 1.25 : 1);
  return {hours, low: round50(base), high: round50(base * 1.15), urgent, review: urgent,
    reason: urgent ? 'La urgencia requiere comprobar la disponibilidad antes de confirmar.' : ''};
}
