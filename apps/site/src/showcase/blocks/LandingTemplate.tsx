import { ArrowRight, BarChart3, Github, Lock, Plug, Sparkles, Star, Zap } from 'lucide-react';
import { Avatar } from '@craftzbay/ui';
import { Button } from '@craftzbay/ui';
import { Card, CardContent } from '@craftzbay/ui';
import { AuthLayout, SignUpForm } from './Authentication';
import { Pricing } from './Pricing';
import type { TemplateProps } from './meta';

/**
 * Landing page template — a complete SaaS marketing site (sticky nav, hero,
 * logo strip, features, pricing, testimonial, CTA, footer). The matching
 * sign-up screen is reached from the preview dock.
 */
const NAV = ['Product', 'Features', 'Pricing', 'Customers', 'Docs'];

const FEATURES = [
  { icon: Zap, title: 'Fast by default', body: 'Ships a tuned Vite build and tree-shakeable components — your bundle stays lean.' },
  { icon: Lock, title: 'Secure', body: 'SSO, audit logs and role-based access on every plan. SOC 2 Type II certified.' },
  { icon: BarChart3, title: 'Insightful', body: 'Real-time dashboards and exportable reports so the whole team sees the numbers.' },
  { icon: Plug, title: 'Integrates', body: 'Native connectors for Slack, GitHub, Linear and 40+ tools, plus a typed REST API.' },
  { icon: Sparkles, title: 'Delightful', body: 'A refined, accessible interface your team will actually enjoy using every day.' },
  { icon: Github, title: 'Open', body: 'Built on open standards with a documented API and first-class self-hosting.' },
];

function Nav({ brand, onSignUp }: { brand: React.ReactNode; onSignUp: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-6">
        <div className="text-sm">{brand}</div>
        <nav className="hidden items-center gap-6 text-sm text-foreground-muted md:flex">
          {NAV.map((n) => (
            <a key={n} href="#" onClick={(e) => e.preventDefault()} className="transition-colors hover:text-foreground">
              {n}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onSignUp}>
            Sign in
          </Button>
          <Button size="sm" onClick={onSignUp}>
            Get started
          </Button>
        </div>
      </div>
    </header>
  );
}

function Landing({ brand, onSignUp }: { brand: React.ReactNode; onSignUp: () => void }) {
  return (
    <div className="bg-background">
      <Nav brand={brand} onSignUp={onSignUp} />

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground-muted">
          <Sparkles className="size-3 text-accent" aria-hidden />
          New — real-time collaboration is here
        </div>
        <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
          The workspace where teams <span className="text-accent">ship faster</span>.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-foreground-muted">
          Plan, track and launch — all in one calm, fast place. Replace the tab-sprawl with a single
          source of truth your whole team trusts.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" onClick={onSignUp}>
            Start free <ArrowRight className="ml-1 size-4" aria-hidden />
          </Button>
          <Button size="lg" variant="outline">
            Book a demo
          </Button>
        </div>
        <p className="mt-4 text-xs text-foreground-subtle">Free 14-day trial · No credit card required</p>
      </section>

      {/* Logo strip */}
      <section className="border-y border-border bg-background-subtle/50 py-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-6 text-sm font-medium text-foreground-subtle">
          <span className="text-xs uppercase tracking-wider">Trusted by teams at</span>
          {['Northwind', 'Acme', 'Globex', 'Initech', 'Umbrella'].map((c) => (
            <span key={c} className="text-foreground-muted">{c}</span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Everything you need, nothing you don't</h2>
          <p className="mt-3 text-foreground-muted">One tool that replaces five — without the bloat.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Card key={f.title}>
              <CardContent className="pt-6">
                <div className="mb-3 inline-flex size-9 items-center justify-center rounded-md bg-accent-soft text-on-accent-soft">
                  <f.icon className="size-5" aria-hidden />
                </div>
                <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground-muted">{f.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-border bg-background-subtle/40 py-24">
        <Pricing />
      </section>

      {/* Testimonial */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <div className="mb-4 flex items-center justify-center gap-1 text-warning-text">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="size-4 fill-current" aria-hidden />
          ))}
        </div>
        <blockquote className="text-2xl font-medium leading-relaxed tracking-tight text-foreground">
          “We cut our launch cycle in half. It's the first tool the whole company actually agreed on.”
        </blockquote>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Avatar size="sm" fallback="JM" />
          <div className="text-left text-sm">
            <div className="font-medium text-foreground">Jamie Morales</div>
            <div className="text-foreground-subtle">VP Engineering, Northwind</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="rounded-2xl border border-border bg-accent px-8 py-14 text-center text-on-accent">
          <h2 className="text-3xl font-semibold tracking-tight">Ready to ship faster?</h2>
          <p className="mx-auto mt-3 max-w-xl opacity-90">
            Join thousands of teams already moving quicker. Start free today.
          </p>
          <div className="mt-7 flex justify-center">
            <Button size="lg" variant="secondary" onClick={onSignUp}>
              Get started free <ArrowRight className="ml-1 size-4" aria-hidden />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-12 sm:grid-cols-4">
          {[
            { h: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
            { h: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
            { h: 'Resources', links: ['Docs', 'API', 'Status', 'Support'] },
            { h: 'Legal', links: ['Privacy', 'Terms', 'Security', 'DPA'] },
          ].map((col) => (
            <div key={col.h}>
              <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground-subtle">{col.h}</div>
              <ul className="space-y-2 text-sm text-foreground-muted">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-foreground">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border py-6 text-center text-xs text-foreground-subtle">
          © {new Date().getFullYear()} Northwind, Inc. · Built with @craftzbay/ui
        </div>
      </footer>
    </div>
  );
}

export function LandingTemplate({ screen, setScreen, brand }: TemplateProps) {
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
              className="rounded-sm font-medium text-accent outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
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
  return <Landing brand={brand} onSignUp={() => setScreen('signup')} />;
}
