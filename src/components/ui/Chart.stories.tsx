import type { Meta, StoryObj } from '@storybook/react-vite';
import { AreaChart, BarChart, LineChart } from './Chart';

const meta: Meta = {
  title: 'Data Display/Chart',
};
export default meta;
type Story = StoryObj;

const trend = [22, 18, 26, 30, 28, 35, 41, 38, 45, 50, 48, 56].map((y, i) => ({ x: i, y }));

export const Line: Story = {
  render: () => (
    <div className="w-80">
      <LineChart data={trend} caption="MRR · last 12 months" />
    </div>
  ),
};

export const Area: Story = {
  render: () => (
    <div className="w-80">
      <AreaChart data={trend} caption="Active users · last 12 months" />
    </div>
  ),
};

export const Bar: Story = {
  render: () => (
    <div className="w-80">
      <BarChart data={trend} caption="Signups by week" />
    </div>
  ),
};
