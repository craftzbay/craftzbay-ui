# @craftzbay/ui

## 0.8.1

### Patch Changes

- 16b9a77: Restore pointer cursor on enabled buttons and Radix triggers (Tailwind v4
  preflight resets buttons to `cursor: default`), and ship the full compiled
  design system in `styles.css` — previously the published file contained only
  react-day-picker styles, so consumers importing `@craftzbay/ui/styles.css`
  got no tokens, base layer, or utilities.

## 0.8.0

### Minor Changes

- 0770135: Auto-generated props tables, automated release pipeline confirmation, and a new CLI scaffolder.

  **Auto-generated props (library)**
  - New `scripts/generate-props.ts` parses every component under
    `src/components/ui/` with `react-docgen-typescript` and emits
    `src/showcase/registry/generated-props.ts` — a typed map of
    `{ componentName: PropGroup[] }`.
  - `ComponentDocPage` now falls back to the generated props when a doc file
    omits its `api: []` override. Sub-component props (CardHeader, DialogContent, …)
    surface automatically per exported name.
  - `pnpm gen:props` regenerates; `pnpm build` runs it automatically.
  - Result: the docs can no longer drift from the TypeScript interface.

  **CLI scaffolder — `create-craftzbay-ui` (0.1.0)**
  - New sibling package, published separately. Use via the standard
    `npm create` flow: `npm create craftzbay-ui my-app` (or `pnpm create
craftzbay-ui my-app`).
  - Templates: `vite-blank` (Card + Input + Switch starter) and
    `vite-dashboard` (AppShell + Dashboard, wired and ready).
  - Interactive prompts powered by `@clack/prompts`; supports
    `--template <id>`, `-y / --yes`, `--no-install`, `-h / --help`.
  - Detects the invoking package manager (pnpm / npm / yarn / bun) and
    runs the matching `install`.
  - Smoke test (`packages/create-app/scripts/smoke.mjs`) scaffolds each
    template into a temp dir and verifies file presence + token replacement.

  **Release CI confirmed**
  - The existing `.github/workflows/release.yml` uses `changesets/action@v1`
    and is operational. Adding `.changeset/*.md` to `main` opens a Release PR
    automatically; merging it publishes to npm + creates a GitHub release.
    See `CONTRIBUTING.md` for the new canonical flow. Local `npm publish`
    is now reserved for emergency hotfixes only.

  **Monorepo conversion**
  - Root is now a pnpm workspace (`pnpm-workspace.yaml` includes `.` and
    `packages/*`). Library stays as `@craftzbay/ui` at the root; the CLI
    lives at `packages/create-app/`.

## 0.7.1

### Patch Changes

- Hotfix: chunk load-order regression on hard refresh.
  - The 0.7.0 multi-vendor split (radix / cmdk / embla / vaul / day-picker /
    rhf / lucide each in own chunk) tripped Rollup's chunk-import graph in
    production, producing
    `Uncaught TypeError: Cannot read properties of undefined (reading 'useLayoutEffect')`
    on hard refresh. Several of those vendors import React indirectly, and
    the generated chunk graph evaluated them before `vendor-react` was ready.
  - Replaced with a conservative 2-chunk split: only React + its tight
    runtime deps (scheduler, jsx-runtime, use-sync-external-store) live in
    `vendor-react`; everything else stays in a single `vendor` chunk.
  - Added a `/favicon.svg` (previously 404'd) and tightened the index.html
    title + description.

## 0.7.0

### Minor Changes

- Mobile nav, real Dashboard chart, footer, migration guide, filterable templates,
  sidebar keyboard nav, vendor code-splitting, and 63 new tests.

  **Templates (library)**
  - `Dashboard` chart placeholder now renders a real `LineChart` with synthetic
    30-day data. Pass `chart` to override.

  **Showcase**
  - Mobile sidebar: a hamburger button now appears below the TopBar on screens
    < md, opening the full sidebar in a left Sheet drawer. Closes on navigation.
  - Sidebar search now supports keyboard nav: `↓ / ↑` cycle results, `↵` opens,
    `Esc` clears. Hint line shows under the input when results are visible.
  - TemplatesIndexPage: use-case chips are now clickable filters. Multi-select
    - clear button.
  - 404 page now uses the library's own `ErrorState` component for consistency.
  - New showcase Footer with brand, version, license, docs / project /
    resources columns. Hidden on `#preview/*` routes.
  - New Migration guide (`#guides/migration`) covering every prop addition
    from 0.4 → 0.6.
  - Home page version pill links to GitHub CHANGELOG.

  **Performance**
  - Showcase build now manually chunks vendor code (react, radix, lucide,
    cmdk, embla, vaul, react-day-picker, react-hook-form). First-paint
    bundle drops from ~244 KB gzip to ~95 KB (react) + ~78 KB (app code).
    No more "chunks larger than 500 KB" warning.

  **Tests**
  - 63 new tests across 8 new smoke-test files (one per component category):
    buttons, inputs, feedback, overlays, navigation, layout, data-display,
    form. Total test count: **87 passing**.
  - New jsdom polyfills: `IntersectionObserver` (Embla),
    `Element.scrollIntoView` (cmdk), `hasPointerCapture` / `releasePointerCapture`
    (Radix).

## 0.6.1

### Patch Changes

- Showcase fixes: never strand the user on a preview, sidebar search now finds
  matches across all three doc kinds.
  - `#preview/*` routes used to render full-bleed, hiding the showcase TopBar
    entirely. Templates like Dashboard rendered their own internal chrome and
    left no obvious way back to the docs. The ShowcaseTopBar is now always
    visible; preview routes get a slim "Live preview · <name>" banner with a
    "Back to template docs" link.
  - The sidebar search input only filtered the current kind's section (a user
    on the Components page could not find "Authentication" by typing "auth").
    When a query is active, the sidebar now searches across components,
    templates, and guides — grouped by kind, with a quick "Open" link to the
    matching index page.
  - Search input now uses `size="sm"` and a clear button.
  - 5 new tests cover the search + cross-kind behaviour.

## 0.6.0

### Minor Changes

- AppShell template + Illustrations defaults + live guides + global scrollbar polish.

  **AppShell**
  - `navSections`, `sidebar`, `topbarActions`, `search`, `user`, `profileMenu`,
    `notifications`, `onMarkAllNotificationsRead`, `onViewAllNotifications` are
    all configurable. The default still renders the same demo so existing call
    sites are unaffected.
  - `active` now accepts any string (was a closed union); legacy `AppShellNavKey`
    alias retained for typed callers.
  - `Dashboard` accepts `stats`, `chart`, `chartTitle`, `chartDescription`,
    `activity`, `activityTitle`, `headerActions` — defaults match the demo.

  **EmptyState / ErrorState**
  - `EmptyState` adds `illustration` prop. With no `icon` or `illustration` it
    renders the built-in `InboxEmpty` line illustration as a default hero —
    previously empty.
  - `ErrorState` swaps its default Lucide icon for the matching line
    illustration per variant (NotFound / ServerError / ConnectionLost). New
    `illustration` prop lets consumers override.

  **Showcase**
  - Guides now embed live interactive demos:
    - **Theming** — swap between the built-in accent presets, with primitives
      re-rendering inside the scope.
    - **Forms** — working react-hook-form sign-in form with validation + Switch.
    - **Dark mode** — live theme-toggle button bound to `<html>.dark`.
    - **Responsive** — live breakpoint indicator using `useMediaQuery`.
  - Sidebar — removed redundant section title (top-link already conveys
    context); group sub-headers (Buttons, Inputs, …) retained.
  - Global subtle scrollbars (thin, transparent track, visible only on hover
    of the scroll container) replace platform-default chrome.

## 0.5.0

### Minor Changes

- Real docs system + parameterized page templates.

  **Docs (consumer-facing showcase)**
  - 51 per-component doc pages (`#components/<slug>`) with description,
    import, multiple example variants, full props table, accessibility
    notes, and related-component links.
  - 11 template doc pages (`#templates/<slug>`) with usage code, API
    reference, and live full-bleed preview links.
  - 6 long-form guides (Quick start, Theming, Accessibility, Forms,
    Dark mode, Responsive).
  - New sidebar nav with filterable search; ⌘K command palette now jumps
    across all components, templates, and guides.

  **Patterns → real templates (library API)**
  Previously most patterns rendered hard-coded demo content. These now
  accept data and render through it. All props are optional with defaults
  matching the old demo content, so existing call sites are unaffected.
  - `SettingsPage` — `sections: SettingsSection[]` (id, label, icon?, render)
  - `RecordDetail` — `header`, `tabs`, `sidePanel`
  - `Pricing` — `tiers: PricingTier[]`, `title`, `subtitle`
  - `Onboarding<T>` — `steps: OnboardingStep<T>[]`, `initialData`, `onComplete`,
    with shared step context (next / prev / data / setData)
  - `FirstRunEmpty` — `heroIcon`, `title`, `description`, `primaryAction`, `steps`
  - `DataTablePage<T>` — generic over the row type, with `columns`,
    `filters: DataTableFilter[]`, `bulkActions: DataTableBulkAction<T>[]`,
    and an optional custom `predicate`.

  **Bundle**
  - `vaul` (Drawer) and `embla-carousel-react` (Carousel) remain externalized,
    keeping `dist-lib/index.js` at ~33 KB gzipped.

  **Other**
  - `AtSign` and `Package` added to the curated icons barrel.
