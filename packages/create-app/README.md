# @craftzbay/create-app

Scaffold a new project preconfigured with [`@craftzbay/ui`](https://www.npmjs.com/package/@craftzbay/ui).

```bash
npm create @craftzbay/app my-app
# or
pnpm create @craftzbay/app my-app
# or
yarn create @craftzbay/app my-app
# or
bun create @craftzbay/app my-app
```

Then:

```bash
cd my-app
pnpm dev
```

## Templates

| ID               | What you get                                                           |
| ---------------- | ---------------------------------------------------------------------- |
| `vite-blank`     | Minimal Vite + React + `@craftzbay/ui` starter (Card + Input + Switch) |
| `vite-dashboard` | `AppShell` + `Dashboard` template, ready to wire data                  |

Pass `--template <id>` to skip the picker:

```bash
npm create @craftzbay/app my-app -- --template vite-dashboard
```

## Options

```
-t, --template <name>   Skip the prompt and use a known template
-y, --yes               Skip "install deps?" prompt and install
    --no-install        Skip dependency install entirely
-h, --help              Show this help
```

## Docs

- Showcase: <https://ui.craftzbay.com>
- Components: <https://ui.craftzbay.com/#components>
- Templates: <https://ui.craftzbay.com/#templates>
- Guides: <https://ui.craftzbay.com/#guides>
