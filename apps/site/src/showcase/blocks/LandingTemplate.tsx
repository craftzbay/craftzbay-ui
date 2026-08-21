import { useState, type MouseEvent, type ReactNode } from 'react';
import { ArrowRight, BarChart3, Github, Lock, Menu, Plug, Sparkles, Star, Zap } from '@/icons';
import { Avatar } from '@craftzbay/ui';
import { Button } from '@craftzbay/ui';
import { Card, CardContent } from '@craftzbay/ui';
import {
  IconButton,
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@craftzbay/ui';
import { AuthLayout, SignUpForm } from './Authentication';
import { Pricing } from './Pricing';
import type { TemplateProps } from './meta';

/**
 * Landing page template — a complete SaaS marketing site following the
 * landing anatomy: nav → hero → logo strip → features → how it works →
 * pricing → testimonial → FAQ → final CTA → footer. The matching sign-up
 * screen is reached from the preview dock.
 *
 * One primary CTA label (`CTA_LABEL`) is repeated in the nav, hero, pricing
 * and final CTA — a different label reads as a different action.
 */
const CTA_LABEL = 'Start free';

/** Section ids. Nav + footer links are real anchors to these. */
const SECTIONS = {
  product: 'product',
  features: 'features',
  how: 'how-it-works',
  pricing: 'pricing',
  customers: 'customers',
  faq: 'faq',
} as const;

const NAV = [
  { label: 'Product', id: SECTIONS.product },
  { label: 'Features', id: SECTIONS.features },
  { label: 'Pricing', id: SECTIONS.pricing },
  { label: 'Customers', id: SECTIONS.customers },
  { label: 'FAQ', id: SECTIONS.faq },
];

const FEATURES = [
  {
    icon: Zap,
    title: 'Fast by default',
    body: 'Ships a tuned Vite build and tree-shakeable components — your bundle stays lean.',
  },
  {
    icon: Lock,
    title: 'Secure',
    body: 'SSO, audit logs and role-based access on every plan. SOC 2 Type II certified.',
  },
  {
    icon: BarChart3,
    title: 'Insightful',
    body: 'Real-time dashboards and exportable reports so the whole team sees the numbers.',
  },
  {
    icon: Plug,
    title: 'Integrates',
    body: 'Native connectors for Slack, GitHub, Linear and 40+ tools, plus a typed REST API.',
  },
  {
    icon: Sparkles,
    title: 'Delightful',
    body: 'A refined, accessible interface your team will actually enjoy using every day.',
  },
  {
    icon: Github,
    title: 'Open',
    body: 'Built on open standards with a documented API and first-class self-hosting.',
  },
];

const STEPS = [
  {
    title: 'Connect your tools',
    body: 'Link GitHub, Slack and your tracker in two clicks — no migration needed.',
  },
  {
    title: 'Plan in one place',
    body: 'Roadmaps, issues and docs live together, so nothing falls between tabs.',
  },
  {
    title: 'Ship and measure',
    body: 'Launch from the same view and watch adoption land on a live dashboard.',
  },
];

const FAQ = [
  {
    q: 'Can I cancel at any time?',
    a: 'Yes. One click in Settings; your plan stays active until the end of the billing period.',
  },
  {
    q: 'Is there a free plan?',
    a: 'The Starter plan is free forever for up to 3 projects. Paid plans include a 14-day trial with no card required.',
  },
  {
    q: 'Where is my data stored?',
    a: 'In the EU or US region you pick at sign-up, encrypted at rest and in transit. We never train on customer data.',
  },
  {
    q: 'Do you support SSO?',
    a: 'Google and Microsoft SSO ship on the Team plan; SAML and SCIM provisioning on Enterprise.',
  },
  {
    q: 'Can I import from another tool?',
    a: 'Yes — importers for Jira, Linear, Asana and CSV run in the background and keep your IDs and history.',
  },
];

const LOGOS = ['Northwind', 'Acme', 'Globex', 'Initech', 'Umbrella'];

/**
 * Smooth-scroll to a section. The hrefs are real (`#features`), this handler
 * only swaps the browser's jump for a smooth scroll and keeps the hash out of
 * a hash-routed host like the showcase. Drop it in an app with path routing.
 */
function scrollTo(e: MouseEvent<HTMLAnchorElement>, id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function SectionLink({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a href={`#${id}`} onClick={(e) => scrollTo(e, id)} className={className}>
      {children}
    </a>
  );
}

function Nav({ brand, onSignUp }: { brand: ReactNode; onSignUp: () => void }) {
  return (
    <header className="border-border bg-background sticky top-0 z-[var(--z-sticky)] border-b">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-6">
        <div className="text-sm">{brand}</div>
        <nav
          aria-label="Primary"
          className="text-foreground-muted hidden items-center gap-6 text-sm md:flex"
        >
          {NAV.map((n) => (
            <SectionLink
              key={n.id}
              id={n.id}
              className="hover:text-foreground focus-visible:ring-ring focus-visible:ring-offset-background rounded-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              {n.label}
            </SectionLink>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onSignUp} className="hidden sm:inline-flex">
            Sign in
          </Button>
          <Button size="sm" variant="secondary" onClick={onSignUp}>
            {CTA_LABEL}
          </Button>
          {/* Section links (and Sign in) move into a drawer below md. */}
          <Sheet>
            <SheetTrigger asChild>
              <IconButton
                aria-label="Open menu"
                icon={<Menu />}
                variant="ghost"
                size="sm"
                className="md:hidden"
              />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle>Menu</SheetTitle>
              <nav aria-label="Primary" className="mt-6 flex flex-col gap-1">
                {NAV.map((n) => (
                  <SheetClose asChild key={n.id}>
                    <a
                      href={`#${n.id}`}
                      onClick={(e) => scrollTo(e, n.id)}
                      className="text-foreground hover:bg-background-muted flex h-11 items-center rounded-md px-3 text-base"
                    >
                      {n.label}
                    </a>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    className="mt-2 justify-start sm:hidden"
                    onClick={onSignUp}
                  >
                    Sign in
                  </Button>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

type LegalTopic = 'privacy' | 'terms' | 'security';
const LEGAL: { key: LegalTopic; title: string; body: string }[] = [
  {
    key: 'privacy',
    title: 'Privacy policy',
    body: 'We store the data you put into Northwind and the account details needed to bill you — nothing is sold or shared with advertisers. Export or delete everything from Settings at any time.',
  },
  {
    key: 'terms',
    title: 'Terms of service',
    body: 'Use Northwind for lawful purposes on the plan you chose. Paid plans renew monthly and can be cancelled any time; access continues to the end of the billing period.',
  },
  {
    key: 'security',
    title: 'Security',
    body: 'Data is encrypted in transit and at rest, access is role-based with audit logs on every plan, and we are SOC 2 Type II certified. Report a vulnerability from the Help menu in the app.',
  },
];

/** Legal pages — in-template destinations for the footer links. */
function LegalPage({
  brand,
  topic,
  onBack,
  onLegal,
}: {
  brand: ReactNode;
  topic: LegalTopic;
  onBack: () => void;
  onLegal: (t: LegalTopic) => void;
}) {
  const active = LEGAL.find((l) => l.key === topic) ?? LEGAL[0];
  return (
    <div className="bg-background min-h-dvh">
      <header className="border-border border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="min-w-0 truncate">{brand}</div>
          <Button variant="ghost" size="sm" onClick={onBack}>
            Back to site
          </Button>
        </div>
      </header>
      <main className="mx-auto w-full max-w-2xl px-6 py-12">
        <h1 className="text-foreground text-3xl font-semibold tracking-tight">{active.title}</h1>
        <p className="text-foreground-muted mt-4 max-w-[65ch] text-base leading-relaxed">
          {active.body}
        </p>
        <nav aria-label="Legal" className="border-border mt-10 border-t pt-6">
          <ul className="text-foreground-muted flex flex-wrap gap-4 text-sm">
            {LEGAL.filter((l) => l.key !== active.key).map((l) => (
              <li key={l.key}>
                <button
                  type="button"
                  onClick={() => onLegal(l.key)}
                  className="text-accent font-medium hover:underline"
                >
                  {l.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </main>
    </div>
  );
}

function Landing({
  brand,
  onSignUp,
  onLegal,
}: {
  brand: ReactNode;
  onSignUp: () => void;
  onLegal: (t: LegalTopic) => void;
}) {
  return (
    <div className="bg-background">
      <Nav brand={brand} onSignUp={onSignUp} />

      <main>
        {/* Hero */}
        <section
          id={SECTIONS.product}
          className="mx-auto max-w-4xl scroll-mt-16 px-6 py-24 text-center"
        >
          <div className="border-border bg-card text-foreground-muted mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
            <Sparkles className="text-accent size-3" aria-hidden />
            New — real-time collaboration is here
          </div>
          <h1 className="text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
            The workspace where teams <span className="text-accent">ship faster</span>.
          </h1>
          <p className="text-foreground-muted mx-auto mt-5 max-w-[65ch] text-lg leading-relaxed">
            Plan, track and launch — all in one calm, fast place. Replace the tab-sprawl with a
            single source of truth your whole team trusts.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="xl" onClick={onSignUp}>
              {CTA_LABEL} <ArrowRight className="ml-1 size-4" aria-hidden />
            </Button>
            <Button size="xl" variant="outline">
              Book a demo
            </Button>
          </div>
          <p className="text-foreground-subtle mt-4 text-sm">
            Free 14-day trial · No credit card required
          </p>
        </section>

        {/* Logo strip — uniform 32px row height, greyscale */}
        <section aria-label="Customers" className="bg-background-subtle py-8">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-6">
            <span className="text-foreground-subtle text-xs font-medium tracking-wider uppercase">
              Trusted by teams at
            </span>
            {LOGOS.map((c) => (
              <span
                key={c}
                className="text-foreground-muted hover:text-foreground inline-flex h-8 items-center text-lg font-semibold tracking-tight grayscale transition-colors"
              >
                {c}
              </span>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id={SECTIONS.features} className="mx-auto max-w-6xl scroll-mt-16 px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight">
              Everything you need, nothing you don't
            </h2>
            <p className="text-foreground-muted mt-3">
              One tool that replaces five — without the bloat.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <Card key={f.title}>
                <CardContent className="pt-6">
                  <div className="bg-accent-soft text-on-accent-soft mb-3 inline-flex size-9 items-center justify-center rounded-md">
                    <f.icon className="size-5" aria-hidden />
                  </div>
                  <h3 className="text-foreground text-sm font-semibold">{f.title}</h3>
                  <p className="text-foreground-muted mt-1.5 text-sm leading-relaxed">{f.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How it works — 3 numbered steps */}
        <section id={SECTIONS.how} className="bg-background-subtle scroll-mt-16 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight">
                Up and running in an afternoon
              </h2>
              <p className="text-foreground-muted mt-3">
                Three steps — no migration project, no consultants.
              </p>
            </div>
            <ol className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              {STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span
                    aria-hidden
                    className="tabular border-border bg-card text-foreground inline-flex size-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold"
                  >
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-foreground text-base font-semibold">
                      <span className="sr-only">Step {i + 1}: </span>
                      {s.title}
                    </h3>
                    <p className="text-foreground-muted mt-1.5 text-sm leading-relaxed">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Pricing */}
        <section id={SECTIONS.pricing} className="scroll-mt-16 py-24">
          <Pricing onTierSelect={onSignUp} className="py-0" />
        </section>

        {/* Testimonial */}
        <section id={SECTIONS.customers} className="bg-background-subtle scroll-mt-16 py-24">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <div
              className="text-warning-text mb-4 flex items-center justify-center gap-1"
              role="img"
              aria-label="5 out of 5 stars"
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-current" aria-hidden />
              ))}
            </div>
            <blockquote className="text-foreground text-2xl leading-relaxed font-medium tracking-tight">
              “We cut our launch cycle in half. It's the first tool the whole company actually
              agreed on.”
            </blockquote>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Avatar size="lg" fallback="JM" />
              <div className="text-left text-sm">
                <div className="text-foreground font-medium">Jamie Morales</div>
                <div className="text-foreground-subtle">VP Engineering, Northwind</div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ — native <details>: keyboard-ready, indexable, no JS */}
        <section id={SECTIONS.faq} className="mx-auto max-w-3xl scroll-mt-16 px-6 py-24">
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight">Frequently asked questions</h2>
            <p className="text-foreground-muted mt-3">
              Everything you need to know before you start.
            </p>
          </div>
          <div className="divide-border border-border mt-10 divide-y border-y">
            {FAQ.map((item) => (
              <details key={item.q} className="group py-4">
                <summary className="text-foreground focus-visible:ring-ring focus-visible:ring-offset-background flex cursor-pointer list-none items-center justify-between gap-4 rounded-sm text-base font-medium outline-none marker:content-none focus-visible:ring-2 focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span
                    aria-hidden
                    className="text-foreground-subtle transition-transform duration-[var(--duration-fast)] group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="text-foreground-muted mt-3 max-w-[65ch] text-sm leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA — h2 + one line + the same primary button */}
        <section className="mx-auto max-w-5xl px-6 pb-24">
          <div className="border-border bg-accent text-on-accent rounded-lg border px-8 py-14 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">Ready to ship faster?</h2>
            <p className="mx-auto mt-3 max-w-[65ch] opacity-90">
              Join thousands of teams already moving quicker.
            </p>
            <div className="mt-7 flex justify-center">
              <Button size="lg" variant="secondary" onClick={onSignUp}>
                {CTA_LABEL} <ArrowRight className="ml-1 size-4" aria-hidden />
              </Button>
            </div>
            <p className="mt-4 text-sm">No credit card required · 14-day free trial</p>
          </div>
        </section>
      </main>

      {/* Footer — real anchors to the sections above; legal links open the
          in-template legal page. Resources are paths for the host app. */}
      <footer className="border-border border-t">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-12 sm:grid-cols-4">
          <FooterColumn
            heading="Product"
            links={[
              { label: 'Features', id: SECTIONS.features },
              { label: 'How it works', id: SECTIONS.how },
              { label: 'Pricing', id: SECTIONS.pricing },
              { label: 'FAQ', id: SECTIONS.faq },
            ]}
          />
          <FooterColumn
            heading="Company"
            links={[
              { label: 'Product', id: SECTIONS.product },
              { label: 'Customers', id: SECTIONS.customers },
              { label: 'Contact', id: SECTIONS.faq },
            ]}
          />
          <FooterColumn
            heading="Resources"
            links={[
              { label: 'Docs', href: '/docs' },
              { label: 'API', href: '/docs/api' },
              { label: 'Status', href: '/status' },
            ]}
          />
          <FooterColumn
            heading="Legal"
            links={[
              { label: 'Privacy', onClick: () => onLegal('privacy') },
              { label: 'Terms', onClick: () => onLegal('terms') },
              { label: 'Security', onClick: () => onLegal('security') },
            ]}
          />
        </div>
        <div className="border-border text-foreground-subtle border-t py-6 text-center text-xs">
          © {new Date().getFullYear()} Northwind, Inc. · Built with @craftzbay/ui
        </div>
      </footer>
    </div>
  );
}

type FooterLink = { label: string; id?: string; href?: string; onClick?: () => void };

function FooterColumn({ heading, links }: { heading: string; links: FooterLink[] }) {
  const linkClass =
    'rounded-sm outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';
  return (
    <div>
      <div className="text-foreground-subtle mb-3 text-xs font-semibold tracking-wider uppercase">
        {heading}
      </div>
      <ul className="text-foreground-muted space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            {l.id ? (
              <SectionLink id={l.id} className={linkClass}>
                {l.label}
              </SectionLink>
            ) : l.onClick ? (
              <button type="button" onClick={l.onClick} className={linkClass}>
                {l.label}
              </button>
            ) : (
              <a href={l.href} className={linkClass}>
                {l.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LandingTemplate({ screen, setScreen, brand }: TemplateProps) {
  const [legalTopic, setLegalTopic] = useState<LegalTopic>('privacy');
  const openLegal = (t: LegalTopic) => {
    setLegalTopic(t);
    setScreen('legal');
  };
  if (screen === 'legal') {
    return (
      <LegalPage
        brand={brand}
        topic={legalTopic}
        onBack={() => setScreen('home')}
        onLegal={openLegal}
      />
    );
  }
  if (screen === 'signup') {
    return (
      <AuthLayout
        brand={brand}
        title="Create your account"
        subtitle="Start your 14-day free trial."
        footer={
          <>
            Just looking?{' '}
            <button
              type="button"
              onClick={() => setScreen('home')}
              className="text-accent focus-visible:ring-ring focus-visible:ring-offset-background rounded-sm font-medium outline-none hover:underline focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              Back to site
            </button>
          </>
        }
      >
        <SignUpForm onSubmit={async () => {}} />
      </AuthLayout>
    );
  }
  return <Landing brand={brand} onSignUp={() => setScreen('signup')} onLegal={openLegal} />;
}
