---
'@craftzbay/ui': patch
---

`DropdownMenuItem` / `ContextMenuItem` (and their sub-trigger, checkbox and radio
variants) now size a leading icon passed as a child to 16px, the way `Button`,
`Sidebar` and `CommandPalette` already do. Before, a bare `<Icons.LogOut />`
inside an item rendered at lucide's 24px default. An explicit `size-*` class on
the svg still wins, so existing `className="size-4"` (or `size-3.5`) workarounds
keep rendering exactly as they did.
