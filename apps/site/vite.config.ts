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
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        // One vendor chunk for all third-party code: it changes far less often
        // than app code, so it stays cached across deploys. Everything lives in
        // a single chunk (React included), so there's no cross-chunk init order
        // to get wrong — route pages, blocks and the generated-props table are
        // split off separately via dynamic import().
        manualChunks: (id) => (id.includes('node_modules') ? 'vendor' : undefined),
      },
    },
  },
});
