---
'@craftzbay/ui': patch
---

Form controls wear a lighter edge. `--border-input` moves from `hsl(215 16% 55%)`
to `hsl(215 16% 57%)` (#808ea3): 3.32:1 on `--background` and 3.04:1 on
`--background-muted`, still clearing WCAG 1.4.11 on every surface a field sits
on — and the lightest value that does. One step further (58%) drops to 2.92:1
on a muted panel.

Buttons no longer carry a field's edge. `Button` and `IconButton` in `secondary`
and `outline` take `--border-strong` instead of `--border-input`. Understanding
1.4.11 (rewritten 2026-06-01) asks for 3:1 only where the boundary is the sole
cue for the control; a button states its own name, so its edge is not that cue —
unlike a field, a checkbox or a radio, which keep `--border-input`. Under
`prefers-contrast: more` `--border-strong` already darkens to the old value.

Measured against 16 other systems: shadcn 1.26, Bootstrap 1.30, Ant 1.41,
Mantine 1.49, MUI 1.74 sit below the threshold; Spectrum 3.19, Atlassian 3.24
and Carbon 3.32 meet it on their own ground only. The library still meets it on
every surface.
