import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumbs } from './Breadcrumbs';

const meta = {
  title: 'Navigation/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
} satisfies Meta<typeof Breadcrumbs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { label: 'Workspace', href: '/' },
      { label: 'Projects', href: '/projects' },
      { label: 'Atlas', href: '/projects/atlas' },
      { label: 'Settings' },
    ],
  },
};

export const Collapsed: Story = {
  args: {
    maxItems: 3,
    items: [
      { label: 'Workspace', href: '/' },
      { label: 'Projects', href: '/projects' },
      { label: 'Atlas', href: '/projects/atlas' },
      { label: 'Reports', href: '/projects/atlas/reports' },
      { label: 'Weekly' },
    ],
  },
};
