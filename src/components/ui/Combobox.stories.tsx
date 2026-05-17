import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Combobox } from './Combobox';

const options = [
  { value: 'go', label: 'Go' },
  { value: 'ts', label: 'TypeScript' },
  { value: 'py', label: 'Python' },
  { value: 'rs', label: 'Rust' },
  { value: 'kt', label: 'Kotlin' },
];

const meta: Meta = { title: 'Primitives/Combobox' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const [v, setV] = useState<string | null>(null);
    return (
      <div className="w-64">
        <Combobox value={v} onChange={setV} options={options} label="Language" />
      </div>
    );
  },
};
