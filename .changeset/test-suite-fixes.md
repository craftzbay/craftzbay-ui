---
'@craftzbay/ui': minor
---

Full test suite (unit + keyboard + axe per component, SSR/hydration, hooks, token contrast, public-API guards) and the defects it surfaced:

- Sidebar: collapsed items always have an accessible name (sr-only label no longer depends on the tooltip being open).
- Toast: viewport region is labelled from `strings.toast.region` (was Radix's hard-coded English).
- MultiSelect / Combobox / DatePicker: popover dialogs have an accessible name (axe `aria-dialog-name`).
- DatePicker: reopens on the selected month (`defaultMonth`).
- CommandDialog: focus returns to the previously focused element on close.
- CommandSeparator: no `role="separator"` inside the listbox.
- `formatMNT(999_999, { compact: true })` → `1M₮` (was `1,000K₮`).
- Amber preset `--ring` darkened to 3.17:1 on `background-muted` (theme.css + `brandPresets` in sync).
