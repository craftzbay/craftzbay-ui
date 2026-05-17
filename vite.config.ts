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
        chunkSizeWarningLimit: 600,
        rollupOptions: {
          output: {
            // Showcase code-splitting: keep first-paint small by isolating
            // each large vendor group into its own chunk.
            manualChunks: (id) => {
              if (!id.includes('node_modules')) return undefined;
              if (id.includes('react-dom')) return 'vendor-react';
              if (id.includes('/react/') || id.endsWith('/react')) return 'vendor-react';
              if (id.includes('@radix-ui')) return 'vendor-radix';
              if (id.includes('lucide-react')) return 'vendor-lucide';
              if (id.includes('react-day-picker') || id.includes('date-fns')) return 'vendor-datepicker';
              if (id.includes('react-hook-form')) return 'vendor-rhf';
              if (id.includes('embla-carousel')) return 'vendor-carousel';
              if (id.includes('vaul')) return 'vendor-vaul';
              if (id.includes('cmdk')) return 'vendor-cmdk';
              return 'vendor';
            },
          },
        },
      },
});
