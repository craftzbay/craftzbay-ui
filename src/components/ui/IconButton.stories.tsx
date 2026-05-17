import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bell, MoreHorizontal, Search, Settings, X } from 'lucide-react';
import { IconButton } from './IconButton';

const meta = {
  title: 'Primitives/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  args: { 'aria-label': 'Settings', icon: <Settings /> },
} satisfies Meta<typeof IconButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <IconButton aria-label="Notifications" icon={<Bell />} />
      <IconButton variant="secondary" aria-label="Search" icon={<Search />} />
      <IconButton variant="outline" aria-label="More" icon={<MoreHorizontal />} />
      <IconButton variant="ghost" aria-label="Close" icon={<X />} />
      <IconButton variant="destructive" aria-label="Delete" icon={<X />} />
    </div>
  ),
};
