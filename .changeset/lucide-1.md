---
'@craftzbay/ui': major
---

Icons come from lucide-react 1.x. `Icons.Github` is gone — lucide 1.0 removed every
brand icon — and `Icons.Code` is exported in its place for "source"/"developer"
affordances. `<Icon name>` and `iconNames` follow the 1.x set (4,100+ names; the
old aliases such as `alert-circle` still resolve). Consumers that reached into
`lucide-react/dist/esm/icons/*.js` themselves must use the `.mjs` files now.
