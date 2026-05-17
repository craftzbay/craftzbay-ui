import { useMemo, useState } from 'react';
import { Search } from '@/icons';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { routeToHash, type Route } from '../routing';

export interface DocSidebarEntry {
  slug: string;
  label: string;
  group: string;
}

export interface DocSidebarSection {
  /** Heading rendered above the section. Use 'top' for the "Get started" links. */
  title: string;
  /** kind = 'component' | 'template' | 'guide' — used to build the URL. */
  kind: 'component' | 'template' | 'guide';
  entries: DocSidebarEntry[];
}

interface DocSidebarProps {
  sections: DocSidebarSection[];
  current?: { kind: Route['kind']; slug?: string };
  /** Top links: Overview / Components index / Templates index / Guides index. */
  topLinks?: { label: string; route: Route }[];
}

export function DocSidebar({ sections, current, topLinks = [] }: DocSidebarProps) {
  const [query, setQuery] = useState('');

  const filteredSections = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return sections.map((s) => ({
        ...s,
        groups: groupEntries(s.entries),
      }));
    }
    return sections
      .map((s) => ({
        ...s,
        groups: groupEntries(
          s.entries.filter(
            (e) =>
              e.label.toLowerCase().includes(q) || e.group.toLowerCase().includes(q),
          ),
        ),
      }))
      .filter((s) => s.groups.length > 0);
  }, [sections, query]);

  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r border-border bg-background px-4 py-6 md:block">
      <div className="mb-4">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search…"
          prefix={<Search className="size-3.5" />}
          hideLabel
          label="Search docs"
          className="h-8 text-sm"
        />
      </div>

      {topLinks.length > 0 && (
        <nav className="mb-6 flex flex-col gap-px">
          {topLinks.map((link) => {
            const isActive =
              link.route.kind === current?.kind && !('slug' in link.route);
            return (
              <SidebarLink
                key={link.label}
                href={`#${routeToHash(link.route)}`}
                active={isActive}
              >
                {link.label}
              </SidebarLink>
            );
          })}
        </nav>
      )}

      {filteredSections.map((section) => (
        <div key={section.title} className="mb-6">
          <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-foreground-subtle">
            {section.title}
          </div>
          {section.groups.map((group) => (
            <div key={group.name} className="mb-3">
              <div className="mb-1 px-2 text-[10px] font-medium uppercase tracking-wide text-foreground-subtle/80">
                {group.name}
              </div>
              <div className="flex flex-col gap-px">
                {group.entries.map((entry) => {
                  const active =
                    current?.kind === section.kind && current.slug === entry.slug;
                  const hash = routeToHash({
                    kind: section.kind,
                    slug: entry.slug,
                  } as Route);
                  return (
                    <SidebarLink key={entry.slug} href={`#${hash}`} active={active}>
                      {entry.label}
                    </SidebarLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ))}
    </aside>
  );
}

function SidebarLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'rounded-md px-2 py-1.5 text-sm transition-colors',
        active
          ? 'bg-accent-soft font-medium text-on-accent-soft'
          : 'text-foreground-muted hover:bg-background-muted hover:text-foreground',
      )}
    >
      {children}
    </a>
  );
}

function groupEntries(entries: DocSidebarEntry[]) {
  const map = new Map<string, DocSidebarEntry[]>();
  for (const e of entries) {
    if (!map.has(e.group)) map.set(e.group, []);
    map.get(e.group)!.push(e);
  }
  return Array.from(map.entries()).map(([name, entries]) => ({
    name,
    entries: entries.slice().sort((a, b) => a.label.localeCompare(b.label)),
  }));
}
