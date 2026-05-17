import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from './Textarea';

const meta = {
  title: 'Primitives/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: { placeholder: 'Write something…' },
} satisfies Meta<typeof Textarea>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Filled: Story = { args: { defaultValue: 'A quick note about the change.' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Locked.' } };
