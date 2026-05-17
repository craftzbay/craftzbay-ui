# @craftzbay/ui

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
    - **Theming** — brand-swap between default / EdgeLog / Gerege / Forest
      presets, with primitives re-rendering inside the scope.
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
