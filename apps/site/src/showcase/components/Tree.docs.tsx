import { Tree } from '@/components/ui/Tree';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'tree',
  name: 'Tree',
  group: 'Data Display',
  description:
    'Hierarchical list with expand / collapse. Use for file explorers, nested settings, taxonomies. Keyboard-navigable: arrows expand, Enter activates.',
  exports: ['Tree'],
  sourceFile: 'Tree.tsx',
  examples: [
    {
      title: 'Default',
      preview: (
        <Tree
          className="w-full max-w-sm"
          defaultExpanded={['src', 'src/components']}
          data={[
            {
              id: 'src',
              label: 'src',
              children: [
                {
                  id: 'src/components',
                  label: 'components',
                  children: [
                    { id: 'src/components/Button.tsx', label: 'Button.tsx' },
                    { id: 'src/components/Card.tsx', label: 'Card.tsx' },
                  ],
                },
                { id: 'src/index.ts', label: 'index.ts' },
              ],
            },
            { id: 'README.md', label: 'README.md' },
            { id: 'package.json', label: 'package.json' },
          ]}
        />
      ),
      code: `<Tree
  defaultExpanded={['src']}
  data={[
    { id: 'src', label: 'src', children: [
      { id: 'src/index.ts', label: 'index.ts' },
    ]},
    { id: 'README.md', label: 'README.md' },
  ]}
/>`,
    },
  ],
  api: [
    {
      rows: [
        {
          name: 'data',
          type: 'TreeNode[]',
          required: true,
          description: 'Recursive node descriptor.',
        },
        {
          name: 'defaultExpanded',
          type: 'string[]',
          description: 'Uncontrolled initially expanded node IDs.',
        },
        {
          name: 'expanded / onExpandedChange',
          type: 'string[]',
          description: 'Controlled expanded state.',
        },
        { name: 'selected / onSelect', type: 'string', description: 'Controlled selection.' },
      ],
    },
  ],
  accessibility: ['Arrow keys: Right expands, Left collapses, Up/Down navigate, Enter activates.'],
  keyboard: [
    { key: 'ArrowDown / ArrowUp', action: 'Move focus to the next / previous visible node.' },
    { key: 'ArrowRight', action: 'Expand a collapsed node, or move to its first child.' },
    { key: 'ArrowLeft', action: 'Collapse an expanded node, or move to its parent.' },
    { key: 'Home / End', action: 'Move focus to the first / last visible node.' },
    { key: 'Enter / Space', action: 'Select the focused node (toggles expansion on parents).' },
  ],
};

export default doc;
