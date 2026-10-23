# Retrato del fundador — segunda versión

La segunda edición responde a la preferencia del fundador por una presencia más serena y natural. Usa IMG_3367.JPG como base y IMG_3368.JPG como referencia complementaria de identidad. Se elimina el borde verde de la primera versión, se mantiene la expresión de boca cerrada y se usa fondo carbón con iluminación de estudio discreta. No se solicitan cambios de edad, anatomía, pose o rasgos.

Modo: herramienta integrada `image_gen`, edición de imagen (sin CLI/API propia). Conversión a WebP con Sharp del runtime existente, sin retoques por código ni dependencias añadidas al sitio.

Archivos finales:
- `assets/portraits/juan-camilo-element999-v2.png`: edición en alta resolución.
- `preview/contacto/juan-camilo-element999-v2.webp`: retrato web.
- `preview/contacto/juan-camilo-element999-v2-640.webp`: variante móvil.

Las fotos originales de Descargas y la primera edición guardada en GitHub se conservan. La página Contacto pasa a usar los archivos v2 y una relación de aspecto 2:3.

## Prompt final

```text
Use case: identity-preserve. EDIT TARGET: image 1 (IMG_3367.JPG), frontal portrait with closed mouth and calm slight smile. Image 2 (IMG_3368.JPG) is ONLY an additional identity reference of the same man; do not use its smiling mouth, crossed-arm pose or camera angle. Make a refined, believable editorial portrait for the founder of Element999, an applied AI and ecommerce business. The user disliked the previous artificial-looking portrait and wants to project thoughtful credibility, calm intelligence and professional substance. Preserve image 1's EXACT face, natural age, gaze, eye shape and brown eye color, eyebrows, nose, mouth, closed-mouth expression, asymmetry, beard, hairline, hairstyle, skin texture, head position, frontal pose, body proportions, charcoal textured jacket and white shirt. Do not invent a new person, improve his jaw, change cheeks, slim the face, age him, add glasses or touch the expression. Treat facial pixels as protected; focus edits outside the face. Change the white background to a seamless dark charcoal #101510 photographic studio backdrop with extremely subtle deep olive atmosphere. Replace harsh frontal flash with plausible soft neutral window-style studio light, gentle natural shadow shaping with both eyes clearly visible, and understated tonal separation of dark jacket from backdrop. Retain honest skin texture and natural warmth, keep original beard and jacket texture. NO neon rim, NO lime outline around hair, NO green skin, NO holograms, NO sci-fi styling, NO smooth wax skin, NO beauty-model glamour, NO tie, props, desks, text or logos. This should feel like an authentic photograph of this exact person in a serious editorial interview, assured and approachable, not a synthetic executive headshot. Same portrait aspect ratio around 2:3, generous head room, upper torso visible. Premium restrained photography that blends into Element999's dark website; the web UI supplies the lime accent rather than painting it onto the person.
```

