import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { isApplePlatform, useModifierKey } from '../use-modifier-key';

type Nav = { userAgentData?: { platform?: string }; platform?: string; userAgent?: string };

function mockNavigator(nav: Nav) {
  vi.stubGlobal('navigator', nav);
}

afterEach(() => vi.unstubAllGlobals());

describe('isApplePlatform', () => {
  it.each([
    [{ userAgentData: { platform: 'macOS' } }, true],
    [{ userAgentData: { platform: 'Windows' }, platform: 'MacIntel' }, false], // UA-CH wins
    [{ platform: 'MacIntel' }, true],
    [{ platform: 'iPhone' }, true],
    [{ platform: 'iPad' }, true],
    [{ platform: 'Win32' }, false],
    [{ platform: 'Linux x86_64' }, false],
    [{ platform: '', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' }, true],
    [{ platform: '', userAgent: 'Mozilla/5.0 (X11; Linux x86_64)' }, false],
    [{}, false],
  ])('%j → %s', (nav, expected) => {
    mockNavigator(nav);
    expect(isApplePlatform()).toBe(expected);
  });

  it('is false without a navigator (server)', () => {
    vi.stubGlobal('navigator', undefined);
    expect(isApplePlatform()).toBe(false);
  });
});

describe('useModifierKey', () => {
  it('returns ⌘ / Cmd on Apple platforms after mount', () => {
    mockNavigator({ userAgentData: { platform: 'macOS' } });
    const { result } = renderHook(() => useModifierKey());
    expect(result.current).toEqual({ symbol: '⌘', label: 'Cmd' });
  });

  it('returns Ctrl elsewhere', () => {
    mockNavigator({ platform: 'Win32' });
    const { result } = renderHook(() => useModifierKey());
    expect(result.current).toEqual({ symbol: 'Ctrl', label: 'Ctrl' });
  });

  it('server output is deterministic (Ctrl) even on Apple', () => {
    mockNavigator({ platform: 'MacIntel' });
    function C() {
      return <b>{useModifierKey().symbol}</b>;
    }
    expect(renderToString(<C />)).toBe('<b>Ctrl</b>');
  });
});
