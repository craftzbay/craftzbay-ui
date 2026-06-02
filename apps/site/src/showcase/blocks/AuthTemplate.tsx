import type { TemplateProps } from './meta';
import { AuthLayout, ForgotPasswordForm, MagicLinkSent, SignInForm, SignUpForm } from './Authentication';

/**
 * Authentication template — the full auth flow on the split-screen AuthLayout:
 * sign in, sign up, forgot password and the magic-link confirmation. Switch
 * between the screens from the preview dock (each is its own full-page layout).
 */
const noop = async () => {};

export function AuthTemplate({ screen, brand }: TemplateProps) {
  switch (screen) {
    case 'signup':
      return (
        <AuthLayout brand={brand} title="Create your account" subtitle="Start free, no credit card.">
          <SignUpForm onSubmit={noop} />
        </AuthLayout>
      );
    case 'forgot':
      return (
        <AuthLayout brand={brand} title="Forgot password?" subtitle="We'll email you a reset link.">
          <ForgotPasswordForm onSubmit={noop} />
        </AuthLayout>
      );
    case 'magic':
      return (
        <AuthLayout brand={brand} title="Check your inbox" subtitle="We sent a magic link to your email.">
          <MagicLinkSent email="you@example.com" />
        </AuthLayout>
      );
    default:
      return (
        <AuthLayout brand={brand} title="Sign in" subtitle="Welcome back. Sign in to continue.">
          <SignInForm onSubmit={noop} />
        </AuthLayout>
      );
  }
}
