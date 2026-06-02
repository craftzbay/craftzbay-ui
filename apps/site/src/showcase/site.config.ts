/**
 * Central showcase constants — repository links, package coordinates, version,
 * and the brand presets surfaced by the on-page brand switcher. Keeping these
 * in one place means a repo rename or version bump touches a single file.
 */
import type { BrandName } from '@craftzbay/ui';

export const PKG_NAME = '@craftzbay/ui';
export const VERSION = '0.8.0';

export const GITHUB_URL = 'https://github.com/craftzbay/craftzbay-ui';
export const NPM_URL = 'https://www.npmjs.com/package/@craftzbay/ui';
export const CHANGELOG_URL = `${GITHUB_URL}/blob/main/packages/ui/CHANGELOG.md`;

/** Source-file link bases (monorepo layout). */
export const SRC_UI = `${GITHUB_URL}/blob/main/packages/ui/src/components/ui`;
export const SRC_PATTERNS = `${GITHUB_URL}/blob/main/packages/ui/src/components/patterns`;

/**
 * Brand presets the switcher cycles through. `name` keys into the library's
 * exported `brandPresets`; `swatch` is the dot shown in the menu (a plain CSS
 * colour, not a token, so the menu reads correctly regardless of active brand).
 */
export interface BrandOption {
  name: BrandName;
  label: string;
  description: string;
  swatch: string;
}

export const BRANDS: BrandOption[] = [
  {
    name: 'default',
    label: 'Graphite Indigo',
    description: 'The default refined-minimal accent.',
    swatch: '#4e5fc4',
  },
  {
    name: 'edgelog',
    label: 'EdgeLog Indigo',
    description: 'Cool indigo, slightly rounder corners.',
    swatch: '#3b5bdb',
  },
  {
    name: 'gerege',
    label: 'Gerege Copper',
    description: 'Warm copper accent, tighter geometry.',
    swatch: '#c2722e',
  },
  {
    name: 'forest',
    label: 'Forest',
    description: 'Calm forest green accent.',
    swatch: '#2f9e6f',
  },
];
