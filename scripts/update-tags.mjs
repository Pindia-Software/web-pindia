import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const tagMap = {
  // Accesibilidad & Legal
  'accesibilidad': 'Accesibilidad & Legal',
  'WCAG': 'Accesibilidad & Legal',
  'AEPD': 'Accesibilidad & Legal',
  'auditoria-web': 'Accesibilidad & Legal',
  'auditoria web': 'Accesibilidad & Legal',
  'auditoría web': 'Accesibilidad & Legal',
  'cookies': 'Accesibilidad & Legal',
  'legal-web': 'Accesibilidad & Legal',
  'legal web': 'Accesibilidad & Legal',
  'RGPD': 'Accesibilidad & Legal',
  'aepd': 'Accesibilidad & Legal',
  'wcag': 'Accesibilidad & Legal',
  'rgpd': 'Accesibilidad & Legal',

  // SEO & Marketing
  'SEO': 'SEO & Marketing',
  'seo': 'SEO & Marketing',
  'marketing-digital': 'SEO & Marketing',
  'marketing digital': 'SEO & Marketing',
  'velocidad-web': 'SEO & Marketing',
  'velocidad web': 'SEO & Marketing',
  'Core Web Vitals': 'SEO & Marketing',
  'core-web-vitals': 'SEO & Marketing',
  'core web vitals': 'SEO & Marketing',
  'landing-page': 'SEO & Marketing',
  'landing page': 'SEO & Marketing',
  'conversion': 'SEO & Marketing',
  'conversión': 'SEO & Marketing',

  // Local - Cantabria (includes local SEO)
  'Cantabria': 'Local - Cantabria',
  'cantabria': 'Local - Cantabria',
  'Santander': 'Local - Cantabria',
  'santander': 'Local - Cantabria',
  'Google Business Profile': 'Local - Cantabria',
  'google-business-profile': 'Local - Cantabria',
  'SEO local': 'Local - Cantabria',
  'seo-local': 'Local - Cantabria',
  'seo local': 'Local - Cantabria',

  // Diseño & Desarrollo
  'diseño web': 'Diseño & Desarrollo',
  'diseno-web': 'Diseño & Desarrollo',
  'diseno web': 'Diseño & Desarrollo',
  'desarrollo-web': 'Diseño & Desarrollo',
  'desarrollo web': 'Diseño & Desarrollo',
  'desarrollo-a-medida': 'Diseño & Desarrollo',
  'desarrollo a medida': 'Diseño & Desarrollo',
  'web-corporativa': 'Diseño & Desarrollo',
  'web corporativa': 'Diseño & Desarrollo',
  'rediseño-web': 'Diseño & Desarrollo',
  'rediseño web': 'Diseño & Desarrollo',
  'rediseno-web': 'Diseño & Desarrollo',
  'rediseno web': 'Diseño & Desarrollo',
  'agencia-web': 'Diseño & Desarrollo',
  'agencia web': 'Diseño & Desarrollo',
  'WordPress': 'Diseño & Desarrollo',
  'wordpress': 'Diseño & Desarrollo',
  'errores-web': 'Diseño & Desarrollo',
  'errores web': 'Diseño & Desarrollo',

  // Ecommerce
  'ecommerce': 'Ecommerce',
  'tienda-online': 'Ecommerce',
  'tienda online': 'Ecommerce',
  'WooCommerce': 'Ecommerce',
  'woocommerce': 'Ecommerce',

  // Integración & Automatización
  'integración': 'Integración & Automatización',
  'integracion': 'Integración & Automatización',
  'integracion-web': 'Integración & Automatización',
  'integracion web': 'Integración & Automatización',
  'integración-web': 'Integración & Automatización',
  'integración web': 'Integración & Automatización',
  'ERP': 'Integración & Automatización',
  'erp': 'Integración & Automatización',
  'Holded': 'Integración & Automatización',
  'holded': 'Integración & Automatización',
  'automatización': 'Integración & Automatización',
  'automatizacion': 'Integración & Automatización',
  'construccion': 'Integración & Automatización',
  'construcción': 'Integración & Automatización',

  // Hostelería & Turismo
  'hostelería': 'Hostelería & Turismo',
  'hosteleria': 'Hostelería & Turismo',
  'restaurantes': 'Hostelería & Turismo',

  // Estrategia & Negocios
  'casos-reales': 'Estrategia & Negocios',
  'casos reales': 'Estrategia & Negocios',
  'pymes': 'Estrategia & Negocios',
  'pyme': 'Estrategia & Negocios',
  'presupuesto': 'Estrategia & Negocios',
  'precio-web': 'Estrategia & Negocios',
  'precio web': 'Estrategia & Negocios',
  'ejemplos-web': 'Estrategia & Negocios',
  'ejemplos web': 'Estrategia & Negocios',
  'digitalización': 'Estrategia & Negocios',
  'digitalizacion': 'Estrategia & Negocios',
  'web-pyme': 'Estrategia & Negocios',
  'web pyme': 'Estrategia & Negocios',

  // Mantenimiento & Evolución
  'migración-web': 'Mantenimiento & Evolución',
  'migración web': 'Mantenimiento & Evolución',
  'migracion-web': 'Mantenimiento & Evolución',
  'migracion web': 'Mantenimiento & Evolución',
  'mantenimiento-web': 'Mantenimiento & Evolución',
  'mantenimiento web': 'Mantenimiento & Evolución',
  'soporte-web': 'Mantenimiento & Evolución',
  'soporte web': 'Mantenimiento & Evolución',
  'rendimiento': 'Mantenimiento & Evolución',

  // Comunidad
  'premios': 'Comunidad',
  'premio': 'Comunidad',
  'eventos': 'Comunidad',
  'evento': 'Comunidad',
  'reconocimiento': 'Comunidad',
};

const tagsToIgnore = new Set(['talento-cantabria', 'talento-Cantabria', 'finalistas', 'finalistas-talento-cantabria']);

const POSTS_SRC = './blog/src/posts';
const files = readdirSync(POSTS_SRC).filter(f => f.endsWith('.md'));

console.log(`Procesando ${files.length} posts...\n`);

let updateCount = 0;

for (const file of files) {
  const path = join(POSTS_SRC, file);
  const content = readFileSync(path, 'utf-8');
  const { data, content: body } = matter(content);
  
  if (!data.tags || !Array.isArray(data.tags)) {
    console.log(`⊘ ${file}: sin tags`);
    continue;
  }
  
  const oldTags = [...data.tags];
  const newTags = new Set();
  
  for (const tag of oldTags) {
    if (tagsToIgnore.has(tag)) {
      continue;
    }
    const mapped = tagMap[tag];
    if (mapped) {
      newTags.add(mapped);
    } else {
      console.warn(`  ⚠ ${file}: tag no mapeado: "${tag}"`);
      newTags.add(tag);
    }
  }
  
  const sortedNewTags = Array.from(newTags).sort();
  
  if (JSON.stringify(oldTags.sort()) !== JSON.stringify(sortedNewTags)) {
    data.tags = sortedNewTags;
    const updated_content = matter.stringify(body, data);
    writeFileSync(path, updated_content);
    updateCount++;
    console.log(`✓ ${file}`);
    console.log(`  antes: ${oldTags.join(', ')}`);
    console.log(`  ahora: ${sortedNewTags.join(', ')}`);
  } else {
    console.log(`= ${file}: sin cambios`);
  }
}

console.log(`\n${updateCount} posts actualizados.`);
