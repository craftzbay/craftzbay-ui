---
'@craftzbay/ui': minor
---

Accessibility fixes from the e2e/axe audit:

- `Table` scroll wrapper and `ScrollArea` viewport are now focusable (`tabIndex=0`, `role="group"`, visible focus ring) with an accessible name from `strings.table.scrollRegion` / `strings.scrollArea.region`; override per instance with the new `scrollLabel` / `viewportLabel` props. `DataGrid` inherits this.
- `Combobox`, `DatePicker` / `DateRangePicker`, `MultiSelect`, `TagInput` and `SelectTrigger` expose an accessible name when no `label` is given — the placeholder (or the default string, new `strings.select.placeholder`). With a `label`, the control carries `aria-labelledby`. A consumer `id` / `aria-label` / `aria-labelledby` is treated as an external label and left untouched.
- `Chart` series groups get a visible keyboard focus outline (`[data-chart-series]:focus-visible` in `theme.css`; Tailwind rings do not paint on SVG `<g>`).
- New `returnFocusTo?: RefObject<HTMLElement | null>` prop on `DialogContent`, `SheetContent` and `DrawerContent` to restore focus to a given element on close (controlled overlays opened from non-focusable or tooltip-wrapped triggers); `onCloseAutoFocus` is still forwarded and wins when it calls `preventDefault()`. Type exported as `ReturnFocusRef`.
