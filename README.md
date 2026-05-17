# @craftzbay/ui

A refined-minimal Tailwind v4 + React design system. Production-grade
primitives — Button through DataGrid — plus composed patterns
(authentication, app shell, settings, etc.).

- **Showcase:** [design.runestonetechnologies.com](https://design.runestonetechnologies.com)
- **Components catalog:** [design.runestonetechnologies.com#catalog](https://design.runestonetechnologies.com#catalog)
- **Docs:** [design.runestonetechnologies.com#docs](https://design.runestonetechnologies.com#docs)

> **Aesthetic direction:** Linear / Vercel / Stripe Dashboard / Notion / Raycast.
> Neutral-dominant, one accent, hairline borders, generous whitespace, fast quiet
> motion. See [`docs/PHILOSOPHY.md`](./docs/PHILOSOPHY.md).

## Install

```bash
pnpm add @craftzbay/ui
```

```tsx
import { Button, Dialog, Toast } from '@craftzbay/ui';
import '@craftzbay/ui/styles.css';

export function App() {
  return <Button variant="primary">Save</Button>;
}
```

Peer dependencies: `react@>=18`, `react-dom@>=18`.

## Local development

```bash
pnpm install
pnpm dev           # Vite showcase at localhost:5173
pnpm build:lib     # Build library → dist-lib/
```

## Tech stack

- **Tailwind CSS v4** — tokens defined in `@theme` in `src/styles/globals.css`
- **React 18** + **TypeScript 5.7**
- **Radix UI** primitives for accessibility-correct overlays
- **class-variance-authority** + `cn()` (`clsx` + `tailwind-merge`)
- **Lucide** icons (16 / 20px, 1.5 stroke)
- **Geist** sans + **Geist Mono** monospace

## Project structure

```
src/
├── styles/
│   └── globals.css           # @theme tokens, semantic vars, base layer
├── lib/
│   ├── utils.ts              # cn() + uid()
│   └── cva.ts
├── components/
│   ├── ui/                   # primitives — 40 components
│   └── patterns/             # composed layouts
├── hooks/
│   ├── use-toast.ts
│   └── use-media-query.ts
└── icons/                    # curated Lucide re-exports
docs/
├── PHILOSOPHY.md             # the 6 refined-minimal principles
├── VOICE.md                  # content + tone of voice
└── ACCESSIBILITY.md          # WCAG checklist + contrast ratios
```

## Component index

### Inputs
- [Input](./src/components/ui/Input.tsx) — text / email / password / number / search with prefix, suffix, error
- [Textarea](./src/components/ui/Textarea.tsx) — auto-resize multi-line input
- [Select](./src/components/ui/Select.tsx) — single-choice menu (Radix)
- [MultiSelect](./src/components/ui/MultiSelect.tsx) — chip-based multi-choice picker
- [Combobox](./src/components/ui/Combobox.tsx) — searchable single-select, sync or async
- [Checkbox](./src/components/ui/Checkbox.tsx) — including indeterminate
- [RadioGroup](./src/components/ui/RadioGroup.tsx) — mutually-exclusive choices
- [Switch](./src/components/ui/Switch.tsx) — instant-apply binary toggle
- [Slider](./src/components/ui/Slider.tsx) — single + range
- [DatePicker](./src/components/ui/DatePicker.tsx) — single + range
- [Form primitives](./src/components/ui/Form.tsx) — react-hook-form bindings

### Buttons
- [Button](./src/components/ui/Button.tsx) — primary · secondary · outline · ghost · destructive · link
- [IconButton](./src/components/ui/IconButton.tsx) — square icon-only variant
- [Pagination](./src/components/ui/Pagination.tsx) — numbered + jumps + page-size

### Feedback
- [Alert](./src/components/ui/Alert.tsx) — inline banner, dismissible
- [Toast](./src/components/ui/Toast.tsx) + `useToast` hook
- [Spinner](./src/components/ui/Spinner.tsx) — accent / neutral / on-accent tones
- [Progress](./src/components/ui/Progress.tsx) — linear + circular, determinate + indeterminate
- [Skeleton](./src/components/ui/Skeleton.tsx) — text, avatar, card variants
- [EmptyState](./src/components/ui/EmptyState.tsx)
- [ErrorState](./src/components/ui/ErrorState.tsx) — 404 / 500 / generic

### Navigation
- [TopNav](./src/components/ui/TopNav.tsx) + `TopNavLink`
- [Sidebar](./src/components/ui/Sidebar.tsx) + `SidebarSection` + `SidebarItem` + `SidebarGroup`
- [Breadcrumbs](./src/components/ui/Breadcrumbs.tsx) — with overflow ellipsis
- [Tabs](./src/components/ui/Tabs.tsx) — underline + pills variants
- [Stepper](./src/components/ui/Stepper.tsx) — horizontal + vertical

### Layout
- [Card](./src/components/ui/Card.tsx) + `CardHeader/Title/Description/Content/Footer`
- [Separator](./src/components/ui/Separator.tsx)
- [ScrollArea](./src/components/ui/ScrollArea.tsx) — Radix-backed styled scroll
- [Accordion](./src/components/ui/Accordion.tsx) — single + multiple

### Overlays
- [Dialog](./src/components/ui/Dialog.tsx) + `ConfirmationDialog`
- [Sheet](./src/components/ui/Sheet.tsx) — left / right / top / bottom
- [Popover](./src/components/ui/Popover.tsx)
- [Tooltip](./src/components/ui/Tooltip.tsx) — 500ms delay default
- [DropdownMenu](./src/components/ui/DropdownMenu.tsx) — submenus, separators, kbd
- [ContextMenu](./src/components/ui/ContextMenu.tsx) — right-click menu
- [CommandPalette](./src/components/ui/CommandPalette.tsx) — ⌘K palette

### Data display
- [Table](./src/components/ui/Table.tsx) + `TableSortHeader`
- [DataGrid](./src/components/ui/DataGrid.tsx) — column visibility, filter, sortable
- [Badge](./src/components/ui/Badge.tsx) — subtle + outline, 6 tones
- [Avatar](./src/components/ui/Avatar.tsx) + `AvatarGroup`

### Typography
- [Kbd](./src/components/ui/Kbd.tsx) — keyboard shortcut indicator

## Patterns (composed layouts)

- [Authentication](./src/components/patterns/Authentication.tsx) — sign-in, sign-up, forgot, magic-link
- [AppShell + Dashboard](./src/components/patterns/AppShell.tsx) — sidebar + topnav shell, 4 stat cards + chart + activity table
- [Settings](./src/components/patterns/Settings.tsx) — sub-nav + 5 sections
- [DataTablePage](./src/components/patterns/DataTablePage.tsx) — filter / search / bulk actions / pagination
- [RecordDetail](./src/components/patterns/RecordDetail.tsx) — header + tabs + side panel
- [Onboarding](./src/components/patterns/Onboarding.tsx) — 4-step stepper flow
- [Pricing](./src/components/patterns/Pricing.tsx) — 3-tier comparison
- [FirstRunEmpty](./src/components/patterns/FirstRunEmpty.tsx) — hero + 3 next-step cards

## Documentation

- [`docs/PHILOSOPHY.md`](./docs/PHILOSOPHY.md) — the six principles + forbidden list
- [`docs/VOICE.md`](./docs/VOICE.md) — tone of voice, button labels, error copy formula
- [`docs/ACCESSIBILITY.md`](./docs/ACCESSIBILITY.md) — WCAG AA contrast table, keyboard map

## Contributing

1. Read [`docs/PHILOSOPHY.md`](./docs/PHILOSOPHY.md) first — the forbidden list is
   non-negotiable.
2. Components reference semantic tokens (`bg-card`, `text-accent`), never raw
   palette steps (`bg-indigo-500`).
3. Every interactive element ships with: default, hover, focus-visible, active,
   disabled, loading, and (where applicable) error / success states.
4. Forward refs correctly; set `displayName`.
5. Run `pnpm typecheck && pnpm lint` before opening a PR.
