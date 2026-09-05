# Showcase E2E (Playwright)

```sh
pnpm --filter @craftzbay/site build      # preview serves dist/
pnpm test:e2e                            # root alias; starts `vite preview --port 4173`
pnpm --filter @craftzbay/site test:e2e docs       # one spec
pnpm --filter @craftzbay/site exec playwright show-report
```

Specs are data-driven from `e2e/routes.ts` (mirrors `src/showcase/routing.ts`,
`registry/components.ts`, `registry/guides.tsx`, `blocks/meta.ts`,
`blocks/admin/data.ts`). `docs.spec.ts` cross-checks the slug lists against the
live index pages, so a new component/guide fails until added here.

| Spec                         | Scope                                                                 |
| ---------------------------- | --------------------------------------------------------------------- |
| `docs.spec.ts`               | every docs page × 1280/375 × light/dark: h1, errors, overflow, axe    |
| `templates.spec.ts`          | every template screen / admin layout+page × 4 viewports × 2 themes    |
| `admin-interactions.spec.ts` | Projects page behaviour, demo states, density, theme, layouts, drawer |
| `templates-flows.spec.ts`    | auth validation, deep links, legacy redirects, mobile sheets, ⌘K      |
| `visual.spec.ts`             | screenshot baselines (home / admin overview / landing)                |

Failures are also appended to `test-results/findings.jsonl` (kind, URL,
viewport, theme, axe nodes) — `FINDINGS.md` is the curated summary. Its
"Current state" table is generated: `pnpm test:e2e` wraps `playwright test`
and rewrites the block from `test-results/report.json` after a full local run
(`pnpm e2e:findings` re-renders it from the last report; CI, sharded and
filtered runs leave it alone).

## Visual baselines

Rasterisation differs per OS, so baselines are stored per platform
(`__screenshots__/chromium-<platform>/…`): the darwin set is generated locally,
the linux set by the "Visual baselines (Linux)" workflow (`workflow_dispatch`),
which runs `--update-snapshots` on the CI runner image and opens a PR with the
PNGs. CI compares against the linux set (`CI_VISUAL=1` in `ci.yml`); when a
change legitimately alters a baseline render, run that workflow and review the
PNG diffs in its PR — never regenerate to hide a regression.
