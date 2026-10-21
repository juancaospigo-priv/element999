# Prototipo Element999

Prototipo local de Fase 2, sin dependencias de paquetes ni servicios externos. Incluye inicio, demostración de caso, diagnóstico guiado, estimación y sistema visual.

Desde la raíz del proyecto:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory prototype
```

Abrir `http://127.0.0.1:4173`. Se necesita servir los archivos por HTTP porque el navegador carga módulos JavaScript. No abrir directamente `index.html` mediante `file://`.

Para comprobar las reglas comerciales:

```sh
node --test prototype/pricing.test.mjs
```

Los datos permanecen en memoria de la pestaña y desaparecen al recargar. El resumen se descarga en el dispositivo. No se conectan modelos, CRM, Supabase, analítica ni pagos. El cálculo en cliente sirve para comprobar la experiencia; su versión de producción deberá validar entradas y precios en servidor.

Los originales se preservan sin cambios. El favicon es un derivado SVG creado para tamaños pequeños. El logotipo de cabecera usa recorte CSS de los márgenes del original.
