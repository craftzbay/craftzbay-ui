---
'@craftzbay/ui': minor
'@craftzbay/create-app': patch
---

Audit pass against design-research rules (2026-08-20).

**Breaking (0.x minor):**
- ESM-only output; CJS (`index.cjs`) removed. Per-module output (`preserveModules`) — importing `{ Button }` now costs ~9 kB gz instead of the whole library.
- `Icon`, `iconNames`, `IconName` moved to the `@craftzbay/ui/icon` subpath (the 1.4k-icon dynamic map is opt-in).
- `uid()` helper removed from the public surface.
- Global `:focus-visible { outline: none }` replaced by a visible default ring; `TableHead` is no longer uppercase by default (`uppercase` prop); `ErrorState` no longer sets `role="alert"`; `Alert` uses `role="status"` except `danger`.
- Dark-mode accent moved to accent-400 (contrast 3.6 → 5.4:1); light `--success-solid` darkened.

**Added:**
- `@craftzbay/ui/theme.css` — tokens + base layer for Tailwind v4 consumers (`@import "tailwindcss"; @import "tw-animate-css"; @import "@craftzbay/ui/theme.css";` + `@source`).
- Every module ships `'use client'` — works from Next.js App Router server components.
- Semantic tokens: `--border-input`, `--overlay`, `--tooltip(-foreground)`, `--accent-hover/active`, `--danger-hover/active`, `--surface-hover/active`, `--switch-track-off/thumb`, `--on-success/warning/danger/info` (mode-aware), `--chart-1..6`.
- i18n: `DesignSystemProvider strings={…}`, `useStrings()`, `defaultStrings`, `mnStrings` (Mongolian built in). `Pagination labels` prop.
- `useFieldIds` hook; `Tree` controlled `expanded`/`selected`; `Combobox selectedLabel`; `DatePicker formatDate`/`locale`/`disabledDays`; `Chart aria-label`/`title`/`showAxis`/`series`/`colors`; `TagInput label/description/error`; `FileUpload onReject`; `Card variant="interactive"` keyboard-operable; `TableRow aria-selected`.

**Fixed:**
- MultiSelect and Tree keyboard navigation (APG-conformant); Combobox nested-interactive clear button; Form → Input error styling; DatePicker `fromDate/toDate` now disable days; Chart accessible name + axis ticks, gradient removed; Sidebar collapsed items keep an accessible name; Pagination label association; Input password toggle keyboard-reachable, `clearable` uncontrolled; 16px inputs below `md` (no iOS zoom); `color-scheme` per theme class; `scroll-behavior` typo; `overflow-wrap: anywhere` + `font-synthesis: none` on body; Popover `min-w`; sub-12px text removed.
- create-app: `vite-dashboard` template imported non-existent `AppShell`/`Dashboard`; smoke test now typechecks the scaffold; Geist `<link>` added to templates.
