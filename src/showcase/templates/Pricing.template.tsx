import type { TemplateDoc } from '../registry/types';

const doc: TemplateDoc = {
  slug: 'pricing',
  name: 'Pricing',
  description: '3-tier comparison grid with feature lists and CTAs. Tiers are declared as data — drop in any number, change copy without touching layout.',
  exports: ['Pricing'],
  sourceFile: 'Pricing.tsx',
  previewSlug: 'pricing',
  useCases: ['Marketing pricing page', 'In-app upgrade flow'],
  examples: [
    {
      title: 'Usage',
      preview: (
        <div className="text-sm text-foreground-muted">
          Open the <a className="text-accent hover:underline" href="#preview/pricing">full-page preview ↗</a>.
        </div>
      ),
      code: `<Pricing
  tiers={[
    { name: 'Starter', price: { monthly: 0, yearly: 0 }, features: [...], cta: 'Start free' },
    { name: 'Team', price: { monthly: 12, yearly: 120 }, features: [...], cta: 'Try Team', highlighted: true },
    { name: 'Enterprise', price: 'Custom', features: [...], cta: 'Contact sales' },
  ]}
  billingPeriod="monthly"
  onSelect={(tier) => router.push(\`/checkout?plan=\${tier.name}\`)}
/>`,
    },
  ],
};

export default doc;
