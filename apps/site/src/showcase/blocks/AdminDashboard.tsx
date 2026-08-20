import { useEffect, useRef, useState } from 'react';
import { Toaster, useCommandPaletteShortcut, useToast } from '@craftzbay/ui';
import { ALL_SECTIONS, WORKSPACES, findModule } from './admin/data';
import { AdminPalette, AppSidebar, AppTopNav, type AppSidebarMode } from './admin/shell';
import { Analytics, Overview, Reports } from './admin/overview';
import { Projects, type ProjectsHandle } from './admin/projects';
import {
  BillingPage,
  InboxPage,
  Members,
  SettingsPage,
  StubPage,
  type MembersHandle,
} from './admin/pages';

/* =============================================================================
 *  AdminDashboard — a complete admin console on the library's app shell.
 *
 *  · Shell: `Sidebar` (collapsible rail ≥lg, Sheet drawer below) + `TopNav`
 *    (tenant name, `/` search, notifications, profile) + `Breadcrumbs` on
 *    every page below the home. `layout="topnav"` drops the rail and moves
 *    primary navigation into the top bar as horizontal links (≤6 sections);
 *    the drawer still serves viewports below lg. `layout="dual"` is the
 *    two-tier shell: a 56px icon rail of modules + a 240px panel with the
 *    active module's sections (Slack / Linear style); below lg the drawer
 *    carries both tiers (module tabs above the list).
 *  · Keyboard: ⌘K / Ctrl+K opens the command palette, `/` focuses search,
 *    Esc closes overlays and blurs the search field.
 *  · Pages live in ./admin/* — Projects is the full table pattern (sort,
 *    filter chips, debounced search, 25/50/100 pagination, bulk bar,
 *    confirm-before-delete, first-run vs filtered empty, skeleton).
 *
 *  Copy the folder, swap the demo data for your API, and wire `page` to your
 *  router.
 * ========================================================================== */

const SIDEBAR_KEY = 'admin-template:sidebar-collapsed';

/** `sidebar` = collapsible rail (default); `topnav` = horizontal links, no rail; `dual` = icon rail + module panel. */
export type AdminLayout = 'sidebar' | 'topnav' | 'dual';

const SIDEBAR_MODE: Record<AdminLayout, AppSidebarMode> = {
  sidebar: 'rail',
  topnav: 'none',
  dual: 'dual',
};

const PAGES = [
  'overview',
  'analytics',
  'projects',
  'inbox',
  'members',
  'reports',
  'settings',
  'billing',
  'audit',
  'roles',
];

export function AdminDashboard({
  layout = 'sidebar',
  initialPage,
}: {
  layout?: AdminLayout;
  /** Page to open first (deep link from the preview route); unknown keys fall back to overview. */
  initialPage?: string;
}) {
  const hasRail = layout === 'sidebar';
  const { push } = useToast();
  const [page, setPage] = useState(() =>
    initialPage && PAGES.includes(initialPage) ? initialPage : 'overview',
  );
  // `dual` only: which module the panel shows. Navigating to a page selects
  // its module; clicking the rail only switches the panel.
  const [module, setModule] = useState(() => findModule(page).key);
  const [workspace, setWorkspace] = useState(WORKSPACES[0].id);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  // The drawer only exists below lg; if the viewport grows past it (window
  // resize, preview width toggle) close it so it never sits over the rail.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const sync = () => {
      if (mq.matches) setDrawerOpen(false);
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [search, setSearch] = useState('');

  const searchRef = useRef<HTMLInputElement>(null);
  const projectsRef = useRef<ProjectsHandle>(null);
  const membersRef = useRef<MembersHandle>(null);

  // Persist the rail state like a real app would.
  const onCollapsedChange = (next: boolean) => {
    setCollapsed(next);
    try {
      localStorage.setItem(SIDEBAR_KEY, next ? '1' : '0');
    } catch {
      /* private mode */
    }
  };

  // ⌘K → palette (library hook). `/` → search, unless typing in a field.
  useCommandPaletteShortcut(setPaletteOpen);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const navigate = (key: string) => {
    setPage(key);
    setModule(findModule(key).key);
    setDrawerOpen(false);
  };

  // Global search lands on the Projects list.
  const onSearchChange = (q: string) => {
    setSearch(q);
    if (q && page !== 'projects') setPage('projects');
  };

  const runAction = (action: 'new-project' | 'invite' | 'toggle-sidebar') => {
    switch (action) {
      case 'new-project':
        setPage('projects');
        // Defer until the page has mounted its handle.
        window.setTimeout(() => projectsRef.current?.create(), 0);
        break;
      case 'invite':
        setPage('members');
        window.setTimeout(() => membersRef.current?.invite(), 0);
        break;
      case 'toggle-sidebar':
        onCollapsedChange(!collapsed);
        break;
    }
  };

  const ws = WORKSPACES.find((w) => w.id === workspace) ?? WORKSPACES[0];

  return (
    // h-dvh + min-h-0 down the column: flex children default to
    // min-height:auto, so without it <main> grows to its content, overflows the
    // shell, and any focus() on an off-screen row scrolls the overflow-hidden
    // root itself (sidebar "scrolls away"). With min-h-0 only <main> scrolls.
    <div className="bg-background text-foreground flex h-dvh overflow-hidden">
      <AppSidebar
        page={page}
        onNavigate={navigate}
        workspace={workspace}
        onWorkspaceChange={setWorkspace}
        collapsed={collapsed}
        onCollapsedChange={onCollapsedChange}
        drawerOpen={drawerOpen}
        onDrawerOpenChange={setDrawerOpen}
        mode={SIDEBAR_MODE[layout]}
        module={module}
        onModuleChange={setModule}
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <AppTopNav
          ref={searchRef}
          workspace={ws}
          onOpenDrawer={() => setDrawerOpen(true)}
          onOpenPalette={() => setPaletteOpen(true)}
          onNavigate={navigate}
          onSignOut={() => push({ title: 'Signed out', description: 'Demo — no real session.' })}
          searchValue={search}
          onSearchChange={onSearchChange}
          layout={layout}
          page={page}
          onWorkspaceChange={setWorkspace}
        />
        <main className="bg-background-subtle min-h-0 flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto max-w-[1440px]">
            {page === 'overview' && <Overview onNavigate={navigate} />}
            {page === 'analytics' && <Analytics onNavigate={navigate} />}
            {page === 'projects' && (
              <Projects ref={projectsRef} onNavigate={navigate} globalQuery={search} />
            )}
            {page === 'inbox' && <InboxPage onNavigate={navigate} />}
            {page === 'members' && <Members ref={membersRef} onNavigate={navigate} />}
            {page === 'reports' && <Reports onNavigate={navigate} />}
            {page === 'settings' && <SettingsPage onNavigate={navigate} />}
            {page === 'billing' && <BillingPage onNavigate={navigate} />}
            {page === 'audit' && (
              <StubPage
                page="audit"
                title="Audit log"
                subtitle="Who did what, and when."
                onNavigate={navigate}
              />
            )}
            {page === 'roles' && (
              <StubPage
                page="roles"
                title="Roles"
                subtitle="Permission sets assigned to members."
                onNavigate={navigate}
              />
            )}
          </div>
        </main>
      </div>

      <AdminPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        onNavigate={navigate}
        onAction={runAction}
        hasSidebar={hasRail}
        sections={layout === 'dual' ? ALL_SECTIONS : undefined}
      />
      <Toaster />
    </div>
  );
}
