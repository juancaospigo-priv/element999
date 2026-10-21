# Element999 entrega de identidad y prototipo

Fecha: 21 de octubre de 2026. Estado: entregada para revisión visual del fundador.

La dirección propuesta combina un laboratorio corporativo, la identidad verde de los adjuntos y una experiencia centrada en encontrar una necesidad concreta. El recorrido inicio → diagnóstico → estimación está implementado como prototipo local navegable, con adaptación móvil y escritorio.

## Entregables

| Entregable | Ubicación | Estado |
| --- | --- | --- |
| Sistema visual, tokens, tipografía, componentes y movimiento | `DESIGN.md` | Preparado |
| Originales preservados y uso de cabecera y apertura | `prototype/assets/` | Integrados |
| Favicon vectorial simplificado | `prototype/assets/favicon.svg` | Comprobado visualmente a 16, 32 y 64 px |
| Prototipo navegable y adaptable | `prototype/index.html` | Implementado |
| Reglas de estimación a 80 EUR/h | `prototype/pricing.mjs` | Comprobadas con pruebas |
| Prompt de continuidad para Lovable | `docs/PROMPT_LOVABLE_FASE_2.md` | Preparado |
| Capturas de revisión | `docs/qa/` | Guardadas |

El prototipo se sirve en `http://127.0.0.1:4173`. Si el servidor está detenido, se inicia con el comando de `prototype/README.md`. La dirección es local a este equipo; no es un despliegue público.

## Mapa de pantallas y navegación

| Vista | Ruta | Contenido y siguiente acción |
| --- | --- | --- |
| Inicio | `#inicio` | Propuesta, emblema, capacidades, demostración, método y acceso al diagnóstico |
| Soluciones | `#soluciones` | Filas de resultados; cada una preselecciona un servicio en el diagnóstico |
| Trabajo | `#casos` | Demostración identificada; acceso al detalle del ejemplo |
| Método | `#metodo` | Encontrar, conectar y comprobar |
| Caso conceptual | `#caso` | Fricción, intervención, verificación y criterios para futuros casos reales |
| Diagnóstico | `#diagnostico` | Objetivo → contexto → confirmación; volver atrás sin perder campos |
| Estimación | `#estimacion` | Resumen, rango o revisión, alcance, exclusiones y descarga local |
| Identidad digital | `#identidad` | Diálogo con paleta, logotipo y muestras del favicon |

La estimación requiere un diagnóstico previo en la pestaña. Los datos se mantienen en memoria y se pierden al recargar. No se ha conectado un modelo, un CRM, pagos, analítica ni una base de datos.

## Textos y criterios de presentación

Titular de apertura: «El elemento que falta.» Acción principal: «Encontrar mi elemento». Las tres líneas se presentan como «Vender más», «Operar mejor» y «Construir lo siguiente».

El ejemplo de ecommerce ilustra una consulta conectada a una oportunidad en CRM. Se identifica como demostración conceptual y no presenta resultados, testimonios ni clientes inventados. La incorporación de casos reales sigue programada para la Fase 4.

El diagnóstico indica que es un recorrido guiado de demostración. Las condiciones de precio distinguen incertidumbre acotada de alcance desconocido. La urgencia requiere revisión de capacidad y las integraciones sin validar bloquean el precio automático.

## Comprobaciones realizadas

| Comprobación | Resultado |
| --- | --- |
| Landing estándar desde selección hasta confirmación y resultado en escritorio | 1.600–1.850 EUR, coincidente con especificación |
| Integración principal desconocida en recorrido móvil | Revisión de alcance, sin precio automático |
| Campos obligatorios vacíos | Se mantiene el paso inicial y se identifican campos inválidos |
| Reinicio desde la estimación | Limpia el formulario y devuelve al primer paso |
| Menú móvil y navegación a casos | Abre, navega y se cierra al cambiar de ruta |
| Detalle de demostración en móvil | Vista correcta y sin desbordamiento horizontal |
| Diálogo de identidad y muestras de favicon | Apertura, representación y cierre comprobados |
| Anchos de inicio 320, 390, 768 y 1.440 px | Sin desbordamiento horizontal tras corregir las órbitas |
| Estimación a 390 px | Sin desbordamiento horizontal |
| Imágenes de cabecera y apertura | Cargadas correctamente |
| Pruebas comerciales con Node | Tres pruebas aprobadas que cubren cinco rangos, exclusiones, urgencia y servicio inválido |

Las pruebas automáticas reproducibles se ejecutan con `node --test prototype/pricing.test.mjs`. El recorrido de interfaz se ha comprobado en el navegador integrado; no se ha realizado una matriz de compatibilidad con todos los navegadores ni una auditoría completa de accesibilidad. El movimiento reducido está contemplado en CSS y requiere contraste en dispositivo real durante la validación de producción.

## Capturas para revisar

- `qa/inicio-escritorio.jpg`: apertura de escritorio.
- `qa/inicio-escritorio-completo.jpg`: composición completa de la página.
- `qa/inicio-movil.jpg`: composición móvil.
- `qa/estimacion-escritorio.jpg` y `qa/estimacion-movil.jpg`: resultado de landing estándar.
- `qa/caso-movil.jpg`: detalle de la demostración.
- `qa/identidad-movil.jpg`: paleta, original y favicon.

## Cierre y continuidad

La Fase 2 entrega una propuesta concreta para revisar identidad, jerarquía, textos, movimiento y recorrido. Queda pendiente la aceptación visual del fundador. El acceso a cuentas externas no es necesario para evaluar este prototipo.

Una vez validada la dirección, la Fase 3 establecerá repositorio remoto, entornos, datos, permisos y API. El agente y la estimación de producción se implementarán en la Fase 5 con validación del lado del servidor. La optimización final de imágenes y el contraste de métricas de carga corresponden a la Fase 4.
