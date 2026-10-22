# Experiencia de marca: el elemento que falta

## Dirección

La portada pasa de mostrar una escultura aislada a una exploración interactiva de fricciones del negocio. El visitante elige ventas que se enfrían, tareas que se repiten o datos que no se conectan. Cada elección cambia la materia visual, la explicación, las piezas de la narrativa al desplazarse y la necesidad editable que se lleva al diagnóstico.

«Conectar las piezas» reúne las curvas alrededor del símbolo abierto de Element999 y cambia la explicación de la fricción por una conexión propuesta. Es una demostración gráfica con reglas locales; no hace diagnóstico con un modelo ni mide datos reales del visitante. El sitio identifica las aplicaciones como ilustrativas.

El portafolio aparece después de la exploración y antes de las capacidades técnicas. Se mantienen los cuatro casos, las arquitecturas con logos, las ocho industrias, la recepción en Formspree, el laboratorio y el footer isométrico. Los encabezados dejan de numerar secciones con un orden heredado de la estructura anterior.

## Código y rendimiento

- `preview/signature/signature.js`: curvas paramétricas originales en Canvas 2D, proyección 3D, controles y sincronización del contenido. No usa una biblioteca gráfica, imágenes, vídeo, IA remota ni almacenamiento de datos del visitante.
- `preview/signature/signature.css`: composición editorial, selector y versión móvil.
- `preview/motion.mjs`: conserva la narrativa al desplazarse y retira la inicialización del renderer de escultura anterior. No se construyen dos escenas de portada simultáneas.
- `preview/preview.mjs`: permite que un CTA con `data-need` lleve su contexto al diagnóstico existente. Las exploraciones de portada se revisan como alcance a medida, sin presupuesto estándar automático.
- `preview/index.html`: portada, posición de los proyectos y carga de los módulos con revisión nueva para evitar mezclar el código antiguo con el nuevo HTML.

`SIGNATURE_CONFIG` expone colores, DPR máximo 1,5, límite de 800.000 píxeles, objetivo de render de 30 fps, 76 fibras en escritorio, 38 en móvil y transición de 1,25 segundos. El dibujo se simplifica si las muestras de coste de render superan 18 ms de forma sostenida. Esto reduce trabajo y no es una garantía universal de FPS. El renderer se detiene fuera del área visible, con la pestaña oculta y durante el preloader. Hay pausa manual, versión estática con movimiento reducido y SVG de respaldo si Canvas 2D no está disponible.

Los recursos nuevos pesan aproximadamente 6,9 KB gzip entre CSS y JS, además del HTML de la nueva portada. El módulo de movimiento anterior se reduce al quitar la geometría/render de la escultura. Se respeta el stack de HTML/CSS/JS nativo; no hay build ni dependencias nuevas.

## Verificación

`qa-signature/check.cjs` verifica las tres fricciones, transformaciones reversibles, contexto del diagnóstico, narrativa de tres capítulos, pausa manual/fuera de pantalla, cinco anchos entre 320 y 1440 px, orden del título móvil, movimiento reducido, respaldo sin Canvas y convivencia con el preloader. No envía solicitudes reales. También se reejecutaron la suite de recepción y las tres pruebas de precios a 80 EUR/h.

Los scripts antiguos que esperaban el canvas de la escultura anterior documentan esa versión; para la portada actual se usa `qa-signature/check.cjs`.
