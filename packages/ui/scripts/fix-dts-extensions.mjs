#!/usr/bin/env node
/* vite-plugin-dts emits extensionless relative specifiers (`./lib/utils`)
 * because the source is compiled with moduleResolution=Bundler. Node16-style
 * resolvers (TypeScript `node16`/`nodenext`, used by Next.js consumers with
 * strict configs) require explicit `.js` — rewrite them after the build. */
import { readdirSync, readFileSync, statSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist-lib');

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith('.d.ts')) out.push(p);
  }
  return out;
}

const SPEC = /((?:from|import)\s*\(?\s*['"])(\.\.?\/[^'"]+)(['"])/g;

let changed = 0;
for (const file of walk(root)) {
  const src = readFileSync(file, 'utf8');
  const next = src.replace(SPEC, (m, pre, spec, post) => {
    if (/\.(js|mjs|cjs|json|css)$/.test(spec)) return m;
    const abs = path.resolve(path.dirname(file), spec);
    if (existsSync(abs + '.d.ts')) return `${pre}${spec}.js${post}`;
    if (existsSync(path.join(abs, 'index.d.ts'))) return `${pre}${spec}/index.js${post}`;
    return m;
  });
  if (next !== src) {
    writeFileSync(file, next);
    changed++;
  }
}
console.log(`fix-dts-extensions: rewrote ${changed} declaration file(s)`);
