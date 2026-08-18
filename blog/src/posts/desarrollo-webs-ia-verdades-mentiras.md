---
title: 'Desarrollo de webs con IA: verdades y mentiras'
description: 'ChatGPT, Cursor, GitHub Copilot: ¿pueden reemplazar a un desarrollador? Qué hace bien la IA, dónde falla y cuándo tiene sentido usarla.'
date: 2026-05-02
author: Beatriz Santa Cruz Llanillo
tags:
  - Diseño & Desarrollo Web
  - Negocio & Estrategia Digital
cover: /assets/img/blog/desarrollo-webs-ia-verdades-mentiras/cover.webp
coverAlt: 'Código generado por IA en pantalla con herramientas de desarrollo'
draft: false
---

Hace un año, ChatGPT escribía código que no funcionaba y había que reescribir todo. Hoy, GitHub Copilot predice líneas de código tan bien que muchos desarrolladores confían en él como si fuera un colega. La IA en desarrollo web ha mejorado. Pero sigue habiendo mito y mucho marketing alrededor. Vamos a separarlos.

## La verdad sobre IA generativa y código

ChatGPT y herramientas parecidas (Claude, Copilot) son **autocomplete sofisticado**. Muy sofisticado. Leen patrones de gigabytes de código, entienden estructura, lógica básica. Pueden escribir:

- Funciones comunes (loops, búsquedas, ordenamientos).
- Scaffolding (estructuras de proyecto, plantillas boilerplate).
- Tests básicos.
- Documentación.
- Refactoring repetitivo.

Eso ahorra tiempo. Un desarrollador que antes escribía 50 líneas de boilerplate en 30 minutos, ahora lo hace en 3 minutos. El problema empieza cuando piensas que eso es desarrollo.

## La mentira: "IA reemplaza desarrolladores"

No. Aquí está el quid: **el 80% del tiempo de desarrollo no es escribir código, es pensar.**

Pensar en arquitectura. ¿Cómo se comunican estos módulos? ¿Dónde va la lógica de negocio? ¿Qué puede fallar?

Pensar en datos. ¿Qué información necesita la web? ¿Cómo se estructura? ¿Qué pasa si el usuario está offline?

Pensar en seguridad. ¿Dónde entra la entrada del usuario? ¿Podría injectar SQL? ¿Qué rutas protejo?

Pensar en rendimiento. ¿Cuántos usuarios simultáneos? ¿Cacheo qué? ¿Dónde está el cuello de botella?

ChatGPT puede escribir código que haría lo anterior. Pero si vos no entendés qué debería hacer, no sabés ni pedirle correctamente. Y si ChatGPT genera código inseguro, lenguaje de consultores.

Ejemplo de la vida real: pedimos a ChatGPT que generara un endpoint de login. Escribió código sin sanitización de entrada, sin rate limiting, sin hashing de contraseña correcto. Parecía funcional. Un desarrollador junior sin experiencia hubiera puesto eso en producción.

Una IA no piensa en "¿y si alguien intenta romper esto?" Una IA no conoce tu negocio. Una IA no sabe que en tu web "offline-first" es un requisito fundamental.

## Dónde la IA sí funciona

**Scaffolding y boilerplate.** "Genera una estructura Next.js con TypeScript, ESLint y Testing Library." 2 minutos, no 30.

**Autocomplete en IDE.** GitHub Copilot dentro de VS Code. Escribis una función, predice el resto con precisión del 70-80%. Aceptás o rechazás. Fluyente.

**Traducción entre lenguajes.** "Convierte este código Python a JavaScript." Funciona bien para lógica común.

**Generación de tests.** "Escribe tests para esta función." Los tests generados suelen necesitar ajustes, pero ahorran el 60% del tiempo.

**Búsqueda en código.** "Dónde en mi proyecto se valida un email?" La IA busca y encuentra con contexto, mejor que grep.

**Refactoring tedioso.** "Renombra todas las variables de camelCase a snake_case." Hecho.

**Documentación.** "Documenta esta API en formato OpenAPI." Genera un 80% usable.

## Dónde la IA falla

**Lógica compleja.** Un algoritmo que requiere pensar varios pasos adelante (ej: planeamiento, backtracking, optimización combinatoria). La IA da una respuesta que parece correcta pero no lo es. Confías, debugueas, pierdes 4 horas.

**Decisiones arquitectónicas.** "¿Uso monolito o microservicios para mi app?" ChatGPT da una respuesta genérica. No conoce tu equipo, tu escala, tu presupuesto. Es un riesgo.

**Seguridad.** "Escribe un endpoint de pago." La IA lo hace, pero sin validación, sin checksums, sin encriptación de datos sensibles. Confía en la IA, pierdes dinero de clientes.

**Performance en producción.** "Optimiza esta query SQL lenta." La IA la optimiza... pero no conoce tu schema real, tus índices, tu volumen de datos. Entrega una solución que es más lenta.

**Casos edge.** "¿Qué pasa si entra una URL con caracteres especiales?" "¿Y si el usuario tiene 500.000 contactos?" La IA da una respuesta para el caso feliz. Los edge cases no.

## Ejemplos que hemos visto

**Un e-commerce generado con IA.** Cliente pidió a ChatGPT que generara una web de tienda. ChatGPT hizo un carrito funcional, checkout, procesamiento de pagos... Todo parecía funcionar. En producción, descubrimos:
- Las transacciones no estaban protegidas contra duplicados.
- El formulario de envío aceptaba cualquier cosa, sin validación.
- La base de datos exponía IDs de usuario en las URLs.

**Un formulario dinámico con IA.** "Crea un formulario que valide email, teléfono y postcode en tiempo real." La IA lo hizo. Validación regex básica. Un usuario español con postcode "28001" lo rellena, la IA lo rechaza (regex USA). Falla.

**Un componente React generado con IA.** Parecía correcto. Pero tenía un memory leak (event listeners no se removían). El cliente se dio cuenta cuando la app se ralentizaba tras 10 minutos de uso.

## El flujo real: IA + humano

Aquí es donde funciona:

1. **Vos describes el problema.** "Necesito un endpoint que devuelva el top 10 de posts por engagement, cachéados 1 hora, con paginación."
2. **IA genera un primer borrador.** 10 minutos en vez de 1 hora.
3. **Vos lo revisás críticamente.** ¿Hay validación? ¿Está protegido contra SQL injection? ¿El cache es eficiente? ¿Qué pasa si no hay posts?
4. **Vos lo ajustás.** Agregás error handling, validación, casos edge.
5. **Vos lo testeas.** Tests unitarios + integración.
6. **Sale a producción.**

Eso es desarrollo moderno con IA. No es "ChatGPT escribe todo". Es "IA acelera lo tedioso, yo pienso en lo importante".

## Cuándo contratar una agencia (no IA)

Un startup llamó diciendo: "Queremos una web, que sea rápida, que escale a 1M de usuarios, y que ChatGPT la haga para ahorrar." Tenían presupuesto para 2 webs decentes.

La respuesta honesta: si querés que escale a 1M usuarios sin que se caiga, necesitás arquitectura, testing, monitoreo, iteración. IA te da código. Un equipo senior te da un sistema.

No es "IA o desarrolladores". Es "IA para lo mecánico, desarrolladores para lo inteligente".

## El mercado hoy

Hay un boom de "agencias IA" que venden "webs en 24 horas con ChatGPT". Entregan: Webflow + ChatGPT autofill. Bonito, rápido, frágil. Primer cambio, primera bug, se rompe. Cliente acude a una agencia de verdad. Costo real: el doble.

Al mismo tiempo, hay desarrolladores que han integrado IA en su flujo y entregan más rápido, mejor, sin sacrificar calidad. Esos son los que crecen.

## Tecnologías que sí funcionan con IA hoy

**Next.js + Vercel.** Cursor (IDE basado en Claude) + Copilot generan scaffolding. El boilerplate lleva 10 minutos. Lógica, que haga el humano.

**Astro para webs estáticas.** "Genera una landing con componentes." IA lo hace bien. Es JSX + props, no hay sorpresas de runtime.

**APIs con Hono.** Pequeño, agresivo. Copilot predice bien las rutas.

**Testing con Vitest.** IA genera tests decentes. Vitest es rápido para iterar.

**Documentación con Mintlify.** IA genera esqueletos. Vos editas para precisión.

## Qué NO dejar a IA

- Decisiones de arquitectura.
- Validación y seguridad.
- Naming (variables, funciones, clases).
- Abstracciones y refactoring conceptual.
- Casos edge y error handling.
- Performance optimization (sin medir antes).

## El futuro

IA mejora cada 6 meses. Hace un año, generar 100 líneas funcionales de JavaScript era raro. Hoy, es lo común. En 18 meses, quizás genere arquitecturas coherentes.

Pero **arquitectura y decisión no desaparecerán.** Alguien debe pensar qué la IA debería generar. Alguien debe revisar. Alguien debe monitorear en producción.

Los desarrolladores que integren IA como herramienta van a ir más rápido. Los que piensen que la IA reemplaza el pensar, van a entregar bugs caros.

## Más en el blog

- [WordPress vs desarrollo a medida en Cantabria](../wordpress-vs-desarrollo-medida-cantabria/), Elegir entre soluciones prefabricadas e IA vs código custom.
- [Precio de una página web en Cantabria](../precio-pagina-web-cantabria/), Cuánto cuesta realmente una web (con IA o sin).
- [Core Web Vitals: qué son y por qué importan](../core-web-vitals-que-son/), Una web rápida requiere más que solo código: requiere arquitectura.

## Si necesitás una web

Si viniste buscando "¿puedo hacer una web con ChatGPT?": técnicamente, sí. Será mediocre. Tendrá bugs de seguridad. Costará el doble reescribirla cuando falle.

Si viniste buscando "¿pueden hacerla en 2 días?": no. Una web buena necesita diseño, lógica, testing, deployment, monitoreo. Una agencia que usa IA bien puede ser más rápida. Una que depende de IA es más lenta (por debugging).

Si querés que hablemos sobre cuál es el mejor approach para tu proyecto específico (IA, freelancer, agencia), [escribinos](/contacto/).
