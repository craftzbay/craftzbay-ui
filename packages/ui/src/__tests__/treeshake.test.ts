// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { build } from 'esbuild';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Automated version of the manual check in CLAUDE.md: bundle `import { Button }`
 * and assert none of the heavy, component-specific deps survive tree-shaking.
 *
 * Runs against the source entry always, and against `dist-lib` (what consumers
 * actually get) when it has been built — CI runs it again after `pnpm build:lib`.
 *
 * esbuild is resolved from vite's dependency tree (hoisted node_modules), not a
 * direct dependency.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, '../..');

const HEAVY_DEPS = ['react-day-picker', 'vaul', 'cmdk', 'recharts', 'embla', 'react-hook-form'];

async function bundleButton(entry: string): Promise<string> {
  const result = await build({
    stdin: {
      contents: `export { Button } from ${JSON.stringify(entry)};`,
      resolveDir: pkgRoot,
      loader: 'ts',
    },
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'browser',
    jsx: 'automatic',
    // Keep node_modules external: a surviving `import "vaul"` is exactly what we detect.
    packages: 'external',
    tsconfig: path.join(pkgRoot, 'tsconfig.json'),
    loader: { '.css': 'empty' },
    logLevel: 'silent',
  });
  return result.outputFiles.map((f) => f.text).join('\n');
}

function leaked(output: string): string[] {
  return HEAVY_DEPS.filter((dep) => output.includes(dep));
}

describe('tree-shaking: import { Button }', () => {
  it('source entry pulls in no heavy component deps', async () => {
    const out = await bundleButton('./src/index.ts');
    expect(out).toContain('Button');
    expect(leaked(out)).toEqual([]);
  });

  const dist = path.join(pkgRoot, 'dist-lib/index.js');
  it.skipIf(!existsSync(dist))('dist-lib entry pulls in no heavy component deps', async () => {
    const out = await bundleButton('./dist-lib/index.js');
    expect(out).toContain('Button');
    expect(leaked(out)).toEqual([]);
  });
});
