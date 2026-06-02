import { ArrowLeft } from '@/icons';
import {
  AuthLayout,
  ForgotPasswordForm,
  MagicLinkSent,
  SignInForm,
  SignUpForm,
} from '@/components/patterns/Authentication';
import { AppShell, Dashboard } from '@/components/patterns/AppShell';
import { SettingsPage } from '@/components/patterns/Settings';
import { DataTablePage } from '@/components/patterns/DataTablePage';
import { RecordDetail } from '@/components/patterns/RecordDetail';
import { Onboarding } from '@/components/patterns/Onboarding';
import { Pricing } from '@/components/patterns/Pricing';
import { FirstRunEmpty } from '@/components/patterns/FirstRunEmpty';

import { getTemplateDoc } from '../registry/templates';
import { routeToHash } from '../routing';
import { ThemeToggle, BrandSwitcher } from '../theme/Controls';
import { BrandMark } from '../components/BrandMark';
import { NotFound } from './NotFound';

/**
 * Standalone template preview — what opens when a template is clicked. It is
 * its own browser tab with no showcase navigation, just a slim chrome strip
 * carrying the live brand + theme controls so the template can be previewed
 * under any brand. The template body fills the rest of the viewport.
 */
export function PreviewPage({ slug }: { slug: string }) {
  const doc = getTemplateDoc(slug);
  if (!doc) return <NotFound />;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-12 w-full max-w-[1600px] items-center gap-3 px-4">
          <a
            href={`#${routeToHash({ kind: 'template', slug })}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" aria-hidden />
            Docs
          </a>
          <span className="h-4 w-px bg-border" aria-hidden />
          <div className="flex items-center gap-2 text-xs text-foreground-muted">
            <span className="inline-flex size-1.5 rounded-full bg-accent" aria-hidden />
            Live preview · <span className="font-medium text-foreground">{doc.name}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <BrandSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="flex-1">
        <PreviewBody slug={slug} />
      </div>
    </div>
  );
}

function PreviewBody({ slug }: { slug: string }) {
  const noopSubmit = async () => {};
  const brand = <BrandMark />;

  switch (slug) {
    case 'auth-signin':
      return (
        <AuthLayout brand={brand} title="Sign in" subtitle="Welcome back. Sign in to continue.">
          <SignInForm onSubmit={noopSubmit} />
        </AuthLayout>
      );
    case 'auth-signup':
      return (
        <AuthLayout brand={brand} title="Create your account" subtitle="Start free, no credit card.">
          <SignUpForm onSubmit={noopSubmit} />
        </AuthLayout>
      );
    case 'auth-forgot':
      return (
        <AuthLayout brand={brand} title="Forgot password?" subtitle="We'll email you a reset link.">
          <ForgotPasswordForm onSubmit={noopSubmit} />
        </AuthLayout>
      );
    case 'auth-magic':
      return (
        <AuthLayout brand={brand} title="Check your inbox" subtitle="We sent a magic link to your email.">
          <MagicLinkSent email="you@company.com" />
        </AuthLayout>
      );
    case 'dashboard':
      return (
        <AppShell brand={brand} active="home">
          <Dashboard />
        </AppShell>
      );
    case 'settings':
      return <SettingsPage />;
    case 'data-table':
      return <DataTablePage />;
    case 'record':
      return <RecordDetail />;
    case 'onboarding':
      return <Onboarding />;
    case 'pricing':
      return <Pricing />;
    case 'first-run':
      return <FirstRunEmpty />;
    default:
      return <NotFound />;
  }
}
