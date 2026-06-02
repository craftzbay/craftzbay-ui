/**
 * Verbatim block source, keyed by slug. Vite returns each file as a string
 * (?raw), so the "Code" tab can never drift from what renders. Imported
 * dynamically by the block page, so this (sizeable) text stays out of the
 * initial bundle.
 */
import appShellSrc from './AppShell.tsx?raw';
import authSrc from './Authentication.tsx?raw';
import settingsSrc from './Settings.tsx?raw';
import dataTableSrc from './DataTablePage.tsx?raw';
import recordSrc from './RecordDetail.tsx?raw';
import onboardingSrc from './Onboarding.tsx?raw';
import pricingSrc from './Pricing.tsx?raw';
import firstRunSrc from './FirstRunEmpty.tsx?raw';

export const blockSources: Record<string, string> = {
  dashboard: appShellSrc,
  'data-table': dataTableSrc,
  settings: settingsSrc,
  record: recordSrc,
  onboarding: onboardingSrc,
  'first-run': firstRunSrc,
  pricing: pricingSrc,
  'auth-signin': authSrc,
  'auth-signup': authSrc,
  'auth-forgot': authSrc,
  'auth-magic': authSrc,
};
