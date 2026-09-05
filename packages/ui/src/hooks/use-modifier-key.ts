'use client';

import { useSyncExternalStore } from 'react';

/** True on macOS / iOS / iPadOS, where the command modifier is ⌘. */
export function isApplePlatform(): boolean {
  if (typeof navigator === 'undefined') return false;
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const platform = nav.userAgentData?.platform ?? nav.platform ?? '';
  return /mac|iphone|ipad|ipod/i.test(platform) || /Mac OS X/i.test(nav.userAgent ?? '');
}

export interface ModifierKey {
  /** Glyph for `<Kbd>`: `⌘` on Apple platforms, `Ctrl` elsewhere. */
  symbol: '⌘' | 'Ctrl';
  /** Spoken/long form for aria-labels and tooltips: `Cmd` / `Ctrl`. */
  label: 'Cmd' | 'Ctrl';
}

/**
 * Platform-correct command modifier for shortcut hints (⌘K vs Ctrl K).
 * Defaults to Ctrl until mounted so server output is deterministic.
 */
const subscribe = () => () => {};

export function useModifierKey(): ModifierKey {
  // Platform never changes, so there is nothing to subscribe to; the store
  // shape just gives a `false` server snapshot and the real value after
  // hydration without a state write in an effect.
  const apple = useSyncExternalStore(subscribe, isApplePlatform, () => false);
  return apple ? { symbol: '⌘', label: 'Cmd' } : { symbol: 'Ctrl', label: 'Ctrl' };
}
