import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Primitives/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: { label: 'I agree to the terms' },
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = { args: { defaultChecked: true } };

export const WithDescription: Story = {
  args: {
    label: 'Email me product updates',
    description: 'About once a month, never on weekends.',
  },
};

export const Indeterminate: Story = { args: { checked: 'indeterminate' } };

export const Disabled: Story = { args: { disabled: true } };
