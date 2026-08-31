# craftzbay-ui

[![npm](https://img.shields.io/npm/v/@craftzbay/ui.svg)](https://www.npmjs.com/package/@craftzbay/ui)
[![CI](https://github.com/craftzbay/craftzbay-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/craftzbay/craftzbay-ui/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/@craftzbay/ui.svg)](./LICENSE)

Monorepo for **[@craftzbay/ui](https://www.npmjs.com/package/@craftzbay/ui)** — a
refined-minimal Tailwind v4 + React design system — and its showcase site.
Live demo: **[ui.craftzbay.com](https://ui.craftzbay.com)**.

> Aesthetic direction: Linear / Vercel / Stripe Dashboard / Notion / Raycast.
> Neutral-dominant, one accent, hairline borders, generous whitespace, fast quiet motion.

## Layout

```
packages/
  ui/            @craftzbay/ui — the published component library
  create-app/    @craftzbay/create-app — `npm create @craftzbay/app`
apps/
  site/          the showcase / documentation site (not published)
```

`apps/site` consumes the library straight from `packages/ui/src` via a Vite
alias, so editing a component hot-reloads the docs instantly. Templates open in
their own browser tab, and the brand + theme switchers in the header re-theme
the whole site — including any open preview tab — live.

## Install (consumers)

```bash
pnpm add @craftzbay/ui
```

```css
@import '@craftzbay/ui/styles.css'; /* no Tailwind in your app */
/* — or, with Tailwind v4 — */
@import 'tailwindcss';
@import 'tw-animate-css'; /* required with theme.css */
@import '@craftzbay/ui/theme.css';
@source "../node_modules/@craftzbay/ui/dist-lib";
```

Add the Geist Google Fonts `<link>` (Inter is a fallback only), toggle `.dark` on `<html>` for dark mode, render `<Toaster />` once.
ESM-only, per-module output: `import { Button }` is ~8 KB gz. Name-addressed icons: `import { Icon } from '@craftzbay/ui/icon'`.
Next.js App Router: since 0.10 every module ships with a `'use client'` banner — import straight from Server Components, no re-export shim (pure utils such as `formatMNT` / `mnStrings` are client-marked too for now).
Full setup (providers, fonts, dark mode) in [`packages/ui/README.md`](./packages/ui/README.md).

## Design rules

The library implements the [craftzbay/design-research](https://github.com/craftzbay/design-research) guidelines
([rendered](https://craftzbay.github.io/design-research/)) — that repo is the source of truth
([`00-defaults.md`](https://github.com/craftzbay/design-research/blob/main/00-defaults.md) holds the canonical numbers);
[`packages/ui/docs/PHILOSOPHY.md`](./packages/ui/docs/PHILOSOPHY.md) summarises it.

## Develop

```bash
pnpm install
pnpm dev            # showcase site at localhost:5173
pnpm typecheck      # every package
pnpm test           # @craftzbay/ui component tests
pnpm lint           # eslint (typescript-eslint + react-hooks + jsx-a11y)
pnpm size           # bundle-size budgets (.size-limit.json)
pnpm build          # build the library, then the site
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the release flow and the
new-component checklist. Library usage docs live in
[`packages/ui/README.md`](./packages/ui/README.md).

MIT © craftzbay
