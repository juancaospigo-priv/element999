# Portafolio de webs de Element999

## Entrega

La sección `#casos` de la web muestra una galería horizontal inspirada en la grabación del fundador: tarjetas curvas, perspectiva, desplazamiento por arrastre, botones, teclado y touch. La página independiente está en `trabajos/`. Se conservan el preloader y la animación isométrica del footer.

Los cuatro proyectos fueron facilitados directamente por el fundador:

- OnTheShortlist.ai: https://ontheshortlist.cupperlab.com/es
- Terence Crudo: https://terencecrudo.com/products/lectura-de-iris
- HolaPepa: https://www.holapepa.com/
- El Almacén de Loza: https://elalmacendeloza.com/

No se añaden métricas de negocio, resultados, testimonios ni un alcance de participación que no haya sido especificado. Los parámetros de seguimiento de los enlaces se retiraron.

## Portadas y apertura

Las portadas son capturas de los sitios reales, optimizadas a WebP y 1.200 × 800 px. Suman 206.280 bytes en esta entrega. La galería y su catálogo se inicializan al acercarse al viewport; no hay vídeos, librerías de carrusel ni iframes de terceros cargados en segundo plano. El código usa HTML, CSS y JavaScript nativos, respetando el proyecto existente. La curvatura y perspectiva son una interpretación propia de la referencia.

Se comprobaron sus cabeceras: OnTheShortlist.ai utiliza `X-Frame-Options: SAMEORIGIN` y `frame-ancestors 'self'`; los otros tres proyectos utilizan `DENY` y `frame-ancestors 'none'`. Por ello, los cuatro se abren en pestaña nueva y `embed` está desactivado. No se intenta eludir esas restricciones ni copiar los sitios o sus sistemas de compra. Las webs continúan alojadas en sus dominios originales; Element999 aloja la galería y sus portadas.

## Añadir un proyecto desde la nube

El catálogo está en `preview/showcase/projects.json` en `main`. Cada entrada admite:

```json
{
  "id": "nombre-unico",
  "name": "Nombre del proyecto",
  "category": "Web / Ecommerce / Software",
  "url": "https://dominio-del-proyecto.example/",
  "cover": "covers/nombre-unico.webp",
  "alt": "Vista de la web del proyecto",
  "featured": true,
  "embed": false
}
```

1. Añadir una portada WebP a `preview/showcase/covers/`.
2. Añadir la entrada al JSON, con el enlace público autorizado.
3. Publicar el contenido de `preview/` en la rama `codex/cloud-preview`, conservando `.nojekyll` y `robots.txt`. Esa rama es la fuente actual de GitHub Pages.

No hay todavía un CMS con inicio de sesión ni un panel de cargas. Mientras se implementa la automatización de despliegue de Fase 3, pedir la incorporación al asistente mantiene sincronizadas la fuente y la rama publicada. Editar solamente `main` no publica automáticamente en la configuración actual.

## Alojar futuras webs estáticas

La ruta `preview/proyectos/` está preparada para alojar versiones estáticas autorizadas. Subir `index.html` y sus recursos a `preview/proyectos/mi-web/` y publicar `preview/` hace que esa web esté disponible en `https://juancaospigo-priv.github.io/element999/proyectos/mi-web/`. Sus rutas de recursos deben ser relativas o incluir la base `/element999/proyectos/mi-web/`.

El catálogo puede enlazar `../proyectos/mi-web/`; `embed: true` activa una vista modal opcional para una web propia que permita su incrustación, con modos escritorio y móvil. Esta vista solo carga el iframe al abrirla y lo elimina al cerrarse. Mantener `embed: false` para sitios externos que lo bloqueen. Habilitarlo solo para código de confianza.

Este alojamiento sirve HTML, CSS, JavaScript y recursos estáticos. Una tienda Shopify, un servidor, una base de datos o un proyecto con secretos necesita su proveedor correspondiente; no se migra al subir un enlace al catálogo. No publicar `.env`, claves ni datos privados en el repositorio público.

## Comprobación

`qa-showcase/check.cjs` comprueba los enlaces, las portadas, botones, teclado, arrastre, touch, anchos de 320/390/768/1.440 px, movimiento reducido, carga diferida, convivencia con el preloader y el footer, alternativa ante un error de catálogo y la vista opcional de una web propia.

```sh
BASE_URL=http://127.0.0.1:4175/ QA_OUTPUT=/tmp CHROME_PATH=/ruta/a/chrome node qa-showcase/check.cjs
```

Playwright debe estar disponible en el entorno que ejecuta esta comprobación. Los resultados se guardan en `qa-showcase/result.json`.
