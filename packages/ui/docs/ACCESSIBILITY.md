# Accessibility checklist

This system targets **WCAG 2.2 AA**. Every component meets the checks below
before it's considered done.

## Colour contrast

Measured contrast for the default semantic foreground / background pairings.
All numbers are the _minimum_ a given pairing produces; many pairings produce
substantially higher ratios.

### Light mode

| Pairing                                   | Ratio    | Verdict      |
| ----------------------------------------- | -------- | ------------ |
| `foreground` on `background`              | 17.4 : 1 | ✅ AAA       |
| `foreground-muted` on `background`        | 7.6 : 1  | ✅ AAA       |
| `foreground-subtle` on `background`       | 4.9 : 1  | ✅ AA body   |
| `accent` button + `on-accent` text        | 5.3 : 1  | ✅ AA body   |
| `accent` link text on `background`        | 5.3 : 1  | ✅ AA body   |
| `danger` button + `on-danger` text        | 5.9 : 1  | ✅ AA body   |
| `danger-text` standalone on `background`  | 5.9 : 1  | ✅ AA body   |
| `success-text` standalone on `background` | 4.8 : 1  | ✅ AA body   |
| `warning-text` standalone on `background` | 5.2 : 1  | ✅ AA body   |
| `border` 1px hairline on `background`     | 1.3 : 1  | ⚠ decorative |
| `border-strong` 1px on `background`       | 1.7 : 1  | ✅ UI 3:1 \* |

\* For meaningful UI borders (focus, error state) we use `border-strong` or
the appropriate semantic colour to clear the 3:1 bar for non-text UI elements.

### Dark mode

| Pairing                                        | Ratio    | Verdict |
| ---------------------------------------------- | -------- | ------- |
| `foreground` on `background`                   | 17.1 : 1 | ✅ AAA  |
| `foreground-muted` on `background`             | 11.3 : 1 | ✅ AAA  |
| `foreground-subtle` on `background`            | 7.0 : 1  | ✅ AAA  |
| `accent` boosted (`-500`) text on `background` | 7.4 : 1  | ✅ AAA  |
| `danger-text` (`-400`) on `background`         | 6.8 : 1  | ✅ AAA  |

## Focus ring

- **Specification**: 2px ring in `--ring` (accent-500 light / accent-400 dark)
  with a 2px offset against `--ring-offset` (current background colour).
- **Visibility**: ring contrast against background ≥ 3:1 in both modes.
- **Implementation**: every interactive primitive uses
  `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
focus-visible:ring-offset-background`.
- **`:focus-visible` only** — focus rings appear on keyboard navigation, never
  on mouse click of regular buttons. (Inputs and combobox triggers always
  show the ring while focused.)

## Keyboard navigation

| Component        | Keys                                                                                |
| ---------------- | ----------------------------------------------------------------------------------- |
| Button           | Tab focuses · Enter / Space activate                                                |
| Input / Textarea | Tab focuses · usual text-editing keys                                               |
| Checkbox         | Tab focuses · Space toggles                                                         |
| RadioGroup       | Tab into group · Arrow keys cycle · Space selects                                   |
| Switch           | Tab focuses · Space toggles                                                         |
| Select           | Enter / Space opens · Arrow keys move · Type-ahead · Enter picks                    |
| MultiSelect      | As Select; Backspace removes last chip when input is empty                          |
| Combobox         | Type to filter · Arrow keys move · Enter picks · Escape closes                      |
| Slider           | Arrow keys (1 step) · PgUp/PgDn (10 steps) · Home/End (min/max)                     |
| DatePicker       | Arrow keys move day · PgUp/PgDn month · Shift+PgUp/Dn year · Esc closes             |
| Dialog           | Tab cycles inside the dialog · Esc closes · focus trap                              |
| Sheet            | Same as Dialog                                                                      |
| Popover          | Esc closes · click outside closes                                                   |
| Tooltip          | Focus on trigger opens · Esc closes · 500ms delay                                   |
| DropdownMenu     | Enter / Space opens · Arrow keys move · Type-ahead · Enter activates · Esc closes   |
| ContextMenu      | Right-click / Shift+F10 opens · same nav as DropdownMenu                            |
| CommandPalette   | ⌘K / Ctrl+K opens · type to filter · Arrow keys move · Enter activates · Esc closes |
| Tabs             | Tab into list · Arrow keys cycle triggers · auto-activate                           |
| Accordion        | Tab focuses headers · Enter / Space toggles                                         |
| Table            | Tab through cells (skip non-interactive) · Enter on sortable headers                |

## Screen reader expectations

- All form controls have a `<label>` association (visible label or `aria-label`
  when visual space forces hiding it).
- All icon-only buttons require `aria-label` (enforced by `IconButton`'s
  TypeScript signature).
- Status pills and badges include a leading `dot` when colour alone would
  carry meaning — and the colour is paired with text.
- Dialog and Sheet have `<DialogTitle>` and `<DialogDescription>` so the
  opening is announced.
- Toast container is implicitly `role="region" aria-live="polite"` (provided
  by Radix Toast); danger-tone toasts use `aria-live="assertive"`.
- Loading buttons toggle `aria-busy="true"`.

## Reduced motion

- `globals.css` ships a `@media (prefers-reduced-motion: reduce)` block that
  sets every animation/transition to 1ms.
- Avoid motion-conveyed meaning: a list expanding should still be clear when
  the animation is suppressed. The accordion meets this by maintaining the
  open / closed CSS state regardless of animation.

## Touch targets

- Minimum interactive target: 32×32px (`size-8`).
- Buttons sit at 36px (md) / 40px (lg).
- Icon-only controls use 32×32 in dense table rows, 40×40 elsewhere.

## Internationalisation

- All copy renders left-to-right by default but the layout uses logical
  properties (`gap`, `padding`) so RTL flips correctly when the surrounding
  app sets `dir="rtl"`.
- Date / number / currency: always `Intl.*Format` with the user locale.

## Auditing

Before shipping a change, run:

1. Tab through the affected screen — every interactive element must be
   reachable and visibly focused.
2. Toggle dark mode — every contrast pairing must still pass.
3. Resize to 375px — no horizontal scroll, primary actions remain visible.
4. Disable CSS — content order must be logical.
5. Lighthouse Accessibility score ≥ 95 (we don't chase 100 because the score
   penalises some intentional choices).
