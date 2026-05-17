# @craftzbay/ui

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
