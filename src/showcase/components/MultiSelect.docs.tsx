import { useState } from 'react';
import { MultiSelect } from '@/components/ui/MultiSelect';
import type { ComponentDoc } from '../registry/types';

function Demo() {
  const [v, setV] = useState<string[]>(['frontend', 'design']);
  return (
    <MultiSelect
      value={v}
      onChange={setV}
      options={[
        { value: 'frontend', label: 'Frontend' },
        { value: 'backend', label: 'Backend' },
        { value: 'design', label: 'Design' },
        { value: 'data', label: 'Data' },
        { value: 'devops', label: 'DevOps' },
      ]}
      placeholder="Pick teams"
      className="w-full max-w-xs"
    />
  );
}

const doc: ComponentDoc = {
  slug: 'multi-select',
  name: 'MultiSelect',
  group: 'Inputs',
  description:
    'Chip-based multi-choice picker. Selected items show inline as removable chips. Backspace clears the last chip when the input is empty.',
  exports: ['MultiSelect'],
  sourceFile: 'MultiSelect.tsx',
  examples: [
    {
      title: 'Default',
      preview: <Demo />,
      code: `const [v, setV] = useState<string[]>([]);

<MultiSelect
  value={v}
  onChange={setV}
  options={[
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'design', label: 'Design' },
  ]}
  placeholder="Pick teams"
/>`,
    },
  ],
  api: [
    {
      rows: [
        { name: 'value', type: 'string[]', required: true, description: 'Controlled list of selected values.' },
        { name: 'onChange', type: '(v: string[]) => void', required: true, description: 'Fires on add / remove.' },
        { name: 'options', type: 'Array<{ value: string; label: string }>', required: true, description: 'Choices.' },
        { name: 'placeholder', type: 'string', description: 'Empty-state placeholder.' },
        { name: 'maxVisibleChips', type: 'number', default: '3', description: 'How many chips render inline before "+N".' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the field.' },
      ],
    },
  ],
  accessibility: [
    'Each chip has aria-label="Remove <label>" and is keyboard-removable with Backspace from the input.',
    'Type-ahead filters the dropdown. Enter adds the highlighted option.',
  ],
  related: [
    { slug: 'tag-input', reason: 'For free-text tags (no fixed options).' },
    { slug: 'combobox', reason: 'For single selection.' },
  ],
};

export default doc;
