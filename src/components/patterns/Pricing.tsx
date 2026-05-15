import { Check } from '@/icons';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface Tier {
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

const tiers: Tier[] = [
  {
    name: 'Starter',
    price: '$0',
    cadence: 'forever',
    description: 'For individuals exploring the product.',
    features: ['Up to 3 projects', 'Community support', 'Single workspace'],
    cta: 'Start free',
  },
  {
    name: 'Team',
    price: '$20',
    cadence: 'per user / month',
    description: 'For small teams running real workloads.',
    features: [
      'Unlimited projects',
      'Email support, 24h response',
      'SSO via Google & Microsoft',
      'Audit log (30 days)',
    ],
    cta: 'Start 14-day trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    cadence: 'annual',
    description: 'For organisations with custom requirements.',
    features: [
      'Everything in Team',
      'SAML SSO + SCIM',
      'Dedicated CSM',
      'SOC 2 report + DPA',
      'Audit log (unlimited)',
    ],
    cta: 'Talk to sales',
  },
];

export function Pricing() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 py-16">
      <header className="text-center space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Plans that scale with your team
        </h1>
        <p className="text-sm text-foreground-muted max-w-xl mx-auto">
          Start free, upgrade when you need more. All paid plans include a 14-day trial — no
          credit card required.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={cn(
              'flex flex-col gap-6 rounded-lg border bg-card p-6',
              tier.highlighted ? 'border-accent shadow-sm' : 'border-border',
            )}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-foreground">{tier.name}</h2>
                {tier.highlighted && <Badge tone="accent">Most popular</Badge>}
              </div>
              <p className="text-sm text-foreground-muted">{tier.description}</p>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-semibold tabular text-foreground">{tier.price}</span>
              <span className="text-sm text-foreground-subtle">{tier.cadence}</span>
            </div>

            <ul className="space-y-2 text-sm">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-foreground">
                  <Check className="size-4 text-accent shrink-0 mt-0.5" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>

            <Button
              variant={tier.highlighted ? 'primary' : 'outline'}
              className="mt-auto w-full"
            >
              {tier.cta}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
