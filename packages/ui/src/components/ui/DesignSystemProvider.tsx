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
 * @example Multiple brands in one app
 *   <DesignSystemProvider tokens={edgelogBrand}>
 *     <Card>...</Card>
 *   </DesignSystemProvider>
 *   <DesignSystemProvider tokens={geregeBrand}>
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
 * Built-in brand presets — drop-in starters showing how a token override
 * map is shaped. Consumers can fork or replace any value.
 */
export const brandPresets = {
  default: {} as BrandTokens,
  /** Cool indigo accent, slightly rounder corners. */
  edgelog: {
    'color-accent': 'oklch(0.55 0.18 250)',
    'color-accent-700': 'oklch(0.46 0.16 250)',
    'color-accent-800': 'oklch(0.38 0.14 250)',
    'color-accent-soft': 'oklch(0.95 0.04 250)',
    'radius-md': '8px',
    'radius-lg': '12px',
  },
  /** Warm copper accent, tighter geometry. */
  gerege: {
    'color-accent': 'oklch(0.62 0.16 45)',
    'color-accent-700': 'oklch(0.54 0.16 45)',
    'color-accent-800': 'oklch(0.46 0.14 45)',
    'color-accent-soft': 'oklch(0.95 0.04 45)',
    'radius-md': '4px',
    'radius-lg': '6px',
  },
  /** Forest green accent. */
  forest: {
    'color-accent': 'oklch(0.55 0.14 155)',
    'color-accent-700': 'oklch(0.47 0.14 155)',
    'color-accent-800': 'oklch(0.39 0.12 155)',
    'color-accent-soft': 'oklch(0.95 0.04 155)',
  },
} as const;

export type BrandName = keyof typeof brandPresets;
