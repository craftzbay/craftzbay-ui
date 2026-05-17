import type { Meta, StoryObj } from '@storybook/react-vite';
import { Separator } from './Separator';

const meta: Meta = { title: 'Layout/Separator' };
export default meta;
type Story = StoryObj;

export const Horizontal: Story = {
  render: () => (
    <div className="w-72 space-y-3">
      <p className="text-sm">Block one</p>
      <Separator />
      <p className="text-sm">Block two</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-12 items-center gap-3 text-sm">
      <span>Inbox</span>
      <Separator orientation="vertical" />
      <span>Sent</span>
      <Separator orientation="vertical" />
      <span>Archive</span>
    </div>
  ),
};
