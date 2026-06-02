import { type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Per-brand token overrides. Keys are CSS variable names (without the `--`
 * prefix); values are CSS values. Any unspecified token falls back to the
 * design system default.
 *
 * @example
 *   <DesignSystemProvider tokens={{ 'color-accent': '#ff5555', 'radius-md': '10px' }}>
 *     <App />
 *   </DesignSystemProvider>
 *
 * @example Swap in one of the built-in accent presets
 *   <DesignSystemProvider tokens={brandPresets.violet}>
 *     <Card>...</Card>
 *   </DesignSystemProvider>
 */
export type BrandTokens = Record<string, string>;

export interface DesignSystemProviderProps extends HTMLAttributes<HTMLDivElement> {
  /** Token overrides (CSS variable name → value). */
  tokens?: BrandTokens;
  /** Children to scope this brand to. */
  children: ReactNode;
}

export function DesignSystemProvider({
  tokens,
  className,
  children,
  style,
  ...props
}: DesignSystemProviderProps) {
  // Build the inline style from tokens — wrapping every key with `--` so
  // consumers can pass either `accent` or `color-accent` without remembering
  // the prefix dance.
  const css: CSSProperties = { ...style };
  if (tokens) {
    for (const [k, v] of Object.entries(tokens)) {
      const key = k.startsWith('--') ? k : `--${k}`;
      (css as Record<string, string>)[key] = v;
    }
  }

  return (
    <div data-brand-scope className={cn('contents', className)} style={css} {...props}>
      {children}
    </div>
  );
}

/**
 * Built-in accent presets — swap the system's single accent colour without
 * touching anything else. Each maps the accent ramp tokens the components
 * read (`color-accent`, its hover/active steps, and the soft surface + text).
 * `default` is the library's graphite-indigo; the rest are colour starters you
 * can use as-is or fork. Light/dark both follow because only the hue changes.
 */
export const brandPresets = {
  /** The library default — graphite indigo. */
  default: {} as BrandTokens,
  /** Blue. */
  blue: {
    'color-accent': 'oklch(0.55 0.16 250)',
    'color-accent-700': 'oklch(0.47 0.16 250)',
    'color-accent-800': 'oklch(0.39 0.14 250)',
    'color-accent-soft': 'oklch(0.95 0.04 250)',
    'color-on-accent-soft': 'oklch(0.45 0.15 250)',
    ring: 'oklch(0.62 0.16 250)',
  },
  /** Violet. */
  violet: {
    'color-accent': 'oklch(0.53 0.20 295)',
    'color-accent-700': 'oklch(0.45 0.18 295)',
    'color-accent-800': 'oklch(0.38 0.16 295)',
    'color-accent-soft': 'oklch(0.95 0.04 295)',
    'color-on-accent-soft': 'oklch(0.45 0.18 295)',
    ring: 'oklch(0.60 0.20 295)',
  },
  /** Emerald. */
  emerald: {
    'color-accent': 'oklch(0.55 0.13 160)',
    'color-accent-700': 'oklch(0.47 0.13 160)',
    'color-accent-800': 'oklch(0.39 0.12 160)',
    'color-accent-soft': 'oklch(0.95 0.04 160)',
    'color-on-accent-soft': 'oklch(0.42 0.12 160)',
    ring: 'oklch(0.60 0.13 160)',
  },
  /** Rose. */
  rose: {
    'color-accent': 'oklch(0.57 0.19 12)',
    'color-accent-700': 'oklch(0.49 0.18 12)',
    'color-accent-800': 'oklch(0.41 0.16 12)',
    'color-accent-soft': 'oklch(0.95 0.035 12)',
    'color-on-accent-soft': 'oklch(0.48 0.18 12)',
    ring: 'oklch(0.62 0.19 12)',
  },
  /** Amber. */
  amber: {
    'color-accent': 'oklch(0.62 0.14 65)',
    'color-accent-700': 'oklch(0.54 0.13 65)',
    'color-accent-800': 'oklch(0.46 0.12 65)',
    'color-accent-soft': 'oklch(0.95 0.05 75)',
    'color-on-accent-soft': 'oklch(0.48 0.12 65)',
    ring: 'oklch(0.66 0.14 65)',
  },
} as const;

export type BrandName = keyof typeof brandPresets;
