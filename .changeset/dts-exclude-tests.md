---
'@craftzbay/ui': patch
---

The published tarball no longer carries `dist-lib/__tests__/helpers/*.d.ts`. The
declaration build excluded `*.test.tsx` but not the `__tests__/` helpers, so their
Node-only stubs shipped with every release and the build logged three TS2307 errors
for `node:fs`/`node:path`/`node:url` on the way.
