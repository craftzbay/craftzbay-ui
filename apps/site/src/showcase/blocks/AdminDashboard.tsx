import { useEffect, useRef, useState } from 'react';
import { Toaster, useCommandPaletteShortcut, useToast } from '@craftzbay/ui';
import { WORKSPACES } from './admin/data';
import { AdminPalette, AppSidebar, AppTopNav } from './admin/shell';
import { Analytics, Overview, Reports } from './admin/overview';
import { Projects, type ProjectsHandle } from './admin/projects';
import { BillingPage, InboxPage, Members, SettingsPage, type MembersHandle } from './admin/pages';

/* =============================================================================
 *  AdminDashboard — a complete admin console on the library's app shell.
 *
 *  · Shell: `Sidebar` (collapsible rail ≥lg, Sheet drawer below) + `TopNav`
 *    (tenant name, `/` search, notifications, profile) + `Breadcrumbs` on
 *    every page below the home.
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

export function AdminDashboard() {
  const { push } = useToast();
  const [page, setPage] = useState('overview');
  const [workspace, setWorkspace] = useState(WORKSPACES[0].id);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
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
    <div className="bg-background text-foreground flex h-screen overflow-hidden">
      <AppSidebar
        page={page}
        onNavigate={navigate}
        workspace={workspace}
        onWorkspaceChange={setWorkspace}
        collapsed={collapsed}
        onCollapsedChange={onCollapsedChange}
        drawerOpen={drawerOpen}
        onDrawerOpenChange={setDrawerOpen}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopNav
          ref={searchRef}
          workspace={ws}
          onOpenDrawer={() => setDrawerOpen(true)}
          onOpenPalette={() => setPaletteOpen(true)}
          onNavigate={navigate}
          onSignOut={() => push({ title: 'Signed out', description: 'Demo — no real session.' })}
          searchValue={search}
          onSearchChange={onSearchChange}
        />
        <main className="bg-background-subtle flex-1 overflow-y-auto p-4 md:p-6">
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
          </div>
        </main>
      </div>

      <AdminPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        onNavigate={navigate}
        onAction={runAction}
      />
      <Toaster />
    </div>
  );
}
