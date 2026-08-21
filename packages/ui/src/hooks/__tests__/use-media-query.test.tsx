import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { useMediaQuery, usePrefersReducedMotion } from '../use-media-query';

type Listener = (e: { matches: boolean }) => void;

function installMatchMedia(initial: Record<string, boolean> = {}) {
  const lists = new Map<string, { matches: boolean; listeners: Set<Listener> }>();
  const mm = vi.fn((query: string) => {
    let entry = lists.get(query);
    if (!entry) {
      entry = { matches: initial[query] ?? false, listeners: new Set() };
      lists.set(query, entry);
    }
    const e = entry;
    return {
      get matches() {
        return e.matches;
      },
      media: query,
      addEventListener: (_: 'change', l: Listener) => e.listeners.add(l),
      removeEventListener: (_: 'change', l: Listener) => e.listeners.delete(l),
    } as unknown as MediaQueryList;
  });
  window.matchMedia = mm as unknown as typeof window.matchMedia;
  return {
    mm,
    set(query: string, matches: boolean) {
      const e = lists.get(query);
      if (!e) throw new Error(`no list for ${query}`);
      e.matches = matches;
      e.listeners.forEach((l) => l({ matches }));
    },
    listenerCount: (query: string) => lists.get(query)?.listeners.size ?? 0,
  };
}

const original = window.matchMedia;
afterEach(() => {
  window.matchMedia = original;
});

describe('useMediaQuery', () => {
  it('reads the current match synchronously', () => {
    installMatchMedia({ '(min-width: 1024px)': true });
    const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)'));
    expect(result.current).toBe(true);
  });

  it('re-renders on the change event and unsubscribes on unmount', () => {
    const env = installMatchMedia();
    const q = '(min-width: 1024px)';
    const { result, unmount } = renderHook(() => useMediaQuery(q));
    expect(result.current).toBe(false);
    expect(env.listenerCount(q)).toBe(1);
    act(() => env.set(q, true));
    expect(result.current).toBe(true);
    unmount();
    expect(env.listenerCount(q)).toBe(0);
  });

  it('resubscribes when the query changes', () => {
    const env = installMatchMedia({ '(a)': false, '(b)': true });
    const { result, rerender } = renderHook(({ q }) => useMediaQuery(q), {
      initialProps: { q: '(a)' },
    });
    expect(result.current).toBe(false);
    rerender({ q: '(b)' });
    expect(result.current).toBe(true);
    expect(env.listenerCount('(a)')).toBe(0);
    expect(env.listenerCount('(b)')).toBe(1);
  });

  it('returns false when matchMedia is unavailable', () => {
    (window as unknown as { matchMedia?: unknown }).matchMedia = undefined;
    const { result } = renderHook(() => useMediaQuery('(min-width: 1px)'));
    expect(result.current).toBe(false);
  });

  it('server snapshot is always false', () => {
    installMatchMedia({ '(x)': true });
    function C() {
      return <i>{String(useMediaQuery('(x)'))}</i>;
    }
    expect(renderToString(<C />)).toBe('<i>false</i>');
  });

  it('usePrefersReducedMotion queries the standard feature', () => {
    const env = installMatchMedia({ '(prefers-reduced-motion: reduce)': true });
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(true);
    expect(env.mm).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
  });
});
