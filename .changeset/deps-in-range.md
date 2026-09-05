---
'@craftzbay/ui': patch
---

Dependencies moved to their current in-range releases (Radix primitives, cmdk 1.1,
tailwind-merge 2.6, react-hook-form 7.87, react-day-picker 9.14). Radix no longer sets
`displayName` on its components; the primitives this library re-exports unchanged
(`DialogTrigger`, `SheetClose`, `Tabs`, …) therefore show their function name in
DevTools instead of a display name. Nothing else observable changed.
