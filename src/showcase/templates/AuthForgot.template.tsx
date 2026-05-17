import type { TemplateDoc } from '../registry/types';

const doc: TemplateDoc = {
  slug: 'auth-forgot',
  name: 'Forgot password',
  description: 'Single-field "enter your email" form to request a password reset link.',
  exports: ['AuthLayout', 'ForgotPasswordForm'],
  sourceFile: 'Authentication.tsx',
  previewSlug: 'auth-forgot',
  useCases: ['Password reset request'],
  examples: [
    {
      title: 'Usage',
      preview: (
        <div className="text-sm text-foreground-muted">
          Open the <a className="text-accent hover:underline" href="#preview/auth-forgot">full-page preview ↗</a>.
        </div>
      ),
      code: `<AuthLayout brand={<Logo />} title="Forgot password?">
  <ForgotPasswordForm onSubmit={async ({ email }) => api.requestReset(email)} />
</AuthLayout>`,
    },
  ],
};

export default doc;
