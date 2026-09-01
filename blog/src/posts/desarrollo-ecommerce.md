---
title: 'Desarrollo ecommerce: cómo es un proyecto de tienda online por dentro'
metaTitle: 'Desarrollo ecommerce: cómo es el proyecto por dentro'
description: >-
  Qué implica un proyecto de desarrollo ecommerce: fases, catálogo, integraciones
  con ERP, migración sin perder ventas y cómo elegir equipo.
date: 2026-09-01T00:00:00.000Z
author: Beatriz Santa Cruz Llanillo
tags:
  - Diseño & Desarrollo Web
  - Negocio & Estrategia Digital
draft: false
---

El **desarrollo ecommerce** no es montar una web con carrito. Es construir el sistema que sostiene un negocio de venta: catálogo, stock, precios, pagos, envíos, devoluciones y los datos que conectan todo eso con lo que ya usas para facturar.

Esa es la razón por la que los proyectos de tienda online se tuercen más que los de web corporativa. Una web corporativa que falla da mala imagen. Un ecommerce que falla pierde pedidos, y a veces los pierde sin que nadie se entere hasta que cuadras el mes.

Somos una empresa de desarrollo, así que vamos a contar cómo es el proyecto por dentro: qué se decide en cada fase, dónde se rompen, y qué separa a un equipo que ha montado tiendas de uno que ha montado webs.

## Los tres caminos del desarrollo ecommerce

Antes de nada, "desarrollo ecommerce" describe tres cosas distintas y conviene saber en cuál estás:

**Plataforma configurada.** Shopify, WooCommerce o PrestaShop con una plantilla, el catálogo cargado y los métodos de pago y envío puestos. Es integración y configuración, no desarrollo. Arranca rápido y tiene techo.

**Plataforma extendida.** La misma base, pero con desarrollo propio encima: módulos a medida, integraciones con tus sistemas, lógica de precios que la plataforma no cubre. Es donde vive la mayoría de proyectos serios de pyme.

**Desarrollo a medida.** El sistema se construye desde tu operativa. Compensa cuando las reglas de negocio son el producto: B2B con tarifas por cliente, configuradores, multi-almacén, catálogos que cambian solos. Lo comparamos a fondo en [tienda online a medida](https://pindia.es/blog/posts/tienda-online-a-medida/).

Un equipo que solo sabe hacer uno de los tres te va a recomendar ese, independientemente de tu caso.

## Las fases reales de un proyecto

**Descubrimiento.** No va de diseño, va de operativa: cómo llega el pedido a tu almacén, quién actualiza el stock, qué pasa con una devolución, cómo se factura. Si esta fase se salta, todo lo demás se construye sobre suposiciones y se paga después.

**Arquitectura de catálogo.** Categorías, atributos, variantes y filtros. Es la decisión más determinante del proyecto y la que más se despacha en diez minutos. Volvemos a ella enseguida porque merece su propia sección.

**Diseño de la experiencia de compra.** Ficha de producto, listado, carrito y proceso de pago. Aquí no se decora: cada paso que añades al proceso de compra te cuesta pedidos, y cada duda que la ficha no resuelve es un abandono.

**Desarrollo e integraciones.** La parte que la gente cree que es todo el proyecto, y que suele ser menos de la mitad del esfuerzo.

**Carga de catálogo y contenidos.** El cuello de botella real. Casi siempre.

**Pruebas de verdad.** No es "abrir la tienda y ver si carga". Es simular compras con distintos métodos de pago, comprobar que el stock se descuenta, que el email de confirmación sale, que la factura se genera y que una devolución no deja el inventario descuadrado.

**Lanzamiento y las dos semanas siguientes.** Las incidencias de un ecommerce aparecen con el uso real, no en pruebas. Un equipo que desaparece el día del lanzamiento es una señal de alarma.

## El catálogo es el proyecto

Si te quedas con una sola idea de este artículo, que sea esta.

Un catálogo vendible no son nombres y precios. Son atributos estructurados para que los filtros sirvan de algo, categorías pensadas para cómo busca tu cliente y no para cómo está organizado tu almacén, variantes coherentes, fotos consistentes y descripciones propias. Si copias el texto del fabricante, Google lo ignora y tu comprador también, porque está leyendo lo mismo en otras diez tiendas.

Y hay una decisión técnica que casi nadie ve venir: **dónde vive la verdad del catálogo**. Si tu stock y tus precios están en un ERP, la tienda no puede ser una segunda fuente de verdad que alguien actualiza a mano. Definir eso al principio evita el problema más caro y más frecuente del ecommerce, que es vender algo que no tienes.

## Integraciones: donde se va el presupuesto

En una tienda de pyme las habituales son cuatro: **ERP o programa de gestión** (stock, precios, altas de producto), **almacén o logística** (preparación y seguimiento), **transportistas** (tarifas y etiquetas) y **facturación**.

Cada una parece un checkbox y ninguna lo es. La parte fácil de una integración es leer los datos; la difícil es decidir qué pasa cuando falla. Qué ocurre si el ERP no responde a las tres de la tarde de un día de campaña, si dos pedidos compran la última unidad a la vez, si una devolución llega antes de que se procese el pago. Un equipo con experiencia en ecommerce te pregunta esto en la primera reunión. Uno que solo ha hecho webs, no.

## Migrar una tienda que ya vende

Es un proyecto distinto y bastante más delicado, porque no partes de cero: partes de algo que factura.

Hay que trasladar productos, clientes, pedidos históricos y, sobre todo, el posicionamiento. Cada URL de producto y de categoría que cambie necesita su redirección, y en un catálogo grande eso son miles de reglas que no se pueden improvisar el día del lanzamiento. Una migración de ecommerce mal planificada cuesta meses de tráfico y de ventas, y la caída no se recupera sola.

El detalle de cómo se conserva el posicionamiento está en [migrar tu web sin perder posicionamiento](https://pindia.es/blog/posts/migrar-web-sin-perder-seo/). Para una tienda, súmale que también estás migrando dinero en curso: pedidos abiertos, suscripciones activas y devoluciones pendientes.

## B2C y B2B no son el mismo desarrollo

Se agrupan bajo la misma palabra y comparten poco.

Un **B2C** vive de la conversión: velocidad, ficha de producto convincente, proceso de compra corto y confianza. El diseño y el rendimiento pesan mucho.

Un **B2B** vive de las reglas: tarifas distintas por cliente, precios ocultos hasta iniciar sesión, pedidos por referencia y cantidad, pedidos mínimos, presupuestos que se aprueban antes de cobrarse, condiciones de pago aplazado. Aquí el diseño importa menos y la lógica lo es casi todo, y por eso el B2B se va a desarrollo a medida con mucha más frecuencia.

Si tu negocio es mixto, el proyecto tiene que resolver los dos comportamientos sobre el mismo catálogo, y eso es una decisión de arquitectura que se toma al principio o no se toma.

## Rendimiento y conversión no son lo mismo, pero se tocan

En ecommerce la velocidad no es una cuestión de orgullo técnico, es facturación. Cada segundo de carga en la ficha de producto y en el proceso de pago se paga en pedidos que no se completan, y el móvil es donde más duele porque es donde está el tráfico.

Lo que hay que medir son [Core Web Vitals](https://pindia.es/blog/posts/core-web-vitals-que-son/) con datos reales de tus usuarios, no de laboratorio, y mirarlos por plantilla: la home suele ir bien y el listado con filtros, mal. Y luego está la otra mitad, que es la fricción: pasos innecesarios, formularios largos, gastos de envío que aparecen al final. Una tienda rápida con un proceso de compra malo sigue sin vender.

## Cómo elegir empresa de desarrollo ecommerce

Cuatro preguntas que separan bastante bien:

**¿Puedo ver tiendas vuestras funcionando?** Ábrelas en el móvil, mete algo en el carrito y llega hasta el pago. Se aprende más en dos minutos que en una hora de reunión.

**¿Qué pasa si el ERP no responde durante una campaña?** Si la respuesta es una cara de sorpresa, no han integrado muchos.

**¿Quién carga el catálogo y quién escribe las descripciones?** Si no está claro en el presupuesto, aparecerá como sobrecoste o como trabajo tuyo a última hora.

**¿Qué hacéis las dos semanas siguientes al lanzamiento?** Es cuando aparecen los problemas de verdad.

## Cuánto cuesta y cuánto se tarda

Un proyecto de desarrollo ecommerce va de unos 1.500 a 4.000 € si es una plataforma configurada, desde 6.000 € una tienda a medida sencilla, de 12.000 a 20.000 € con integración a ERP y desde 25.000 € un ecommerce complejo o B2B. El plazo, entre 6 y 12 semanas para complejidad media.

El desglose completo, con los costes recurrentes que no aparecen en el presupuesto de desarrollo, está en [precio de una tienda online](https://pindia.es/blog/posts/precio-tienda-online/).

## Cómo trabajamos en Pindia

Empezamos por la operativa y por dónde viven tus datos, porque de ahí sale la arquitectura y de la arquitectura sale el presupuesto. Somos una empresa de desarrollo de software, así que las integraciones con ERP y las reglas de negocio raras no son un añadido incómodo: suelen ser la parte interesante del proyecto.

## Preguntas frecuentes

### ¿Qué es el desarrollo ecommerce?

Es el diseño y la construcción del sistema que sostiene una venta online: catálogo, stock, precios, pagos, envíos y las integraciones con los sistemas que ya usas. Va bastante más allá de poner un carrito en una web.

### ¿Cuánto cuesta un proyecto de desarrollo ecommerce?

De 1.500 a 4.000 € una plataforma configurada, desde 6.000 € una tienda a medida sencilla, de 12.000 a 20.000 € con integración a ERP y desde 25.000 € un ecommerce complejo o B2B. A eso hay que sumar los costes recurrentes de vender online.

### ¿Cuánto se tarda en desarrollar una tienda online?

Entre 6 y 12 semanas para una complejidad media, más si hay integración con ERP o migración de una tienda existente. El plazo lo suele marcar el catálogo, no el desarrollo.

### ¿Se puede integrar la tienda con mi ERP?

Sí, y en la mayoría de proyectos serios es el núcleo del trabajo. Lo importante es decidir desde el principio dónde vive la verdad del stock y de los precios, y qué hace la tienda cuando el ERP no responde.

### ¿Qué es más difícil, un ecommerce B2C o uno B2B?

Son difíciles en cosas distintas. El B2C se juega en conversión, velocidad y confianza. El B2B se juega en reglas: tarifas por cliente, pedidos mínimos, precios ocultos y pago aplazado. El B2B acaba en desarrollo a medida con más frecuencia.

### ¿Puedo migrar mi tienda actual sin perder ventas?

Sí, si la migración se planifica: mapa de redirecciones producto a producto, traslado de clientes y pedidos, y un plan para los pedidos abiertos durante el cambio. Improvisarlo cuesta meses de tráfico y de facturación.

### ¿Necesito una plataforma o un desarrollo a medida?

Depende de cuántas reglas de negocio propias tengas. Si vendes productos estándar a consumidor final, una plataforma suele bastar. Si tus precios, tarifas o procesos son particulares, la plataforma se acaba convirtiendo en un obstáculo.

## Más en el blog

- [Tienda online a medida](https://pindia.es/blog/posts/tienda-online-a-medida/), cuándo compensa frente a una plataforma estándar.
- [Precio de una tienda online](https://pindia.es/blog/posts/precio-tienda-online/), el desarrollo y los costes recurrentes, juntos.
- [Integrar tu ERP con la web](https://pindia.es/blog/posts/integracion-erp-web-empresa/), qué merece la pena automatizar y qué no.
- [Cómo planificar una tienda online que venda](https://pindia.es/blog/posts/tienda-online-cantabria/), la operativa antes que la plataforma.

Si tienes un proyecto de ecommerce entre manos, o una tienda que se te ha quedado pequeña, [hablemos](/contacto/).

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Qué es el desarrollo ecommerce?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Es el diseño y la construcción del sistema que sostiene una venta online: catálogo, stock, precios, pagos, envíos y las integraciones con los sistemas que ya usas. Va bastante más allá de poner un carrito en una web."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuánto cuesta un proyecto de desarrollo ecommerce?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "De 1.500 a 4.000 € una plataforma configurada, desde 6.000 € una tienda a medida sencilla, de 12.000 a 20.000 € con integración a ERP y desde 25.000 € un ecommerce complejo o B2B. A eso hay que sumar los costes recurrentes de vender online."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuánto se tarda en desarrollar una tienda online?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Entre 6 y 12 semanas para una complejidad media, más si hay integración con ERP o migración de una tienda existente. El plazo lo suele marcar el catálogo, no el desarrollo."
      }
    },
    {
      "@type": "Question",
      "name": "¿Se puede integrar la tienda con mi ERP?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí, y en la mayoría de proyectos serios es el núcleo del trabajo. Lo importante es decidir desde el principio dónde vive la verdad del stock y de los precios, y qué hace la tienda cuando el ERP no responde."
      }
    },
    {
      "@type": "Question",
      "name": "¿Qué es más difícil, un ecommerce B2C o uno B2B?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Son difíciles en cosas distintas. El B2C se juega en conversión, velocidad y confianza. El B2B se juega en reglas: tarifas por cliente, pedidos mínimos, precios ocultos y pago aplazado. El B2B acaba en desarrollo a medida con más frecuencia."
      }
    },
    {
      "@type": "Question",
      "name": "¿Puedo migrar mi tienda actual sin perder ventas?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí, si la migración se planifica: mapa de redirecciones producto a producto, traslado de clientes y pedidos, y un plan para los pedidos abiertos durante el cambio. Improvisarlo cuesta meses de tráfico y de facturación."
      }
    },
    {
      "@type": "Question",
      "name": "¿Necesito una plataforma o un desarrollo a medida?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Depende de cuántas reglas de negocio propias tengas. Si vendes productos estándar a consumidor final, una plataforma suele bastar. Si tus precios, tarifas o procesos son particulares, la plataforma se acaba convirtiendo en un obstáculo."
      }
    }
  ]
}
</script>
