# Element999

Web de presentación de Element999: interfaz premium, apertura 3D, narrativa de scroll, diagnóstico de demostración y preloader líquido WebGL. HTML, CSS y módulos JavaScript nativos, sin framework ni build.

## Abrir la web

El código actual está en `preview/`. Desde GitHub Codespaces o un entorno con Python:

```sh
python3 -m http.server 4173 --bind 0.0.0.0 --directory preview
```

En Codespaces, abrir el puerto 4173 desde la pestaña Ports. Añadir `?preloader=force` para repetir el preloader. El repositorio por sí solo almacena el código; no constituye un despliegue web público.

## Documentación y pruebas

- [Movimiento](README_MOVIMIENTO.md)
- [Preloader y configuración](PRELOADER.md)
- `qa/` y `qa-preloader/`: capturas y resultados de las verificaciones realizadas.
- `qa-*.cjs`: scripts de verificación del entorno original; sus rutas locales de Playwright, Chrome y salida deben adaptarse para ejecutarlos en otro entorno.
- `archive/revision-visual/`: respaldo íntegro de la revisión temporal, incluidas versiones anteriores y capturas.
- `migration-manifest.json`: rutas y hashes SHA-256 de las copias recuperadas, para verificar el respaldo antes de borrar las fuentes locales.

## Estado funcional

El diagnóstico es una demostración con tarifa base de 80 EUR/h. No conecta todavía agentes reales, CRM ni pagos. La integración final del logo debe revisarse con los activos originales.

## Producto, identidad y prototipo inicial

- [Fase 1: producto y operación](docs/FASE_1.md)
- [Backlog de producción](docs/BACKLOG.md)
- [Fase 2: entrega y validación](docs/FASE_2.md)
- [Sistema de diseño](DESIGN.md)
- [Prototipo inicial](prototype/README.md)
- [Prompt para Lovable](docs/PROMPT_LOVABLE_FASE_2.md)
- `prototype/assets/`: logos originales y favicon.

## Alcance del respaldo

El 21 de octubre de 2026 se recuperó el acceso a la carpeta original de Documentos. Todos sus archivos de proyecto se incorporaron a `archive/original-project/` conservando sus rutas y contenido; documentación, diseño y prototipo también se ofrecen en las rutas enlazadas arriba. La web más reciente permanece en `preview/`.

`original-project-manifest.json` registra los hashes SHA-256 de los archivos originales. La carpeta `.git` local inicial no contenía commits ni remotos y se excluyó; la historia válida del proyecto está en este repositorio. `migration-manifest.json` conserva la evidencia de la primera migración, anterior a la recuperación de Documentos.

## Portafolio de proyectos

La galería está en `preview/trabajos/` y en la sección Trabajo de la web. [Añadir proyectos y alojar futuras webs estáticas](docs/PORTAFOLIO.md).

## Arquitecturas visuales

La sección `#arquitecturas` presenta ecommerce, agentes de texto/voz/avatar y software factory con logos reales y movimiento. [Alcance, fuentes de logos, accesibilidad y muestras de voz](docs/ARQUITECTURAS_VISUALES.md).
