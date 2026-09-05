import '@testing-library/jest-dom/vitest';
import { afterEach, expect } from 'vitest';
import { cleanup } from '@testing-library/react';
import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// @types/jest-axe augments `jest.Matchers` only; vitest 5 no longer merges
// that namespace into its own assertions, so declare the matcher on vitest's
// `Matchers` (the one augmentation point that feeds both `expect(x)` and the
// asymmetric matchers). Type parameters must repeat vitest's exactly.
declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- must repeat vitest's parameter list verbatim
  interface Matchers<R extends void | Promise<void> = void | Promise<void>, T = unknown> {
    toHaveNoViolations(): R;
  }
}

afterEach(() => {
  cleanup();
});

// Polyfill ResizeObserver — Radix uses it but jsdom lacks it.
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}

// Polyfill IntersectionObserver — Embla / Carousel use it.
if (typeof globalThis.IntersectionObserver === 'undefined') {
  globalThis.IntersectionObserver = class {
    root = null;
    rootMargin = '';
    thresholds = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  } as unknown as typeof IntersectionObserver;
}

// Polyfill Element.scrollIntoView — cmdk uses it on every command item.
if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function () {};
}

// hasPointerCapture / releasePointerCapture — Radix uses them in tests.
if (typeof Element !== 'undefined' && !Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false;
  Element.prototype.releasePointerCapture = () => {};
}
if (typeof Element !== 'undefined' && !Element.prototype.setPointerCapture) {
  // vaul (Drawer) calls it on pointerdown; jsdom lacks it.
  Element.prototype.setPointerCapture = () => {};
}

// Polyfill matchMedia for components that check prefers-color-scheme etc.
if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}
