import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFieldIds } from '../use-field-ids';

describe('useFieldIds', () => {
  it('derives -desc / -error ids from the supplied id', () => {
    const { result } = renderHook(() => useFieldIds('email'));
    expect(result.current).toEqual({
      fieldId: 'email',
      helperId: 'email-desc',
      errorId: 'email-error',
      describedBy: undefined,
    });
  });

  it('falls back to a stable useId value', () => {
    const { result, rerender } = renderHook(() => useFieldIds());
    const first = result.current.fieldId;
    expect(first).toBeTruthy();
    expect(result.current.helperId).toBe(`${first}-desc`);
    expect(result.current.errorId).toBe(`${first}-error`);
    rerender();
    expect(result.current.fieldId).toBe(first);
  });

  it('references helper only when present', () => {
    const { result } = renderHook(() => useFieldIds('f', { hasHelper: true }));
    expect(result.current.describedBy).toBe('f-desc');
  });

  it('error wins over helper', () => {
    const { result } = renderHook(() => useFieldIds('f', { hasHelper: true, hasError: true }));
    expect(result.current.describedBy).toBe('f-error');
  });

  it('appends consumer extra ids after the library id', () => {
    const { result } = renderHook(() =>
      useFieldIds('f', { hasHelper: true, extra: 'hint-1 hint-2' }),
    );
    expect(result.current.describedBy).toBe('f-desc hint-1 hint-2');
  });

  it('extra alone is returned as-is', () => {
    const { result } = renderHook(() => useFieldIds('f', { extra: 'x' }));
    expect(result.current.describedBy).toBe('x');
  });

  it('empty extra does not produce a dangling space', () => {
    const { result } = renderHook(() => useFieldIds('f', { hasError: true, extra: '' }));
    expect(result.current.describedBy).toBe('f-error');
  });
});
