---
'@craftzbay/ui': minor
---

Docs site + bundle slimming.

**New**
- 6-page MDX docs site lives inside Storybook under a top-level `Docs/`
  group: Introduction, Quick start, Theming, Patterns, Accessibility, FAQ.
  Visible at the top of the Storybook sidebar.

**Bundle**
- `vaul` (Drawer) and `embla-carousel-react` (Carousel) are now external
  to the library bundle. They stay in `dependencies` so `pnpm add
  @craftzbay/ui` still installs them transitively — they just don't end
  up duplicated in your application bundle.
- Result: **`dist-lib/index.js` is now 142 KB / 33 KB gzipped** (down
  from 191 KB / 50 KB — a 35% gzipped reduction). The library now
  weighs about the same as `react-day-picker` alone.
