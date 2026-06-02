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
 * Accent presets the switcher cycles through. `name` keys into the library's
 * exported `brandPresets`; `swatch` is the dot shown in the menu (a plain CSS
 * colour, not a token, so the menu reads correctly regardless of active accent).
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
    label: 'Indigo',
    description: 'The library default — graphite indigo.',
    swatch: '#4e5fc4',
  },
  {
    name: 'blue',
    label: 'Blue',
    description: 'A cooler, brighter blue.',
    swatch: '#2f6bd6',
  },
  {
    name: 'violet',
    label: 'Violet',
    description: 'Saturated purple-violet.',
    swatch: '#7c4ddb',
  },
  {
    name: 'emerald',
    label: 'Emerald',
    description: 'Calm green.',
    swatch: '#1f9d6b',
  },
  {
    name: 'rose',
    label: 'Rose',
    description: 'Warm pink-red.',
    swatch: '#df3f6b',
  },
  {
    name: 'amber',
    label: 'Amber',
    description: 'Warm amber-orange.',
    swatch: '#c2832e',
  },
];
