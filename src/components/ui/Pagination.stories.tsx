import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination } from './Pagination';

const meta = {
  title: 'Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: { page: 3, pageCount: 12, totalItems: 240, pageSize: 20, onPageChange: () => {} },
} satisfies Meta<typeof Pagination>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithPageSize: Story = {
  args: {
    pageSizeOptions: [10, 20, 50, 100],
    onPageSizeChange: () => {},
  },
};
