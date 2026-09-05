/**
 * Curated re-exports from lucide-react. Components should import icons from
 * here, never directly from 'lucide-react', so the design system can swap
 * icon sets later if needed and so unused icons stay tree-shakable.
 *
 * Icons are imported via their per-module paths (not the package barrel) on
 * purpose: the `@craftzbay/ui/icon` entry lazy-loads arbitrary icons through
 * lucide-react/dynamicIconImports, and if the barrel were in the static module
 * graph, Rollup would co-locate every dynamically imported icon into the
 * barrel's chunk — inlining the entire icon set instead of code-splitting it
 * (verified: the showcase vendor chunk goes 614 kB → 1.4 MB). The deep paths
 * are typed by `src/types/lucide-deep.d.ts`; each export is re-typed as
 * `LucideIcon` below so the emitted declarations only reference the package
 * root.
 *
 * Defaults applied at the call site:
 *   - 16px for inline-with-text usage
 *   - 20px for use inside buttons
 *   - strokeWidth 1.5
 */
import type { LucideIcon } from 'lucide-react';

import _AlertCircle from 'lucide-react/dist/esm/icons/alert-circle.mjs';
import _AlertTriangle from 'lucide-react/dist/esm/icons/alert-triangle.mjs';
import _ArrowDown from 'lucide-react/dist/esm/icons/arrow-down.mjs';
import _ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left.mjs';
import _ArrowRight from 'lucide-react/dist/esm/icons/arrow-right.mjs';
import _ArrowUp from 'lucide-react/dist/esm/icons/arrow-up.mjs';
import _ArrowUpDown from 'lucide-react/dist/esm/icons/arrow-up-down.mjs';
import _AtSign from 'lucide-react/dist/esm/icons/at-sign.mjs';
import _BarChart3 from 'lucide-react/dist/esm/icons/bar-chart-3.mjs';
import _Bell from 'lucide-react/dist/esm/icons/bell.mjs';
import _Bookmark from 'lucide-react/dist/esm/icons/bookmark.mjs';
import _Calendar from 'lucide-react/dist/esm/icons/calendar.mjs';
import _ChartPie from 'lucide-react/dist/esm/icons/chart-pie.mjs';
import _Check from 'lucide-react/dist/esm/icons/check.mjs';
import _Handshake from 'lucide-react/dist/esm/icons/handshake.mjs';
import _Image from 'lucide-react/dist/esm/icons/image.mjs';
import _CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle-2.mjs';
import _ChevronDown from 'lucide-react/dist/esm/icons/chevron-down.mjs';
import _ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left.mjs';
import _ChevronRight from 'lucide-react/dist/esm/icons/chevron-right.mjs';
import _ChevronUp from 'lucide-react/dist/esm/icons/chevron-up.mjs';
import _ChevronsLeft from 'lucide-react/dist/esm/icons/chevrons-left.mjs';
import _ChevronsRight from 'lucide-react/dist/esm/icons/chevrons-right.mjs';
import _ChevronsUpDown from 'lucide-react/dist/esm/icons/chevrons-up-down.mjs';
import _Circle from 'lucide-react/dist/esm/icons/circle.mjs';
import _Copy from 'lucide-react/dist/esm/icons/copy.mjs';
import _CornerDownLeft from 'lucide-react/dist/esm/icons/corner-down-left.mjs';
import _CreditCard from 'lucide-react/dist/esm/icons/credit-card.mjs';
import _Download from 'lucide-react/dist/esm/icons/download.mjs';
import _Edit2 from 'lucide-react/dist/esm/icons/edit-2.mjs';
import _Ellipsis from 'lucide-react/dist/esm/icons/ellipsis.mjs';
import _ExternalLink from 'lucide-react/dist/esm/icons/external-link.mjs';
import _Eye from 'lucide-react/dist/esm/icons/eye.mjs';
import _EyeOff from 'lucide-react/dist/esm/icons/eye-off.mjs';
import _File from 'lucide-react/dist/esm/icons/file.mjs';
import _FileText from 'lucide-react/dist/esm/icons/file-text.mjs';
import _Filter from 'lucide-react/dist/esm/icons/filter.mjs';
import _Folder from 'lucide-react/dist/esm/icons/folder.mjs';
import _FolderOpen from 'lucide-react/dist/esm/icons/folder-open.mjs';
import _Code from 'lucide-react/dist/esm/icons/code.mjs';
import _GripVertical from 'lucide-react/dist/esm/icons/grip-vertical.mjs';
import _Heart from 'lucide-react/dist/esm/icons/heart.mjs';
import _HelpCircle from 'lucide-react/dist/esm/icons/help-circle.mjs';
import _Home from 'lucide-react/dist/esm/icons/home.mjs';
import _Inbox from 'lucide-react/dist/esm/icons/inbox.mjs';
import _Info from 'lucide-react/dist/esm/icons/info.mjs';
import _Kanban from 'lucide-react/dist/esm/icons/kanban.mjs';
import _Key from 'lucide-react/dist/esm/icons/key.mjs';
import _LayoutGrid from 'lucide-react/dist/esm/icons/layout-grid.mjs';
import _Link2 from 'lucide-react/dist/esm/icons/link-2.mjs';
import _Loader2 from 'lucide-react/dist/esm/icons/loader-2.mjs';
import _Lock from 'lucide-react/dist/esm/icons/lock.mjs';
import _LogOut from 'lucide-react/dist/esm/icons/log-out.mjs';
import _Mail from 'lucide-react/dist/esm/icons/mail.mjs';
import _Menu from 'lucide-react/dist/esm/icons/menu.mjs';
import _MessageSquare from 'lucide-react/dist/esm/icons/message-square.mjs';
import _Minus from 'lucide-react/dist/esm/icons/minus.mjs';
import _Moon from 'lucide-react/dist/esm/icons/moon.mjs';
import _MoreHorizontal from 'lucide-react/dist/esm/icons/more-horizontal.mjs';
import _Package from 'lucide-react/dist/esm/icons/package.mjs';
import _Pencil from 'lucide-react/dist/esm/icons/pencil.mjs';
import _Plug from 'lucide-react/dist/esm/icons/plug.mjs';
import _Plus from 'lucide-react/dist/esm/icons/plus.mjs';
import _Receipt from 'lucide-react/dist/esm/icons/receipt.mjs';
import _Search from 'lucide-react/dist/esm/icons/search.mjs';
import _Settings from 'lucide-react/dist/esm/icons/settings.mjs';
import _ShoppingCart from 'lucide-react/dist/esm/icons/shopping-cart.mjs';
import _Sparkles from 'lucide-react/dist/esm/icons/sparkles.mjs';
import _Star from 'lucide-react/dist/esm/icons/star.mjs';
import _Sun from 'lucide-react/dist/esm/icons/sun.mjs';
import _Tags from 'lucide-react/dist/esm/icons/tags.mjs';
import _Trash2 from 'lucide-react/dist/esm/icons/trash-2.mjs';
import _Upload from 'lucide-react/dist/esm/icons/upload.mjs';
import _User from 'lucide-react/dist/esm/icons/user.mjs';
import _Users from 'lucide-react/dist/esm/icons/users.mjs';
import _Wallet from 'lucide-react/dist/esm/icons/wallet.mjs';
import _X from 'lucide-react/dist/esm/icons/x.mjs';
import _XCircle from 'lucide-react/dist/esm/icons/x-circle.mjs';
import _Zap from 'lucide-react/dist/esm/icons/zap.mjs';

export const AlertCircle: LucideIcon = _AlertCircle;
export const AlertTriangle: LucideIcon = _AlertTriangle;
export const ArrowDown: LucideIcon = _ArrowDown;
export const ArrowLeft: LucideIcon = _ArrowLeft;
export const ArrowRight: LucideIcon = _ArrowRight;
export const ArrowUp: LucideIcon = _ArrowUp;
export const ArrowUpDown: LucideIcon = _ArrowUpDown;
export const AtSign: LucideIcon = _AtSign;
export const BarChart3: LucideIcon = _BarChart3;
export const Bell: LucideIcon = _Bell;
export const Bookmark: LucideIcon = _Bookmark;
export const Calendar: LucideIcon = _Calendar;
export const ChartPie: LucideIcon = _ChartPie;
export const Check: LucideIcon = _Check;
export const Handshake: LucideIcon = _Handshake;
export const ImageIcon: LucideIcon = _Image;
export const CheckCircle2: LucideIcon = _CheckCircle2;
export const ChevronDown: LucideIcon = _ChevronDown;
export const ChevronLeft: LucideIcon = _ChevronLeft;
export const ChevronRight: LucideIcon = _ChevronRight;
export const ChevronUp: LucideIcon = _ChevronUp;
export const ChevronsLeft: LucideIcon = _ChevronsLeft;
export const ChevronsRight: LucideIcon = _ChevronsRight;
export const ChevronsUpDown: LucideIcon = _ChevronsUpDown;
export const Circle: LucideIcon = _Circle;
export const Copy: LucideIcon = _Copy;
export const CornerDownLeft: LucideIcon = _CornerDownLeft;
export const CreditCard: LucideIcon = _CreditCard;
export const Download: LucideIcon = _Download;
export const Edit2: LucideIcon = _Edit2;
export const Ellipsis: LucideIcon = _Ellipsis;
export const ExternalLink: LucideIcon = _ExternalLink;
export const Eye: LucideIcon = _Eye;
export const EyeOff: LucideIcon = _EyeOff;
export const File: LucideIcon = _File;
export const FileText: LucideIcon = _FileText;
export const Filter: LucideIcon = _Filter;
export const Folder: LucideIcon = _Folder;
export const FolderOpen: LucideIcon = _FolderOpen;
export const Code: LucideIcon = _Code;
export const GripVertical: LucideIcon = _GripVertical;
export const Heart: LucideIcon = _Heart;
export const HelpCircle: LucideIcon = _HelpCircle;
export const Home: LucideIcon = _Home;
export const Inbox: LucideIcon = _Inbox;
export const Info: LucideIcon = _Info;
export const Kanban: LucideIcon = _Kanban;
export const Key: LucideIcon = _Key;
export const LayoutGrid: LucideIcon = _LayoutGrid;
export const Link2: LucideIcon = _Link2;
export const Loader2: LucideIcon = _Loader2;
export const Lock: LucideIcon = _Lock;
export const LogOut: LucideIcon = _LogOut;
export const Mail: LucideIcon = _Mail;
export const Menu: LucideIcon = _Menu;
export const MessageSquare: LucideIcon = _MessageSquare;
export const Minus: LucideIcon = _Minus;
export const Moon: LucideIcon = _Moon;
export const MoreHorizontal: LucideIcon = _MoreHorizontal;
export const Package: LucideIcon = _Package;
export const Pencil: LucideIcon = _Pencil;
export const Plug: LucideIcon = _Plug;
export const Plus: LucideIcon = _Plus;
export const Receipt: LucideIcon = _Receipt;
export const Search: LucideIcon = _Search;
export const Settings: LucideIcon = _Settings;
export const ShoppingCart: LucideIcon = _ShoppingCart;
export const Sparkles: LucideIcon = _Sparkles;
export const Star: LucideIcon = _Star;
export const Sun: LucideIcon = _Sun;
export const Tags: LucideIcon = _Tags;
export const Trash2: LucideIcon = _Trash2;
export const Upload: LucideIcon = _Upload;
export const User: LucideIcon = _User;
export const Users: LucideIcon = _Users;
export const Wallet: LucideIcon = _Wallet;
export const X: LucideIcon = _X;
export const XCircle: LucideIcon = _XCircle;
export const Zap: LucideIcon = _Zap;
