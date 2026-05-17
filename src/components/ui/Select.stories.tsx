import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select, SelectContent, SelectItem, SelectTrigger } from './Select';

const meta: Meta = { title: 'Primitives/Select' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Select defaultValue="usd">
      <SelectTrigger className="w-48" placeholder="Currency" />
      <SelectContent>
        <SelectItem value="usd">US Dollar</SelectItem>
        <SelectItem value="eur">Euro</SelectItem>
        <SelectItem value="jpy">Japanese Yen</SelectItem>
        <SelectItem value="mnt">Mongolian Tögrög</SelectItem>
      </SelectContent>
    </Select>
  ),
};
