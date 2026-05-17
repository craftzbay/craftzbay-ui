import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, AvatarGroup } from './Avatar';

const meta = {
  title: 'Data Display/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: { src: 'https://i.pravatar.cc/96?u=jane', alt: 'Jane', fallback: 'JD' },
} satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar size="xs" fallback="AB" />
      <Avatar size="sm" fallback="CD" />
      <Avatar size="md" fallback="EF" />
      <Avatar size="lg" fallback="GH" />
      <Avatar size="xl" fallback="IJ" />
    </div>
  ),
};

export const Fallback: Story = {
  args: { src: undefined, fallback: 'BO' },
};

export const WithStatus: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar fallback="ON" status="online" />
      <Avatar fallback="BS" status="busy" />
      <Avatar fallback="AW" status="away" />
      <Avatar fallback="OF" status="offline" />
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <AvatarGroup max={3}>
      <Avatar src="https://i.pravatar.cc/96?u=1" fallback="1" />
      <Avatar src="https://i.pravatar.cc/96?u=2" fallback="2" />
      <Avatar src="https://i.pravatar.cc/96?u=3" fallback="3" />
      <Avatar src="https://i.pravatar.cc/96?u=4" fallback="4" />
      <Avatar src="https://i.pravatar.cc/96?u=5" fallback="5" />
    </AvatarGroup>
  ),
};
