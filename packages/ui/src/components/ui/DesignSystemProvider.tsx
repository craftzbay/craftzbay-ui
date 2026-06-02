import { type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Per-brand token overrides. Keys are CSS variable names (without the `--`
 * prefix); values are CSS values. Any unspecified token falls back to the
 * design system default.
 *
 * @example
 *   <DesignSystemProvider tokens={{ accent: '#ff5555', 'radius-md': '10px' }}>
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
 * touching anything else.
 *
 * These override the *semantic* tokens the utilities resolve to. globals.css
 * maps the accent utilities with `@theme inline` (e.g. `bg-accent` →
 * `var(--accent)`, `bg-accent-soft` → `var(--accent-subtle)`), so the override
 * must target `--accent` / `--accent-subtle` / `--accent-subtle-foreground` /
 * `--ring` — NOT `--color-accent` (which `inline` never emits). The hover/
 * active steps (`--color-accent-700/800`) come from the raw palette and are
 * overridden directly. `default` is the built-in graphite-indigo.
 */
export const brandPresets = {
  /** The library default — graphite indigo. */
  default: {} as BrandTokens,
  /** Blue. */
  blue: {
    accent: 'oklch(0.55 0.16 250)',
    'color-accent-700': 'oklch(0.47 0.16 250)',
    'color-accent-800': 'oklch(0.39 0.14 250)',
    'accent-subtle': 'oklch(0.95 0.04 250)',
    'accent-subtle-foreground': 'oklch(0.45 0.15 250)',
    ring: 'oklch(0.62 0.16 250)',
  },
  /** Violet. */
  violet: {
    accent: 'oklch(0.53 0.20 295)',
    'color-accent-700': 'oklch(0.45 0.18 295)',
    'color-accent-800': 'oklch(0.38 0.16 295)',
    'accent-subtle': 'oklch(0.95 0.04 295)',
    'accent-subtle-foreground': 'oklch(0.45 0.18 295)',
    ring: 'oklch(0.60 0.20 295)',
  },
  /** Emerald. */
  emerald: {
    accent: 'oklch(0.55 0.13 160)',
    'color-accent-700': 'oklch(0.47 0.13 160)',
    'color-accent-800': 'oklch(0.39 0.12 160)',
    'accent-subtle': 'oklch(0.95 0.04 160)',
    'accent-subtle-foreground': 'oklch(0.42 0.12 160)',
    ring: 'oklch(0.60 0.13 160)',
  },
  /** Rose. */
  rose: {
    accent: 'oklch(0.57 0.19 12)',
    'color-accent-700': 'oklch(0.49 0.18 12)',
    'color-accent-800': 'oklch(0.41 0.16 12)',
    'accent-subtle': 'oklch(0.95 0.035 12)',
    'accent-subtle-foreground': 'oklch(0.48 0.18 12)',
    ring: 'oklch(0.62 0.19 12)',
  },
  /** Amber. */
  amber: {
    accent: 'oklch(0.62 0.14 65)',
    'color-accent-700': 'oklch(0.54 0.13 65)',
    'color-accent-800': 'oklch(0.46 0.12 65)',
    'accent-subtle': 'oklch(0.95 0.05 75)',
    'accent-subtle-foreground': 'oklch(0.48 0.12 65)',
    ring: 'oklch(0.66 0.14 65)',
  },
} as const;

export type BrandName = keyof typeof brandPresets;
