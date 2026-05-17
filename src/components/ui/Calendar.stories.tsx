import type { Meta, StoryObj } from '@storybook/react-vite';
import { Calendar } from './Calendar';

const meta = {
  title: 'Primitives/Calendar',
  component: Calendar,
  tags: ['autodocs'],
} satisfies Meta<typeof Calendar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = { args: { mode: 'single' as const } };
export const Range: Story = { args: { mode: 'range' as const, numberOfMonths: 2 } };
export const Multiple: Story = { args: { mode: 'multiple' as const } };
