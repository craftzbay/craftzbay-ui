---
'@craftzbay/ui': patch
---

`cn()` merges with tailwind-merge 3, the release that knows Tailwind v4's utilities.
On 2.x a v4-only class in an override (`rounded-xs`, `shadow-xs`, `outline-hidden`,
`ring-3`, `inset-ring-*`) was not recognised as a conflict, so both classes survived
and the stylesheet order decided. The upgrade costs about 1.5 kB (brotli) on the
first component you import; the `import { Button }` size budget moves from 10 to 11 kB
to record that.
