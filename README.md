# craftzbay-ui

Monorepo for **[@craftzbay/ui](https://www.npmjs.com/package/@craftzbay/ui)** — a
refined-minimal Tailwind v4 + React design system — and its showcase site.

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

## Develop

```bash
pnpm install
pnpm dev            # showcase site at localhost:5173
pnpm typecheck      # every package
pnpm test           # @craftzbay/ui component tests
pnpm build          # build the library, then the site
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the release flow and the
new-component checklist. Library usage docs live in
[`packages/ui/README.md`](./packages/ui/README.md).

MIT © craftzbay
