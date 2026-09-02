---
'@craftzbay/ui': patch
'@craftzbay/site': patch
---

Opening a modal layer no longer shoves the page sideways. Radix (Select,
Combobox, DropdownMenu, Dialog, Sheet…) locks the page with
react-remove-scroll, which hides the page scrollbar and then pads `<body>` by
the width it just reclaimed. `theme.css` already reserves that width
permanently with `scrollbar-gutter: stable`, so the compensation double-counted
and the whole page slid across for as long as a menu was open — visible only
with classic (non-overlay) scrollbars, which is why it never showed up
headless. The base layer now refuses that padding.

Showcase alignment: the home page was on `max-w-6xl` while the top bar and
footer are `max-w-[1400px]`, so the hero started 124px right of the brand mark
above it; the docs rail added `px-4` on top of the container's `px-6`, putting
Components, Templates, Guides and every component page 16px right of the same
mark. Both now start on the site column.
