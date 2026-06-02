import type { TemplateProps } from './meta';
import { AdminDashboard } from './AdminDashboard';
import { AuthLayout, SignInForm, SignUpForm } from './Authentication';

/**
 * Admin dashboard template. The "app" screen is a complete, sellable admin
 * console — a slim icon rail switches areas, each area's child menu renders in
 * the secondary panel, and pages are real and interactive (Projects is full
 * CRUD with search + filter + pagination; Team, Billing, Settings, Inbox each
 * have their own data and actions). The sign-in / sign-up screens are full-page
 * auth layouts, reached from the preview dock.
 */
const noop = async () => {};

export function AdminTemplate({ screen, setScreen, brand }: TemplateProps) {
  switch (screen) {
    case 'signin':
      return (
        <AuthLayout brand={brand} title="Sign in" subtitle="Welcome back. Sign in to continue.">
          <SignInForm onSubmit={noop} />
        </AuthLayout>
      );
    case 'signup':
      return (
        <AuthLayout brand={brand} title="Create your account" subtitle="Start free, no credit card.">
          <SignUpForm onSubmit={noop} />
        </AuthLayout>
      );
    default:
      return <AdminDashboard brand={brand} onSignOut={() => setScreen('signin')} />;
  }
}
