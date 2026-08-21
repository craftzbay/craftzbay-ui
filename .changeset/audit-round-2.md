---
'@craftzbay/ui': minor
---

Audit round 2 — a11y, hydration, contrast and API consistency.

**Fixes**

- Calendar: selected/range days styled from tokens (RDP 9 `<td>` selector); `react-day-picker/style.css` side-effect import removed; RDP labels come from `useStrings` (mn included).
- `brandPresets` / `DesignSystemProvider tokens`: `{ light, dark }` pairs — soft accent backgrounds no longer wash out in dark mode.
- Hydration-safe: `useMediaQuery` (`useSyncExternalStore`), `useToast` (no module singleton shared across SSR requests), `DatePicker` default format `yyyy-MM-dd` / `locale.code`.
- Toast: `duration: 0` keeps the toast open; `push` with an existing `id` updates in place; persistent toasts are never evicted by the 3-toast cap.
- Drawer: `direction` is passed to vaul (drag physics follow it), close button, `dvh`.
- Consumer `aria-label` / `aria-describedby` are merged, never overwritten (Input, Textarea, Checkbox, RadioGroup, Switch, Breadcrumbs, Sidebar, Stepper, Carousel). `hideLabel` hides only the label, not the description.
- Combobox: filters by label (`keywords`), empty state renders for non-matching queries, `aria-controls` points at the real list, `loadOptions` rejection → error text.
- Slider uncontrolled `showValue`; RadioGroup forwards `orientation`; Input `value={null}` handled; Textarea autoResize respects `minRows` + ResizeObserver; FileUpload drag flicker + duplicate keys; CommandPalette shortcut hook toggles without re-render; ConfirmationDialog awaits `onConfirm`.
- Chart: one tab stop per series with arrow-key roving (was one per point), measured width (no `preserveAspectRatio="none"` distortion), negative bars, i18n `labels`.
- Table / DataGrid: `aria-sort` only on the active column, `aria-selected` only with `role="row"` (plain rows use `data-state="selected"`), `align` on cells, sticky header via `containerClassName`/`maxHeight`, min one visible column, Date cells formatted; Pagination zero state; Progress clamps to `[0, max]`.
- Contrast: `--border-input` and `--switch-track-off` ≥ 3:1 against both `background` and `background-muted` in light and dark. `prefers-contrast: more`, `forced-colors`, `prefers-reduced-transparency` handled in `theme.css`; scrollbar thumb always visible; reduced-motion keeps a slow opacity pulse for Spinner/indeterminate Progress.

**Additions**

- Button `size="xl"` (44px). Badge `icon`. `TableCell`/`TableHead` `align`. `headingLevel` on Alert/EmptyState/ErrorState. `asChild` on Card, SidebarItem, TopNavLink. Controlled `open` on Alert and SidebarGroup; controlled `columnVisibility` on DataGrid. New string keys (`drawer`, `calendar`, `topNav`, `stepper.*`, `breadcrumbs.collapsed`, `chart.summary/point/seriesNav`, `fileUpload.*`) with Mongolian translations. `mergeStrings` is a deep merge.

**Behaviour changes (minor, 0.x)**

- Button/IconButton `loading` no longer sets `disabled`; it uses `aria-disabled` + `aria-busy` and keeps focus. With `asChild` no spinner is rendered.
- `Alert` is not a live region unless `live`; its title is an `h3` by default (`headingLevel`).
- `FormError` is plain text referenced via `aria-describedby`; the form renders one `role="status"` live region. Field-level `role="alert"` removed.
- `FormControl` no longer injects `tone`; fields style from `aria-invalid`. `tone` on Input/Select is **deprecated** and will be removed in the next major.
- `useFieldIds` helper id suffix `-helper` → `-desc`. `Card` padding is 16px / 24px (md+). `--text-md` token removed (unused). `.line-clamp-*` utilities removed — use Tailwind's built-ins.
