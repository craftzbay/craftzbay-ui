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
    // No manual vendor chunking. Splitting React's runtime (scheduler /
    // use-sync-external-store) into a separate chunk from its consumers
    // (cmdk, Radix Toast/Dialog) races on module init and throws
    // "Cannot read properties of undefined (reading 'subscribe')" the first
    // time a portal-based component mounts. A single bundle has no cross-chunk
    // ordering to get wrong.
    chunkSizeWarningLimit: 1200,
  },
});
