# Element999 sistema de diseño

Versión 0.1. Dirección visual de Fase 2, preparada para revisión. Referencia ejecutable: `prototype/`.

Element999 se expresa como un laboratorio corporativo de inteligencia aplicada. La composición da prioridad a una necesidad empresarial, un método comprensible y una acción clara. El verde señala el elemento que conecta el sistema; no decora cada superficie.

## Identidad y activos

- Logotipo horizontal original: `prototype/assets/logotipo-original.jpg`. En la cabecera se muestra mediante un recorte CSS de su margen negro; los píxeles originales permanecen intactos.
- Emblema original: `prototype/assets/emblema-original.png`. Su uso principal es la escena de apertura, rodeado por conexiones que representan proceso, dato y decisión.
- Favicon derivado: `prototype/assets/favicon.svg`. Trazo abierto y punto verde sobre carbón, sin números ni brillo para mantener legibilidad a 16 y 32 píxeles. Es una adaptación vectorial simplificada, no una vectorización exacta del original.
- Para materiales de marca con otros fondos se necesitará preparar y revisar una versión transparente o vectorial del logotipo. Esta fase mantiene la composición oscura de los originales y evita reinterpretar su lettering.

## Tokens de color

| Token CSS | Valor | Aplicación |
| --- | --- | --- |
| `--bg` | `#080B09` | Lienzo principal |
| `--panel` | `#101510` | Formularios y superficies secundarias |
| `--text` | `#EFF1E9` | Texto principal |
| `--muted` | `#A2ADA2` | Explicaciones y texto secundario |
| `--line` | `#283127` | Líneas y separadores |
| `--green` | `#A7FF52` | Acción principal, foco y conexiones |
| `--paper` | `#E9ECDF` | Sección editorial de demostración |
| `--ink` | `#182218` | Texto y botones sobre fondo claro |

El verde de interfaz es una interpretación plana de los adjuntos para evitar que el brillo del raster determine cada componente. Los mensajes y los estados también se expresan con texto, nunca exclusivamente con color.

## Tipografía

El prototipo usa Arial y Helvetica para texto y titulares, y las fuentes monoespaciadas del sistema para metadatos. No carga fuentes externas. Esto permite evaluar la composición sin introducir dependencias de red.

| Uso | Escritorio | Móvil | Regla |
| --- | --- | --- | --- |
| Titular de apertura | 65–112 px; 115 px en pantallas muy amplias | 62–88 px | Peso 500, interlínea 0,99–1,02 |
| Título de pantalla | 60 px | 45 px | Peso 400, interlínea 1,03 |
| Título de sección | 46 px | 36 px | Peso 500, interlínea 1,07 |
| Texto explicativo | 14–16 px | 13–14 px | Interlínea 1,65–1,7 |
| Controles y campos | 12–13 px | 12–13 px | Etiquetas visibles y asociadas |
| Metadatos | 9–10 px | 8–10 px | Mayúsculas espaciadas |

Los pequeños rótulos orbitales son ornamentales y su significado también aparece en el texto accesible. No deben alojar información comercial o condiciones esenciales.

## Composición

- Ancho máximo de contenido: 1.280 px. Márgenes de 56 px en escritorio, 32 px en tablet y 20 px en móvil.
- Rejilla de apertura: texto a la izquierda y escena orbital a la derecha. En móvil, la escena se coloca después de las acciones.
- Espaciado de secciones: 100 px en escritorio y 60 px en móvil. Separadores finos para establecer ritmo sin acumular cajas.
- Soluciones en filas numeradas, con descripción breve y flecha. La numeración facilita recorrer el catálogo sin convertirlo en una colección de tarjetas iguales.
- Demostración de caso sobre fondo mineral. Su contraste introduce una pausa editorial y separa evidencia de explicación comercial.
- Formularios y estimaciones en dos columnas en escritorio y una en móvil. El precio y sus condiciones comparten la misma superficie.
- Esquinas de 3–6 px; sin redondeados de cápsula en todos los controles.

## Componentes y estados

| Componente | Comportamiento |
| --- | --- |
| Cabecera | Marca, tres enlaces y acción en escritorio; menú desplegable en móvil |
| Acción principal | Verde sobre carbón, flecha, foco visible, área mínima de 48 px de alto |
| Acción secundaria | Enlace de texto o botón delimitado; no compite con la acción principal |
| Fila de solución | Número, resultado, capacidades y flecha; preselecciona la ruta del diagnóstico |
| Opción de formulario | Radio nativo dentro de área pulsable; borde verde cuando está seleccionada |
| Campo | Etiqueta visible, instrucciones y validación nativa, con comprobación adicional de espacios vacíos |
| Resumen | Pares de etiqueta y valor; necesidad y contexto confirmados antes de estimar |
| Estimación | Rango, impuestos y terceros separados, condiciones, alcance y descarga local |
| Revisión necesaria | Sin precio si falta alcance; urgencia con importe orientativo y revisión explícita |
| Identidad | Diálogo nativo con originales, paleta y favicon a 16, 32 y 64 px |

## Movimiento y rendimiento

La escena combina una órbita lenta de 80 segundos y una variación de brillo y escala de 7 segundos. La animación afecta a `transform` y `filter` y se mantiene localizada en la apertura. El coste de `filter` debe medirse en dispositivos reales antes de producción; si perjudica la fluidez se eliminará.

Las acciones cambian de estado con transiciones de 200 ms. `prefers-reduced-motion` desactiva animaciones, transiciones y desplazamiento suave. La información permanece disponible sin movimiento. No se necesitan vídeo, WebGL, librerías de animación ni imágenes generadas adicionales para esta dirección.

Los originales ocupan aproximadamente 1,1 MB en total y se conservan como material de referencia del prototipo. La Fase 4 debe generar derivados raster optimizados y comparar su fidelidad antes de publicar. No se ha demostrado todavía el cumplimiento de Core Web Vitals con tráfico real.

## Reglas editoriales

Hablar de problemas, intervenciones y resultados comprobables. Evitar garantías de ventas, rankings, plazos o ahorro sin evidencia. El prototipo usa una demostración conceptual identificada y no atribuye métricas ni testimonios a clientes inexistentes.

La experiencia pública explica lo que el cliente necesita decidir. El diagnóstico de esta fase incluye una indicación breve de demostración porque todavía no hay agente ni servicios conectados. Esa indicación se sustituirá por el comportamiento real cuando se implementen sus fases.

## Adaptación responsive y accesibilidad

Puntos de adaptación principales: 760 px, 1.100 px y 1.600 px. Los campos ocupan el ancho disponible. El menú móvil mantiene `aria-expanded`; el diálogo gestiona foco y cierre mediante Escape. Las rutas colocan el foco en el título de pantalla y el enlace de salto conserva la pantalla actual.

Se utilizan controles HTML nativos, etiquetas asociadas, texto alternativo y estados con texto. Esta preparación y las comprobaciones de interfaz de Fase 2 no sustituyen la auditoría de accesibilidad de producción.
