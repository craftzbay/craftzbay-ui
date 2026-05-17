import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { DatePicker, DateRangePicker } from './DatePicker';

const meta: Meta = { title: 'Primitives/DatePicker' };
export default meta;
type Story = StoryObj;

export const Single: Story = {
  render: () => {
    const [d, setD] = useState<Date | undefined>();
    return (
      <div className="w-64">
        <DatePicker value={d} onChange={setD} label="Due date" />
      </div>
    );
  },
};

export const Range: Story = {
  render: () => {
    const [r, setR] = useState<DateRange | undefined>();
    return (
      <div className="w-72">
        <DateRangePicker value={r} onChange={setR} label="Period" />
      </div>
    );
  },
};
