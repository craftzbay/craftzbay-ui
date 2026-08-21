import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { StringsContext, useStrings } from '../use-strings';
import { defaultStrings, mergeStrings } from '../../lib/strings';
import { mnStrings } from '../../lib/strings.mn';
import { DesignSystemProvider } from '../../components/ui/DesignSystemProvider';

describe('useStrings', () => {
  it('returns English defaults without a provider', () => {
    const { result } = renderHook(() => useStrings());
    expect(result.current).toBe(defaultStrings);
  });

  it('reads the nearest StringsContext', () => {
    const { result } = renderHook(() => useStrings(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <StringsContext.Provider value={mnStrings}>{children}</StringsContext.Provider>
      ),
    });
    expect(result.current.dialog.close).toBe('Хаах');
  });

  it('DesignSystemProvider deep-merges a partial override', () => {
    const { result } = renderHook(() => useStrings(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <DesignSystemProvider strings={{ pagination: { next: 'Дараах' } }}>
          {children}
        </DesignSystemProvider>
      ),
    });
    expect(result.current.pagination.next).toBe('Дараах');
    expect(result.current.pagination.prev).toBe(defaultStrings.pagination.prev);
    expect(result.current.dialog).toEqual(defaultStrings.dialog);
  });

  it('nested providers merge over the parent, not the defaults', () => {
    const { result } = renderHook(() => useStrings(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <DesignSystemProvider strings={mnStrings}>
          <DesignSystemProvider strings={{ dialog: { close: 'X' } }}>
            {children}
          </DesignSystemProvider>
        </DesignSystemProvider>
      ),
    });
    expect(result.current.dialog.close).toBe('X');
    expect(result.current.sheet.close).toBe('Хаах');
  });
});

describe('mergeStrings', () => {
  it('returns base unchanged when override is missing', () => {
    expect(mergeStrings(defaultStrings)).toBe(defaultStrings);
    expect(mergeStrings(defaultStrings, undefined)).toBe(defaultStrings);
  });

  it('ignores undefined leaves and does not mutate inputs', () => {
    const override = { dialog: { close: undefined }, toast: { close: 'Bye' } };
    const out = mergeStrings(defaultStrings, override);
    expect(out.dialog.close).toBe('Close');
    expect(out.toast).toEqual({ close: 'Bye', region: 'Notifications' });
    expect(defaultStrings.toast.close).toBe('Close');
    expect(out).not.toBe(defaultStrings);
  });

  it('an undefined group leaves the whole group intact', () => {
    const out = mergeStrings(defaultStrings, { alert: undefined });
    expect(out.alert).toEqual(defaultStrings.alert);
  });
});
