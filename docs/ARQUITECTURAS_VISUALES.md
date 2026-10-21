# Arquitecturas visuales de soluciones

La sección `#arquitecturas` sustituye las tres ventanas conceptuales anteriores por escenas representativas, con la identidad de Element999, logos auténticos y movimiento que conecta las herramientas con la experiencia del cliente.

## Escenas

- **Ecommerce:** una tienda ilustrada, un producto y un recorrido de compra; Shopify, OpenAI, WhatsApp, Stripe y n8n conectan visualmente experiencia, atención, pago y seguimiento.
- **Agentes de texto:** una conversación de ejemplo con contexto y siguiente paso; OpenAI, Claude, WhatsApp, Supabase y n8n.
- **Agentes de voz:** una pieza de voz, forma de onda y muestra bajo petición; OpenAI, ElevenLabs, Supabase y n8n.
- **Avatar:** un personaje original ilustrado en SVG, una muestra de voz y animación de boca durante la reproducción; OpenAI, HeyGen, ElevenLabs y n8n.
- **Software factory:** un producto ilustrativo rodeado de construcción, datos, protección y publicación; GitHub, Cloudflare, Claude, Supabase y Vercel.

Los textos explican el recorrido sin exponer un diagrama técnico de API, bases de datos o infraestructura. Las herramientas son opciones representativas; no se afirma que estén integradas en el prototipo, que deban usarse todas en cada proyecto ni que existan alianzas o certificaciones.

## Logos reales

Los doce recursos provienen de sitios o CDNs oficiales y se sirven desde `preview/architectures/logos/`. Se conservan sus colores, proporciones y contenido; cada tarjeta enlaza a la web de la herramienta. Las fuentes exactas y tamaños se registran en `preview/architectures/logo-sources.json`. Se usan iconos oficiales de los productos, no versiones de las marcas dibujadas o generadas por IA.

Los logos suman **44.450 bytes**. CSS y módulo JavaScript añaden aproximadamente **7,9 KB con gzip**, además del HTML de las escenas. La compresión efectiva depende del alojamiento. Los logos cargan de forma diferida. No se incorporan frameworks, vídeos, audio descargado, paquetes de animación ni peticiones a servicios de IA.

## Movimiento y accesibilidad

Conexiones con señales animadas, tarjetas con desplazamiento suave y respuesta mínima al cursor. Los controles interactivos permanecen inmóviles. El movimiento se pausa fuera de pantalla o con la pestaña oculta y puede pausarse manualmente. Con `prefers-reduced-motion` las escenas se muestran estáticas. Las pestañas y los modos de agente tienen navegación por teclado.

En móvil, las composiciones se escalan y se añade una leyenda de marcas legible. Los botones de audio se presentan fuera de la miniatura para conservar un área táctil de al menos 44 px.

## Alcance de las muestras de voz

El botón solicita al navegador una muestra de texto fija mediante `speechSynthesis`, en español, solo después de una acción del visitante. No escucha el micrófono, no genera una respuesta con IA y no utiliza APIs de ElevenLabs ni HeyGen. Esas marcas ilustran una arquitectura posible. La animación del personaje usa los eventos de reproducción; no constituye sincronización labial por fonemas.

Si el navegador no dispone de síntesis, rechaza la reproducción o no inicia la voz, se muestra un mensaje y se restablecen los controles. Cambiar de escena, salir de la sección, ocultar la pestaña o detener la muestra cancela el audio. La disponibilidad y calidad de la voz dependen del dispositivo.

## Coherencia comercial

Ecommerce y los modos avanzados de voz/avatar se derivan a **solución a medida** en el diagnóstico. El modo texto conserva la opción de agente estándar. No se asigna a una tienda ni a un avatar el precio de una landing o un agente básico. La tarifa aprobada de 80 EUR/h y el motor de precios existente se mantienen.

## Verificación

`qa-architectures/check.cjs` y `qa-architectures/result.json` documentan:

- Las tres pestañas principales, los tres modos de agente y sus logos visibles.
- Teclado, pausa manual, movimiento reducido y pausa fuera de pantalla.
- Anchos 320, 390, 768 y 1.440 px sin desbordamiento horizontal.
- Leyenda de marcas y tamaño del control de audio móvil.
- Apertura del diagnóstico y revisión de alcance de ecommerce.
- Ciclo de inicio, finalización y cancelación de voz con un adaptador de síntesis controlado, y alternativa sin API de voz.
- Conservación de las secciones de portafolio y footer y ausencia de errores JavaScript.

El adaptador de voz valida los estados y eventos; no certifica que exista una voz audible en todos los navegadores. Se mantienen las pruebas del motor comercial y se actualizan los nombres de pestañas del recorrido anterior.

Para repetir la comprobación con Playwright disponible:

```sh
BASE_URL=http://127.0.0.1:4177/ QA_OUTPUT=/tmp CHROME_PATH=/ruta/a/chrome node qa-architectures/check.cjs
```
