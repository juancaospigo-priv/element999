# Element999 muestra de apertura y narrativa animada

La vista de revisión incorpora una apertura tridimensional y una sección de scroll que transforma piezas dispersas en un sistema conectado. Se conserva el explorador de soluciones y el diagnóstico de demostración a 80 EUR/h.

## Cómo revisarla

Abrir `http://127.0.0.1:4173/?motion=cinematica` con el servidor activo. La apertura dura aproximadamente dos segundos y se puede repetir con el control situado bajo las acciones principales. En escritorio, el símbolo responde al cursor. El enlace «Explorar la conexión» lleva a las tres etapas controladas por scroll: fricción, conexión y sistema. Los botones 01, 02 y 03 permiten ir directamente a cada etapa.

## Comportamiento y adaptación

- El símbolo es geometría 3D con iluminación suave mediante WebGL nativo. Los fragmentos convergen durante la entrada. Una alternativa Canvas 2D permite mostrar la pieza sin WebGL.
- El scroll ensambla seis piezas, descubre las conexiones y modifica el contexto editorial. El recorrido es reversible y no intercepta la rueda ni impone una velocidad de desplazamiento.
- Las vistas del explorador transicionan con profundidad y conservan navegación por teclado.
- La animación de apertura se limita a 30 fps en escritorio y 24 fps en el encuadre móvil. El dibujo se suspende cuando la apertura sale de la zona visible o la pestaña queda oculta.
- La densidad de píxeles del lienzo está limitada para contener el coste de renderizado. Estas decisiones no constituyen una certificación de rendimiento en todos los dispositivos.
- Con movimiento reducido, el símbolo se muestra formado y los tres capítulos se presentan como contenido estático legible.
- El encuadre móvil coloca la pieza visual entre el titular y la explicación, en lugar de limitarse a reducir la composición de escritorio.

## Comprobaciones realizadas

Pruebas en Chrome de escritorio con contexto aislado: geometría WebGL activa; formación y repetición de entrada; etapas de scroll y navegación inversa; navegación por teclado del explorador; diagnóstico completo de landing con resultado 1.600–1.850 EUR; ausencia de errores JavaScript; alternativa sin WebGL; movimiento reducido con tres capítulos accesibles.

Se comprobaron anchos de 320, 390, 768 y 1.440 px sin desbordamiento horizontal. Las etapas centrales y finales se revisaron en móvil para comprobar que texto e ilustración no se solapan. Las capturas y `qa/resultado.json` documentan esta revisión. No se ha ejecutado todavía una matriz de navegadores ni una auditoría de Core Web Vitals.

## Alcance de la entrega

Esta muestra vive fuera de la carpeta original de Element999 porque su acceso sigue bloqueado por el sistema. Los originales de marca y los documentos de producto no se han modificado. El símbolo de la muestra es una interpretación vectorial y tridimensional; su integración definitiva debe validarse contra los activos originales.

La propuesta es código nativo sin librerías de animación externas y no requiere Framer para reproducir estos comportamientos. La elección de plataforma para producción sigue abierta a la evaluación del fundador.

## Ejecución local

Desde la carpeta que contiene este documento:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory preview
```

Las pruebas de interfaz se guardan junto a la muestra. El diagnóstico conserva datos solo en la memoria de la pestaña y no conecta un agente real, un CRM ni pagos.
