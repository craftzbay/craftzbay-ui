import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dts from 'vite-plugin-dts';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isLib = process.env.BUILD_TARGET === 'lib';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    ...(isLib
      ? [
          dts({
            entryRoot: 'src',
            include: ['src/**/*.ts', 'src/**/*.tsx'],
            exclude: [
              'src/**/*.stories.tsx',
              'src/**/*.test.{ts,tsx}',
              'src/App.tsx',
              'src/main.tsx',
              'src/foundations/**',
            ],
            insertTypesEntry: true,
          }),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: isLib
    ? {
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
            'lucide-react',
            'react-day-picker',
            'react-hook-form',
            'tailwind-merge',
            'vaul',
          ],
        },
      }
    : {
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
          output: {
            // Two-chunk vendor split: React + its tight runtime deps
            // (scheduler, jsx-runtime, use-sync-external-store) get their
            // own chunk so React hooks are always defined before the rest
            // of the vendor code evaluates. Splitting further (radix,
            // lucide, cmdk, …) introduced "Cannot read properties of
            // undefined (reading 'useLayoutEffect')" on hard refresh —
            // those packages import React indirectly and broke under the
            // wrong chunk load order.
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
