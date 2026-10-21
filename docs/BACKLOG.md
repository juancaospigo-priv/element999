# Element999 backlog y estimación de producción

Fecha: 21 de octubre de 2026. Base de alcance: [especificación de Fase 1](FASE_1.md).

Actualización de estado: Fase 2 entregada para revisión visual. Ver [entrega y comprobaciones](FASE_2.md). Los rangos de horas de la tabla se conservan como estimación de referencia; no constituyen un registro de tiempo real. El total de 204–328 horas corresponde al alcance originalmente pendiente tras Fase 1 y no al trabajo restante tras esta entrega.

Este backlog convierte el plan aprobado en paquetes de trabajo verificables. Los esfuerzos son estimaciones de planificación para una primera versión con dos servicios estándar; incluyen implementación asistida por IA y comprobaciones. No representan horas ya trabajadas ni una oferta contractual.

## 1 Paquetes por fase

| Fase | Trabajo concreto | Dependencias | Esfuerzo pendiente | Evidencia de aceptación |
| --- | --- | --- | --- | --- |
| 1 | Especificación validada con tarifa de 80 EUR/h | Fundador | 0 h | Decisiones comerciales registradas en versión 0.2 |
| 2 | Preparar logos y favicon; tokens visuales; mapa de pantallas; textos clave; prototipo móvil y escritorio; prompt de Lovable | Validación de Fase 1 | 20–32 h | Recorrido inicio → diagnóstico → estimación aprobado |
| 3 | Configurar repositorio remoto y entornos; modelo de datos; autenticación; permisos; API; eventos persistidos; copias y despliegue | Contratos de datos de Fase 1; cuentas disponibles | 24–40 h | Prueba de extremo a extremo y aislamiento entre dos clientes |
| 4 | Construir web; sistema de casos; cargar contenido autorizado; metadatos y rastreabilidad; analítica; accesibilidad y rendimiento | Fases 2 y 3; evidencia de casos | 32–48 h | Web de revisión completa y formularios probados |
| 5 | Conocimiento aprobado; extracción estructurada; confirmación; motor de precios; resumen; límites; alternativa de formulario; 30 escenarios | Fase 3; tarifas validadas; integración con web de Fase 4 | 40–64 h | Resultados de evaluación y cálculos exactos |
| 6 | Área del cliente; propuestas versionadas; aceptación; pago y facturación seleccionados; incorporación; seguimiento | Fase 5; identidad empresarial y condiciones; proveedores elegidos | 24–40 h | Cliente de prueba pasa de diagnóstico a incorporación |
| 7 | Plantillas landing y agente; funciones de IA; flujos n8n; consola; control de costes; recuperación y autorización de acciones | Fases 3, 5 y 6; conectores del piloto | 40–64 h | Dos entregas de prueba y fallo recuperado sin duplicados |
| 8 | Pruebas finales; restauración; piloto; panel de métricas; manual; correcciones y preparación del lanzamiento | Fases anteriores; 3–5 participantes disponibles | 24–40 h | Cero bloqueos críticos; recorrido completo; autorización de lanzamiento |

Estimación de referencia tras cerrar Fase 1: **204–328 horas**, antes de contingencia, para Fases 2–8. La revisión de Fase 1 está completada. Tras la entrega de Fase 2, el alcance restante de Fases 3–8 suma **184–296 horas**, más los ajustes visuales que se acuerden.

Orden de prioridad: validar oferta → definir experiencia → establecer base técnica → demostrar experiencia → diagnosticar y estimar → contratar → ejecutar → medir y lanzar.

## 2 Secuencia y calendario

Con 30 horas productivas semanales, 204–328 horas equivalen a unas 7–11 semanas de trabajo. Con una reserva de planificación del 20 %, prever **9–14 semanas de capacidad**, redondeadas hacia arriba. Son semanas de trabajo disponible, no una fecha de lanzamiento comprometida.

El calendario real incorpora esperas de contenido, revisiones, accesos y proveedores. La observación del piloto puede extenderlo. Si la dedicación real es de 15 horas por semana, la duración de trabajo se aproxima al doble.

Aunque algunas tareas pueden solaparse, no se presupone ejecución simultánea ni una reducción automática de esfuerzo. Cada cambio material de alcance exige actualizar la estimación.

## 3 Presupuesto de planificación

Las cifras siguientes son hipótesis internas, no precios vigentes de proveedores. Se deberán verificar los planes y consumos al seleccionar cada servicio. Las herramientas ya pagadas por el fundador se contabilizarán aparte para evitar sumar dos veces el mismo coste.

| Concepto | Hipótesis | Uso de la cifra |
| --- | --- | --- |
| Trabajo propio | 204–328 h × 55 EUR/h = 11.220–18.040 EUR | Coste de oportunidad, aunque no genere pago a terceros |
| Trabajo con contingencia del 20 % | 13.464–21.648 EUR | Reserva de esfuerzo para el alcance definido |
| Herramientas e infraestructura | Envolvente propuesta de 200–450 EUR/mes | Presupuesto de planificación conjunto para construcción y piloto; no autoriza gasto |
| Producción audiovisual externa | Sin partida activada | Presupuestar solo si aporta valor frente a su coste y carga |
| Firma, pagos y facturación | Pendientes de proveedor y volumen | Añadir cuotas y comisiones al confirmar Fase 6 |
| Costes de cada cliente | Separados del presupuesto de Element999 | Incluir APIs, alojamiento e integraciones en su propuesta |

El presupuesto mensual se desglosará en interfaz/alojamiento, base de datos, orquestación, modelo, correo, observabilidad y herramientas creativas. El límite máximo aprobado será configurable; hasta validarlo no se activarán compras ni suscripciones.

Los modelos se elegirán con una muestra de conversaciones y tareas: calidad de salida, latencia, coste por diagnóstico y capacidad de recuperación. No se presupone utilizar varios proveedores en cada interacción.

## 4 Primeras tareas de la Fase 2

| Orden | Tarea | Responsable | Resultado |
| --- | --- | --- | --- |
| 1 | Registrar ajuste de tarifa y validación del resto de la especificación | Fundador con asistencia de Codex | Completado en versión 0.2 |
| 2 | Inventariar los adjuntos y preparar variantes optimizadas | Codex | Logo horizontal, emblema y favicon de prueba |
| 3 | Definir tokens, jerarquía y movimiento | Codex | Sistema visual para el prototipo |
| 4 | Dibujar inicio, caso, diagnóstico y estimación | Codex | Recorrido revisable en móvil y escritorio |
| 5 | Preparar el prompt y contexto para Lovable | Codex | Instrucción vinculada al producto aprobado |
| 6 | Construir el prototipo con las capacidades disponibles | Codex; fundador para accesos cuando sean necesarios | Prototipo de Fase 2 |

## 5 Riesgos que afectan a esfuerzo o autonomía

| Riesgo | Señal | Respuesta prevista |
| --- | --- | --- |
| Oferta demasiado abierta | Muchas solicitudes fuera de plantilla | Mantener revisión a medida y ajustar catálogo con datos |
| Falta de evidencia | Resultados sin fuente o permiso | Publicar solo entregables verificables o demostraciones identificadas |
| Precio insuficiente | Horas o consumo reales superiores a la base | Revisar esfuerzo y margen por servicio tras cada entrega |
| Conector no validado | API incompleta o acciones que no se pueden recuperar | Prueba técnica y revisión antes de dar precio estándar |
| Dependencia del fundador | Repetición de dudas y bloqueos | Añadir reglas, requisitos y autoservicio a partir de incidencias |
| Multimedia excesiva | Carga lenta o poca legibilidad | Optimizar recursos y reducir efectos según medición |
| Falsa autonomía | Propuestas erróneas o compromisos inventados | Mantener reglas deterministas y revisar decisiones con riesgo |
| Datos o acciones mezclados | Acceso entre clientes o ejecución duplicada | Bloquear lanzamiento hasta superar pruebas y recuperación |

## 6 Condición para pasar a la Fase 2

La Fase 1 está validada con el ajuste a 80 EUR/h. La Fase 2 ya tiene una entrega revisable; el siguiente hito es aceptar la dirección visual antes de establecer la infraestructura de Fase 3. La capacidad y los costes internos siguen siendo supuestos de planificación; el gasto requiere autorización específica. Los casos detallados, el dominio y los proveedores transaccionales se resolverán en las fases indicadas.
