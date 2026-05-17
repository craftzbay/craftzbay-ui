import type { Meta, StoryObj } from '@storybook/react-vite';
import { Inbox, Plus } from 'lucide-react';
import { Button } from './Button';
import { EmptyState } from './EmptyState';

const meta = {
  title: 'Feedback/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  args: {
    icon: <Inbox className="size-6" />,
    title: 'No projects yet',
    description: 'Create your first project to get started.',
    action: <Button leadingIcon={<Plus />}>New project</Button>,
  },
} satisfies Meta<typeof EmptyState>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
