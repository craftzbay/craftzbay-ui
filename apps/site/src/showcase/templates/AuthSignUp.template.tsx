import type { TemplateDoc } from '../registry/types';

const doc: TemplateDoc = {
  slug: 'auth-signup',
  name: 'Sign up',
  description: 'Centered sign-up form with email + password and Terms acceptance. Same shape as Sign in — drop in, handle the submit.',
  exports: ['AuthLayout', 'SignUpForm'],
  sourceFile: 'Authentication.tsx',
  previewSlug: 'auth-signup',
  useCases: ['New customer account creation', 'Internal user onboarding'],
  examples: [
    {
      title: 'Usage',
      preview: (
        <div className="text-sm text-foreground-muted">
          Open the{' '}
          <a className="text-accent hover:underline" href="#preview/auth-signup">full-page preview ↗</a>.
        </div>
      ),
      code: `<AuthLayout brand={<Logo />} title="Create your account">
  <SignUpForm
    onSubmit={async (v) => api.signUp(v)}
    providers={['google', 'github']}
  />
</AuthLayout>`,
    },
  ],
};

export default doc;
