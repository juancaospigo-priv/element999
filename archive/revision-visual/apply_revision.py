"""Aplicar solo cuando el sistema permita acceso normal a la carpeta del proyecto."""
from pathlib import Path
from shutil import copy2

bundle = Path(__file__).resolve().parent
project = Path('/Users/juancamilo/Documents/ChatGPT/ELEMENT999')
prototype = project / 'prototype'
index = prototype / 'index.html'
source = index.read_text()
if 'revision.mjs' in source:
    raise SystemExit('La revisión ya figura en el prototipo; revisar antes de volver a aplicar.')
for marker in ['<link rel="stylesheet" href="styles.css">', '<section id="soluciones"', '<script type="module" src="app.mjs"></script>']:
    if marker not in source:
        raise SystemExit('El prototipo ha cambiado: falta el marcador ' + marker)
updated = source.replace('<link rel="stylesheet" href="styles.css">', '<link rel="stylesheet" href="styles.css">\n  <link rel="stylesheet" href="revision.css">', 1)
updated = updated.replace('      <section id="soluciones"', (bundle / 'studio.html').read_text() + '\n      <section id="soluciones"', 1)
if updated == source or 'studio-title' not in updated:
    raise SystemExit('No se pudo insertar el explorador; no se ha modificado el proyecto.')
updated = updated.replace('<script type="module" src="app.mjs"></script>', '<script type="module" src="app.mjs"></script>\n  <script type="module" src="revision.mjs"></script>', 1)
backup = prototype / 'index.pre-revision.html'
if backup.exists():
    raise SystemExit('Ya existe una copia previa; revisar antes de reemplazar nada.')
copy2(index, backup)
for filename in ['revision.css', 'revision.mjs']:
    copy2(bundle / filename, prototype / filename)
index.write_text(updated)
copy2(bundle / 'REVISION_VISUAL.md', project / 'docs/REVISION_VISUAL.md')
print('Revisión aplicada. Pendientes: revisión visual, pruebas de navegación y actualización de documentación.')
