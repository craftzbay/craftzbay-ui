import type { RefObject } from 'react';

/** Element that should receive focus when an overlay closes. */
export type ReturnFocusRef = RefObject<HTMLElement | null>;

/**
 * Build an `onCloseAutoFocus` handler that moves focus to `returnFocusTo`
 * instead of Radix's default (the element focused when the content mounted —
 * which is `<body>` for controlled overlays opened from a pointer click on a
 * non-focusable or tooltip-wrapped trigger). A consumer handler runs first
 * and wins if it calls `preventDefault()`.
 */
export function withReturnFocus(
  returnFocusTo: ReturnFocusRef | undefined,
  handler: ((e: Event) => void) | undefined,
): ((e: Event) => void) | undefined {
  if (!returnFocusTo) return handler;
  return (e) => {
    handler?.(e);
    if (e.defaultPrevented) return;
    const el = returnFocusTo.current;
    if (!el) return;
    e.preventDefault();
    el.focus();
  };
}
