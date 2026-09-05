---
'@craftzbay/ui': major
---

**1.0.0.** The public surface of 0.11 is the 1.0 surface: every export, prop and CSS
token stays as it was. What 1.0 changes is the promise — from here on a breaking
change means a major, and everything below is what this release itself breaks:

- `Icons.Github` is removed (lucide 1.0 dropped brand icons); `Icons.Code` is new.
- Consumers importing `lucide-react/dist/esm/icons/*.js` directly must switch to
  `.mjs`.

Baseline: React 18 or 19 (the workspace now develops on 19 and tests 18 in CI),
Tailwind CSS v4, TypeScript 5.7+. Built with Vite 8; declarations ship without
test helpers; `'use client'` sits exactly on the modules that need it.
