---
'@craftzbay/ui': minor
---

Canon alignment, round 3.

- `Dialog`: modal radius `rounded-xl` (12px).
- `DataGrid`: default cell renders `—` with `aria-label` (`strings.dataGrid.emptyCell`, en/mn) for `null` / `undefined` / `''`.
- `useToast`: per-variant default duration — success/info/default 4000ms, warning 6000ms, danger 0 (persistent, manual close); explicit `duration` still wins. New `TOAST_DURATIONS` export. Toast viewport uses `max-h-dvh`.
- `Skeleton`: default `delay` is now 300ms (pass `delay={0}` for immediate render); new `minVisible` (500ms). `useDelayedLoading(ms, { minVisible })` holds `true` for at least `minVisible` once shown.
- `theme.css`: `html { scrollbar-gutter: stable }`.
- `ErrorState`: new `variant="403"` (permission denied) with `Locked` illustration and en/mn strings; pair with an `action` (back/home) — no retry.
- `formatPhone(input)` → `+976 XXXX XXXX` for 8-digit Mongolian numbers (accepts `+976…`/`976…`/spaced; non-MN returned as-is); `parsePhoneMN()` → E.164. `formatMNT(n, { compact: true })` → `12.4M₮` / `850K₮`.
- New hooks `useDebounce(value, delay = 300)` and `useDebouncedCallback(fn, delay = 300)`.
- `IconButton` sizes now match Button heights: sm 32 / md 36 / lg 40 / new xl 44 (was 28/32/40).
- `Calendar` / `DatePicker`: week starts on Monday by default (`weekStartsOn={1}`); popover shadow `shadow-md`.
- `Sidebar` section labels: sentence case (removed forced `uppercase`).
- `Chart` Y axis padding uses the spacing scale (`py-1.5`).
