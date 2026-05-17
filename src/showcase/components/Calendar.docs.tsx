import { Calendar } from '@/components/ui/Calendar';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'calendar',
  name: 'Calendar',
  group: 'Inputs',
  description:
    'Inline calendar grid. Useful when the calendar must always be visible — e.g. booking flows, schedules. For form fields, prefer DatePicker.',
  exports: ['Calendar'],
  sourceFile: 'Calendar.tsx',
  examples: [
    {
      title: 'Single mode',
      preview: <Calendar mode="single" />,
      code: `<Calendar mode="single" />`,
      surfaceClassName: 'min-h-[340px]',
    },
  ],
  api: [
    {
      rows: [
        { name: 'mode', type: `'single' | 'range' | 'multiple'`, default: `'single'`, description: 'Selection mode.' },
        { name: 'selected', type: 'Date | DateRange | Date[]', description: 'Controlled selection.' },
        { name: 'onSelect', type: '(value) => void', description: 'Fires on day click.' },
        { name: 'startMonth / endMonth', type: 'Date', description: 'Navigation bounds.' },
        { name: 'showOutsideDays', type: 'boolean', default: 'true', description: 'Render days from adjacent months.' },
      ],
    },
  ],
  accessibility: [
    'Renders as a real ARIA grid; days are buttons with aria-pressed for selection.',
    'Respects locale via Intl.DateTimeFormat — weekday headers reflect user locale.',
  ],
  related: [{ slug: 'date-picker', reason: 'Calendar in a dropdown.' }],
};

export default doc;
