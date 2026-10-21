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

## Alcance del respaldo

Este repositorio contiene todos los archivos accesibles de las dos copias de trabajo de la revisión visual. La carpeta original `Documents/ChatGPT/ELEMENT999` sigue bloqueada por macOS: sus documentos de producto, archivos de fases anteriores, activos y metadatos Git no se pudieron recuperar. Esa carpeta no debe borrarse hasta respaldarla y verificarla. No se presenta esta subida como un respaldo completo de dicha carpeta original.
