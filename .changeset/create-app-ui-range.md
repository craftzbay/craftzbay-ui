---
'@craftzbay/create-app': patch
---

Templates depend on `@craftzbay/ui@^0.11.3` instead of `^0.9.0`. On a 0.x library a
caret range stops at the next minor, so every scaffold quietly installed 0.9.0 while
the workspace smoke test typechecked it against the current source. The smoke test now
asserts that each template's range admits the workspace `packages/ui` version, so the
pin cannot go stale again without failing CI.
