import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/Select';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'select',
  name: 'Select',
  group: 'Inputs',
  description:
    'Single-choice menu for 5–20 fixed options. Radix-backed: keyboard navigation, type-ahead, and screen-reader announcements are built in. For free-text + filter use Combobox.',
  exports: ['Select', 'SelectTrigger', 'SelectContent', 'SelectItem', 'SelectGroup', 'SelectValue'],
  sourceFile: 'Select.tsx',
  examples: [
    {
      title: 'Default',
      preview: (
        <Select defaultValue="usd">
          <SelectTrigger className="w-full max-w-xs" placeholder="Currency" />
          <SelectContent>
            <SelectItem value="usd">US Dollar (USD)</SelectItem>
            <SelectItem value="eur">Euro (EUR)</SelectItem>
            <SelectItem value="mnt">Mongolian Tögrög (MNT)</SelectItem>
            <SelectItem value="jpy">Japanese Yen (JPY)</SelectItem>
          </SelectContent>
        </Select>
      ),
      code: `<Select defaultValue="usd">
  <SelectTrigger placeholder="Currency" />
  <SelectContent>
    <SelectItem value="usd">US Dollar (USD)</SelectItem>
    <SelectItem value="eur">Euro (EUR)</SelectItem>
    <SelectItem value="mnt">Mongolian Tögrög (MNT)</SelectItem>
    <SelectItem value="jpy">Japanese Yen (JPY)</SelectItem>
  </SelectContent>
</Select>`,
    },
    {
      title: 'Disabled options',
      preview: (
        <Select defaultValue="free">
          <SelectTrigger className="w-full max-w-xs" placeholder="Plan" />
          <SelectContent>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="enterprise" disabled>
              Enterprise — contact sales
            </SelectItem>
          </SelectContent>
        </Select>
      ),
      code: `<SelectItem value="enterprise" disabled>
  Enterprise — contact sales
</SelectItem>`,
    },
  ],
  api: [
    {
      title: 'Select (root)',
      rows: [
        { name: 'value', type: 'string', description: 'Controlled value.' },
        { name: 'defaultValue', type: 'string', description: 'Uncontrolled initial value.' },
        { name: 'onValueChange', type: '(value: string) => void', description: 'Fires on selection.' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the trigger.' },
      ],
    },
    {
      title: 'SelectTrigger',
      rows: [
        { name: 'placeholder', type: 'string', description: 'Shown when nothing is selected.' },
        { name: 'className', type: 'string', description: 'Width / spacing overrides.' },
      ],
    },
    {
      title: 'SelectItem',
      rows: [
        { name: 'value', type: 'string', required: true, description: 'Unique value reported to onValueChange.' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Skip in keyboard navigation.' },
      ],
    },
  ],
  accessibility: [
    'Backed by @radix-ui/react-select — full keyboard nav, type-ahead, focus return, and ARIA.',
    'Renders inside a portal — overflow:hidden on ancestors does not clip the menu.',
  ],
  related: [
    { slug: 'combobox', reason: 'Searchable single-select.' },
    { slug: 'multi-select', reason: 'When users need multiple choices.' },
    { slug: 'radio-group', reason: 'For 2–4 visible options.' },
  ],
};

export default doc;
