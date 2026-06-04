/**
 * Curated re-exports from lucide-react. Components should import icons from
 * here, never directly from 'lucide-react', so the design system can swap
 * icon sets later if needed and so unused icons stay tree-shakable.
 *
 * Icons are imported via their per-module paths (not the package barrel) on
 * purpose: <Icon name="…"> lazy-loads arbitrary icons through
 * lucide-react/dynamicIconImports, and if the barrel were in the static module
 * graph, Rollup would co-locate every dynamically imported icon into the
 * barrel's chunk — inlining the entire icon set instead of code-splitting it.
 * (Type-only imports from 'lucide-react' are fine — they erase at build time.)
 *
 * Defaults applied at the call site:
 *   - 16px for inline-with-text usage
 *   - 20px for use inside buttons
 *   - strokeWidth 1.5
 */
export { default as AlertCircle } from 'lucide-react/dist/esm/icons/alert-circle.js';
export { default as AlertTriangle } from 'lucide-react/dist/esm/icons/alert-triangle.js';
export { default as ArrowDown } from 'lucide-react/dist/esm/icons/arrow-down.js';
export { default as ArrowLeft } from 'lucide-react/dist/esm/icons/arrow-left.js';
export { default as ArrowRight } from 'lucide-react/dist/esm/icons/arrow-right.js';
export { default as ArrowUp } from 'lucide-react/dist/esm/icons/arrow-up.js';
export { default as ArrowUpDown } from 'lucide-react/dist/esm/icons/arrow-up-down.js';
export { default as AtSign } from 'lucide-react/dist/esm/icons/at-sign.js';
export { default as BarChart3 } from 'lucide-react/dist/esm/icons/bar-chart-3.js';
export { default as Bell } from 'lucide-react/dist/esm/icons/bell.js';
export { default as Bookmark } from 'lucide-react/dist/esm/icons/bookmark.js';
export { default as Calendar } from 'lucide-react/dist/esm/icons/calendar.js';
export { default as Check } from 'lucide-react/dist/esm/icons/check.js';
export { default as CheckCircle2 } from 'lucide-react/dist/esm/icons/check-circle-2.js';
export { default as ChevronDown } from 'lucide-react/dist/esm/icons/chevron-down.js';
export { default as ChevronLeft } from 'lucide-react/dist/esm/icons/chevron-left.js';
export { default as ChevronRight } from 'lucide-react/dist/esm/icons/chevron-right.js';
export { default as ChevronUp } from 'lucide-react/dist/esm/icons/chevron-up.js';
export { default as ChevronsLeft } from 'lucide-react/dist/esm/icons/chevrons-left.js';
export { default as ChevronsRight } from 'lucide-react/dist/esm/icons/chevrons-right.js';
export { default as ChevronsUpDown } from 'lucide-react/dist/esm/icons/chevrons-up-down.js';
export { default as Circle } from 'lucide-react/dist/esm/icons/circle.js';
export { default as Copy } from 'lucide-react/dist/esm/icons/copy.js';
export { default as CornerDownLeft } from 'lucide-react/dist/esm/icons/corner-down-left.js';
export { default as CreditCard } from 'lucide-react/dist/esm/icons/credit-card.js';
export { default as Download } from 'lucide-react/dist/esm/icons/download.js';
export { default as Edit2 } from 'lucide-react/dist/esm/icons/edit-2.js';
export { default as Ellipsis } from 'lucide-react/dist/esm/icons/ellipsis.js';
export { default as ExternalLink } from 'lucide-react/dist/esm/icons/external-link.js';
export { default as Eye } from 'lucide-react/dist/esm/icons/eye.js';
export { default as EyeOff } from 'lucide-react/dist/esm/icons/eye-off.js';
export { default as File } from 'lucide-react/dist/esm/icons/file.js';
export { default as FileText } from 'lucide-react/dist/esm/icons/file-text.js';
export { default as Filter } from 'lucide-react/dist/esm/icons/filter.js';
export { default as Folder } from 'lucide-react/dist/esm/icons/folder.js';
export { default as FolderOpen } from 'lucide-react/dist/esm/icons/folder-open.js';
export { default as Github } from 'lucide-react/dist/esm/icons/github.js';
export { default as GripVertical } from 'lucide-react/dist/esm/icons/grip-vertical.js';
export { default as Heart } from 'lucide-react/dist/esm/icons/heart.js';
export { default as HelpCircle } from 'lucide-react/dist/esm/icons/help-circle.js';
export { default as Home } from 'lucide-react/dist/esm/icons/home.js';
export { default as Inbox } from 'lucide-react/dist/esm/icons/inbox.js';
export { default as Info } from 'lucide-react/dist/esm/icons/info.js';
export { default as LayoutGrid } from 'lucide-react/dist/esm/icons/layout-grid.js';
export { default as Link2 } from 'lucide-react/dist/esm/icons/link-2.js';
export { default as Loader2 } from 'lucide-react/dist/esm/icons/loader-2.js';
export { default as Lock } from 'lucide-react/dist/esm/icons/lock.js';
export { default as LogOut } from 'lucide-react/dist/esm/icons/log-out.js';
export { default as Mail } from 'lucide-react/dist/esm/icons/mail.js';
export { default as Menu } from 'lucide-react/dist/esm/icons/menu.js';
export { default as Minus } from 'lucide-react/dist/esm/icons/minus.js';
export { default as Moon } from 'lucide-react/dist/esm/icons/moon.js';
export { default as MoreHorizontal } from 'lucide-react/dist/esm/icons/more-horizontal.js';
export { default as Package } from 'lucide-react/dist/esm/icons/package.js';
export { default as Pencil } from 'lucide-react/dist/esm/icons/pencil.js';
export { default as Plug } from 'lucide-react/dist/esm/icons/plug.js';
export { default as Plus } from 'lucide-react/dist/esm/icons/plus.js';
export { default as Search } from 'lucide-react/dist/esm/icons/search.js';
export { default as Settings } from 'lucide-react/dist/esm/icons/settings.js';
export { default as ShoppingCart } from 'lucide-react/dist/esm/icons/shopping-cart.js';
export { default as Sparkles } from 'lucide-react/dist/esm/icons/sparkles.js';
export { default as Star } from 'lucide-react/dist/esm/icons/star.js';
export { default as Sun } from 'lucide-react/dist/esm/icons/sun.js';
export { default as Trash2 } from 'lucide-react/dist/esm/icons/trash-2.js';
export { default as Upload } from 'lucide-react/dist/esm/icons/upload.js';
export { default as User } from 'lucide-react/dist/esm/icons/user.js';
export { default as Users } from 'lucide-react/dist/esm/icons/users.js';
export { default as X } from 'lucide-react/dist/esm/icons/x.js';
export { default as XCircle } from 'lucide-react/dist/esm/icons/x-circle.js';
export { default as Zap } from 'lucide-react/dist/esm/icons/zap.js';

export type { LucideIcon, LucideProps } from 'lucide-react';
