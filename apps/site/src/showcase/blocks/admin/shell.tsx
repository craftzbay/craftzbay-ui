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
import { NAV, NOTIFICATIONS, USER, WORKSPACES, findNav, type Workspace } from './data';

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
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const { collapsed } = useSidebar();
  const ws = WORKSPACES.find((w) => w.id === value) ?? WORKSPACES[0];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={collapsed ? `Workspace: ${ws.name}` : undefined}
          className={cn(
            'flex h-10 w-full items-center gap-2.5 rounded-md text-left transition-colors outline-none',
            'hover:bg-background-muted focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2',
            collapsed ? 'justify-center px-0' : 'px-1.5',
          )}
        >
          <Avatar
            size="md"
            fallback={ws.initial}
            alt=""
            className="rounded-md [&_span]:rounded-md"
          />
          {!collapsed && (
            <>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="text-foreground block truncate text-sm font-semibold">
                  {ws.name}
                </span>
                <span className="text-foreground-subtle block text-xs">{ws.plan} plan</span>
              </span>
              <ChevronsUpDown className="text-foreground-subtle size-4 shrink-0" aria-hidden />
            </>
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

function NavItems({ page, onNavigate }: { page: string; onNavigate: (key: string) => void }) {
  const { collapsed } = useSidebar();
  return (
    <>
      {NAV.map((section) => (
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
}: AppSidebarProps) {
  const navigate = (key: string) => {
    onNavigate(key);
    onDrawerOpenChange(false);
  };
  return (
    <>
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

      <Sheet open={drawerOpen} onOpenChange={onDrawerOpenChange}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Sidebar
            header={<WorkspaceSwitcher value={workspace} onChange={onWorkspaceChange} />}
            footer={<UserCard />}
            className="flex h-full w-full border-r-0"
          >
            <NavItems page={page} onNavigate={navigate} />
          </Sidebar>
        </SheetContent>
      </Sheet>
    </>
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
}

export const AppTopNav = forwardRef<HTMLInputElement, AppTopNavProps>(function AppTopNav(
  { workspace, onOpenDrawer, onOpenPalette, onNavigate, onSignOut, searchValue, onSearchChange },
  searchRef,
) {
  const unread = NOTIFICATIONS.filter((n) => n.unread).length;
  return (
    <TopNav
      className="bg-background supports-[backdrop-filter]:bg-background"
      logo={
        <div className="flex items-center gap-2">
          <IconButton
            aria-label="Open navigation"
            icon={<Menu />}
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onOpenDrawer}
          />
          {/* Tenant is visible on every page, even with a single workspace. */}
          <span className="flex items-center gap-2 text-sm">
            <span className="text-foreground font-semibold">{workspace.name}</span>
            <Badge tone="neutral" variant="outline" className="hidden sm:inline-flex">
              {workspace.plan}
            </Badge>
          </span>
        </div>
      }
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
          <Tooltip label="Command palette (⌘K)">
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
        <div>
          <h1 className="text-foreground text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="text-foreground-muted mt-1 text-sm">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
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
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (key: string) => void;
  onAction: (action: 'new-project' | 'invite' | 'toggle-sidebar') => void;
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
          <CommandItem onSelect={run(() => onAction('toggle-sidebar'))}>
            <Menu /> Toggle sidebar
          </CommandItem>
        </CommandGroup>
        {NAV.map((section) => (
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
