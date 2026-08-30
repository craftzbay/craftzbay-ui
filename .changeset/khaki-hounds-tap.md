---
'@craftzbay/ui': patch
---

Input: the inner `<input>` now stretches to the field's height, so the
focusable target is the full 32/36/40px control instead of the ~20px text box.
Below 24px axe's `target-size` rule only passes while nothing sits close by,
which broke as soon as the field was packed into a toolbar.
