/**
 * Verbatim template source, keyed by slug. Vite returns each file as a string
 * (?raw) so the "Source" tab can never drift from what renders. Imported
 * dynamically by the template page, so this text stays out of the initial
 * bundle.
 */
import adminSrc from './AdminDashboard.tsx?raw';
import adminDataSrc from './admin/data.ts?raw';
import adminShellSrc from './admin/shell.tsx?raw';
import localeSrc from '../i18n/locale.tsx?raw';
import adminDictSrc from '../i18n/admin.ts?raw';
import authDictSrc from '../i18n/auth.ts?raw';
import landingDictSrc from '../i18n/landing.ts?raw';
import newsDictSrc from '../i18n/news.ts?raw';
import ecommerceDictSrc from '../i18n/ecommerce.ts?raw';
import adminOverviewSrc from './admin/overview.tsx?raw';
import adminProjectsSrc from './admin/projects.tsx?raw';
import adminProjectsPartsSrc from './admin/projects-parts.tsx?raw';
import adminPagesSrc from './admin/pages.tsx?raw';
import authSrc from './AuthTemplate.tsx?raw';
import landingSrc from './LandingTemplate.tsx?raw';
import newsSrc from './NewsTemplate.tsx?raw';
import ecommerceSrc from './EcommerceTemplate.tsx?raw';

/** The admin template is a folder; show every file with a path banner. */
function bundle(files: [string, string][]): string {
  return files.map(([path, src]) => `// ───── ${path} ─────\n${src.trimEnd()}\n`).join('\n');
}

export const blockSources: Record<string, string> = {
  admin: bundle([
    ['AdminDashboard.tsx', adminSrc],
    ['admin/shell.tsx', adminShellSrc],
    ['admin/overview.tsx', adminOverviewSrc],
    ['admin/projects.tsx', adminProjectsSrc],
    ['admin/projects-parts.tsx', adminProjectsPartsSrc],
    ['admin/pages.tsx', adminPagesSrc],
    ['admin/data.ts', adminDataSrc],
    ['i18n/admin.ts', adminDictSrc],
    ['i18n/locale.tsx', localeSrc],
  ]),
  auth: bundle([
    ['AuthTemplate.tsx', authSrc],
    ['i18n/auth.ts', authDictSrc],
  ]),
  landing: bundle([
    ['LandingTemplate.tsx', landingSrc],
    ['i18n/landing.ts', landingDictSrc],
  ]),
  news: bundle([
    ['NewsTemplate.tsx', newsSrc],
    ['i18n/news.ts', newsDictSrc],
  ]),
  ecommerce: bundle([
    ['EcommerceTemplate.tsx', ecommerceSrc],
    ['i18n/ecommerce.ts', ecommerceDictSrc],
  ]),
};
