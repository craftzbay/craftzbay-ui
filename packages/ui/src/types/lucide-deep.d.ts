/**
 * lucide-react 0.460 ships typings only for the package root, but `src/icons`
 * imports icons via their per-module paths (`lucide-react/dist/esm/icons/x.js`)
 * so the main barrel never enters the module graph — see src/icons/index.ts.
 * Ambient only: `src/icons` re-types every export as `LucideIcon`, so the
 * emitted declarations never reference these deep paths.
 */
declare module 'lucide-react/dist/esm/icons/*' {
  import type { LucideIcon } from 'lucide-react';
  const Icon: LucideIcon;
  export default Icon;
}
