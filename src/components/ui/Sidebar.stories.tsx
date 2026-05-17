import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  BarChart3,
  Bell,
  Bookmark,
  ChevronsUpDown,
  Folder,
  HelpCircle,
  Home,
  Inbox,
  LayoutGrid,
  Plug,
  Plus,
  Search,
  Settings,
  Users,
} from '@/icons';
import { Avatar } from './Avatar';
import { Badge } from './Badge';
import { Sidebar, SidebarGroup, SidebarItem, SidebarSection } from './Sidebar';

const meta: Meta = {
  title: 'Navigation/Sidebar',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

function Brand() {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-2 rounded-md p-1.5 text-left outline-none transition-colors hover:bg-background-muted focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-accent text-on-accent text-xs font-semibold">
        ✦
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">Atlas</p>
        <p className="truncate text-[11px] text-foreground-subtle">Pro workspace</p>
      </div>
      <ChevronsUpDown className="size-3.5 shrink-0 text-foreground-subtle" aria-hidden />
    </button>
  );
}

function ProfileFooter() {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-2.5 rounded-md px-1 py-1 text-left outline-none transition-colors hover:bg-background-muted focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Avatar fallback="BO" size="sm" status="online" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">Bay Otgonbayar</p>
        <p className="truncate text-xs text-foreground-subtle">Owner</p>
      </div>
      <ChevronsUpDown className="size-3.5 shrink-0 text-foreground-subtle" aria-hidden />
    </button>
  );
}

function PageBody({ title }: { title: string }) {
  return (
    <div className="flex flex-1 flex-col gap-4 bg-background-subtle p-6">
      <div className="flex items-center gap-3 rounded-md border border-border bg-card px-3 py-2">
        <Search className="size-4 text-foreground-subtle" aria-hidden />
        <input
          placeholder="Search projects, members, files…"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-foreground-subtle"
        />
      </div>
      <div className="rounded-md border border-dashed border-border bg-card p-8 text-center text-sm text-foreground-muted">
        {title}
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <div className="flex h-[640px]">
      <Sidebar header={<Brand />} footer={<ProfileFooter />}>
        <SidebarSection label="Workspace">
          <SidebarItem icon={<Home />} active>
            Overview
          </SidebarItem>
          <SidebarItem icon={<Folder />} trailing={<Badge tone="neutral">12</Badge>}>
            Projects
          </SidebarItem>
          <SidebarItem icon={<Inbox />} trailing={<Badge tone="accent">5</Badge>}>
            Inbox
          </SidebarItem>
          <SidebarItem icon={<Users />} trailing={<Badge tone="neutral">3</Badge>}>
            Team
          </SidebarItem>
          <SidebarItem icon={<BarChart3 />}>Insights</SidebarItem>
        </SidebarSection>

        <SidebarSection label="Personal">
          <SidebarItem icon={<Bell />}>Notifications</SidebarItem>
          <SidebarItem icon={<Bookmark />}>Bookmarks</SidebarItem>
          <SidebarItem icon={<LayoutGrid />}>Apps</SidebarItem>
        </SidebarSection>

        <SidebarSection label="Account">
          <SidebarItem icon={<Settings />}>Settings</SidebarItem>
          <SidebarItem icon={<Plug />}>Integrations</SidebarItem>
          <SidebarItem icon={<HelpCircle />}>Help & docs</SidebarItem>
        </SidebarSection>
      </Sidebar>
      <PageBody title="Page content" />
    </div>
  ),
};

export const WithCollapsibleGroups: Story = {
  render: () => (
    <div className="flex h-[640px]">
      <Sidebar header={<Brand />} footer={<ProfileFooter />}>
        <SidebarSection label="Workspace">
          <SidebarItem icon={<Home />} active>
            Overview
          </SidebarItem>
          <SidebarGroup icon={<Folder />} label="Projects" defaultOpen>
            <SidebarItem sub>Atlas</SidebarItem>
            <SidebarItem sub>Beacon</SidebarItem>
            <SidebarItem sub>Cinder</SidebarItem>
            <SidebarItem sub trailing={<Badge tone="accent">new</Badge>}>
              Delta
            </SidebarItem>
          </SidebarGroup>
          <SidebarGroup icon={<Users />} label="Teams">
            <SidebarItem sub>Engineering</SidebarItem>
            <SidebarItem sub>Design</SidebarItem>
            <SidebarItem sub>Marketing</SidebarItem>
          </SidebarGroup>
        </SidebarSection>

        <SidebarSection label="Pinned">
          <SidebarItem icon={<Bookmark />}>Q2 OKRs</SidebarItem>
          <SidebarItem icon={<Bookmark />}>Roadmap 2026</SidebarItem>
        </SidebarSection>

        <SidebarSection label="Account">
          <SidebarItem icon={<Settings />}>Settings</SidebarItem>
        </SidebarSection>
      </Sidebar>
      <PageBody title="Click a group header to collapse / expand." />
    </div>
  ),
};

export const Collapsed: Story = {
  render: () => (
    <div className="flex h-[640px]">
      <Sidebar defaultCollapsed header={<Brand />} footer={<ProfileFooter />}>
        <SidebarSection label="Workspace">
          <SidebarItem icon={<Home />} active>
            Overview
          </SidebarItem>
          <SidebarItem icon={<Folder />}>Projects</SidebarItem>
          <SidebarItem icon={<Inbox />}>Inbox</SidebarItem>
          <SidebarItem icon={<Users />}>Team</SidebarItem>
        </SidebarSection>
        <SidebarSection label="Account">
          <SidebarItem icon={<Settings />}>Settings</SidebarItem>
        </SidebarSection>
      </Sidebar>
      <PageBody title="Sidebar starts collapsed — click the rail to expand." />
    </div>
  ),
};

export const Minimal: Story = {
  render: () => (
    <div className="flex h-[480px]">
      <Sidebar>
        <SidebarSection>
          <SidebarItem icon={<Home />} active>
            Overview
          </SidebarItem>
          <SidebarItem icon={<Folder />}>Projects</SidebarItem>
          <SidebarItem icon={<Users />}>Team</SidebarItem>
        </SidebarSection>
      </Sidebar>
      <PageBody title="Sidebar without brand header or profile footer." />
    </div>
  ),
};

export const WithCallToAction: Story = {
  render: () => (
    <div className="flex h-[640px]">
      <Sidebar
        header={<Brand />}
        footer={
          <div className="flex flex-col gap-3">
            <div className="rounded-md border border-border bg-card p-3">
              <p className="text-xs font-medium">Upgrade to Pro</p>
              <p className="mt-0.5 text-[11px] text-foreground-muted">
                Unlimited projects + SSO
              </p>
              <button
                type="button"
                className="mt-2 inline-flex h-7 w-full items-center justify-center rounded-md bg-accent text-xs font-medium text-on-accent hover:bg-accent-700"
              >
                See plans
              </button>
            </div>
            <ProfileFooter />
          </div>
        }
      >
        <SidebarSection>
          <button
            type="button"
            className="mx-2 mb-2 flex h-8 items-center gap-2 rounded-md bg-accent px-2 text-sm font-medium text-on-accent hover:bg-accent-700"
          >
            <Plus className="size-4" /> New project
          </button>
        </SidebarSection>
        <SidebarSection label="Workspace">
          <SidebarItem icon={<Home />} active>
            Overview
          </SidebarItem>
          <SidebarItem icon={<Folder />} trailing={<Badge tone="neutral">12</Badge>}>
            Projects
          </SidebarItem>
          <SidebarItem icon={<Inbox />} trailing={<Badge tone="accent">5</Badge>}>
            Inbox
          </SidebarItem>
        </SidebarSection>
      </Sidebar>
      <PageBody title="Sidebar footer can host upgrade CTAs, version banners, etc." />
    </div>
  ),
};
