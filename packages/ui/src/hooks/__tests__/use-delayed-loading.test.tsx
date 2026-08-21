import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useDelayedLoading } from '../use-delayed-loading';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('useDelayedLoading', () => {
  it('is false until ms elapses, then true', () => {
    const { result } = renderHook(() => useDelayedLoading(300));
    expect(result.current).toBe(false);
    act(() => vi.advanceTimersByTime(299));
    expect(result.current).toBe(false);
    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe(true);
  });

  it('ms <= 0 is true synchronously on first render', () => {
    const { result } = renderHook(() => useDelayedLoading(0));
    expect(result.current).toBe(true);
  });

  it('holds true for minVisible when ms changes after showing', () => {
    const { result, rerender } = renderHook(
      ({ ms }) => useDelayedLoading(ms, { minVisible: 500 }),
      {
        initialProps: { ms: 100 },
      },
    );
    act(() => vi.advanceTimersByTime(100));
    expect(result.current).toBe(true);
    // Switching the delay re-arms: the placeholder must stay for the rest of minVisible.
    act(() => vi.advanceTimersByTime(200));
    rerender({ ms: 50 });
    expect(result.current).toBe(true);
    act(() => vi.advanceTimersByTime(299));
    expect(result.current).toBe(true);
    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe(false);
    act(() => vi.advanceTimersByTime(50));
    expect(result.current).toBe(true);
  });

  it('hides immediately when minVisible already elapsed, then re-shows after the new ms', () => {
    const { result, rerender } = renderHook(
      ({ ms }) => useDelayedLoading(ms, { minVisible: 100 }),
      {
        initialProps: { ms: 10 },
      },
    );
    act(() => vi.advanceTimersByTime(10));
    expect(result.current).toBe(true);
    act(() => vi.advanceTimersByTime(200));
    rerender({ ms: 40 });
    expect(result.current).toBe(false);
    act(() => vi.advanceTimersByTime(40));
    expect(result.current).toBe(true);
  });

  it('clears timers on unmount (no state update after unmount)', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { unmount } = renderHook(() => useDelayedLoading(100));
    unmount();
    act(() => vi.advanceTimersByTime(1000));
    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
