import type { Meta, StoryObj } from '@storybook/react-vite';
import { Slider } from './Slider';

const meta = {
  title: 'Primitives/Slider',
  component: Slider,
  tags: ['autodocs'],
} satisfies Meta<typeof Slider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { defaultValue: [40], label: 'Volume', showValue: true, formatValue: (v) => `${v}%` },
};

export const Range: Story = {
  args: {
    defaultValue: [200, 800],
    label: 'Price range',
    showValue: true,
    min: 0,
    max: 1000,
    formatValue: (v) => `$${v}`,
  },
};
