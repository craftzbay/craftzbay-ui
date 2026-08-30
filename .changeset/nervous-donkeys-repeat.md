---
'@craftzbay/ui': patch
---

Input: `type="search"` no longer shows two clear buttons. The native WebKit
search cancel button is suppressed so only the `clearable` button renders.

TopNav: the `search` slot keeps a fixed position from `md` up. The bar now
lays out as three tracks, so a wider logo slot (breadcrumbs that change per
page) no longer shifts the search box sideways on navigation.
