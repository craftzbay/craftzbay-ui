# @craftzbay/site

## 0.0.8

### Patch Changes

- Updated dependencies [54feeb4]
- Updated dependencies [be63c5f]
- Updated dependencies [f5b4f96]
- Updated dependencies [2e24a19]
- Updated dependencies [d3b9167]
  - @craftzbay/ui@0.11.4

## 0.0.7

### Patch Changes

- ee08319: Admin template: the shell's `<main>` scroll pane is now `position: relative`.
  Without a containing block, the `sr-only` labels the library renders
  (`position: absolute`) resolved against the initial containing block, escaped
  both the pane's and the shell's `overflow`, and stretched the document to the
  full length of the page — the Projects table gave the preview a second
  scrollbar and a screen of dead space below the shell. `templates.spec.ts` now
  asserts that an `app` shell never scrolls the document.
- ae3964e: Opening a modal layer no longer shoves the page sideways. Radix (Select,
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

- Updated dependencies [afda339]
- Updated dependencies [ae3964e]
  - @craftzbay/ui@0.11.3

## 0.0.6

### Patch Changes

- Updated dependencies [88415b8]
  - @craftzbay/ui@0.11.2

## 0.0.5

### Patch Changes

- Updated dependencies [4a05b8f]
- Updated dependencies [ad64552]
- Updated dependencies [4d3b80f]
  - @craftzbay/ui@0.11.1

## 0.0.4

### Patch Changes

- Updated dependencies [5ff1a7b]
- Updated dependencies [f500b9c]
- Updated dependencies [c4fe1d6]
- Updated dependencies [2e5e8d4]
- Updated dependencies [5395f74]
- Updated dependencies [c4900d0]
- Updated dependencies [2227223]
- Updated dependencies [e471206]
- Updated dependencies [c4fe1d6]
  - @craftzbay/ui@0.11.0

## 0.0.3

### Patch Changes

- Updated dependencies [0ce7563]
  - @craftzbay/ui@0.10.0

## 0.0.2

### Patch Changes

- Updated dependencies
  - @craftzbay/ui@0.9.0

## 0.0.1

### Patch Changes

- Updated dependencies [16b9a77]
  - @craftzbay/ui@0.8.1
