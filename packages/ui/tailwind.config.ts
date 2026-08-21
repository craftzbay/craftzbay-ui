/**
 * Tailwind v4 picks up tokens via the `@theme` block in `src/styles/globals.css`.
 * This config exists for a few specific reasons:
 *
 *   1. Tools (ESLint plugin, prettier-plugin-tailwindcss, IDE intellisense)
 *      still look for a config file by name.
 *   2. To enable class-based dark mode and content scanning.
 *   3. To register Tailwind plugins.
 *
 * Do not duplicate tokens here — the CSS is the source of truth.
 */
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class', '.dark'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx,mdx}', './stories/**/*.{ts,tsx,mdx}'],
  plugins: [],
};

export default config;
