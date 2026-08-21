import { useEffect } from 'react';
import { AdminTemplate } from './AdminTemplate';
import { AuthTemplate } from './AuthTemplate';
import { LandingTemplate } from './LandingTemplate';
import { NewsTemplate } from './NewsTemplate';
import { EcommerceTemplate } from './EcommerceTemplate';
import { BrandMark } from '../components/BrandMark';

/**
 * Renders a template by slug at its active screen. Imported lazily
 * (React.lazy), so every template + its dependencies stay out of the initial
 * bundle and only load when a preview or template page is opened.
 */
export default function BlockPreview({
  slug,
  screen,
  setScreen,
  variant,
  page,
}: {
  slug: string;
  screen: string;
  setScreen: (screen: string) => void;
  /** Layout variant key (see `BlockMeta.variants`); only some templates use it. */
  variant?: string;
  /** Initial in-app page for app shells (admin). */
  page?: string;
}) {
  const props = { screen, setScreen, brand: <BrandMark />, variant };
  // This chunk loaded — re-arm the preview page's one-shot chunk-error reload.
  useEffect(() => {
    try {
      sessionStorage.removeItem('cb-preview-chunk-reloaded');
    } catch {
      /* ignore */
    }
  }, []);
  switch (slug) {
    case 'admin':
      return (
        <AdminTemplate
          layout={variant === 'topnav' || variant === 'dual' ? variant : 'sidebar'}
          initialPage={page}
        />
      );
    case 'auth':
      return <AuthTemplate {...props} />;
    case 'landing':
      return <LandingTemplate {...props} />;
    case 'news':
      return <NewsTemplate {...props} />;
    case 'ecommerce':
      return <EcommerceTemplate {...props} />;
    default:
      return null;
  }
}
