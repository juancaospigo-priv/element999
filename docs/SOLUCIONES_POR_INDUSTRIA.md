# Soluciones por industria

La sección `#industrias` se sitúa después de Capacidades y antes de Trabajo. Añade el enlace Industrias al menú principal y mantiene la identidad negra, verde y editorial del sitio.

## Experiencia

Ocho sectores: ecommerce; educación y formación; servicios y consultoría; inmobiliario; salud y bienestar; legal; finanzas; seguros. Cada sector tiene un panel propio con tres aplicaciones, ilustración vectorial, conexiones animadas, texto orientado al negocio y acceso al diagnóstico. Se muestran como aplicaciones que pueden diseñarse según el alcance; no se presentan como productos ya desplegados ni experiencia acreditada en todos los sectores.

La navegación usa pestañas verticales en escritorio y desplazamiento horizontal en móvil, con selección mediante clic, touch, flechas, Inicio y Fin. Las pestañas y paneles tienen relaciones ARIA y foco itinerante. Hay una pausa manual de escenas; la preferencia de movimiento reducido muestra una versión estática. Las animaciones se detienen fuera de pantalla y con la pestaña del navegador oculta.

Los enlaces a proyectos relacionados solo usan los casos existentes: El Almacén de Loza, Terence Crudo y el producto OnTheShortlist.ai. Las aplicaciones de salud, legal, finanzas y seguros se limitan a presencia web, atención inicial y tareas administrativas. No se atribuyen capacidades clínicas, decisiones financieras, asesoramiento legal, cumplimiento normativo ni resultados no validados.

## Diagnóstico y recepción

El botón «Explorar mi solución» selecciona un alcance a medida, conserva la industria y propone una necesidad editable. La industria aparece en confirmación, resumen descargado y payload a Formspree. Reiniciar o abrir otra solución explícita limpia el contexto anterior. No se altera la tarifa de 80 EUR/h ni se genera un presupuesto estándar automático para un proyecto sectorial sin delimitar.

## Implementación

- `preview/index.html`: contenido estático de los ocho paneles, navegación y carga de recursos.
- `preview/industries/industries.css`: estilos, escenas y animaciones.
- `preview/industries/industries.js`: pestañas, teclado, orientación, pausa y respuesta suave al cursor.
- `preview/preview.mjs`: contexto de industria en diagnóstico y resumen.
- `preview/requests/requests.js`: campo de industria en el envío existente.

HTML/CSS/JavaScript nativos, sin framework, fuente externa, biblioteca, vídeo ni imagen añadida. Los SVG son originales y están incluidos en HTML. CSS: 10.784 bytes (3.093 gzip); JS: 4.172 bytes (1.489 gzip), medidos antes de publicar. El contenido de los paneles se incluye además en HTML. No se requieren un build ni una base de datos nueva.

## Verificación

`qa-industries/check.cjs` verifica ocho sectores y 24 aplicaciones, teclado, cinco anchos entre 320 y 1.440 px, pausa manual/fuera de pantalla, movimiento reducido, apertura del diagnóstico, limpieza del contexto y envío interceptado con la industria. Sin envíos reales ni gasto de cuota del proveedor. Se reejecutaron las pruebas de recepción y las tres pruebas comerciales de precios. Evidencia en `qa-industries/result.json`.
