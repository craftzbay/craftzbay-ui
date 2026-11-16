---
'@craftzbay/ui': minor
---

Dialog and Sheet: bound the content to the viewport height and add `DialogBody` / `SheetBody`, a scrolling region between the header and footer, so the header and footer stay pinned when the content is long. `DialogHeader`, `DialogFooter`, `SheetHeader` and `SheetFooter` no longer shrink. The close (×) button is now pinned with CSS (sticky, same position and DOM order), so it no longer scrolls away when the content overflows without a body region.
