import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { ChevronDown, ChevronsLeft, ChevronsRight } from '@/icons';
import { cn } from '@/lib/utils';

interface SidebarContextValue {
  collapsed: boolean;
}
const SidebarContext = createContext<SidebarContextValue>({ collapsed: false });

/** Read the parent Sidebar's collapsed state. Useful for brand/footer slots
 *  that need to swap between full and compact rendering. */
export function useSidebar(): SidebarContextValue {
  return useContext(SidebarContext);
}

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  /** Default state on first mount. Use `defaultCollapsed` for uncontrolled. */
  defaultCollapsed?: boolean;
  /** Controlled collapsed state. */
  collapsed?: boolean;
  /** Called when the user toggles via the rail or keyboard. */
  onCollapsedChange?: (next: boolean) => void;
  /** Header slot pinned to the top (brand, workspace switcher, etc.). */
  header?: ReactNode;
  /** Footer slot pinned to the bottom (user card, version, etc.). */
  footer?: ReactNode;
}

/**
 * App-level navigation rail. Holds `SidebarSection` → `SidebarItem` lists,
 * and optionally a `footer`. Supports collapse to icon-only on desktop.
 *
 * @example
 *   <Sidebar footer={<UserCard />}>
 *     <SidebarSection label="Workspace">
 *       <SidebarItem icon={<Home />} active>Home</SidebarItem>
 *       <SidebarItem icon={<Folder />}>Projects</SidebarItem>
 *     </SidebarSection>
 *     <SidebarSection label="Account">
 *       <SidebarItem icon={<Settings />}>Settings</SidebarItem>
 *     </SidebarSection>
 *   </Sidebar>
 *
 * @do Use 1–3 sections. More than that signals the IA needs restructuring.
 * @dont Hide critical navigation under the collapsed state — keep icons
 *       always visible with tooltips.
 */
export const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  {
    defaultCollapsed = false,
    collapsed: controlled,
    onCollapsedChange,
    header,
    footer,
    className,
    children,
    ...props
  },
  ref,
) {
  const [internal, setInternal] = useState(defaultCollapsed);
  const collapsed = controlled ?? internal;
  const setCollapsed = (next: boolean) => {
    if (controlled === undefined) setInternal(next);
    onCollapsedChange?.(next);
  };

  return (
    <SidebarContext.Provider value={{ collapsed }}>
      <aside
        ref={ref}
        aria-label="Primary"
        className={cn(
          'sticky top-0 hidden md:flex h-screen shrink-0 flex-col gap-2 border-r border-border bg-background-subtle',
          'transition-[width] duration-[var(--duration-base)] ease-[var(--ease-out)]',
          collapsed ? 'w-14' : 'w-60',
          className,
        )}
        {...props}
      >
        {header && (
          <div
            className={cn(
              'flex h-14 shrink-0 items-center overflow-hidden border-b border-border',
              collapsed ? 'justify-center px-2' : 'px-3',
            )}
          >
            {header}
          </div>
        )}
        <div className="flex-1 overflow-y-auto py-3">{children}</div>
        {footer && (
          <div className="border-t border-border p-2">{footer}</div>
        )}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
          className={cn(
            'flex h-8 items-center gap-2 mx-2 mb-2 rounded-md px-2 text-foreground-subtle',
            'hover:bg-background-muted hover:text-foreground outline-none',
            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            'transition-colors duration-[var(--duration-fast)]',
          )}
        >
          {collapsed ? <ChevronsRight className="size-4" aria-hidden /> : <ChevronsLeft className="size-4" aria-hidden />}
          {!collapsed && <span className="text-xs font-medium">Collapse</span>}
        </button>
      </aside>
    </SidebarContext.Provider>
  );
});
Sidebar.displayName = 'Sidebar';

export interface SidebarSectionProps extends HTMLAttributes<HTMLDivElement> {
  /** Visible section header. Hidden when collapsed. */
  label?: ReactNode;
}

export function SidebarSection({ label, className, children, ...props }: SidebarSectionProps) {
  const { collapsed } = useContext(SidebarContext);
  return (
    <div className={cn('mb-3', className)} {...props}>
      {label && !collapsed && (
        <div className="px-4 pb-1 pt-2 text-xs font-medium text-foreground-subtle uppercase tracking-wide">
          {label}
        </div>
      )}
      <ul className="flex flex-col gap-px">{children}</ul>
    </div>
  );
}
SidebarSection.displayName = 'SidebarSection';

export interface SidebarItemProps extends HTMLAttributes<HTMLAnchorElement> {
  /** Lucide icon shown to the left. */
  icon?: ReactNode;
  /** Mark as the current page. */
  active?: boolean;
  /** Optional `href` — when absent, renders as a `<button>` so consumers can
   *  bind their own handler / routing wrapper via `onClick`. */
  href?: string;
  /** Trailing badge / counter slot. */
  trailing?: ReactNode;
  /** Render a sub-item indented under a parent. */
  sub?: boolean;
}

export function SidebarItem({
  icon,
  active,
  href,
  trailing,
  sub,
  className,
  children,
  ...props
}: SidebarItemProps) {
  const { collapsed } = useContext(SidebarContext);
  const Comp: any = href ? 'a' : 'button';
  return (
    <li className="px-2">
      <Comp
        href={href}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'flex h-8 w-full items-center gap-2 rounded-md px-2 text-sm outline-none',
          'transition-colors duration-[var(--duration-fast)]',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          active
            ? 'bg-background-muted text-foreground font-medium'
            : 'text-foreground-muted hover:bg-background-muted hover:text-foreground',
          sub && !collapsed && 'ml-6',
          collapsed && 'justify-center',
          className,
        )}
        {...props}
      >
        {icon && <span className="flex shrink-0 items-center [&_svg]:size-4">{icon}</span>}
        {!collapsed && <span className="flex-1 truncate text-left">{children}</span>}
        {!collapsed && trailing && <span className="ml-auto">{trailing}</span>}
      </Comp>
    </li>
  );
}
SidebarItem.displayName = 'SidebarItem';

/** Lightweight collapsible sub-section inside the sidebar. */
export interface SidebarGroupProps {
  icon?: ReactNode;
  label: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function SidebarGroup({ icon, label, defaultOpen = true, children }: SidebarGroupProps) {
  const { collapsed } = useContext(SidebarContext);
  const [open, setOpen] = useState(defaultOpen);
  if (collapsed) return <>{children}</>;
  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={cn(
          'mx-2 flex h-8 w-[calc(100%-1rem)] items-center gap-2 rounded-md px-2 text-sm text-foreground-muted outline-none',
          'transition-colors duration-[var(--duration-fast)]',
          'hover:bg-background-muted hover:text-foreground',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        )}
      >
        {icon && <span className="flex shrink-0 items-center [&_svg]:size-4">{icon}</span>}
        <span className="flex-1 text-left">{label}</span>
        <ChevronDown className={cn('size-3.5 transition-transform', open && 'rotate-180')} aria-hidden />
      </button>
      {open && <ul className="flex flex-col gap-px">{children}</ul>}
    </li>
  );
}
SidebarGroup.displayName = 'SidebarGroup';
