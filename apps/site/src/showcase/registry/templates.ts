import type { TemplateDoc } from './types';

/* -----------------------------------------------------------------------------
 *  Template registry. Each entry has a docs page (#templates/<slug>) AND a
 *  full-bleed live preview (#preview/<slug>) so consumers can see the template
 *  rendered without the showcase chrome.
 *
 *  Stage 2 will fill these out — for now we ship slim wrappers around the
 *  existing patterns and add `previewSlug` linking to the legacy preview keys.
 * --------------------------------------------------------------------------- */

import authSigninDoc from '../templates/AuthSignIn.template';
import authSignupDoc from '../templates/AuthSignUp.template';
import authForgotDoc from '../templates/AuthForgot.template';
import authMagicDoc from '../templates/AuthMagic.template';
import dashboardDoc from '../templates/Dashboard.template';
import settingsDoc from '../templates/Settings.template';
import dataTableDoc from '../templates/DataTable.template';
import recordDoc from '../templates/RecordDetail.template';
import onboardingDoc from '../templates/Onboarding.template';
import pricingDoc from '../templates/Pricing.template';
import firstRunDoc from '../templates/FirstRunEmpty.template';

export const templateDocs: TemplateDoc[] = [
  authSigninDoc,
  authSignupDoc,
  authForgotDoc,
  authMagicDoc,
  dashboardDoc,
  settingsDoc,
  dataTableDoc,
  recordDoc,
  onboardingDoc,
  pricingDoc,
  firstRunDoc,
];

export function getTemplateDoc(slug: string): TemplateDoc | undefined {
  return templateDocs.find((d) => d.slug === slug);
}
