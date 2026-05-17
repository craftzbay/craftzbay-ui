import { useEffect, useState, type ReactNode } from 'react';
import { Menu } from '@/icons';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/Sheet';
import { DocSidebar, type DocSidebarSection } from './DocSidebar';
import type { Route } from '../routing';

interface DocLayoutProps {
  sidebar: DocSidebarSection[];
  topLinks?: { label: string; route: Route }[];
  current: { kind: Route['kind']; slug?: string };
  /**
   * Additional sections searched ONLY when a query is active. Pass the other
   * kinds' sidebar sections so a user on the Components page can still find
   * Templates / Guides through search.
   */
  crossKindSections?: DocSidebarSection[];
  children: ReactNode;
}

/**
 * Two-column doc shell: left sidebar (sticky), right scrollable content.
 * On screens < md the sidebar collapses behind a hamburger button that
 * opens its contents in a left Sheet drawer.
 */
export function DocLayout({
  sidebar,
  topLinks,
  current,
  crossKindSections,
  children,
}: DocLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sheet when the route changes (clicking any link).
  useEffect(() => {
    setMobileOpen(false);
  }, [current.kind, current.slug]);

  return (
    <div className="mx-auto flex max-w-[1400px] gap-0 px-0 md:px-6">
      {/* Desktop sidebar — sticky, hidden < md */}
      <DocSidebar
        sections={sidebar}
        topLinks={topLinks}
        current={current}
        crossKindSections={crossKindSections}
      />

      <main className="min-w-0 flex-1 px-4 py-6 md:px-10 md:py-10">
        {/* Mobile sheet trigger — visible only < md */}
        <div className="mb-4 md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground-muted transition-colors hover:bg-background-muted hover:text-foreground"
              >
                <Menu className="size-4" />
                Browse
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <DocSidebar
                sections={sidebar}
                topLinks={topLinks}
                current={current}
                crossKindSections={crossKindSections}
                variant="mobile"
                onNavigate={() => setMobileOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </div>

        {children}
      </main>
    </div>
  );
}
