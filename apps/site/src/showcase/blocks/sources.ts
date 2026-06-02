/**
 * Verbatim template source, keyed by slug. Vite returns each file as a string
 * (?raw) so the "Source" tab can never drift from what renders. Imported
 * dynamically by the template page, so this text stays out of the initial
 * bundle.
 */
import adminSrc from './AdminDashboard.tsx?raw';
import landingSrc from './LandingTemplate.tsx?raw';
import newsSrc from './NewsTemplate.tsx?raw';
import ecommerceSrc from './EcommerceTemplate.tsx?raw';

export const blockSources: Record<string, string> = {
  admin: adminSrc,
  landing: landingSrc,
  news: newsSrc,
  ecommerce: ecommerceSrc,
};
