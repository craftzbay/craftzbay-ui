import { Stepper } from '@/components/ui/Stepper';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'stepper',
  name: 'Stepper',
  group: 'Navigation',
  description:
    'Linear progress indicator for multi-step flows: onboarding wizards, checkouts, multi-page forms. Past steps show as complete, current as active, future as pending.',
  i18n: 'Reads `stepper.label`, `stepper.complete`, `stepper.current`, `stepper.upcoming`.',
  exports: ['Stepper'],
  sourceFile: 'Stepper.tsx',
  examples: [
    {
      title: 'Horizontal',
      preview: (
        <Stepper
          current={1}
          className="w-full max-w-lg"
          steps={[
            { title: 'Account', description: 'Name & email' },
            { title: 'Team', description: 'Invite members' },
            { title: 'Billing', description: 'Choose plan' },
          ]}
        />
      ),
      code: `<Stepper
  current={1}
  steps={[
    { title: 'Account', description: 'Name & email' },
    { title: 'Team', description: 'Invite members' },
    { title: 'Billing', description: 'Choose plan' },
  ]}
/>`,
    },
    {
      title: 'Vertical',
      preview: (
        <Stepper
          current={1}
          orientation="vertical"
          className="w-full max-w-xs"
          steps={[{ title: 'Connect repo' }, { title: 'Configure build' }, { title: 'Deploy' }]}
        />
      ),
      code: `<Stepper orientation="vertical" current={1} steps={[…]} />`,
    },
  ],
  api: [
    {
      rows: [
        { name: 'current', type: 'number', required: true, description: '0-indexed active step.' },
        {
          name: 'steps',
          type: 'Array<{ title: ReactNode; description?: ReactNode }>',
          required: true,
          description: 'Step descriptors.',
        },
        {
          name: 'orientation',
          type: `'horizontal' | 'vertical'`,
          default: `'horizontal'`,
          description: 'Layout.',
        },
      ],
    },
  ],
  accessibility: ['Each step is announced as "Step X of Y" with completion state.'],
  related: [{ slug: 'tabs', reason: 'For non-linear section switches.' }],
};

export default doc;
