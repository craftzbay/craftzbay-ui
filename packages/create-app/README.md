# create-craftzbay-ui

Scaffold a new project preconfigured with [`@craftzbay/ui`](https://www.npmjs.com/package/@craftzbay/ui).

```bash
npm create craftzbay-ui my-app
# or
pnpm create craftzbay-ui my-app
# or
yarn create craftzbay-ui my-app
# or
bun create craftzbay-ui my-app
```

Then:

```bash
cd my-app
pnpm dev
```

## Templates

| ID                | What you get                                                          |
| ----------------- | --------------------------------------------------------------------- |
| `vite-blank`      | Minimal Vite + React + `@craftzbay/ui` starter (Card + Input + Switch) |
| `vite-dashboard`  | `AppShell` + `Dashboard` template, ready to wire data                 |

Pass `--template <id>` to skip the picker:

```bash
npm create craftzbay-ui my-app -- --template vite-dashboard
```

## Options

```
-t, --template <name>   Skip the prompt and use a known template
-h, --help              Show this help
```

## Docs

- Showcase: <https://design.runestonetechnologies.com>
- Components: <https://design.runestonetechnologies.com/#components>
- Templates: <https://design.runestonetechnologies.com/#templates>
- Guides: <https://design.runestonetechnologies.com/#guides>
