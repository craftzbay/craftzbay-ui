import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppShell, Dashboard } from './AppShell';
import { AuthLayout, SignInForm } from './Authentication';
import { DataTablePage } from './DataTablePage';
import { FirstRunEmpty } from './FirstRunEmpty';
import { Onboarding } from './Onboarding';
import { Pricing } from './Pricing';
import { RecordDetail } from './RecordDetail';
import { SettingsPage } from './Settings';

const meta: Meta = {
  title: 'Patterns',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

export const SignIn: Story = {
  render: () => (
    <AuthLayout brand="Atlas" title="Welcome back" subtitle="Sign in to continue.">
      <SignInForm onSubmit={() => {}} />
    </AuthLayout>
  ),
};

export const Shell: Story = {
  render: () => (
    <AppShell brand="Atlas">
      <Dashboard />
    </AppShell>
  ),
};

export const Settings: Story = { render: () => <SettingsPage /> };
export const DataTable: Story = { render: () => <DataTablePage /> };
export const Record: Story = { render: () => <RecordDetail /> };
export const OnboardingFlow: Story = { render: () => <Onboarding /> };
export const PricingPage: Story = { render: () => <Pricing /> };
export const FirstRun: Story = { render: () => <FirstRunEmpty /> };
