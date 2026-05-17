---
'@craftzbay/ui': minor
---

Brand override + test/CI infrastructure + TypeScript clean-up.

**New**
- `DesignSystemProvider` — wrap a subtree to override CSS-variable tokens
  (accent palette, radii, etc.) for multi-brand or per-section theming.
  Ships with four presets: `default`, `edgelog`, `gerege`, `forest`.
- `Illustrations` namespace export — six refined-minimal line SVGs
  (InboxEmpty, NoSearchResults, NotFound, ServerError, Construction,
  ConnectionLost) for empty / error states.
- `useSidebar()` hook (was missing from index re-export earlier).

**Fixed**
- Alert / EmptyState / ErrorState — `title` prop is now `ReactNode` cleanly
  (previously colliding with the native `title?: string` HTML attribute).
  If you were passing a non-React-node `title` HTML attribute on these,
  it must now go on a wrapping element instead.
- Textarea ref assignment under React 19's stricter `RefObject` typing.
- `use-toast` store no longer relies on `typeof self`-recursive typing,
  removing implicit `any` warnings.

**Infrastructure**
- `vitest` + `@testing-library/react` + `jest-axe` + JSDOM env wired up.
  Initial 19 tests cover Button, Input, Switch, Badge, Alert behaviour
  and a11y.
- GitHub Actions: `ci.yml` (typecheck + test + builds on every PR) and
  `release.yml` (changesets-driven publish on merge to main).
- `tw-animate-css` registered so `data-state=open` slide-in / fade-in
  transitions on Toast / Dialog / Sheet / Drawer actually run.
