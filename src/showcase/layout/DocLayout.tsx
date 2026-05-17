import type { ReactNode } from 'react';
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
 * The sticky ShowcaseTopBar sits above this in App.tsx, so the sidebar
 * top offset is 3.5rem (h-14).
 */
export function DocLayout({
  sidebar,
  topLinks,
  current,
  crossKindSections,
  children,
}: DocLayoutProps) {
  return (
    <div className="mx-auto flex max-w-[1400px] gap-0 px-0 md:px-6">
      <DocSidebar
        sections={sidebar}
        topLinks={topLinks}
        current={current}
        crossKindSections={crossKindSections}
      />
      <main className="min-w-0 flex-1 px-6 py-10 md:px-10">{children}</main>
    </div>
  );
}
