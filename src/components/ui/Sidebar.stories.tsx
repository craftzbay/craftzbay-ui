import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bell, FolderKanban, Home, Settings, Users } from 'lucide-react';
import { Sidebar, SidebarItem, SidebarSection } from './Sidebar';

const meta: Meta = {
  title: 'Navigation/Sidebar',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="flex h-[480px]">
      <Sidebar>
        <SidebarSection>
          <SidebarItem icon={<Home />} active>Overview</SidebarItem>
          <SidebarItem icon={<FolderKanban />}>Projects</SidebarItem>
          <SidebarItem icon={<Users />}>Team</SidebarItem>
        </SidebarSection>
        <SidebarSection label="Personal">
          <SidebarItem icon={<Bell />}>Notifications</SidebarItem>
          <SidebarItem icon={<Settings />}>Settings</SidebarItem>
        </SidebarSection>
      </Sidebar>
      <div className="flex-1 bg-background-subtle p-6 text-sm text-foreground-muted">
        Page content
      </div>
    </div>
  ),
};
