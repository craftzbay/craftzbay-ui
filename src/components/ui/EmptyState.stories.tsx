import type { Meta, StoryObj } from '@storybook/react-vite';
import { Plus } from 'lucide-react';
import { Button } from './Button';
import { InboxEmpty, NoSearchResults } from '@/illustrations';
import { EmptyState } from './EmptyState';

const meta = {
  title: 'Feedback/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  args: {
    icon: <InboxEmpty />,
    title: 'No projects yet',
    description: 'Create your first project to get started.',
    action: <Button leadingIcon={<Plus />}>New project</Button>,
  },
} satisfies Meta<typeof EmptyState>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoResults: Story = {
  args: {
    icon: <NoSearchResults />,
    title: 'No results',
    description: 'Try a different search term or clear filters.',
    action: <Button variant="outline">Clear filters</Button>,
  },
};
