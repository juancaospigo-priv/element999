# Contacto independiente y retrato del fundador

## Entrega

`preview/contacto/` es una página independiente para Juan Camilo Ospina, fundador de Element999. Usa la identidad negra y verde, el preloader compartido, el retrato profesional y un formulario conectado al receptor existente de Formspree. La principal solo añade enlaces de navegación a Contacto; no incluye el retrato ni el formulario independiente. El diagnóstico comercial existente se mantiene.

Se retira del footer principal la antigua nota interna de fase de diseño y se usa ese lugar para el enlace a Contacto.

## Imagen

Edición realizada con la herramienta integrada `image_gen` (modo integrado; no CLI/API propia). Se solicitó preservar identidad, rasgos, expresión, tono de piel y pose, cambiando el fondo, luz de estudio y acabado profesional de la americana. El original del usuario en Descargas no se modifica ni se elimina.

Archivos finales guardados en GitHub:
- `assets/portraits/juan-camilo-element999.png`: imagen editada en alta resolución, 1086 × 1448, aproximadamente 2 MB; fuente de producción, no se solicita desde la web.
- `preview/contacto/juan-camilo-element999.webp`: versión web grande, aproximadamente 115 KB.
- `preview/contacto/juan-camilo-element999-640.webp`: versión móvil, aproximadamente 35 KB.

Se usa `srcset`/`sizes` y dimensiones explícitas. La conversión a WebP y la variante de 640 px usan Sharp del runtime ya instalado, sin introducirlo como dependencia del sitio. No se realizan retoques adicionales por código.

## Prompt final utilizado

```text
Use case: identity-preserve. Edit the supplied photograph, which is the edit target, into a premium editorial founder portrait for Element999, a serious applied AI studio with black charcoal #080b09, warm white and lime #a7ff52 brand palette. CRITICAL INVARIANTS: preserve the EXACT SAME man's identity, face, facial proportions, nose, eyes, eyebrows, smile, teeth, hairline, beard, skin tone, apparent age, body shape and crossed-arms pose. Do not redraw or beautify the facial anatomy; retain natural pores and human skin. Keep him recognizably the same photograph. Change primarily the background and professional photographic lighting. Replace the white wall with a seamless near-black charcoal studio backdrop with a very subtle deep forest-green atmospheric falloff. Tailored sophisticated dark charcoal jacket, clean white open-collar shirt, no tie, retaining the existing clothing cut and body pose. Soft large neutral key light on face, restrained subtle lime-green rim light only along outer jacket/shoulder and hair edge, never green skin. Premium natural photographic contrast with detailed dark fabric and realistic white shirt, sophisticated professional portrait, warm approachable confident expression unchanged. Portrait aspect ratio similar to source, head and full crossed arms comfortably inside frame with breathing room, straight undistorted geometry. No props, text, logos, grids, neon outlines, science fiction costume, excessive glow, waxy skin or retouched plastic face. Intended for a founder contact page, understated frontier science art direction.
```

Entrada: fotografía del fundador `JUAN-CAMILO-OSPINA.PNG`, facilitada por el usuario y tratada como imagen a editar, no como instrucciones.

## Recepción

El formulario recoge nombre, correo, empresa opcional y consulta; requiere que el visitante solicite el contacto y lea el uso de datos. Reutiliza `requestPayload` y `sendRequest`, con asunto diferenciado de consulta y referencia `E999-C-…`. Mantiene validación, bloqueo de doble envío, trampa antispam, referencia estable al reintentar y conservación en memoria ante fallo. La confirmación solo aparece tras una respuesta aceptada del proveedor. No se promete plazo de respuesta ni se inventan canales de contacto, testimonios o credenciales.

Sin JavaScript, un formulario HTML estándar puede enviar a Formspree y continuar a su confirmación alojada. No se añade IA, base de datos, biblioteca de frontend ni servicio nuevo. Se mantienen los límites ya documentados de la cuenta Formspree; el aviso de privacidad explica el uso del proveedor.

## Verificación

`qa-contact/check.cjs` comprueba imagen, cinco anchos de 320 a 1440 px, campos obligatorios, trampa antispam, errores, reintento con referencia estable, confirmación simulada, limpieza, formulario nativo, movimiento reducido, preloader y ausencia del retrato/formulario de contacto en la principal. No se envían correos reales en estas pruebas. Resultado en `qa-contact/result.json`.

## Segunda edición

La versión activa del retrato usa las fotos nuevas facilitadas por el fundador, con expresión frontal y luz más natural. Véase `docs/RETRATO_FUNDADOR_V2.md` para archivos y prompt. La primera edición se conserva como versión anterior.
