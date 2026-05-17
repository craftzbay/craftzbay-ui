import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowRight, Download, Mail, Plus, Trash2 } from 'lucide-react';
import { Button } from './Button';

const meta = {
  title: 'Primitives/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Button' },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'outline', 'ghost', 'destructive', 'link'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'icon'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} variant="primary">Primary</Button>
      <Button {...args} variant="secondary">Secondary</Button>
      <Button {...args} variant="outline">Outline</Button>
      <Button {...args} variant="ghost">Ghost</Button>
      <Button {...args} variant="destructive">Destructive</Button>
      <Button {...args} variant="link">Link</Button>
    </div>
  ),
  args: { children: undefined },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
    </div>
  ),
  args: { children: undefined },
};

export const WithIcons: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} leadingIcon={<Mail />}>Email me</Button>
      <Button {...args} variant="outline" trailingIcon={<ArrowRight />}>Continue</Button>
      <Button {...args} variant="secondary" leadingIcon={<Download />}>Download</Button>
      <Button {...args} variant="destructive" leadingIcon={<Trash2 />}>Delete</Button>
      <Button {...args} variant="ghost" leadingIcon={<Plus />}>Add</Button>
    </div>
  ),
  args: { children: undefined },
};

export const Loading: Story = {
  args: { loading: true, children: 'Saving…' },
};

export const Disabled: Story = {
  args: { disabled: true, children: 'Disabled' },
};

export const FullRow: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div className="flex flex-col gap-6 p-8">
      {(['primary', 'secondary', 'outline', 'ghost', 'destructive', 'link'] as const).map(
        (v) => (
          <div key={v} className="flex items-center gap-3">
            <span className="w-24 text-xs text-foreground-muted">{v}</span>
            <Button variant={v} size="sm">Small</Button>
            <Button variant={v} size="md">Medium</Button>
            <Button variant={v} size="lg">Large</Button>
            <Button variant={v} disabled>Disabled</Button>
            <Button variant={v} loading>Loading</Button>
          </div>
        ),
      )}
    </div>
  ),
};
