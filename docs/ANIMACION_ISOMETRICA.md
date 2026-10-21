# Materia conectada: animación isométrica

Reproducción visual propia de la grabación de referencia: retícula de baldosas redondeadas en proyección isométrica, relieve, iluminación de grupos que sigue al cursor y variación cromática dentro de las piezas. Paleta Element999: fondo #070908, verde #a7ff52 y reflejos #edffd9. Los símbolos de terceros de la grabación se sustituyen por la marca, 999 y un elemento radial.

## Revisión

- En la web: sección `#materia`, después de la apertura.
- Vista a pantalla completa: `laboratorio/`.
- La muestra no sustituye el preloader líquido ya existente.

## Implementación y peso

`preview/isometric/tiles.js` contiene la configuración y un shader WebGL escrito para esta reproducción. No se incorporan frameworks ni runtimes externos. Un único canvas, una llamada de dibujo por fotograma y una pequeña textura de iconos generada en memoria. No hay vídeo de fondo ni imágenes descargadas.

JS: 10.358 bytes, 4.341 bytes con gzip en la medición inicial. CSS: 1.780 bytes, 770 bytes con gzip. El recurso HTML de la vista independiente añade aproximadamente 0,74 KB comprimidos. El peso transferido efectivo depende de la compresión del alojamiento.

La resolución se limita a DPR 1,5 y aproximadamente 1,2 millones de píxeles, con reducción si baja de 45 fps. El renderizado se suspende fuera de pantalla, en pestaña oculta y durante el preloader. Movimiento reducido muestra una composición estática; sin WebGL o tras perder el contexto se usa una alternativa CSS. Cursor, touch y flechas de teclado desplazan la luz; en reposo realiza un recorrido lento.

## Validación

`qa-isometric/result.json` recoge las comprobaciones en Chrome aislado: 60 fps en escritorio, interacción visual, teclado, móvil, ausencia de desbordamientos, movimiento reducido sin bucle, alternativas sin WebGL y con pérdida de contexto, pausa fuera de pantalla y compatibilidad con el preloader. Esta prueba no garantiza 60 fps en todos los dispositivos ni sustituye una matriz de navegadores.

Para repetirla con Playwright disponible:

```sh
BASE_URL=http://127.0.0.1:4174/ QA_OUTPUT=/tmp CHROME_PATH=/ruta/a/chrome node qa-isometric/check.cjs
```

## Relación con shaders.com

Se consultó su documentación pública y se abrió la herramienta para el fundador. En esta sesión no hay plugin ni control de navegador conectado a la cuenta de Shaders. Por tanto, esta entrega es una reproducción visual propia en el código de Element999; no es un proyecto creado dentro de esa cuenta, una exportación de Shaders ni una copia exacta certificada. El acceso oficial puede conectarse mediante OAuth y MCP en https://shaders.com/mcp (https://shaders.com/docs/guide/mcp).

La grabación y sus fotogramas de análisis no se publican en el repositorio.
