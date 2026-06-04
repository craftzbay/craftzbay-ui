import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dts from 'vite-plugin-dts';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Library build only. The showcase site lives in `apps/site` and has its own
 * Vite config — this package never builds an HTML app, only the distributable
 * ESM/CJS bundle + type declarations under `dist-lib/`.
 */
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      entryRoot: 'src',
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/test/**'],
      insertTypesEntry: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist-lib',
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
      cssFileName: 'styles',
    },
    cssCodeSplit: false,
    sourcemap: true,
    emptyOutDir: true,
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        /^@radix-ui\//,
        'class-variance-authority',
        'clsx',
        'cmdk',
        /^embla-carousel/,
        // Regex: keeps subpaths external too — lucide-react/dynamicIconImports
        // powers <Icon name="…">; a bare string only matches the root import.
        /^lucide-react/,
        'react-day-picker',
        'react-hook-form',
        'tailwind-merge',
        'vaul',
      ],
    },
  },
});
