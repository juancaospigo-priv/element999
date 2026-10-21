# Preloader líquido de Element999

Implementado en la copia activa de revisión, formada por HTML, CSS y módulos JavaScript nativos. No hay `package.json`, framework ni compilación. El servidor local sirve `preview/`. La carpeta original de Documentos sigue devolviendo `Operation not permitted`, incluso con ejecución autorizada; esta entrega no afirma haberla modificado.

## Archivos e integración

| Archivo | Responsabilidad |
| --- | --- |
| `preview/preloader/Preloader.js` | Configuración, seguimiento real de recursos, contador, interacción, resolución adaptativa, sesión, accesibilidad y liberación de recursos |
| `preview/preloader/fluid.frag` | FBM de value noise, dos capas de domain warping q/r, normales, especularidad, máscara de marca y revelado orgánico |
| `preview/preloader/fluid.vert` | Geometría de dos triángulos para el lienzo fullscreen |
| `preview/preloader/preloader.css` | Overlay fijo a 100dvh, interfaz, degradación CSS y versión de movimiento reducido |
| `preview/index.html` | CSS y módulo de entrada; protección de primer pintado; módulos existentes identificados como críticos |
| `preview/motion.mjs` | Pausa y continuidad de la apertura existente durante la carga y el revelado |

No se añadió ninguna dependencia de producción. Los shaders están escritos a mano. La marca se rasteriza con la tipografía disponible en una textura temporal y se llena con el mismo campo de fluido; no es una imagen de marca descargada.

## Configuración

El objeto `PRELOADER_CONFIG` está al inicio de `Preloader.js`.

| Parámetro | Valor inicial |
| --- | --- |
| `colors` | `#050807`, `#173021`, `#72B63B`, `#D2FF9D` |
| `speed.rest`, `speed.loaded` | `0.075`, `0.27` |
| `turbulence`, `depth` | `1.05`, `1.15` |
| `minDurationMs` | `1800` |
| `revealDurationMs` | `1200` |
| `revealBezier` | `[0.22, 1, 0.36, 1]` |
| `maxDPR` | `2` |
| `maxRenderPixels` | `1500000` |
| `lowFPSThreshold` | `45` |
| `minResolutionScale` | `0.42` |
| `assetTimeoutMs` | `9000` |
| `force` | `false` |
| `criticalAssets` | Lista opcional de URLs adicionales |

El presupuesto de píxeles puede limitar la resolución antes de alcanzar DPR 2. Bajo 45 fps, las ventanas de medición de 500 ms reducen la escala un 22 % hasta el mínimo configurado. El contador y el texto de interfaz permanecen en DOM y no pierden resolución.

## Progreso y ciclo de vida

El seguimiento incluye imágenes no diferidas, imágenes marcadas con `data-critical`, `document.fonts.ready`, hojas de estilo, scripts marcados con `data-critical`, shaders y vídeos marcados con `data-critical` o `data-preload` hasta disponer de su primer frame (`loadeddata`). No descarga indiscriminadamente todos los vídeos de la página.

El progreso representa comprobaciones de recursos completadas, no bytes de transferencia. El contador interpola hacia ese valor y nunca lo supera. Los fallos y los plazos agotados se registran como `error` y `timeout`; permiten salir del preloader sin afirmar que el recurso se cargó correctamente. Una imagen crítica retenida durante la prueba mantuvo el progreso real en 91 % y el visual en 90 % hasta su carga.

La carga tiene una duración mínima de 1,8 segundos. Al completarse el seguimiento y la interpolación, el revelado dura 1,2 segundos. La apertura de la página empieza durante el revelado y conserva su continuidad al retirar el overlay. El scroll se bloquea conservando la posición anterior y se restaura exactamente; los estados `inert` que ya existían se preservan.

El contador usa `aria-live="polite"` y anuncia hitos cada 20 %, en lugar de emitir cada frame. El canvas es `aria-hidden`. El seguimiento del puntero y touch usa interpolación y arrastre local. El origen del revelado es la última posición suavizada del usuario o el centro cuando no hay interacción.

Al terminar se cancelan RAF, peticiones y listeners, se retira el nodo, se eliminan textura, shaders, programa y buffer, y se libera el contexto mediante `WEBGL_lose_context` cuando está disponible.

## Sesión y desarrollo

- Uso normal: `http://127.0.0.1:4173/`. Una ejecución completa por sesión de pestaña, mediante `sessionStorage`.
- Forzar repetición: `http://127.0.0.1:4173/?preloader=force` o `?preloader=1`.
- Desactivar en desarrollo: `?preloader=0`.
- `force: true` también permite forzarlo desde la configuración.

Si se cambia `sessionKey` o `forceParam`, mantener sincronizada la pequeña protección inicial de `index.html`. Si JavaScript está desactivado, la web sigue visible. Si el módulo no llega a ejecutarse, la protección inicial se retira tras 15 segundos; ese watchdog se cancela cuando el módulo toma el control.

## Comprobaciones y rendimiento

En Chrome local, viewport 1440 × 1000 y DPR 1: **59 fps de media, 60 fps en los últimos 30 frames y p95 de 17 ms**. Duración observada: 3030 ms. Son mediciones de esta ejecución y este equipo; no una certificación en otros portátiles o navegadores.

Con presión de CPU simulada, las mediciones de 36–37 fps activaron escalas `0.78 → 0.6084 → 0.474552 → 0.42`, respetando el límite inferior. En el encuadre móvil de 390 × 844 se observaron 60 fps en esa prueba de Chrome; no es una medición en un teléfono físico.

Pruebas aprobadas:

- Shader y marca dentro del fluido sin errores JavaScript.
- Progreso retenido por una imagen crítica pendiente y contador sin adelantar la carga.
- Una vez por sesión y repetición forzada.
- Fallback sin WebGL, fallo HTTP del shader y pérdida de contexto durante la carga.
- Versión estática sin shader de fluido con movimiento reducido.
- Perturbación mediante cursor y touch, y origen del revelado correspondiente.
- Restauración del scroll de 700 px a 700 px y conservación de `inert` previo.
- Eliminación de dos shaders, un programa, un buffer y una textura; pérdida explícita del contexto al terminar.
- Apertura, tres etapas de scroll, teclado del explorador y diagnóstico de landing a 80 EUR/h con rango de 1.600–1.850 EUR.
- Adaptación de la web en 320, 390, 768 y 1440 px sin desbordamiento horizontal.

Informes y capturas en `qa-preloader/`. Las pruebas reproducibles están en `qa-preloader.cjs`, `qa-preloader-edge.cjs` y `qa-motion.cjs`; usan el Playwright ya disponible en el entorno de trabajo, no una dependencia del sitio.

Para iniciar la muestra desde esta carpeta:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory preview
```
