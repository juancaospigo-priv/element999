# Recepción de solicitudes sin Supabase

La web es estática y conserva su estructura de módulos JavaScript nativos. Formspree recibe el diagnóstico y los datos de contacto, almacena el envío en su panel y notifica al destinatario configurado. No se guardan contactos en GitHub ni en almacenamiento persistente del navegador. No hay funciones de servidor ni claves privadas en el frontend.

## Configuración y activación

1. Crear un formulario en una cuenta de Formspree del propietario y verificar el correo destinatario. No compartir contraseñas ni claves API.
2. Facilitar el endpoint público `https://formspree.io/f/<id>` e introducirlo en `preview/requests-config.js`.
3. Configurar las notificaciones al correo elegido y restringir el formulario al dominio `juancaospigo-priv.github.io` desde el panel. Revisar la protección antispam/CAPTCHA del proveedor; el campo trampa del navegador es solo una capa adicional, no protección suficiente por sí sola.
4. Ejecutar un envío de prueba identificado como tal, verificar su presencia en el panel y confirmar la llegada al correo. Las pruebas automatizadas interceptan la red y no acreditan entrega real.
5. Publicar en la rama `codex/cloud-preview` después de configurar el endpoint. Verificar un envío desde la web publicada antes de dar por concluida la activación.

Si no hay endpoint válido el botón de envío permanece deshabilitado y se explica que la recepción no está activada. No se acepta una URL arbitraria ni se utiliza una cuenta de terceros como destinatario.

## Flujo

El visitante completa los tres pasos del diagnóstico, consulta la estimación y puede descargar un resumen sin enviar datos. Para solicitar contacto introduce nombre y correo y marca que solicita respuesta sobre su proyecto. Se envían necesidad, negocio, herramientas, alcance, estimación orientativa a 80 EUR/h y una referencia. No se envían parámetros de la URL ni etiquetas de seguimiento.

El botón se bloquea durante el envío. Solo una respuesta HTTP satisfactoria con JSON sin errores confirma la recepción. La confirmación no acredita entrega en el buzón, aceptación del presupuesto ni reserva. Ante un error o tiempo de espera de 20 segundos se conserva el formulario en memoria para reintentar. La misma referencia acompaña los reintentos para reconocer posibles duplicados; el proveedor no garantiza deduplicación. Recargar o cerrar la pestaña descarta los datos sin enviar. El resumen descargado indica si la recepción fue confirmada.

El reinicio limpia los datos de contacto. Durante un envío no permite reiniciar o reemplazar el diagnóstico desde otro enlace. No incluye autorespuesta por correo al visitante; la confirmación es en pantalla.

## Límites y conservación

A fecha de comprobación, Formspree Free incluye **50 envíos al mes y 30 días de historial**, además de notificaciones por correo. El historial gratuito no es un archivo permanente. Conservar los correos recibidos en el buzón de negocio y revisar periódicamente spam, cuota y panel. Antes de superar ese volumen se debe ampliar el plan o migrar el receptor. No se ha configurado una copia de seguridad automática, un monitor ni una automatización recurrente.

La información de uso de datos en el formulario describe este flujo. Cuando se definan razón social, contacto de privacidad y política de conservación del negocio, completar el aviso legal y la política general del sitio con esos datos reales.

Fuentes oficiales:
- https://formspree.io/plans/
- https://help.formspree.io/articles/account-management/account-limits/
- https://help.formspree.io/articles/building-your-form/building-an-html-form/
- https://help.formspree.io/articles/building-your-form/submit-forms-with-javascript-ajax

## Verificación

No hay build ni dependencias nuevas. Servir `preview/` con un servidor estático y ejecutar `qa-requests/check.cjs` con Playwright disponible vía `NODE_PATH`. El script usa un receptor simulado y configuración interceptada, sin modificar el endpoint de producción ni enviar mensajes a nadie.

## Endpoint configurado

El propietario facilitó `https://formspree.io/f/xgaogjpp`. Está configurado en `preview/requests-config.js`. Las comprobaciones del código usan respuestas simuladas; la aceptación real del proveedor se registra por separado en `qa-requests/live-result.json`. La llegada al buzón requiere confirmación del propietario.

## Verificación de producción

El 22 de octubre de 2026 se publicó la recepción y se envió una única solicitud identificada como prueba técnica desde GitHub Pages. Formspree respondió HTTP 200 con `ok: true`; la interfaz mostró la referencia `E999-4B59A228` y no se registraron errores JavaScript. Evidencia: `qa-requests/live-result.json`. Esto confirma la aceptación del proveedor, no acredita la llegada al buzón: pendiente de confirmación del propietario.
