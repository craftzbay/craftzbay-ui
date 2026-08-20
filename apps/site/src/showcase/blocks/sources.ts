/**
 * Verbatim template source, keyed by slug. Vite returns each file as a string
 * (?raw) so the "Source" tab can never drift from what renders. Imported
 * dynamically by the template page, so this text stays out of the initial
 * bundle.
 */
import adminSrc from './AdminDashboard.tsx?raw';
import adminDataSrc from './admin/data.ts?raw';
import adminShellSrc from './admin/shell.tsx?raw';
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
  ]),
  auth: authSrc,
  landing: landingSrc,
  news: newsSrc,
  ecommerce: ecommerceSrc,
};
