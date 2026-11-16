---
'@craftzbay/ui': minor
---

Dialog and Sheet: add `DialogBody` and `SheetBody`, a scrolling region between the header and footer, so the header and footer stay pinned when the content is long. Dialog and Sheet content is now bounded to the viewport height (`overflow-y-auto` as a fallback for content without a body). `DialogContent` switches to a column layout only when a `DialogBody` is a direct child; dialogs without one keep their layout. `DialogHeader`, `DialogFooter`, `SheetHeader` and `SheetFooter` no longer shrink. The close (×) button is unchanged: it stays pinned when a body component is used, and scrolls with the content otherwise.
