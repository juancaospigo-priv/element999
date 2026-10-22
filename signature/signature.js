// Element999's signature: business friction becomes a continuous field of fibres.
// No model calls, user data, media downloads or third-party graphics runtime.
export const SIGNATURE_CONFIG = Object.freeze({ maxDPR: 1.5, maxPixels: 800000, fps: 30, desktopFibres: 76, mobileFibres: 38, points: 88, transitionSeconds: 1.25, colors: ['#a7ff52', '#d8ffb2', '#548632'] });
const modes = {
 sales: { label: '01 — VENTAS', problem: 'El interés llega.\nEl seguimiento se pierde.', solution: 'Cada consulta, con contexto.\nCada oportunidad, con siguiente paso.', annotation: 'Una consulta sin siguiente paso.', element: 'Seguimiento con memoria.', need: 'Quiero mejorar el seguimiento de las consultas y oportunidades comerciales de mi negocio.', cards: ['Una consulta', 'El contexto', 'La prioridad', 'Una respuesta', 'El seguimiento', 'La oportunidad'], chapters: [['El interés\nse enfría.', 'Una consulta llega, se responde y queda sin un siguiente paso.'], ['Conectar\nla conversación.', 'Atención, contexto y seguimiento unidos alrededor de cada oportunidad.'], ['La oportunidad\ntiene continuidad.', 'El sistema conserva el contexto y prepara el siguiente paso para tu equipo.']] },
 operations: { label: '02 — OPERACIÓN', problem: 'El trabajo avanza.\nLa misma tarea vuelve.', solution: 'Una entrada clara.\nUn proceso que puede continuar.', annotation: 'Otra vez, la misma tarea.', element: 'Un proceso conectado.', need: 'Quiero automatizar tareas repetitivas y conectar las herramientas de mi operación.', cards: ['Una tarea', 'Las herramientas', 'Una regla', 'La acción', 'El proceso', 'La entrega'], chapters: [['El trabajo\nse repite.', 'Copiar datos, actualizar estados y perseguir aprobaciones consume atención.'], ['Conectar\nlas acciones.', 'Definimos entradas, reglas y tareas para unir las herramientas de tu operación.'], ['Un proceso\ncon continuidad.', 'La automatización hace avanzar los pasos definidos y deja las excepciones a tu equipo.']] },
 data: { label: '03 — INFORMACIÓN', problem: 'La información existe.\nLas piezas no se encuentran.', solution: 'El dato, en su contexto.\nLa información, disponible.', annotation: 'Un dato fuera de contexto.', element: 'Información que conecta.', need: 'Quiero conectar los datos y herramientas de mi negocio para disponer de información con contexto.', cards: ['Un dato', 'Las fuentes', 'El contexto', 'La conexión', 'Una vista', 'La información'], chapters: [['Los datos\nse dispersan.', 'La información está repartida entre documentos, personas y herramientas.'], ['Conectar\nel contexto.', 'Unimos fuentes y definimos qué necesita ver cada persona para trabajar.'], ['La información\nencuentra su lugar.', 'Un sistema reúne las piezas y ofrece una vista útil para tu operación.']] },
};
const hero = document.querySelector('.signature-hero');
if (hero) {
 const canvas = hero.querySelector('canvas');
 const ctx = canvas.getContext('2d', { alpha: true });
 const field = hero.querySelector('.sig-field');
 const specimen = hero.querySelector('.sig-specimen');
 const buttons = [...hero.querySelectorAll('[data-friction]')];
 const connect = hero.querySelector('.sig-connect');
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 const fine = matchMedia('(hover: hover) and (pointer: fine)');
 const controller = new AbortController(), options = { signal: controller.signal };
 let mode = 'sales', target = 0, connection = 0, phase = 0, width = 1, height = 1, visible = false, paused = false, frame = 0, last = 0, painted = 0, slowFrames = 0, lean = false;
 const pointer = { x: 0, y: 0 }, mouse = { x: 0, y: 0 };
 const pause = document.createElement('button');pause.type = 'button';pause.className = 'sig-pause';specimen.append(pause);
 const fallback = document.createElementNS('http://www.w3.org/2000/svg', 'svg');fallback.classList.add('sig-fallback-mark');fallback.setAttribute('viewBox', '0 0 100 100');fallback.setAttribute('aria-hidden', 'true');fallback.innerHTML = '<path d="M72 20H43C7 20 7 80 43 80H72" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round"/><circle cx="72" cy="50" r="6" fill="currentColor"/>';field.prepend(fallback);
 function multiline(node, text) { node.replaceChildren(...text.split('\n').flatMap((line, i) => i ? [document.createElement('br'), document.createTextNode(line)] : [document.createTextNode(line)])); }
 function content() {
  const data = modes[mode];specimen.dataset.connected = String(target === 1);hero.dataset.friction = mode;
  hero.querySelector('.sig-specimen-mode').textContent = data.label;
  hero.querySelector('.sig-readout-label').textContent = target ? 'EL ELEMENTO QUE CONECTA' : 'LA FRICCIÓN';
  multiline(hero.querySelector('.sig-readout-text'), target ? data.solution : data.problem);
  hero.querySelector('.sig-annotation-text').textContent = target ? data.element : data.annotation;
  hero.querySelector('.sig-connect-text').textContent = target ? 'Volver al punto de partida' : 'Conectar las piezas';
  hero.querySelector('.sig-connect-icon').textContent = target ? '↺' : '+';
  connect.setAttribute('aria-pressed', String(target === 1));hero.querySelector('.sig-main-cta').dataset.need = data.need;
  buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.friction === mode)));
  document.querySelectorAll('.assembly-card strong').forEach((node, i) => { node.textContent = data.cards[i]; });
  document.querySelectorAll('.connection-chapter').forEach((chapter, i) => { multiline(chapter.querySelector('h2'), data.chapters[i][0]); chapter.querySelector('p:not(.eyebrow)').textContent = data.chapters[i][1]; });
 }
 function render() {
  if (!ctx || width < 2) return;
  const started = performance.now(), t = reduced.matches ? 0 : phase;
  ctx.clearRect(0, 0, width, height);
  const cx = width * .47, cy = height * .46, scale = Math.min(width * .29, height * .35);
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 1.8);glow.addColorStop(0, '#a7ff5210');glow.addColorStop(1, '#080b0900');ctx.fillStyle = glow;ctx.fillRect(0, 0, width, height);
  const ry = -.42 + mouse.x * .35, rx = .28 + mouse.y * .25, rz = -.22;
  const sy = Math.sin(ry), coY = Math.cos(ry), sx = Math.sin(rx), coX = Math.cos(rx), sz = Math.sin(rz), coZ = Math.cos(rz);
  function project(x, y, z) { let a = x * coY + z * sy, c = -x * sy + z * coY, b = y * coX - c * sx; c = y * sx + c * coX;const p = 4 / (4 - c);return [cx + (a * coZ - b * sz) * scale * p, cy + (a * sz + b * coZ) * scale * p, c]; }
  const count = Math.round((width < 500 ? SIGNATURE_CONFIG.mobileFibres : SIGNATURE_CONFIG.desktopFibres) * (lean ? .65 : 1));
  const points = width < 500 ? 64 : SIGNATURE_CONFIG.points;
  // Each strand is a projection of an original parametric 3D curve.
  // Friction scatters or splits the curves; connection gathers the brand's open C.
  for (let i = 0; i < count; i++) {
   const phi = i / count * Math.PI * 2 + t * .12;
   ctx.beginPath();let depth = 0;
   for (let j = 0; j <= points; j++) {
    const u = j / points, angle = .57 + u * (Math.PI * 2 - 1.14), tube = .16 + .025 * Math.sin(angle * 3 + t * .35);
    const radius = 1.08 + tube * Math.cos(phi + angle * 1.8);
    const bx = radius * Math.cos(angle), by = radius * Math.sin(angle), bz = tube * Math.sin(phi + angle * 1.8);
    let x = bx, y = by, z = bz;
    const distortion = 1 - connection;
    if (mode === 'operations') { x = Math.sin(angle) * 1.2 + .14 * Math.cos(phi); y = Math.sin(angle * 2) * .68 + .12 * Math.sin(phi); z = Math.cos(angle) * .35; }
    else if (mode === 'data') { const a = .4 + (i % 3) * 2.1 + u * 1.3; x = Math.cos(a) * (1.18 + .15 * Math.cos(phi)); y = Math.sin(a) * (1.18 + .15 * Math.cos(phi)); z = .2 * Math.sin(phi); }
    else { x += .18 * Math.sin(angle * 3 + phi * 2 + t * .22); y += .17 * Math.cos(angle * 2 + phi + t * .17); z += .25 * Math.sin(phi + angle); }
    x = bx * connection + x * distortion; y = by * connection + y * distortion; z = bz * connection + z * distortion;
    const p = project(x, y, z);depth += p[2];if (j === 0) ctx.moveTo(p[0], p[1]);else ctx.lineTo(p[0], p[1]);
   }
   const bright = (Math.sin(phi) + 1) * .5;ctx.strokeStyle = i % 9 === 0 ? '#e1ffc0' : i % 3 === 0 ? '#a7ff52' : '#548632';ctx.globalAlpha = .16 + bright * .5;ctx.lineWidth = i % 9 === 0 ? .8 : .45;ctx.stroke();
  }
  ctx.globalAlpha = 1;
  const dot = project(1.07 + (1 - connection) * .48, (1 - connection) * -.42, .15), r = scale * (.075 + connection * .025);
  const halo = ctx.createRadialGradient(dot[0], dot[1], 0, dot[0], dot[1], r * 4.5);halo.addColorStop(0, '#caff8a55');halo.addColorStop(1, '#a7ff5200');ctx.fillStyle = halo;ctx.fillRect(dot[0] - r * 5, dot[1] - r * 5, r * 10, r * 10);
  const surface = ctx.createRadialGradient(dot[0] - r * .3, dot[1] - r * .4, 0, dot[0], dot[1], r);surface.addColorStop(0, '#edffd2');surface.addColorStop(.3, '#bfff75');surface.addColorStop(1, '#34601a');ctx.fillStyle = surface;ctx.beginPath();ctx.arc(dot[0], dot[1], r, 0, Math.PI * 2);ctx.fill();
  field.dataset.rendered = 'true';field.dataset.renderer = 'canvas2d';field.dataset.connected = String(connection > .97);
  if (performance.now() - started > 18) slowFrames++; else slowFrames = Math.max(0, slowFrames - 1);if (slowFrames > 12) lean = true;
 }
 function pending() { return document.documentElement.classList.contains('preloader-pending') && !document.documentElement.classList.contains('preloader-revealing'); }
 function canRun() { return ctx && visible && !paused && !reduced.matches && !document.hidden && !pending(); }
 function loop(now) {
  frame = 0;if (!canRun()) return;
  const delta = Math.min(.07, Math.max(0, (now - last) / 1000));last = now;phase += delta;
  connection += (target - connection) * (1 - Math.exp(-delta * 4 / SIGNATURE_CONFIG.transitionSeconds));
  mouse.x += (pointer.x - mouse.x) * .09;mouse.y += (pointer.y - mouse.y) * .09;
  if (now - painted >= 1000 / SIGNATURE_CONFIG.fps - 1) { render();painted = now; }
  frame = requestAnimationFrame(loop);
 }
 function sync() {
  pause.disabled = reduced.matches || !ctx;pause.textContent = !ctx || reduced.matches ? 'Materia estática' : paused ? 'Reanudar materia ↻' : 'Pausar materia Ⅱ';pause.setAttribute('aria-pressed', String(paused));
  if (!canRun()) { cancelAnimationFrame(frame);frame = 0; }
  if (reduced.matches || paused || !ctx) { connection = target;render(); }
  else if (!frame && canRun()) { last = performance.now();frame = requestAnimationFrame(loop); }
 }
 function resize() { const rect = field.getBoundingClientRect();width = Math.max(1, rect.width);height = Math.max(1, rect.height);const dpr = Math.min(devicePixelRatio || 1, SIGNATURE_CONFIG.maxDPR, Math.sqrt(SIGNATURE_CONFIG.maxPixels / (width * height)));canvas.width = Math.round(width * dpr);canvas.height = Math.round(height * dpr);ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);render();sync(); }
 buttons.forEach(button => button.addEventListener('click', () => { mode = button.dataset.friction;target = 0;content();if (reduced.matches || paused) connection = 0;render();sync(); }, options));
 connect.addEventListener('click', () => { target = target ? 0 : 1;content();sync(); }, options);
 pause.addEventListener('click', () => { paused = !paused;sync(); }, options);
 field.addEventListener('pointermove', event => { if (!fine.matches || reduced.matches || paused) return;const rect = field.getBoundingClientRect();pointer.x = (event.clientX - rect.left) / rect.width - .5;pointer.y = (event.clientY - rect.top) / rect.height - .5; }, { ...options, passive: true });
 field.addEventListener('pointerleave', () => { pointer.x = 0;pointer.y = 0; }, options);
 document.addEventListener('visibilitychange', sync, options);reduced.addEventListener('change', sync, options);
 document.addEventListener('element999:preloader:reveal', sync, options);document.addEventListener('element999:preloader:complete', sync, options);
 const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting;hero.dataset.signatureVisible = String(visible);sync(); }, { threshold: 0 });observer.observe(field);
 const resizeObserver = new ResizeObserver(resize);resizeObserver.observe(field);content();resize();hero.dataset.signatureReady = 'true';
 window.addEventListener('pagehide', event => { if (!event.persisted) { controller.abort();observer.disconnect();resizeObserver.disconnect();cancelAnimationFrame(frame);canvas.width = canvas.height = 0; } }, options);
}
