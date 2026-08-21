import { TagInput } from '@/components/ui/TagInput';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'tag-input',
  name: 'TagInput',
  group: 'Inputs',
  description:
    'Free-text chip input. Type a tag, press Enter or comma to add. Backspace removes the last tag when the input is empty. Use MultiSelect when tags must come from a fixed list.',
  i18n: 'Reads `tagInput.placeholder` and `tagInput.remove` ("Remove {tag}").',
  exports: ['TagInput'],
  sourceFile: 'TagInput.tsx',
  examples: [
    {
      title: 'Default',
      preview: (
        <TagInput defaultValue={['frontend', 'react', 'typescript']} className="w-full max-w-md" />
      ),
      code: `<TagInput defaultValue={['frontend', 'react', 'typescript']} />`,
    },
  ],
  api: [
    {
      rows: [
        { name: 'value', type: 'string[]', description: 'Controlled tags.' },
        { name: 'defaultValue', type: 'string[]', description: 'Uncontrolled initial tags.' },
        {
          name: 'onChange',
          type: '(tags: string[]) => void',
          description: 'Fires on add / remove.',
        },
        { name: 'placeholder', type: 'string', description: 'Empty-state placeholder.' },
        { name: 'max', type: 'number', description: 'Maximum number of tags.' },
        {
          name: 'allowDuplicates',
          type: 'boolean',
          default: 'false',
          description: 'Allow the same tag twice.',
        },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the field.' },
      ],
    },
  ],
  accessibility: [
    'Each chip is keyboard-removable with Backspace from an empty input or Delete on the chip itself.',
    'Tab moves through chips; arrow keys navigate between them.',
  ],
  related: [{ slug: 'multi-select', reason: 'When tags come from a known set.' }],
};

export default doc;
