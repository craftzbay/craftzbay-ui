import { Folder, Home, Settings, Users } from '@/icons';
import { Sidebar, SidebarItem, SidebarSection } from '@/components/ui/Sidebar';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'sidebar',
  name: 'Sidebar',
  group: 'Navigation',
  description:
    'Sticky left navigation rail. Collapsible to icons-only. Compose SidebarSection + SidebarItem; access collapsed state via useSidebar().',
  exports: ['Sidebar', 'SidebarSection', 'SidebarItem', 'SidebarGroup', 'useSidebar'],
  sourceFile: 'Sidebar.tsx',
  examples: [
    {
      title: 'Default',
      preview: (
        <div className="flex h-64 w-full max-w-lg overflow-hidden rounded-md border border-border">
          <Sidebar className="!sticky-none !h-full" defaultCollapsed={false}>
            <SidebarSection>
              <SidebarItem icon={<Home />} active>Home</SidebarItem>
              <SidebarItem icon={<Folder />}>Projects</SidebarItem>
              <SidebarItem icon={<Users />}>Members</SidebarItem>
              <SidebarItem icon={<Settings />}>Settings</SidebarItem>
            </SidebarSection>
          </Sidebar>
          <div className="flex-1 bg-background-subtle p-4 text-xs text-foreground-muted">Main content area</div>
        </div>
      ),
      code: `<Sidebar defaultCollapsed={false}>
  <SidebarSection>
    <SidebarItem icon={<Home />} active>Home</SidebarItem>
    <SidebarItem icon={<Folder />}>Projects</SidebarItem>
    <SidebarItem icon={<Users />}>Members</SidebarItem>
  </SidebarSection>
</Sidebar>`,
    },
  ],
  api: [
    {
      title: 'Sidebar',
      rows: [
        { name: 'defaultCollapsed', type: 'boolean', default: 'false', description: 'Initial collapsed state.' },
        { name: 'collapsed', type: 'boolean', description: 'Controlled collapsed state.' },
        { name: 'onCollapsedChange', type: '(c: boolean) => void', description: 'Fires when collapse changes.' },
        { name: 'header', type: 'ReactNode', description: 'Rendered above nav (logo / brand).' },
        { name: 'footer', type: 'ReactNode', description: 'Rendered at the bottom (user menu).' },
      ],
    },
    {
      title: 'SidebarItem',
      rows: [
        { name: 'icon', type: 'ReactNode', description: 'Leading icon, always visible.' },
        { name: 'active', type: 'boolean', default: 'false', description: 'Highlights as current.' },
        { name: 'trailing', type: 'ReactNode', description: 'Right-aligned content (Badge, count).' },
        { name: 'href', type: 'string', description: 'If set, renders as an anchor.' },
      ],
    },
  ],
  accessibility: [
    'Renders as a real <nav>; SidebarItem with `active` sets aria-current="page".',
    'Collapsed icon-only items keep their label as aria-label so screen readers still announce them.',
  ],
  related: [
    { slug: 'top-nav', reason: 'Horizontal nav alternative.' },
  ],
};

export default doc;
