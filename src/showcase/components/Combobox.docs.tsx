import { useState } from 'react';
import { Combobox } from '@/components/ui/Combobox';
import type { ComponentDoc } from '../registry/types';

function Demo() {
  const [v, setV] = useState<string | null>('ts');
  return (
    <Combobox
      value={v}
      onChange={setV}
      options={[
        { value: 'go', label: 'Go' },
        { value: 'ts', label: 'TypeScript' },
        { value: 'rs', label: 'Rust' },
        { value: 'py', label: 'Python' },
        { value: 'java', label: 'Java' },
      ]}
      placeholder="Language"
    />
  );
}

const doc: ComponentDoc = {
  slug: 'combobox',
  name: 'Combobox',
  group: 'Inputs',
  description:
    'Searchable single-select. Use when option count is large (20+) or when filter-as-you-type is faster than scanning a menu. Supports async option loading.',
  exports: ['Combobox'],
  sourceFile: 'Combobox.tsx',
  examples: [
    {
      title: 'Default',
      preview: <Demo />,
      code: `const [v, setV] = useState<string | null>('ts');

<Combobox
  value={v}
  onChange={setV}
  options={[
    { value: 'go', label: 'Go' },
    { value: 'ts', label: 'TypeScript' },
    { value: 'rs', label: 'Rust' },
  ]}
  placeholder="Language"
/>`,
    },
  ],
  api: [
    {
      rows: [
        { name: 'value', type: 'string | null', required: true, description: 'Controlled selection.' },
        { name: 'onChange', type: '(v: string | null) => void', required: true, description: 'Fires on select / clear.' },
        { name: 'options', type: 'Array<{ value: string; label: string; disabled?: boolean }>', required: true, description: 'Choices to render.' },
        { name: 'placeholder', type: 'string', description: 'Shown when value is null.' },
        { name: 'onSearch', type: '(q: string) => void', description: 'Use for async option fetching.' },
        { name: 'loading', type: 'boolean', default: 'false', description: 'Show spinner in dropdown while options load.' },
        { name: 'emptyText', type: 'string', default: `'No results'`, description: 'Empty-state message.' },
      ],
    },
  ],
  accessibility: [
    'Type-ahead filters as you type; arrow keys navigate filtered results.',
    'Esc closes; Enter selects highlighted option.',
  ],
  related: [
    { slug: 'select', reason: 'For fixed 5–20 options without search.' },
    { slug: 'multi-select', reason: 'For multiple selections.' },
  ],
};

export default doc;
