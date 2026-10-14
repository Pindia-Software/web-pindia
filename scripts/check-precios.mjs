/**
 * check-precios.mjs: lista las cifras en euros que no están en la tabla de
 * precios de CLAUDE.md (entre <!-- precios:inicio --> y <!-- precios:fin -->).
 *
 * No falla el build: las cifras de mercado, las multas y los costes ajenos
 * salen también y son correctas. Sirve para revisar a ojo si se ha colado
 * un precio de Pindia que no coincide con la tabla.
 *
 * Uso: npm run check:precios
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;

// Cifras canónicas, leídas de la tabla de CLAUDE.md
const claude = readFileSync(join(ROOT, 'CLAUDE.md'), 'utf8');
const tabla = claude.split('<!-- precios:inicio -->')[1]?.split('<!-- precios:fin -->')[0];
if (!tabla) {
  console.error('No encuentro la tabla de precios en CLAUDE.md (marcadores precios:inicio / precios:fin).');
  process.exit(1);
}
const toNum = s => Number(s.replace(/[.\s ]/g, ''));
const canon = new Set([...tabla.matchAll(/\d{1,3}(?:\.\d{3})*/g)].map(m => toNum(m[0])));

// Ficheros a revisar
function walk(dir, exts, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, exts, out);
    else if (exts.some(e => name.endsWith(e))) out.push(p);
  }
  return out;
}
const files = [
  ...walk(join(ROOT, 'src'), ['.html']),
  ...walk(join(ROOT, 'blog/src/posts'), ['.md']),
];

// Cifra con euros: "1.500 €", "300-600 euros", "de 300 a 800 €", "99 €/mes"
const RE = /(\d{1,3}(?:[.  ]\d{3})*)(?:\s*(?:-|a|y)\s*(\d{1,3}(?:[.  ]\d{3})*))?\s*(?:€|euros)/gi;

let total = 0;
for (const f of files) {
  let t = readFileSync(f, 'utf8');
  if (f.endsWith('.html')) {
    t = t.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->/g, ' ')
         .replace(/<[^>]+>/g, ' ');
  }
  t = t.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
  const hits = [];
  for (const m of t.matchAll(RE)) {
    const nums = [m[1], m[2]].filter(Boolean).map(toNum);
    const fuera = nums.filter(n => !canon.has(n));
    if (!fuera.length) continue;
    const s = Math.max(0, m.index - 60);
    hits.push(`  ${fuera.join(', ')} €  ·  …${t.slice(s, m.index + m[0].length + 20).trim()}…`);
  }
  if (hits.length) {
    console.log(`\n${relative(ROOT, f)} (${hits.length})`);
    hits.forEach(h => console.log(h));
    total += hits.length;
  }
}
console.log(`\n${total} cifra(s) fuera de la tabla de CLAUDE.md. Revisa que ninguna sea un precio de Pindia.`);
