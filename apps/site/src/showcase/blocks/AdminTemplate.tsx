import type { TemplateProps } from './meta';
import { AdminDashboard } from './AppShell';
import { AuthLayout, SignInForm, SignUpForm } from './Authentication';

/**
 * Admin dashboard template. The "app" screen is a complete multi-page admin
 * console (sidebar-driven). The sign-in / sign-up screens are full-page auth
 * layouts — reached from the preview dock since they don't share the app chrome.
 */
const noop = async () => {};

export function AdminTemplate({ screen, brand }: TemplateProps) {
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
      return <AdminDashboard brand={brand} />;
  }
}
