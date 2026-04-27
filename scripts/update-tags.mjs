import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const tagMap = {
  'Diseño & Desarrollo': 'Diseño & Desarrollo Web',
  'Mantenimiento & Evolución': 'Diseño & Desarrollo Web',
  'Hostelería & Turismo': 'Diseño & Desarrollo Web',
  'Ecommerce': 'Diseño & Desarrollo Web',

  'SEO & Marketing': 'SEO & Crecimiento',

  'Estrategia & Negocios': 'Negocio & Estrategia Digital',
  'Integración & Automatización': 'Negocio & Estrategia Digital',

  'Accesibilidad & Legal': 'Cumplimiento & Accesibilidad',

  'Comunidad': 'General',
};

const tagsToRemove = new Set(['Local - Cantabria']);

const POSTS_SRC = './blog/src/posts';
const files = readdirSync(POSTS_SRC).filter(f => f.endsWith('.md'));

console.log(`Procesando ${files.length} posts...\n`);

let updateCount = 0;

for (const file of files) {
  const path = join(POSTS_SRC, file);
  const content = readFileSync(path, 'utf-8');
  const { data, content: body } = matter(content);

  const oldTags = Array.isArray(data.tags) ? [...data.tags] : [];
  const newTags = new Set();

  for (const tag of oldTags) {
    if (tagsToRemove.has(tag)) continue;
    const mapped = tagMap[tag];
    if (mapped) {
      newTags.add(mapped);
    } else {
      console.warn(`  ⚠ ${file}: tag no mapeado: "${tag}"`);
      newTags.add(tag);
    }
  }

  if (newTags.size === 0) newTags.add('General');

  const sortedNewTags = Array.from(newTags).sort();

  if (JSON.stringify(oldTags.sort()) !== JSON.stringify(sortedNewTags)) {
    data.tags = sortedNewTags;
    writeFileSync(path, matter.stringify(body, data));
    updateCount++;
    console.log(`✓ ${file}`);
    console.log(`  antes: ${oldTags.join(', ')}`);
    console.log(`  ahora: ${sortedNewTags.join(', ')}`);
  } else {
    console.log(`= ${file}: sin cambios`);
  }
}

console.log(`\n${updateCount} posts actualizados.`);
