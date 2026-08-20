import { forwardRef, type ReactNode } from 'react';
import {
  Bell,
  Check,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings as SettingsIcon,
  User,
} from '@/icons';
import { useModifierKey } from '@/hooks/use-modifier-key';
import {
  Avatar,
  Badge,
  Breadcrumbs,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  IconButton,
  Input,
  Kbd,
  Sheet,
  SheetContent,
  SheetTitle,
  Sidebar,
  SidebarItem,
  SidebarSection,
  TopNav,
  Tooltip,
  cn,
  useSidebar,
} from '@craftzbay/ui';
import {
  MODULES,
  NAV,
  NOTIFICATIONS,
  USER,
  WORKSPACES,
  findNav,
  type NavSection,
  type Workspace,
} from './data';

/* =============================================================================
 *  Admin template — app shell built from the library Sidebar + TopNav +
 *  Breadcrumbs. The sidebar collapses to an icon rail on desktop (≥lg) and
 *  becomes a Sheet drawer below that. The top bar always shows the tenant.
 * ========================================================================== */

/* ---------------------------------------------------------------------------
 *  Workspace (tenant) switcher — sidebar header slot
 * ------------------------------------------------------------------------ */

export function WorkspaceSwitcher({
  value,
  onChange,
  variant = 'sidebar',
}: {
  value: string;
  onChange: (id: string) => void;
  /** `sidebar` fills the rail header (collapses with it); `bar` is a compact top-bar trigger. */
  variant?: 'sidebar' | 'bar';
}) {
  // Outside a Sidebar the context defaults to `collapsed: false`, so the bar
  // variant is safe without a provider.
  const { collapsed: railCollapsed } = useSidebar();
  const collapsed = variant === 'sidebar' && railCollapsed;
  const ws = WORKSPACES.find((w) => w.id === value) ?? WORKSPACES[0];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={collapsed ? `Workspace: ${ws.name}` : undefined}
          className={cn(
            'flex items-center gap-2.5 rounded-md text-left transition-colors outline-none',
            'hover:bg-background-muted focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2',
            variant === 'bar' ? 'h-9 min-w-0 px-1.5' : 'h-10 w-full',
            variant === 'sidebar' && (collapsed ? 'justify-center px-0' : 'px-1.5'),
          )}
        >
          <Avatar
            size={variant === 'bar' ? 'sm' : 'md'}
            fallback={ws.initial}
            alt=""
            className="rounded-md [&_span]:rounded-md"
          />
          {variant === 'bar' ? (
            <>
              <span className="text-foreground truncate text-sm font-semibold">{ws.name}</span>
              <Badge tone="neutral" variant="outline" className="hidden sm:inline-flex">
                {ws.plan}
              </Badge>
              <ChevronsUpDown className="text-foreground-subtle size-4 shrink-0" aria-hidden />
            </>
          ) : (
            !collapsed && (
              <>
                <span className="min-w-0 flex-1 leading-tight">
                  <span className="text-foreground block truncate text-sm font-semibold">
                    {ws.name}
                  </span>
                  <span className="text-foreground-subtle block text-xs">{ws.plan} plan</span>
                </span>
                <ChevronsUpDown className="text-foreground-subtle size-4 shrink-0" aria-hidden />
              </>
            )
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[232px]">
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {WORKSPACES.map((w) => (
          <DropdownMenuItem key={w.id} onSelect={() => onChange(w.id)} className="gap-2.5">
            <Avatar size="sm" fallback={w.initial} alt="" />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-foreground truncate text-sm">{w.name}</span>
              <span className="text-foreground-subtle text-xs">{w.plan}</span>
            </span>
            {w.id === value && <Check className="text-accent size-4" aria-hidden />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2.5">
          <span className="border-border text-foreground-subtle inline-flex size-6 items-center justify-center rounded-md border border-dashed">
            <Plus className="size-3.5" aria-hidden />
          </span>
          Create workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ---------------------------------------------------------------------------
 *  Navigation list — shared by the desktop rail and the mobile drawer
 * ------------------------------------------------------------------------ */

function NavItems({
  page,
  onNavigate,
  sections = NAV,
}: {
  page: string;
  onNavigate: (key: string) => void;
  sections?: NavSection[];
}) {
  const { collapsed } = useSidebar();
  return (
    <>
      {sections.map((section) => (
        <SidebarSection key={section.label} label={section.label}>
          {section.items.map((it) => {
            const active = page === it.key;
            const Icon = it.icon;
            const item = (
              <SidebarItem
                key={it.key}
                icon={<Icon />}
                active={active}
                onClick={() => onNavigate(it.key)}
                trailing={
                  it.count != null ? (
                    <Badge tone={active ? 'accent' : 'neutral'} className="tabular">
                      {it.count}
                    </Badge>
                  ) : undefined
                }
                className={cn(
                  // Active = accent bar + weight + background, never colour alone.
                  'before:bg-accent relative before:absolute before:top-1.5 before:bottom-1.5 before:left-0 before:w-0.5 before:rounded-full before:opacity-0',
                  active && 'text-foreground before:opacity-100',
                )}
              >
                {it.label}
              </SidebarItem>
            );
            // Icon-only rail must still name the destination.
            return collapsed ? (
              <Tooltip key={it.key} label={it.label} side="right">
                {item}
              </Tooltip>
            ) : (
              item
            );
          })}
        </SidebarSection>
      ))}
    </>
  );
}

function UserCard() {
  const { collapsed } = useSidebar();
  return (
    <div className={cn('flex items-center gap-2.5', collapsed ? 'justify-center' : 'px-1')}>
      <Avatar size="sm" fallback={USER.initials} alt={USER.name} status="online" />
      {!collapsed && (
        <div className="min-w-0 leading-tight">
          <div className="text-foreground truncate text-sm font-medium">{USER.name}</div>
          <div className="text-foreground-subtle truncate text-xs">{USER.email}</div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
 *  `dual` shell — icon rail of modules (56px) + 240px panel of the active
 *  module's sections. Two-tier navigation for products with many areas.
 * ------------------------------------------------------------------------ */

function RailButton({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Tooltip label={label} side="right">
      <button
        type="button"
        aria-label={label}
        aria-current={active ? 'page' : undefined}
        onClick={onClick}
        className={cn(
          'relative inline-flex size-10 items-center justify-center rounded-md outline-none [&_svg]:size-5',
          'transition-colors duration-[var(--duration-fast)]',
          'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2',
          // Active = accent bar on the rail's left edge + background + accent
          // icon, never colour alone. The bar sits outside the 40px button so
          // it hugs the rail edge (button is centred in a 56px rail → 8px gap).
          'before:bg-accent before:absolute before:top-2 before:bottom-2 before:-left-2 before:w-0.5 before:rounded-r-full before:opacity-0',
          active
            ? 'bg-background-muted text-accent before:opacity-100'
            : 'text-foreground-muted hover:bg-surface-hover hover:text-foreground',
        )}
      >
        {icon}
      </button>
    </Tooltip>
  );
}

export function AppRail({
  module,
  onModuleChange,
  onNavigate,
}: {
  module: string;
  onModuleChange: (key: string) => void;
  onNavigate: (key: string) => void;
}) {
  return (
    <nav
      aria-label="Modules"
      className="border-border bg-background-subtle hidden w-14 shrink-0 flex-col items-center gap-1 border-r py-2 lg:flex"
    >
      {/* Brand mark — the rail is the only chrome that never scrolls away. */}
      <span
        aria-hidden
        className="bg-foreground text-background mb-2 inline-flex size-8 items-center justify-center rounded-md text-sm font-semibold"
      >
        A
      </span>
      {/* Modules scroll independently when there are more than fit (short
          laptops, many areas); brand above and the user below stay pinned.
          Scrollbar hidden, edge fades signal overflow. */}
      <div className="relative min-h-0 w-full flex-1">
        <div
          className="flex h-full w-full [scrollbar-width:none] flex-col items-center gap-1 overflow-y-auto overscroll-contain py-0.5 [&::-webkit-scrollbar]:hidden"
          style={{
            maskImage:
              'linear-gradient(to bottom, transparent, #000 10px, #000 calc(100% - 10px), transparent)',
          }}
        >
          {MODULES.map((m) => {
            const Icon = m.icon;
            return (
              <RailButton
                key={m.key}
                label={m.label}
                icon={<Icon />}
                active={m.key === module}
                onClick={() => onModuleChange(m.key)}
              />
            );
          })}
        </div>
      </div>
      <div className="mt-1 shrink-0">
        <Tooltip label={`${USER.name} — Settings`} side="right">
          <button
            type="button"
            aria-label={`${USER.name}, open settings`}
            onClick={() => onNavigate('settings')}
            className="hover:bg-background-muted focus-visible:ring-ring focus-visible:ring-offset-background inline-flex size-10 items-center justify-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            <Avatar size="sm" fallback={USER.initials} alt="" status="online" />
          </button>
        </Tooltip>
      </div>
    </nav>
  );
}

/** Segmented module strip — the drawer's stand-in for the rail below lg. */
function ModuleTabs({
  module,
  onModuleChange,
}: {
  module: string;
  onModuleChange: (key: string) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Modules"
      className="bg-background-muted flex w-full snap-x [scrollbar-width:none] gap-0.5 overflow-x-auto rounded-md p-0.5 [&::-webkit-scrollbar]:hidden"
    >
      {MODULES.map((m) => {
        const Icon = m.icon;
        const active = m.key === module;
        return (
          <button
            key={m.key}
            type="button"
            aria-pressed={active}
            onClick={() => onModuleChange(m.key)}
            // Five tabs overflow a 256px drawer; keep the active one in view.
            ref={
              active
                ? (el) => el?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
                : undefined
            }
            className={cn(
              'inline-flex h-8 shrink-0 snap-start items-center justify-center gap-1.5 rounded-[5px] px-2.5 text-sm whitespace-nowrap outline-none [&_svg]:size-4',
              'transition-colors duration-[var(--duration-fast)]',
              'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-1',
              active
                ? 'bg-background text-foreground font-medium shadow-sm'
                : 'text-foreground-muted hover:text-foreground',
            )}
          >
            <Icon aria-hidden />
            {m.label}
          </button>
        );
      })}
    </div>
  );
}

function PanelHeader({ label }: { label: string }) {
  // Module name, distinct from the uppercase section labels below it.
  return <h2 className="text-foreground truncate text-sm font-semibold">{label}</h2>;
}

/** `rail` = collapsible sidebar (≥lg); `dual` = icon rail + module panel; `none` = drawer only. */
export type AppSidebarMode = 'rail' | 'dual' | 'none';

export interface AppSidebarProps {
  page: string;
  onNavigate: (key: string) => void;
  workspace: string;
  onWorkspaceChange: (id: string) => void;
  collapsed: boolean;
  onCollapsedChange: (next: boolean) => void;
  /** Mobile drawer state (below lg). */
  drawerOpen: boolean;
  onDrawerOpenChange: (open: boolean) => void;
  /** Desktop chrome (≥lg). Every mode keeps the drawer below lg. */
  mode?: AppSidebarMode;
  /** Active module for `dual`. */
  module?: string;
  onModuleChange?: (key: string) => void;
}

/**
 * Desktop rail (≥lg, collapsible) + mobile drawer (<lg). Both render the same
 * `Sidebar` from the library so the two never drift.
 */
export function AppSidebar({
  page,
  onNavigate,
  workspace,
  onWorkspaceChange,
  collapsed,
  onCollapsedChange,
  drawerOpen,
  onDrawerOpenChange,
  mode = 'rail',
  module = MODULES[0].key,
  onModuleChange = () => {},
}: AppSidebarProps) {
  const navigate = (key: string) => {
    onNavigate(key);
    onDrawerOpenChange(false);
  };
  const dual = mode === 'dual';
  const activeModule = MODULES.find((m) => m.key === module) ?? MODULES[0];
  const sections = dual ? activeModule.sections : NAV;
  return (
    <>
      {dual && (
        <>
          <AppRail module={module} onModuleChange={onModuleChange} onNavigate={navigate} />
          <Sidebar
            aria-label={`${activeModule.label} navigation`}
            header={<PanelHeader label={activeModule.label} />}
            // Panel is fixed-width: no collapse control (the rail already is the icon tier).
            className="md:hidden lg:flex [&>button:last-child]:hidden"
          >
            <NavItems page={page} onNavigate={navigate} sections={sections} />
          </Sidebar>
        </>
      )}
      {mode === 'rail' && (
        <Sidebar
          collapsed={collapsed}
          onCollapsedChange={onCollapsedChange}
          header={<WorkspaceSwitcher value={workspace} onChange={onWorkspaceChange} />}
          footer={<UserCard />}
          // The library default is `hidden md:flex`; the admin shell promotes the
          // breakpoint to lg and serves a drawer below it.
          className="md:hidden lg:flex"
        >
          <NavItems page={page} onNavigate={navigate} />
        </Sidebar>
      )}

      <Sheet open={drawerOpen} onOpenChange={onDrawerOpenChange}>
        <SheetContent side="left" className="w-64 p-0" showClose={false}>
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Sidebar
            header={
              dual ? (
                <ModuleTabs module={module} onModuleChange={onModuleChange} />
              ) : (
                <WorkspaceSwitcher value={workspace} onChange={onWorkspaceChange} />
              )
            }
            footer={<UserCard />}
            className="flex h-full w-full border-r-0"
          >
            {dual && (
              <div className="px-4 pb-2">
                <PanelHeader label={activeModule.label} />
              </div>
            )}
            <NavItems page={page} onNavigate={navigate} sections={sections} />
          </Sidebar>
        </SheetContent>
      </Sheet>
    </>
  );
}

/* ---------------------------------------------------------------------------
 *  Horizontal primary nav — the `topnav` shell. Sections are flattened to
 *  their items (≤6 here); Settings and Billing stay in the profile menu.
 *  Active = accent bar + weight, never colour alone. Visible ≥lg only; below
 *  that the hamburger opens the same drawer as the sidebar shell.
 * ------------------------------------------------------------------------ */

const TOPNAV_KEYS = ['overview', 'analytics', 'projects', 'inbox', 'members', 'reports'];

function TopNavItems({ page, onNavigate }: { page: string; onNavigate: (key: string) => void }) {
  const items = NAV.flatMap((s) => s.items).filter((it) => TOPNAV_KEYS.includes(it.key));
  return (
    // The library nav slot shows from md; this shell needs lg for six links +
    // a workspace switcher + search, so the wrapper hides itself below lg.
    <div className="hidden lg:contents">
      {items.map((it) => {
        const active = page === it.key;
        return (
          <button
            key={it.key}
            type="button"
            onClick={() => onNavigate(it.key)}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'relative inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-sm outline-none',
              'transition-colors duration-[var(--duration-fast)]',
              'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2',
              'after:bg-accent after:absolute after:inset-x-3 after:-bottom-2.5 after:h-0.5 after:rounded-full after:opacity-0',
              active
                ? 'text-foreground font-semibold after:opacity-100'
                : 'text-foreground-muted hover:text-foreground font-medium',
            )}
          >
            {it.label}
            {it.count != null && (
              <Badge tone={active ? 'accent' : 'neutral'} className="tabular">
                {it.count}
              </Badge>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------------------
 *  Top bar — tenant name, search (`/`), ⌘K hint, notifications, profile
 * ------------------------------------------------------------------------ */

export interface AppTopNavProps {
  workspace: Workspace;
  onOpenDrawer: () => void;
  onOpenPalette: () => void;
  onNavigate: (key: string) => void;
  onSignOut: () => void;
  searchValue: string;
  onSearchChange: (q: string) => void;
  /** `sidebar` (default) shows the tenant name; `topnav` adds primary links; `topnav` and `dual` host the workspace switcher. */
  layout?: 'sidebar' | 'topnav' | 'dual';
  /** Active page — needed for the `topnav` links' active state. */
  page?: string;
  onWorkspaceChange?: (id: string) => void;
}

export const AppTopNav = forwardRef<HTMLInputElement, AppTopNavProps>(function AppTopNav(
  {
    workspace,
    onOpenDrawer,
    onOpenPalette,
    onNavigate,
    onSignOut,
    searchValue,
    onSearchChange,
    layout = 'sidebar',
    page = '',
    onWorkspaceChange,
  },
  searchRef,
) {
  const unread = NOTIFICATIONS.filter((n) => n.unread).length;
  const mod = useModifierKey();
  return (
    <TopNav
      className="bg-background supports-[backdrop-filter]:bg-background"
      logo={
        <div className="flex min-w-0 items-center gap-2">
          <IconButton
            aria-label="Open navigation"
            icon={<Menu />}
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onOpenDrawer}
          />
          {layout !== 'sidebar' ? (
            // No sidebar header to host the switcher, so it lives in the bar.
            <WorkspaceSwitcher
              variant="bar"
              value={workspace.id}
              onChange={(id) => onWorkspaceChange?.(id)}
            />
          ) : (
            // Tenant is visible on every page, even with a single workspace.
            <span className="flex min-w-0 items-center gap-2 text-sm">
              <span className="text-foreground truncate font-semibold">{workspace.name}</span>
              <Badge tone="neutral" variant="outline" className="hidden sm:inline-flex">
                {workspace.plan}
              </Badge>
            </span>
          )}
        </div>
      }
      nav={layout === 'topnav' ? <TopNavItems page={page} onNavigate={onNavigate} /> : undefined}
      search={
        <Input
          ref={searchRef}
          type="search"
          label="Search"
          hideLabel
          size="sm"
          placeholder="Search projects, people…"
          prefix={<Search className="size-4" aria-hidden />}
          suffix={
            <span className="hidden items-center gap-0.5 sm:inline-flex">
              <Kbd>/</Kbd>
            </span>
          }
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          clearable
          onClear={() => onSearchChange('')}
          onKeyDown={(e) => {
            if (e.key === 'Escape') (e.target as HTMLInputElement).blur();
          }}
          className="hidden md:block"
        />
      }
      actions={
        <>
          <Tooltip label={`Command palette (${mod.label}+K)`}>
            <IconButton
              aria-label="Open command palette"
              icon={<Search />}
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={onOpenPalette}
            />
          </Tooltip>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton
                aria-label={unread > 0 ? `Notifications, ${unread} unread` : 'Notifications'}
                icon={
                  <span className="relative inline-flex">
                    <Bell />
                    {unread > 0 && (
                      <span
                        aria-hidden
                        className="bg-accent ring-background absolute -top-0.5 -right-0.5 size-2 rounded-full ring-2"
                      />
                    )}
                  </span>
                }
                variant="ghost"
                size="sm"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                Notifications
                {unread > 0 && <Badge tone="accent">{unread} new</Badge>}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {NOTIFICATIONS.map((n) => (
                <DropdownMenuItem
                  key={n.id}
                  className="flex items-start gap-2.5"
                  onSelect={() => onNavigate('inbox')}
                >
                  <Avatar size="xs" fallback={n.initials} alt="" className="mt-0.5" />
                  <span className="flex min-w-0 flex-col">
                    <span className="text-foreground text-sm">
                      <span className="font-medium">{n.who}</span> {n.text}
                    </span>
                    <span className="text-foreground-subtle text-xs">{n.when} ago</span>
                  </span>
                  {n.unread && (
                    <span
                      aria-label="Unread"
                      className="bg-accent mt-1.5 ml-auto size-1.5 rounded-full"
                    />
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => onNavigate('inbox')}>View all</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Account menu"
                className="hover:bg-background-muted focus-visible:ring-ring focus-visible:ring-offset-background ml-1 inline-flex size-8 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              >
                <Avatar size="sm" fallback={USER.initials} alt={USER.name} status="online" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="leading-tight">
                  <div className="text-foreground text-sm font-medium">{USER.name}</div>
                  <div className="text-foreground-subtle text-xs font-normal">{USER.email}</div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => onNavigate('settings')}>
                <User className="size-4" aria-hidden /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onNavigate('settings')}>
                <SettingsIcon className="size-4" aria-hidden /> Settings
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onNavigate('billing')}>
                <CreditCard className="size-4" aria-hidden /> Billing
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={onSignOut}>
                <LogOut className="size-4" aria-hidden /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      }
    />
  );
});

/* ---------------------------------------------------------------------------
 *  Page header — the library has no page-level header primitive, so this thin
 *  local one keeps "h1 left, primary action right" consistent. Breadcrumbs
 *  appear automatically for any page below the home (depth ≥ 2).
 * ------------------------------------------------------------------------ */

export function PageHeader({
  page,
  title,
  subtitle,
  actions,
  onNavigate,
}: {
  page: string;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  onNavigate?: (key: string) => void;
}) {
  const nav = findNav(page);
  const crumbs =
    nav && page !== 'overview'
      ? [
          { label: 'Home', href: '#overview' },
          { label: nav.section.label },
          { label: nav.item.label },
        ]
      : null;
  return (
    <header className="mb-6">
      {crumbs && (
        <Breadcrumbs
          items={crumbs}
          className="mb-2"
          renderLink={(_, children) => (
            <button
              type="button"
              onClick={() => onNavigate?.('overview')}
              className="hover:text-foreground focus-visible:ring-ring rounded-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              {children}
            </button>
          )}
        />
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-foreground text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="text-foreground-muted mt-1 text-sm">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}

/* ---------------------------------------------------------------------------
 *  ⌘K palette — navigation + actions
 * ------------------------------------------------------------------------ */

export function AdminPalette({
  open,
  onOpenChange,
  onNavigate,
  onAction,
  hasSidebar = true,
  sections = NAV,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (key: string) => void;
  onAction: (action: 'new-project' | 'invite' | 'toggle-sidebar') => void;
  /** False in the `topnav` / `dual` shells — there is no rail to toggle. */
  hasSidebar?: boolean;
  /** Navigation groups to list; the `dual` shell passes every module's sections. */
  sections?: NavSection[];
}) {
  const run = (fn: () => void) => () => {
    onOpenChange(false);
    fn();
  };
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Command palette">
      <CommandInput placeholder="Go to a page or run an action…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem onSelect={run(() => onAction('new-project'))}>
            <Plus /> New project
            <CommandShortcut>N</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={run(() => onAction('invite'))}>
            <User /> Invite teammate
          </CommandItem>
          {hasSidebar && (
            <CommandItem onSelect={run(() => onAction('toggle-sidebar'))}>
              <Menu /> Toggle sidebar
            </CommandItem>
          )}
        </CommandGroup>
        {sections.map((section) => (
          <CommandGroup key={section.label} heading={section.label}>
            {section.items.map((it) => {
              const Icon = it.icon;
              return (
                <CommandItem
                  key={it.key}
                  value={`${section.label} ${it.label}`}
                  onSelect={run(() => onNavigate(it.key))}
                >
                  <Icon /> {it.label}
                </CommandItem>
              );
            })}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
