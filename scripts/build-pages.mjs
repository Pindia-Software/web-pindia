#!/usr/bin/env node
/**
 * build-pages.mjs — Compilador de páginas HTML con partials
 *
 * Lee:   /src/**\/*.html  (excepto /src/partials/)
 * Genera: el mismo árbol en la raíz del proyecto.
 *
 * Sintaxis de inclusión:
 *   <!-- @include nombre -->
 *   <!-- @include nombre key="valor" otro="x" -->
 *
 * Dentro del partial los placeholders {{key}} se sustituyen por los valores
 * pasados en el include. Los placeholders sin valor se reemplazan por "".
 *
 * Los partials pueden incluir otros partials (resolución recursiva).
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, statSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = join(__dirname, '..');
const SRC_DIR   = join(ROOT, 'src');
const PARTIALS  = join(SRC_DIR, 'partials');
const OUT_DIR   = ROOT;
const MAX_DEPTH = 10;

// ── Cache de partials ────────────────────────────────────────────────────────

const partialCache = new Map();

function loadPartial(name) {
  if (partialCache.has(name)) return partialCache.get(name);
  const path = join(PARTIALS, `${name}.html`);
  const html = readFileSync(path, 'utf8');
  partialCache.set(name, html);
  return html;
}

// ── Parser de directivas @include ────────────────────────────────────────────

// Captura indentación previa al comentario (whitespace al inicio de la línea)
const INCLUDE_RE = /^([ \t]*)<!--\s*@include\s+([\w-]+)((?:\s+[\w-]+="[^"]*")*)\s*-->[ \t]*$/gm;
const ATTR_RE    = /([\w-]+)="([^"]*)"/g;

function parseAttrs(str) {
  const out = {};
  if (!str) return out;
  let m;
  while ((m = ATTR_RE.exec(str)) !== null) {
    out[m[1]] = m[2];
  }
  // Convención: si llega `active="X"`, expone también `active_X = ' aria-current="page"'`
  // para que el partial pueda escribir <a class="..."{{active_X}}>… en un solo include
  if (out.active) {
    out[`active_${out.active}`] = ' aria-current="page"';
  }
  return out;
}

function applyVars(template, vars) {
  return template.replace(/\{\{\s*([\w-]+)\s*\}\}/g, (_, key) => vars[key] ?? '');
}

function indentBlock(block, indent) {
  if (!indent) return block;
  return block
    .split('\n')
    .map((line, i) => (i === 0 || line.length === 0) ? line : indent + line)
    .join('\n');
}

function expand(html, depth = 0) {
  if (depth > MAX_DEPTH) {
    throw new Error(`Profundidad máxima de includes superada (${MAX_DEPTH}). ¿Recursión?`);
  }
  return html.replace(INCLUDE_RE, (_match, indent, name, attrStr) => {
    const raw     = loadPartial(name);
    const vars    = parseAttrs(attrStr);
    const filled  = applyVars(raw, vars);
    const expanded = expand(filled, depth + 1);
    // El partial se almacena dedented; aplicamos la indentación detectada
    // en el comentario @include a todas sus líneas (la primera ya hereda).
    const trimmed = expanded.replace(/\n+$/, '');
    return indent + indentBlock(trimmed, indent);
  });
}

// ── Walker de archivos ───────────────────────────────────────────────────────

function* walkHTML(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st   = statSync(full);
    if (st.isDirectory()) {
      if (full === PARTIALS) continue;
      yield* walkHTML(full);
    } else if (entry.endsWith('.html')) {
      yield full;
    }
  }
}

// ── Build ────────────────────────────────────────────────────────────────────

function build() {
  let count = 0;
  let warnings = 0;

  for (const srcPath of walkHTML(SRC_DIR)) {
    const rel    = relative(SRC_DIR, srcPath);
    const out    = join(OUT_DIR, rel);
    const input  = readFileSync(srcPath, 'utf8');
    const output = expand(input);

    // Aviso si quedan placeholders sin sustituir
    const stale = output.match(/\{\{[\w-]+\}\}/g);
    if (stale) {
      console.warn(`  ⚠️  ${rel}: placeholders sin sustituir → ${[...new Set(stale)].join(', ')}`);
      warnings += stale.length;
    }

    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, output, 'utf8');
    count++;
    console.log(`  ✓ ${rel}`);
  }

  console.log(`\n✅ ${count} página(s) compilada(s)${warnings ? ` · ${warnings} warning(s)` : ''}`);
}

build();
