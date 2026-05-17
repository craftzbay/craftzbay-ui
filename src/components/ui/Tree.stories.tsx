import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tree, type TreeNode } from './Tree';

const meta: Meta = {
  title: 'Data Display/Tree',
};
export default meta;
type Story = StoryObj;

const data: TreeNode[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      {
        id: 'components',
        label: 'components',
        children: [
          { id: 'Button.tsx', label: 'Button.tsx' },
          { id: 'Input.tsx', label: 'Input.tsx' },
          { id: 'Dialog.tsx', label: 'Dialog.tsx' },
        ],
      },
      { id: 'index.ts', label: 'index.ts' },
    ],
  },
  { id: 'README.md', label: 'README.md' },
  { id: 'package.json', label: 'package.json' },
];

export const Default: Story = {
  render: () => (
    <Tree data={data} defaultExpanded={['src', 'components']} className="w-72" />
  ),
};
