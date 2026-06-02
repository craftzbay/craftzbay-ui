import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UI_SRC = path.resolve(__dirname, '../../packages/ui/src');

/**
 * Showcase site build. The library is consumed straight from source via the
 * aliases below, so editing a component hot-reloads the docs instantly — no
 * rebuild step. The displayed import strings still read `@craftzbay/ui`; this
 * alias just points that bare specifier (and the legacy `@/…` paths the ported
 * docs use) at the workspace source.
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@craftzbay/ui': path.join(UI_SRC, 'index.ts'),
      '@': UI_SRC,
      '@site': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // React + its tight runtime deps share one chunk so hooks are always
        // defined before the rest of the vendor code evaluates.
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return undefined;
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/scheduler/') ||
            id.includes('node_modules/use-sync-external-store/')
          ) {
            return 'vendor-react';
          }
          return 'vendor';
        },
      },
    },
  },
});
