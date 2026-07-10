---
title: '¿Tu web cumple con la ley? Avisos legales, cookies, RGPD y DPA explicados'
metaTitle: '¿Tu web cumple la ley? Guía legal'
description: 'Aviso legal, cookies, RGPD, privacidad, DPA: qué es obligatorio, qué riesgos hay si no lo cumples y cómo implementarlo sin gastar 5.000€ en abogados.'
date: 2026-05-02
author: Borja García
tags:
  - Cumplimiento & Accesibilidad
  - General
cover: /assets/img/blog/tu-web-cumple-ley/cover.webp
coverAlt: 'Documentos legales y cumplimiento RGPD en pantalla'
draft: false
---

Una pyme de Bilbao recibió una multa de 2.000 euros por no tener política de cookies. Otro e-commerce de Logroño recibió un aviso de un usuario (traducido con Google): "Habéis procesado mis datos sin consentimiento y voy a reportaros a Aepd.es" (la Agencia Española de Protección de Datos). No hizo nada, y seis meses después, llegó la multa: 4.500 euros.

No es raro. Es que muchas webs en España cumplen "a medias" o directamente no cumplen. Y la AEPD cada año sanciona más casos. Vamos a desmitificar qué es obligatorio, qué es riesgo real, y cómo no gastar 5.000 euros con un abogado.

## Los cuatro pilares: qué es obligatorio

**1. Aviso Legal (obligatorio por Ley 34/1988 de Publicidad y LSSICE)**

Quién sois, quién os representa legalmente, domicilio fiscal, CIF/NIF. Una pyme puede resumirlo en media página. Debe estar visible (típicamente en el footer). No es complicado, pero es obligatorio.

Si no lo tienes, no pasa gran cosa (no hay multa), pero es como conducir sin placa. Cualquiera que quiera reportarte tienecausas.

**2. Política de Cookies (obligatorio por ePrivacy Directive)**

Cuando tu web usa cookies (sesión, analytics, publicidad), debes:
- Informar de qué cookies usa.
- Cuál es su propósito.
- Dónde se almacenan.
- Pedir consentimiento antes de guardarlas (salvo cookies técnicas de sesión).

Eso requiere un banner de cookies. No puedes simplemente aceptar todo. Debe haber opción de rechazar. Y ese consentimiento debe quedar registrado (prueba de que el usuario decidió).

Riesgo: una auditoria externa, un usuario enfadado, o la propia AEPD ve tu web, detecta que no tienes banner o que las cookies se guardan sin consentimiento. Multa: 300-600 euros (casos leves) hasta 10.000+ (webs grandes).

**3. Política de Privacidad (obligatorio por RGPD)**

Dónde vas, cómo procesáis datos, para qué, cuánto tiempo los guardáis, a quién se los pasáis, y cuáles son los derechos del usuario (acceso, rectificación, olvido, portabilidad).

El RGPD es europeo. Aplica a webs españolas que recojan datos de clientes. No solo "formularios de contacto". Analytics, email marketing, CRM, chat: todo es "procesamiento de datos".

Riesgo: Alto. AEPD sanciona activamente. Multas: desde 2.000 euros (casos leves) hasta 20 millones de euros (grandes empresas, grandes violaciones). En pymes, típicamente 2.000-5.000.

**4. DPA (Data Processing Agreement) - obligatorio por RGPD si subcontratas**

Si usas un email marketing (Mailchimp, Brevo), analytics (Google Analytics 4), hosting (Ionos, AWS), o cualquier tercero que procese datos por ti, necesitás un DPA.

Un DPA es un contrato donde ese tercero se compromete a cumplir RGPD, a no vender datos, a encriptarlos en tránsito, etc.

¿Por qué importa? Porque vos eres el "responsable" (quien decide qué datos se recogen). El tercero es el "encargado" (quien los procesa). Si el encargado falla, también te multan a vos.

Riesgo: Muy alto. Una auditoria descubre que tu Mailchimp no tiene DPA firmado. Multa: 1.000-3.000 euros (porque no es tu culpa directamente, pero deberías haberlo hecho).

## Mito: "Aviso legal + política de privacidad = cumplir RGPD"

Falso. Eso es solo documentación. Cumplir RGPD es:

- Tener documentación (sí, eso).
- **Pedir consentimiento explícito** para procesar datos (checkbox, no "aceptar implícitamente navegando").
- **Documentar qué datos procesas y por qué** (registro de actividades de tratamiento).
- **Proteger datos**: encriptación en tránsito y en reposo, acceso restringido.
- **Tener un plan si se pierde datos** (notificar en 72 horas, documentar).
- **Respetar derechos de usuario**: si alguien dice "borra mi cuenta", borres en máximo 30 días.

Muchos ven "política de privacidad" como un checkbox. Es un documento que documenta qué haces, no que te haya hecho legal.

## Caso real: tienda online de Santander

Una tienda de ropa recogía email, teléfono y dirección en checkout. No tenía:
- Banner de cookies (Google Analytics sin consentimiento).
- Política de privacidad (usuarios no sabían qué pasaba con sus datos).
- Consentimiento explícito para marketing (recibían emails de promoción sin pedir permiso).

Un cliente reportó a AEPD. La agencia investigó, confirmó violaciones. Multa: 3.500 euros. Además, el cliente pidió "derecho al olvido" (borrar sus datos). La tienda no tenía proceso para hacerlo (tenía que recuperar datos de tres años de backups). Costó 1.200 euros en horas de IT.

Total: 4.700 euros por no gastar 500 euros en documentación + implementación correcta.

## Qué necesitás (el checklist real)

### 1. Aviso Legal

Información:
- Nombre/razón social, CIF/NIF.
- Domicilio fiscal.
- Nombre del responsable legal (titular o representante).
- Email de contacto para asuntos legales.
- Detallar si vendes online (impuestos, devoluciones, etc.).

Longitud: media página. Puedes copiarlo de otra pyme del sector y adaptarlo.

Dónde va: footer de todas las páginas. Link `<a href="/aviso-legal/">Aviso Legal</a>`.

Costo: 0 euros si lo escribes vos, 200-400 si contratás consultoría. No necesitás abogado.

### 2. Política de Cookies

Información:
- Qué cookies usa la web (Google Analytics, Cloudflare, sesión, etc.).
- Propósito de cada una.
- Duración.
- Si es obligatoria (técnica) o requiere consentimiento (analytics, publicidad).
- Cómo el usuario puede rechazarlas o gestionarlas.

Implementación:
- **Banner de cookies.** Aparece en primera visita. Opciones: "Aceptar todo", "Rechazar", "Personalizar". Personalizar permite elegir qué tipos aceptar (técnica, analytics, publicidad).
- **Almacenar consentimiento.** Guardar en localStorage o cookie (paradójicamente) qué eligió.
- **Respetar la elección.** Si rechaza analytics, no cargues Google Analytics tag.

Costo: 0 euros si usas una librería libre (como iubenda o cookiebot Free tier). 20-50 euros/mes si usas solución premium.

Riesgo si no lo tienes: multa de 500-3.000 euros + usuarios enfadados.

### 3. Política de Privacidad

Información obligatoria:
- **Responsable:** quién eres y dónde contactarte.
- **Datos que recogéis:** email, teléfono, IP, cookies, localización, etc.
- **Base legal:** por qué recogéis cada tipo (consentimiento, contrato, interés legítimo).
- **Fines:** para qué usáis los datos (contacto, email marketing, soporte).
- **Duración:** cuánto tiempo guardáis cada dato.
- **Destinatarios:** a quién le pasáis datos (Mailchimp, Google, hosting, etc.).
- **Derechos de usuario:** acceso, rectificación, olvido, portabilidad, oposición.
- **Cookies:** resumen de qué cookies usáis.
- **Política de menores:** si recogéis datos de < 14 años, qué consentimiento requieren.

Longitud: 3-5 páginas típicamente.

Herramientas:
- **Generadores online:** iubenda, termly.io, privacypolicies.com. Responden preguntas, generan política. 0-30 euros.
- **Abogado:** 300-800 euros. Recomendable si la web es compleja (e-commerce, app, datos sensibles).

Dónde va: footer, link `<a href="/politica-privacidad/">Política de Privacidad</a>`.

Costo realista: 100-400 euros.

Riesgo si no lo tienes: multa de 1.000-20.000 euros (dependiendo de gravedad). AEPD lo considera una violación seria.

### 4. DPA (si usas terceros)

Servicios que probablemente requieren DPA:

- **Email marketing:** Mailchimp, Brevo, Klaviyo, Substack.
- **Analytics:** Google Analytics (requiere que la web esté en "modo consentimiento" + DPA).
- **CRM:** HubSpot, Pipedrive.
- **Chat/soporte:** Zendesk, Intercom.
- **Hosting:** casi todos (pero algunos ya tienen claúsulas estándar).
- **CDN:** Cloudflare (tiene DPA estándar).
- **Publicidad:** Google Ads, Facebook Pixel.

Cómo conseguirlo:
- La mayoría de proveedores tienen un DPA estándar. Busca en su sitio: Settings > Privacy / Compliance / DPA. Descárgalo o firmalo online.
- Algunos no lo tienen visible. Email a soporte: "¿Podéis compartir DPA estándar?" Te lo envían en 24-48 horas.

Costo: 0 euros. Es administrativo.

Riesgo si no lo tienes: si AEPD audita, ve que usas Mailchimp sin DPA, multa de 500-2.000 euros. Es un riesgo más bajo que no tener política, pero visible.

## Implementación práctica: paso a paso

**Semana 1:**
- Escribe o genera aviso legal (2 horas).
- Escribe o genera política de privacidad (4 horas, o paga 200 euros y en 1 día).

**Semana 2:**
- Implementa banner de cookies (3 horas con iubenda gratis, o 200 euros con consultor).
- Actualiza footer con links a avisos y políticas.

**Semana 3:**
- Descarga DPAs de Mailchimp, Google Analytics, hosting. Firmalo (30 minutos).
- Documenta qué datos procesas (lista: emails, teléfonos, IPs, cookies). 1 hora.

**Total real:** 10-15 horas de trabajo, 0-400 euros de terceros. Si pagas a un consultor, 300-800 euros y 2-3 días.

## Red flags: qué hace que AEPD te mire

- Recoger emails sin consentimiento explícito (checkbox).
- Google Analytics sin DPA y sin "modo consentimiento" activado.
- No tener banner de cookies en 2026 (la AEPD hace auditorias.
- Forma de contacto sin privacidad (guardar datos sin política).
- Vender datos a terceros sin decirlo (prohibido en RGPD casi siempre).
- No responder derecho al olvido en 30 días.

Cualquiera de estos puede resultar en auditoria + multa.

## Cuándo contratar un abogado (de verdad necesitás)

- **Operación compleja.** Si procesas datos de trabajadores, menores, datos médicos, datos bancarios. Necesitás asesoría.
- **Operación transfronteriza.** Si tienes clientes en otros países (UE, UK, California). El RGPD aplica, pero pueden aplicar leyes locales adicionales.
- **Incidente de datos.** Si alguien se cuela en tu base de datos. Necesitás saber qué hacer, cómo notificar, cómo documentar.
- **Duda genuina.** Si no entendés qué datos procesas o cuál es tu base legal. Mejor pagar consultoría que una multa de 5.000 euros.

Costo de abogado: 100-200 euros/hora, típicamente 500-2.000 euros por asesoría completa.

## El resumen para empezar hoy

- **Aviso Legal:** obligatorio. 30 minutos a 2 horas. Gratis o 200 euros.
- **Política de Cookies:** obligatorio. 1-2 horas + implementación (banner). 0-300 euros.
- **Política de Privacidad:** obligatorio. 4 horas o 200-400 euros.
- **DPA:** obligatorio si usas terceros. 1 hora de admin. Gratis.
- **Total:** 1-2 semanas, 200-600 euros, zero multas.

O lo puedes dejar, ahorrar 400 euros, y arriesgar 2.000-5.000 euros en multa cuando AEPD audite tu sector.

## Más en el blog

- [RGPD y cookies: lo mínimo legal](../rgpd-cookies-web-cantabria/) — Análisis detallado de banners, CMP y errores comunes.
- [Accesibilidad web en empresas](../accesibilidad-web-empresas-cantabria/) — Cumplimiento legal también incluye WCAG.
- [Errores comunes en webs](../errores-comunes-web-empresa/) — A veces la falta de cumplimiento es síntoma de negligencia general.

## Siguiente paso

Si no tienes claro cómo empezar o necesitás una auditoria de cumplimiento de tu web actual, [hablemos](/contacto/). En 48 horas tienes un informe de qué te falta y cuál es el riesgo real.
