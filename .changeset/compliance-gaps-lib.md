---
'@craftzbay/ui': minor
---

Accessibility / localisation compliance pass (additive, no breaking changes):

- Touch targets (WCAG 2.5.8): Checkbox, RadioGroup item, Switch `sm` and IconButton `sm` gain an invisible ≥24px hit halo; Input clear/password buttons are 24px.
- Chart: `--chart-1` is a categorical blue (no longer aliases `--accent`); new `tableFallback` (default on, `sr-only` data table) + `showTableToggle`; every point/bar is keyboard-focusable with an `aria-label`; `y: null` breaks the line; `state="loading" | "empty" | "error"`; nice 1/2/2.5/5 axis ticks; strings moved to `UiStrings.chart`.
- 16px inputs on mobile: Combobox, MultiSelect, TagInput, DatePicker trigger, CommandPalette input use `text-lg md:text-sm`.
- Contrast: amber preset accent darkened to oklch(0.56 0.14 65) (4.8:1 with white); `--foreground-subtle` → hsl(215 16% 45%) (4.6:1 on `background-muted`).
- Safe areas: Toast viewport, Sheet and Drawer pad by `env(safe-area-inset-*)` (set `viewport-fit=cover`).
- New: `formatDate`, `formatNumber`, `formatMNT`, `<RelativeTime>`, `useDelayedLoading(ms)`, `Skeleton delay`; `UiStrings.relativeTime` (EN/MN).
- Minor: Calendar weekday `text-xs` and `bg-accent-hover`; Sidebar root is `<nav>`; Popover content has a focus-visible ring.
