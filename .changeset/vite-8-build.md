---
'@craftzbay/ui': patch
---

Built with Vite 8 (Rolldown + Oxc minifier). Output shape is unchanged — one ESM
module per source file, `.d.ts` beside each — and every module that uses hooks or
context still starts with `'use client'`. That directive now comes from the source
file itself instead of a build banner, so it is no longer duplicated; plain modules
(barrels, `cn`/`cva`, types) no longer carry one, which is what Next.js expects.
