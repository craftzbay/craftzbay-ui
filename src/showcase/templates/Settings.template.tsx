import type { TemplateDoc } from '../registry/types';

const doc: TemplateDoc = {
  slug: 'settings',
  name: 'Settings',
  description: 'Two-column settings layout: sticky sub-nav on the left, scrolling sections on the right. Sections are declared as data — add / remove without touching the layout.',
  exports: ['SettingsPage'],
  sourceFile: 'Settings.tsx',
  previewSlug: 'settings',
  useCases: ['User account settings', 'Workspace settings', 'Project settings'],
  examples: [
    {
      title: 'Usage',
      preview: (
        <div className="text-sm text-foreground-muted">
          Open the <a className="text-accent hover:underline" href="#preview/settings">full-page preview ↗</a>.
        </div>
      ),
      code: `<SettingsPage
  sections={[
    { id: 'profile', label: 'Profile', icon: <User />, render: () => <ProfileForm /> },
    { id: 'security', label: 'Security', icon: <Shield />, render: () => <SecurityForm /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell />, render: () => <NotificationsForm /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard />, render: () => <BillingForm /> },
    { id: 'team', label: 'Team', icon: <Users />, render: () => <TeamSettings /> },
  ]}
  defaultSection="profile"
/>`,
    },
  ],
  api: [
    {
      title: 'SettingsPage',
      rows: [
        { name: 'sections', type: 'SettingsSection[]', required: true, description: 'Section descriptors (id, label, icon?, render).' },
        { name: 'defaultSection', type: 'string', description: 'Initial active section id.' },
        { name: 'title', type: 'ReactNode', default: `'Settings'`, description: 'Page title.' },
      ],
    },
  ],
};

export default doc;
