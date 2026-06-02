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
}: {
  slug: string;
  screen: string;
  setScreen: (screen: string) => void;
}) {
  const props = { screen, setScreen, brand: <BrandMark /> };
  switch (slug) {
    case 'admin':
      return <AdminTemplate />;
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
