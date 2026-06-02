import { AdminDashboard } from './AppShell';
import {
  AuthLayout,
  ForgotPasswordForm,
  MagicLinkSent,
  SignInForm,
  SignUpForm,
} from './Authentication';
import { SettingsPage } from './Settings';
import { DataTablePage } from './DataTablePage';
import { RecordDetail } from './RecordDetail';
import { Onboarding } from './Onboarding';
import { Pricing } from './Pricing';
import { FirstRunEmpty } from './FirstRunEmpty';
import { BrandMark } from '../components/BrandMark';

/**
 * Renders a block's live composition by slug. Imported lazily (React.lazy), so
 * every block component + its dependencies stay out of the initial bundle and
 * only load when a preview or block page is actually opened.
 */
const noop = async () => {};

export default function BlockPreview({ slug }: { slug: string }) {
  const brand = <BrandMark />;
  switch (slug) {
    case 'dashboard':
      return <AdminDashboard brand={brand} />;
    case 'data-table':
      return <DataTablePage />;
    case 'settings':
      return <SettingsPage />;
    case 'record':
      return <RecordDetail />;
    case 'onboarding':
      return <Onboarding />;
    case 'first-run':
      return <FirstRunEmpty />;
    case 'pricing':
      return <Pricing />;
    case 'auth-signin':
      return (
        <AuthLayout brand={brand} title="Sign in" subtitle="Welcome back. Sign in to continue.">
          <SignInForm onSubmit={noop} />
        </AuthLayout>
      );
    case 'auth-signup':
      return (
        <AuthLayout brand={brand} title="Create your account" subtitle="Start free, no credit card.">
          <SignUpForm onSubmit={noop} />
        </AuthLayout>
      );
    case 'auth-forgot':
      return (
        <AuthLayout brand={brand} title="Forgot password?" subtitle="We'll email you a reset link.">
          <ForgotPasswordForm onSubmit={noop} />
        </AuthLayout>
      );
    case 'auth-magic':
      return (
        <AuthLayout brand={brand} title="Check your inbox" subtitle="We sent a magic link to your email.">
          <MagicLinkSent email="you@example.com" />
        </AuthLayout>
      );
    default:
      return null;
  }
}
