---
'@craftzbay/ui': minor
'create-craftzbay-ui': major
---

Auto-generated props tables, automated release pipeline confirmation, and a new CLI scaffolder.

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
