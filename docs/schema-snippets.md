# Bloques JSON-LD para pegar

Van dentro de `<head>` (o justo antes de `</body>`), cada uno en su propia etiqueta:
`<script type="application/ld+json"> … </script>`

Campos `[COMPLETAR]` = datos vuestros reales. NO los inventes: dirección, teléfono,
coordenadas y perfiles deben ser los de verdad o el schema pierde valor (o da error).

Valida el resultado en https://validator.schema.org y en el test de resultados
enriquecidos de Google antes de dar por bueno cada uno.

---

## 0 · LocalBusiness — reutilizable en TODO el sitio
Define esto UNA vez (idealmente en la home o en una plantilla común) con `@id` fijo.
En los artículos, en lugar de repetirlo, se referencia por ese `@id` (ver más abajo).

```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://pindia.es/#organization",
  "name": "Pindia Software",
  "url": "https://pindia.es/",
  "logo": "https://pindia.es/[COMPLETAR-ruta-logo].png",
  "image": "https://pindia.es/[COMPLETAR-imagen].jpg",
  "description": "Empresa de desarrollo de software y diseño web a medida en Cantabria. Software a medida, aplicaciones, integraciones e inteligencia artificial.",
  "telephone": "[COMPLETAR-telefono]",
  "email": "[COMPLETAR-email-contacto]",
  "priceRange": "€€",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[COMPLETAR-calle-numero]",
    "addressLocality": "Santa Cruz de Bezana",
    "addressRegion": "Cantabria",
    "postalCode": "[COMPLETAR-CP]",
    "addressCountry": "ES"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "[COMPLETAR-lat]",
    "longitude": "[COMPLETAR-lng]"
  },
  "areaServed": [
    { "@type": "AdministrativeArea", "name": "Cantabria" },
    { "@type": "City", "name": "Santander" },
    { "@type": "City", "name": "Torrelavega" },
    { "@type": "Country", "name": "España" }
  ],
  "sameAs": [
    "[COMPLETAR-url-linkedin]",
    "[COMPLETAR-url-otra-red]"
  ]
}
```

> Nota: `ProfessionalService` es un subtipo de `LocalBusiness`, más preciso para vosotros.
> El `priceRange` admite "€€" o un rango real; no lo dejes vacío.

---

## 1 · Artículo "Mantenimiento web"

### 1a · Article
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Mantenimiento web para empresas: qué incluye y cuánto cuesta",
  "description": "Qué incluye un buen mantenimiento web, cuánto cuesta al mes de verdad y cómo saber si el que pagas es un timo.",
  "image": "https://pindia.es/[COMPLETAR-ruta-cover].webp",
  "author": { "@type": "Organization", "name": "Pindia Software", "@id": "https://pindia.es/#organization" },
  "publisher": { "@id": "https://pindia.es/#organization" },
  "datePublished": "[COMPLETAR-fecha-original AAAA-MM-DD]",
  "dateModified": "[COMPLETAR-fecha-hoy AAAA-MM-DD]",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://pindia.es/blog/posts/mantenimiento-web-empresas-cantabria/"
  }
}
```

### 1b · FAQPage  (usa las 7 preguntas del artículo; aquí van todas)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Qué es el mantenimiento web?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Es el conjunto de tareas que mantienen una web funcionando, segura y actualizada tras su lanzamiento: actualizaciones de software, copias de seguridad, monitorización, soporte ante incidencias y pequeños cambios de contenido."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuánto cuesta el mantenimiento de una página web al mes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Entre 40 y 200 € mensuales según el alcance. Una web corporativa de pyme se mantiene bien por 60-120 € al mes. Por debajo de 20 € normalmente solo estás pagando hosting."
      }
    },
    {
      "@type": "Question",
      "name": "¿Es obligatorio el mantenimiento web?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Legalmente no, pero en la práctica sí: sin actualizaciones la web acaba siendo vulnerable, y el cumplimiento de cookies, RGPD y accesibilidad exige revisiones cuando cambia la normativa. La responsabilidad legal es del titular de la web."
      }
    },
    {
      "@type": "Question",
      "name": "¿Qué pasa si no hago mantenimiento a mi web?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Con el tiempo aparecen vulnerabilidades, errores, caídas y pérdida de posicionamiento. El coste de un rescate (limpieza de malware, restauración y recuperación de SEO) suele superar el de varios años de mantenimiento."
      }
    },
    {
      "@type": "Question",
      "name": "¿El mantenimiento web incluye el hosting?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Depende del proveedor. A menudo se venden juntos y ahí está la confusión: un plan de 15 € al mes suele ser hosting con otro nombre. Conviene preguntar qué parte es alojamiento y qué parte es trabajo técnico."
      }
    },
    {
      "@type": "Question",
      "name": "¿Puedo cambiar de empresa de mantenimiento web?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí, siempre que tengas acceso al dominio, al hosting y al código. Conviene comprobarlo antes de firmar: es el motivo más frecuente por el que una empresa se queda atrapada con un proveedor."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuánto cuesta mantener una tienda online?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Más que una web corporativa, porque hay que vigilar la pasarela de pago, el stock y las integraciones. Suele partir de 130 € al mes."
      }
    }
  ]
}
```

---

## 2 · Artículo "Diseño web a medida"

### 2a · Article
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Diseño web a medida: qué es, qué incluye y cuánto cuesta",
  "description": "Qué es el diseño web a medida, qué incluye de verdad, cuánto cuesta y cuándo merece la pena frente a una plantilla.",
  "image": "https://pindia.es/[COMPLETAR-ruta-cover].webp",
  "author": { "@type": "Organization", "name": "Pindia Software", "@id": "https://pindia.es/#organization" },
  "publisher": { "@id": "https://pindia.es/#organization" },
  "datePublished": "[COMPLETAR-fecha-hoy AAAA-MM-DD]",
  "dateModified": "[COMPLETAR-fecha-hoy AAAA-MM-DD]",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://pindia.es/blog/posts/diseno-web-a-medida/"
  }
}
```

### 2b · FAQPage
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Qué es una web a medida?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Una web diseñada y programada específicamente para tu empresa, en lugar de adaptar una plantilla comprada. Contiene solo lo que necesitas, se integra con tus sistemas y el código es tuyo."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuánto cuesta una web a medida?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Desde unos 3.000 € una web corporativa, frente a 600-1.500 € de una plantilla. El precio depende del número de páginas, funcionalidades, integraciones e idiomas. Conviene comparar el coste a tres años, no el inicial."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuál es la diferencia entre web a medida y plantilla?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "La plantilla es un diseño ya hecho que se personaliza: sale rápido y barato, pero carga funciones que no usas, depende de muchos plugins y tiene un techo técnico. La web a medida solo tiene lo que necesitas, rinde mejor, escala y es tuya."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuánto se tarda en hacer una web a medida?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Entre 4 y 10 semanas según el alcance. El retraso más habitual no es técnico: son los contenidos (textos y fotos) del cliente."
      }
    },
    {
      "@type": "Question",
      "name": "¿Una web a medida posiciona mejor en Google?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No por sí sola. Posiciona mejor porque permite controlar el SEO técnico y el rendimiento, que sí son factores reales. Con plantilla existe un techo que no se puede superar."
      }
    },
    {
      "@type": "Question",
      "name": "¿Puedo migrar de una plantilla a una web a medida?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí, y es razonable si empezaste validando. Hay que hacerlo con un plan de migración para no perder posicionamiento."
      }
    },
    {
      "@type": "Question",
      "name": "¿La IA hace más baratas las webs a medida?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí. Reduce el tiempo de las partes mecánicas del desarrollo, y eso baja precio y plazo. No sustituye la arquitectura, la seguridad ni el criterio de ingeniería."
      }
    }
  ]
}
```

---

## Reglas para no meter la pata con el schema

1. **El texto de cada `answer` debe existir tal cual en la página visible.** Google penaliza el FAQ schema que no coincide con el contenido. Si editas una respuesta en el artículo, edítala también aquí.
2. **Una sola definición de la organización** con `@id: https://pindia.es/#organization`. Los artículos la referencian, no la repiten.
3. **No inventes reseñas.** No añadas `aggregateRating` al schema si no tienes reseñas reales verificables: es motivo de acción manual de Google. Las reseñas del bloque Reviews del SERP salen de tu Google Business Profile, no de un `aggregateRating` inventado.
4. **Fechas en formato `AAAA-MM-DD`.** `dateModified` es la que cuenta para frescura: actualízala en cada revisión real.
5. Valida cada bloque antes de publicar. Un JSON-LD con un error de sintaxis no da medio resultado: no da ninguno.
