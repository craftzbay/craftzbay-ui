import type { TemplateDoc } from '../registry/types';

const doc: TemplateDoc = {
  slug: 'onboarding',
  name: 'Onboarding wizard',
  description: 'Multi-step Stepper flow with one card per step. Steps are declared as data — the template handles navigation and per-step state.',
  exports: ['Onboarding'],
  sourceFile: 'Onboarding.tsx',
  previewSlug: 'onboarding',
  useCases: ['New user setup', 'Workspace creation flow', 'Integration setup wizard'],
  examples: [
    {
      title: 'Usage',
      preview: (
        <div className="text-sm text-foreground-muted">
          Open the <a className="text-accent hover:underline" href="#preview/onboarding">full-page preview ↗</a>.
        </div>
      ),
      code: `<Onboarding
  steps={[
    { id: 'account', title: 'Account', render: ({ next }) => <AccountStep onNext={next} /> },
    { id: 'team', title: 'Team', render: ({ next, prev }) => <TeamStep onNext={next} onPrev={prev} /> },
    { id: 'billing', title: 'Billing', render: ({ next, prev }) => <BillingStep onNext={next} onPrev={prev} /> },
    { id: 'done', title: 'Done', render: ({ finish }) => <Review onFinish={finish} /> },
  ]}
  onComplete={async (data) => api.completeOnboarding(data)}
/>`,
    },
  ],
};

export default doc;
