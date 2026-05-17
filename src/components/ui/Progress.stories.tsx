import type { Meta, StoryObj } from '@storybook/react-vite';
import { Progress, ProgressCircle } from './Progress';

const meta = {
  title: 'Feedback/Progress',
  component: Progress,
  tags: ['autodocs'],
  args: { 'aria-label': 'Upload progress', value: 60 },
} satisfies Meta<typeof Progress>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Indeterminate: Story = { args: { value: undefined } };

export const Circle: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <ProgressCircle value={24} aria-label="Storage used" />
      <ProgressCircle value={68} aria-label="Storage used" />
      <ProgressCircle value={92} aria-label="Storage used" />
    </div>
  ),
};
