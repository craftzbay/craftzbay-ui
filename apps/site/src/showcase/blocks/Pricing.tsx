import type { ReactNode } from 'react';
import { Check } from '@/icons';
import { Badge } from '@craftzbay/ui';
import { Button } from '@craftzbay/ui';
import { cn } from '@craftzbay/ui';

/* -----------------------------------------------------------------------------
 *  Pricing — N-tier comparison grid. Tiers are declared as data so consumers
 *  can change copy, count, and CTA behavior without touching the layout.
 * --------------------------------------------------------------------------- */

export interface PricingTier {
  name: string;
  /** Price string. Pre-formatted — render '$0', '$20', 'Custom', '¥1,200', etc. */
  price: string;
  /** Cadence label rendered next to the price ('per user / month'). */
  cadence?: string;
  description?: string;
  features: string[];
  /** CTA label. */
  cta: string;
  /** Mark this tier as the recommended one — adds accent border + badge. */
  highlighted?: boolean;
  /** Click handler for the CTA. */
  onSelect?: () => void;
}

export interface PricingProps {
  /** Top heading. */
  title?: ReactNode;
  /** Subtitle under the heading. */
  subtitle?: ReactNode;
  /** Tier descriptors. */
  tiers?: PricingTier[];
  /** Label shown on the highlighted tier badge. */
  highlightedLabel?: string;
  /** Fallback CTA handler for tiers that don't define their own onSelect. */
  onTierSelect?: (tier: PricingTier) => void;
  className?: string;
}

const DEFAULT_TIERS: PricingTier[] = [
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
    cta: 'Start free',
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

/**
 * Pricing grid. Defaults to a 3-tier demo if `tiers` is omitted. Renders an
 * `h2` so it slots into a landing page under the single `h1`; tiers are `h3`.
 *
 * @example
 *   <Pricing
 *     title="Plans"
 *     tiers={[
 *       { name: 'Free', price: '$0', features: ['…'], cta: 'Start' },
 *       { name: 'Pro', price: '$12', features: ['…'], cta: 'Upgrade', highlighted: true },
 *     ]}
 *   />
 */
export function Pricing({
  title = 'Plans that scale with your team',
  subtitle = 'Start free, upgrade when you need more. All paid plans include a 14-day trial — no credit card required.',
  tiers = DEFAULT_TIERS,
  highlightedLabel = 'Most popular',
  onTierSelect,
  className,
}: PricingProps = {}) {
  const cols = tiers.length;
  return (
    <section aria-labelledby="pricing-title" className={cn('mx-auto max-w-5xl space-y-8 px-6 py-16', className)}>
      <header className="space-y-3 text-center">
        <h2 id="pricing-title" className="text-3xl font-semibold tracking-tight text-foreground">{title}</h2>
        {subtitle && <p className="mx-auto max-w-xl text-sm text-foreground-muted">{subtitle}</p>}
      </header>

      <div
        className={cn(
          'grid gap-4',
          cols === 2 && 'md:grid-cols-2',
          cols === 3 && 'md:grid-cols-3',
          cols === 4 && 'md:grid-cols-2 lg:grid-cols-4',
          cols > 4 && 'md:grid-cols-3',
        )}
      >
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
                <h3 className="text-base font-semibold text-foreground">{tier.name}</h3>
                {tier.highlighted && <Badge tone="accent">{highlightedLabel}</Badge>}
              </div>
              {tier.description && (
                <p className="text-sm text-foreground-muted">{tier.description}</p>
              )}
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="tabular text-3xl font-semibold text-foreground">{tier.price}</span>
              {tier.cadence && (
                <span className="text-sm text-foreground-subtle">{tier.cadence}</span>
              )}
            </div>

            <ul className="space-y-2 text-sm">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>

            <Button
              variant={tier.highlighted ? 'primary' : 'outline'}
              className="mt-auto w-full"
              onClick={tier.onSelect ?? (onTierSelect && (() => onTierSelect(tier)))}
            >
              {tier.cta}
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
