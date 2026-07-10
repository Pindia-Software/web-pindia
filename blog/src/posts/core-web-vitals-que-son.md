---
title: 'Core Web Vitals: qué son y por qué importan para tu web'
metaTitle: 'Core Web Vitals: qué son y por qué importan'
description: >-
  Core Web Vitals son las métricas que Google usa para ranking. LCP, INP y CLS explicados sin tecnicismos. Cómo medirlas y mejorarlas en tu web.
date: 2026-05-02
author: Borja García
tags:
  - SEO & Crecimiento
  - Diseño & Desarrollo Web
cover: /assets/img/blog/core-web-vitals-que-son/cover.webp
coverAlt: 'Comparación de métricas Core Web Vitals en Google PageSpeed Insights'
draft: false
---

Google cambió las reglas. Hace años la velocidad importaba "un poco". Hoy es un factor de ranking directo que puede costar clientes. Core Web Vitals son tres números que miden cómo experimenta alguien tu web en realidad. No es teoría; es lo que Google ve cuando entra en tu sitio.

## Qué son Core Web Vitals

Google vigila tres cosas en tu web:

**LCP (Largest Contentful Paint).** Cuánto tarda en verse el contenido principal. Si tienes una foto grande, un párrafo importante o un vídeo, LCP mide cuándo ese elemento está visible para el usuario. Si tarda más de 2,5 segundos, está en rojo.

**INP (Interaction to Next Paint).** Cómo responde tu web a una interacción. Alguien hace clic en un botón, escribe en un campo, y tú necesitas responder en menos de 200 milisegundos. Si tardas más, la web se siente "muerta".

**CLS (Cumulative Layout Shift).** Los elementos no pueden saltar de un lado a otro mientras se carga. Imágenes sin dimensiones definidas, anuncios que aparecen de repente, tipografías que cambian de tamaño: eso suma puntos negativos.

Los tres están en la Search Console de Google. Si miras tu página de "Experiencia > Core Web Vitals", ves datos de usuarios reales (no simulados). Esos datos es lo que Google usa para rankear.

## Por qué importa: el negocio detrás

Una página que carga mal no solo pierde posiciones SEO. Pierde clientes en directo.

Datos de Google: un aumento de 100 milisegundos en LCP puede reducir conversiones un 7%. Si tu web genera 1.000 consultas al mes y convierte el 10%, esos 100ms pueden ser 7 clientes perdidos cada mes. Al año, casi 100.

Pero hay más. Cuando entras a una web y esperas más de 3 segundos, tiendes a irte. No porque sea infinito, sino porque hay otras opciones a un clic. En Cantabria, donde probablemente tus competidores están intentando lo mismo, ese cambio de experiencia es brutal.

Google lo sabe. Por eso penaliza en ranking. No es capricho: es que cuando tú estés en la posición 4 en vez de la 2 por culpa de Core Web Vitals malos, generarás menos tráfico. Punto.

## LCP: contenido principal lento

LCP es "cuándo ves lo importante". Si tu home lleva un video de fondo con autoplay, ese vídeo es el elemento más grande. LCP espera a que cargue. Si pesa 15 MB, acabas de esperar 5 segundos en ADSL.

Casos reales que encontramos:

- **Fotos sin optimizar.** Una inmobiliaria con imágenes de 8 MB de fichero. LCP = 7 segundos. Solución: reducir a WebP de 300 KB. LCP = 0,8 segundos.
- **Tema pesado.** Un e-commerce WordPress que carga 400 KB de CSS por el theme, aunque la home solo necesita 30 KB. Diferir estilos no usados.
- **Fuentes externas.** Cargar cuatro tipografías de Google Fonts suma 200-400ms. Usar system fonts en la home, tipografías externas solo donde es necesario.
- **API lenta.** Un widget que llama a una API externa (stats, reviews en directo). Si la API tarda 3 segundos, LCP = 3 segundos.

Mejora rápida: **cargar lo importante primero, el resto después.** Es sencillo, pero requiere disciplina.

## INP: respuesta al usuario

INP mide cuánto tarda tu web en responder. Haces clic en "añadir al carrito", la página procesa, y tienes retroalimentación (el carrito actualiza, un spinner gira, algo pasa). Si eso tarda más de 200ms, está mal.

Dónde falla:

- **JavaScript bloqueante.** Scripts que no dejan que el navegador haga nada mientras procesan. Una validación de formulario en JavaScript sin optimizar puede bloquear 500ms.
- **Tareas en el main thread.** Si procesas un archivo CSV grande en JavaScript, el navegador se congela. Mientras tanto, clicks, escritura en campos, nada se registra.
- **Actualizaciones DOM masivas.** Rellenar 1.000 filas de una tabla en un bucle forEach. Cada iteración causa un recálculo de layout.

Ejemplo de la vida real: una web de agencias llevaba un formulario de presupuesto interactivo. Cada vez que escribías en un campo, hacía un cálculo en JavaScript. A partir del campo 5, cada keystroke tardaba 800ms en procesarse. Usuario abandonaba a mitad de rellenar.

Solución: hacer los cálculos en Web Worker (hilo separado) o debounce (esperar a que dejes de escribir para calcular).

## CLS: contenido que salta

CLS mide "desplazamientos inesperados". Entras en una página, empiezas a leer, y de repente una imagen se carga y todo baja 200 píxeles. Molesto. Repítelo diez veces en una sesión, y el usuario siente que la web es caótica.

Culpables típicos:

- **Imágenes sin altura.** `<img src="...">` sin atributo `height` o `width`. El navegador no sabe cuánto espacio reservar. Cuando carga, todo se recoloca.
- **Anuncios no redimensionados.** Un banner de Google AdSense que se carga dinámicamente sin reservar espacio.
- **Fuentes que cambian de tamaño.** Una fuente web que se carga con algo de delay. Mientras carga, ves la fuente fallback (más grande o más pequeña). Cuando llega la fuente real, todo se redimensiona.
- **Elementos flotantes tardíos.** Modals, notificaciones, chat widgets que aparecen de repente.

Aquí el remedio es fácil: **siempre define dimensiones** en imágenes, reserva espacio para elementos dinámicos, y carga fuentes web temprano con `font-display: swap` para evitar que cambien de tamaño.

## Cómo medir Core Web Vitals

**PageSpeed Insights** (pagespeed.web.dev). Introducis vuestra URL y Google os da una puntuación. Mira móvil, no escritorio. Si está en verde (>80), bien. Amarillo (50-79), cuidado. Rojo (<50), acción urgente.

**Search Console.** Ve a "Experiencia > Core Web Vitals". Aquí ves datos de usuarios reales. Es lo que Google usa para decidir ranking. Si aquí estás en rojo, SearchConsole te lo avisa.

**WebPageTest.** Más detallado que PageSpeed. Te da vídeos de la carga, cascadas de red, dónde se pierde tiempo.

**Chrome DevTools.** En el navegador, abre DevTools > Lighthouse. Ejecuta una auditoría. Menos preciso que PageSpeed (que mide usuario real), pero rápido de iterar durante desarrollo.

## Mejoras que funcionan (sin código a medida)

Si tu web es WordPress:

- **Plugins de cache:** WP Super Cache o WP Rocket comparten contenido estático y reducen LCP un 30-50%.
- **Optimización de imágenes:** Imagify o SmushIT comprimen todas las imágenes a WebP automáticamente.
- **Lazy loading:** Muchos temas lo tienen integrado. Asegúrate de que no sea agresivo (que no tarde demasiado en cargar imágenes en scroll).
- **Diferir CSS/JS no crítico:** Plugins como Autoptimize lo hacen automáticamente.

Si es una web custom (HTML/CSS/JS):

- Definir dimensiones en todas las imágenes (`width` y `height` en HTML o CSS).
- Usar `loading="lazy"` en imágenes below-the-fold.
- `font-display: swap` en `@font-face` para que se vea tipografía fallback mientras carga la web font.
- Comprimir imágenes a WebP.
- Servir desde CDN (Cloudflare gratis suma mucho).
- Minificar CSS y JS.
- Diferir scripts que no se necesitan al cargar (`defer` o `async`).

## Caso real: tienda online de Santander

Una tienda de ropa de Santander tenía LCP en 4,5 segundos (imágenes de 6 MB cada una), INP en 450ms (JavaScript de slider sin optimizar), CLS en 0,15 (elementos sin dimensiones definidas). Ranking: posición 8 en búsquedas locales.

Tras dos semanas:
- Imágenes a WebP con lazy loading. LCP → 1,2 segundos.
- Defer de JavaScript no crítico, optimización de slider. INP → 120ms.
- Dimensiones a todas las imágenes. CLS → 0,01.

Tres meses después, pasó a posición 3 en búsquedas locales. La métrica de conversión (precio medio de pedido) no cambió, pero el volumen de tráfico orgánico subió un 180%.

## Cuánto cuesta mejorar Core Web Vitals

Una auditoría de Core Web Vitals y reporte de mejoras: 300-500 euros. Se entrega en 48 horas.

Implementar mejoras (sin rediseño):
- Optimización de imágenes + cache + lazy loading: 600-1.000 euros.
- Optimización de JavaScript + diferimiento: 800-1.500 euros.
- Reengineering de un slider o componente pesado: 1.500-2.500 euros.

Si tu web es vieja (más de 5 años), los costes pueden subir. En ese caso, a veces es más rentable hacer una web nueva.

## Más en el blog

- [Velocidad web: pérdida de clientes](../velocidad-web-rendimiento-cantabria/) — Guía completa de optimización de velocidad.
- [Errores comunes en webs de empresa](../errores-comunes-web-empresa/) — Problemas que ralentizan tu web.
- [¿Tu web cumple con la ley?](../tu-web-cumple-ley/) — Si optimizas Core Web Vitals, asegúrate también de cumplir RGPD.

## Siguiente paso

¿Quieres saber cómo están tus Core Web Vitals? [Hablemos](/contacto/). Auditamos, medimos con datos de usuario real, y te decimos qué se puede hacer sin destrozar presupuesto.
