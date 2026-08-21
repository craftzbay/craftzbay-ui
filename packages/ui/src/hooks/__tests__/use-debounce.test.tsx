import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useDebounce, useDebouncedCallback } from '../use-debounce';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('useDebounce', () => {
  it('returns the initial value synchronously and trails updates by delay', () => {
    const { result, rerender } = renderHook(({ v }) => useDebounce(v, 300), {
      initialProps: { v: 'a' },
    });
    expect(result.current).toBe('a');
    rerender({ v: 'b' });
    expect(result.current).toBe('a');
    act(() => vi.advanceTimersByTime(299));
    expect(result.current).toBe('a');
    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe('b');
  });

  it('restarts the timer on every change (only the last value lands)', () => {
    const { result, rerender } = renderHook(({ v }) => useDebounce(v, 100), {
      initialProps: { v: 1 },
    });
    rerender({ v: 2 });
    act(() => vi.advanceTimersByTime(60));
    rerender({ v: 3 });
    act(() => vi.advanceTimersByTime(60));
    expect(result.current).toBe(1);
    act(() => vi.advanceTimersByTime(40));
    expect(result.current).toBe(3);
  });

  it('delay <= 0 updates immediately', () => {
    const { result, rerender } = renderHook(({ v }) => useDebounce(v, 0), {
      initialProps: { v: 'a' },
    });
    rerender({ v: 'b' });
    expect(result.current).toBe('b');
  });

  it('defaults to 300ms', () => {
    const { result, rerender } = renderHook(({ v }) => useDebounce(v), { initialProps: { v: 0 } });
    rerender({ v: 1 });
    act(() => vi.advanceTimersByTime(299));
    expect(result.current).toBe(0);
    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe(1);
  });
});

describe('useDebouncedCallback', () => {
  it('invokes once with the last args after delay', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(fn, 200));
    act(() => {
      result.current('a');
      result.current('b');
      result.current('c');
    });
    expect(fn).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(200));
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('c');
  });

  it('always calls the latest fn without changing identity', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { result, rerender } = renderHook(({ fn }) => useDebouncedCallback(fn, 50), {
      initialProps: { fn: first },
    });
    const ref = result.current;
    rerender({ fn: second });
    expect(result.current).toBe(ref);
    act(() => result.current());
    act(() => vi.advanceTimersByTime(50));
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('drops the pending call on unmount', () => {
    const fn = vi.fn();
    const { result, unmount } = renderHook(() => useDebouncedCallback(fn, 100));
    act(() => result.current('x'));
    unmount();
    act(() => vi.advanceTimersByTime(500));
    expect(fn).not.toHaveBeenCalled();
  });
});
