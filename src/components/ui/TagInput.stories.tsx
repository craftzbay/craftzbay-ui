import type { Meta, StoryObj } from '@storybook/react-vite';
import { TagInput } from './TagInput';

const meta = {
  title: 'Primitives/TagInput',
  component: TagInput,
  tags: ['autodocs'],
} satisfies Meta<typeof TagInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { placeholder: 'Type and press Enter…' } };
export const WithDefaults: Story = { args: { defaultValue: ['frontend', 'react', 'tailwind'] } };
export const WithMax: Story = { args: { defaultValue: ['a', 'b', 'c'], max: 3 } };
export const Disabled: Story = { args: { defaultValue: ['locked'], disabled: true } };
export const ErrorState: Story = { args: { defaultValue: ['bad'], error: true } };
