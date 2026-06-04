/**
 * lucide-react 0.460 ships typings only for the package root, but we import
 * icons via their per-module paths (`lucide-react/dist/esm/icons/x.js`) so the
 * main barrel never enters the module graph. If it did, Rollup would co-locate
 * every dynamically imported icon (see <Icon name="…">) into the chunk that
 * holds the barrel, inlining the whole icon set (~900 kB) instead of
 * code-splitting it.
 */
declare module 'lucide-react/dist/esm/icons/*' {
  import type { LucideIcon } from 'lucide-react';
  const Icon: LucideIcon;
  export default Icon;
}
