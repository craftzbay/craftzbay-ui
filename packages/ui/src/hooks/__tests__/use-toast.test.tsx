import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';

type Mod = typeof import('../use-toast');
let mod: Mod;

// The queue is a lazy module-level singleton — reload the module so every
// test starts from an empty store.
beforeEach(async () => {
  vi.resetModules();
  mod = await import('../use-toast');
});
afterEach(() => vi.restoreAllMocks());

describe('useToast', () => {
  it('starts empty (fresh store per test)', () => {
    const { result } = renderHook(() => mod.useToast());
    expect(result.current.toasts).toEqual([]);
  });

  it('push adds to the front, returns the id, and applies per-variant durations', () => {
    const { result } = renderHook(() => mod.useToast());
    let a = '';
    let b = '';
    act(() => {
      a = result.current.push({ title: 'A' });
      b = result.current.push({ title: 'B', variant: 'danger' });
    });
    expect(result.current.toasts.map((t) => t.id)).toEqual([b, a]);
    expect(result.current.toasts[1]).toMatchObject({
      variant: 'default',
      duration: 4000,
      open: true,
    });
    expect(result.current.toasts[0]).toMatchObject({ variant: 'danger', duration: 0 });
  });

  it.each([
    ['default', 4000],
    ['success', 4000],
    ['info', 4000],
    ['warning', 6000],
    ['danger', 0],
  ] as const)('variant %s defaults to %i ms', (variant, duration) => {
    expect(mod.TOAST_DURATIONS[variant]).toBe(duration);
    const { result } = renderHook(() => mod.useToast());
    act(() => {
      result.current.push({ variant });
    });
    expect(result.current.toasts[0].duration).toBe(duration);
  });

  it('explicit duration wins over the variant default', () => {
    const { result } = renderHook(() => mod.useToast());
    act(() => {
      result.current.push({ variant: 'danger', duration: 1500 });
    });
    expect(result.current.toasts[0].duration).toBe(1500);
  });

  it('push with an existing id updates in place and keeps queue position', () => {
    const { result } = renderHook(() => mod.useToast());
    act(() => {
      result.current.push({ id: 'x', title: 'Uploading', variant: 'info' });
      result.current.push({ id: 'y', title: 'Other' });
    });
    act(() => result.current.dismiss('x'));
    expect(result.current.toasts.find((t) => t.id === 'x')?.open).toBe(false);
    act(() => {
      result.current.push({ id: 'x', title: 'Done', variant: 'success' });
    });
    expect(result.current.toasts.map((t) => t.id)).toEqual(['y', 'x']);
    const x = result.current.toasts[1];
    expect(x).toMatchObject({ title: 'Done', variant: 'success', duration: 4000, open: true });
  });

  it('update without a variant keeps the previous duration', () => {
    const { result } = renderHook(() => mod.useToast());
    act(() => {
      result.current.push({ id: 'x', variant: 'warning' });
      result.current.push({ id: 'x', title: 'still warning' });
    });
    expect(result.current.toasts[0]).toMatchObject({ variant: 'warning', duration: 6000 });
  });

  it('dismiss closes, remove drops', () => {
    const { result } = renderHook(() => mod.useToast());
    let id = '';
    act(() => {
      id = result.current.push({ title: 'A' });
    });
    act(() => result.current.dismiss(id));
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].open).toBe(false);
    act(() => result.current.remove(id));
    expect(result.current.toasts).toEqual([]);
  });

  it('caps auto-dismissing toasts at 3 (oldest dropped) but keeps persistent ones', () => {
    const { result } = renderHook(() => mod.useToast());
    act(() => {
      result.current.push({ id: 'p1', variant: 'danger' }); // persistent
      result.current.push({ id: 'a' });
      result.current.push({ id: 'b' });
      result.current.push({ id: 'p2', duration: 0 }); // persistent
      result.current.push({ id: 'c' });
      result.current.push({ id: 'd' });
    });
    const ids = result.current.toasts.map((t) => t.id);
    expect(ids).toEqual(['d', 'c', 'p2', 'b', 'p1']);
    expect(ids).not.toContain('a');
  });

  it('the `toast` helper dispatches outside React and every subscriber sees it', () => {
    const h1 = renderHook(() => mod.useToast());
    const h2 = renderHook(() => mod.useToast());
    act(() => {
      mod.toast({ title: 'Global' });
    });
    expect(h1.result.current.toasts).toHaveLength(1);
    expect(h2.result.current.toasts).toBe(h1.result.current.toasts);
  });

  it('generates unique ids', () => {
    const { result } = renderHook(() => mod.useToast());
    const ids = new Set<string>();
    act(() => {
      for (let i = 0; i < 20; i++) ids.add(result.current.push({ duration: 0 }));
    });
    expect(ids.size).toBe(20);
  });

  it('callbacks are referentially stable across renders', () => {
    const { result, rerender } = renderHook(() => mod.useToast());
    const { push, dismiss, remove } = result.current;
    rerender();
    expect(result.current.push).toBe(push);
    expect(result.current.dismiss).toBe(dismiss);
    expect(result.current.remove).toBe(remove);
  });
});
