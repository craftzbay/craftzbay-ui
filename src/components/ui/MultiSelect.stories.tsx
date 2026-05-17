import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { MultiSelect } from './MultiSelect';

const options = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'devops', label: 'DevOps' },
  { value: 'design', label: 'Design' },
  { value: 'pm', label: 'Product' },
];

const meta: Meta = { title: 'Primitives/MultiSelect' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const [v, setV] = useState<string[]>(['frontend']);
    return (
      <div className="w-72">
        <MultiSelect value={v} onChange={setV} options={options} label="Tags" />
      </div>
    );
  },
};
