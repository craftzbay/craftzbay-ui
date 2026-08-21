import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/components/ui/**', 'src/hooks/**', 'src/lib/**'],
      exclude: ['**/*.test.{ts,tsx}', '**/__tests__/**'],
      reporter: ['text', 'html'],
      thresholds: {
        'src/components/ui/**': { lines: 80, statements: 80 },
        'src/hooks/**': { lines: 80, statements: 80 },
        'src/lib/**': { lines: 80, statements: 80 },
      },
    },
  },
});
