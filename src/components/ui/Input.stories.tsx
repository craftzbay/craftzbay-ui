import type { Meta, StoryObj } from '@storybook/react-vite';
import { Mail, Search } from 'lucide-react';
import { Input } from './Input';

const meta = {
  title: 'Primitives/Input',
  component: Input,
  tags: ['autodocs'],
  args: { placeholder: 'jane@example.com' },
} satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithPrefix: Story = {
  args: { prefix: <Mail className="size-4" />, placeholder: 'Email' },
};

export const WithSuffix: Story = {
  args: { suffix: <Search className="size-4" />, placeholder: 'Search…' },
};

export const WithError: Story = {
  args: { error: 'Email is required', defaultValue: '', placeholder: 'Email' },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Locked' },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-3">
      <Input size="sm" placeholder="Small" />
      <Input size="md" placeholder="Medium" />
      <Input size="lg" placeholder="Large" />
    </div>
  ),
};
