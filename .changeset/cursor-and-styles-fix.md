---
'@craftzbay/ui': patch
---

Restore pointer cursor on enabled buttons and Radix triggers (Tailwind v4
preflight resets buttons to `cursor: default`), and ship the full compiled
design system in `styles.css` — previously the published file contained only
react-day-picker styles, so consumers importing `@craftzbay/ui/styles.css`
got no tokens, base layer, or utilities.
