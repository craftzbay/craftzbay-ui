import { useEffect, useState } from 'react';
import { Toaster } from '@/components/ui/Toast';
import { TooltipProvider } from '@/components/ui/Tooltip';
import { useCommandPaletteShortcut } from '@/components/ui/CommandPalette';

import { isFullBleedRoute, parseHash, routeToHash, type Route } from './showcase/routing';
import { ThemeProvider } from './showcase/theme/theme-context';
import { ShowcaseTopBar } from './showcase/layout/ShowcaseTopBar';
import { ShowcaseFooter } from './showcase/layout/ShowcaseFooter';
import { DocLayout } from './showcase/layout/DocLayout';
import {
  buildComponentSidebar,
  buildCrossKindSections,
  buildGuideSidebar,
  buildTemplateSidebar,
  docTopLinks,
} from './showcase/layout/sidebars';
import { ShowcasePalette } from './showcase/widgets/ShowcasePalette';
import { HomePage } from './showcase/pages/HomePage';
import { ComponentsIndexPage } from './showcase/pages/ComponentsIndexPage';
import { ComponentDocPage } from './showcase/pages/ComponentDocPage';
import { TemplatesIndexPage } from './showcase/pages/TemplatesIndexPage';
import { TemplateDocPage } from './showcase/pages/TemplateDocPage';
import { GuidesIndexPage } from './showcase/pages/GuidesIndexPage';
import { GuidePage } from './showcase/pages/GuidePage';
import { PreviewPage } from './showcase/pages/PreviewPage';
import { NotFound } from './showcase/pages/NotFound';
import { getComponentDoc } from './showcase/registry/components';
import { getTemplateDoc } from './showcase/registry/templates';
import { getGuideDoc } from './showcase/registry/guides';

/* -----------------------------------------------------------------------------
 *  Root showcase shell.
 *
 *  Routing is hash-based (see ./showcase/routing). Render strategy:
 *    - #preview/* renders PreviewPage standalone — its own tab, no chrome.
 *    - #components/*, #templates/*, #guides/* render inside DocLayout.
 *    - Home / index pages render with the TopBar but no DocLayout.
 *
 *  Theme (light/dark) and the active brand preset are owned by ThemeProvider
 *  and applied to <html>, so they reach portalled overlays and persist into
 *  the standalone preview tab.
 * --------------------------------------------------------------------------- */

export function App() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <Shell />
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}

function Shell() {
  const [route, setRoute] = useState<Route>(() =>
    typeof window === 'undefined' ? { kind: 'home' } : parseHash(window.location.hash),
  );

  useEffect(() => {
    const onHash = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Reset scroll on navigation so deep pages don't open mid-scroll.
  const scrollKey = `${route.kind}/${'slug' in route ? route.slug : ''}`;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [scrollKey]);

  const [cmdOpen, setCmdOpen] = useState(false);
  useCommandPaletteShortcut(setCmdOpen);

  if (isFullBleedRoute(route) && route.kind === 'preview') {
    // key: switching template from the preview dock must reset screen state.
    return <PreviewPage
        key={route.slug}
        slug={route.slug}
        initialScreen={route.screen}
        initialVariant={route.variant}
        initialPage={route.page}
      />;
  }

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <ShowcaseTopBar onOpenPalette={() => setCmdOpen(true)} current={route} />
      <div className="flex-1">
        <RouteView route={route} />
      </div>
      <ShowcaseFooter />
      <ShowcasePalette open={cmdOpen} onOpenChange={setCmdOpen} />
    </div>
  );
}

function RouteView({ route }: { route: Route }) {
  switch (route.kind) {
    case 'home':
      return <HomePage />;

    case 'catalog':
      // Back-compat: the old mega-demo wall is gone; send to components index.
      if (typeof window !== 'undefined') {
        window.location.hash = routeToHash({ kind: 'components-index' });
      }
      return null;

    case 'components-index':
      return (
        <DocLayout
          sidebar={buildComponentSidebar()}
          topLinks={docTopLinks}
          current={{ kind: route.kind }}
          crossKindSections={buildCrossKindSections('component')}
        >
          <ComponentsIndexPage />
        </DocLayout>
      );

    case 'component': {
      const doc = getComponentDoc(route.slug);
      if (!doc) return <NotFound />;
      return (
        <DocLayout
          sidebar={buildComponentSidebar()}
          topLinks={docTopLinks}
          current={{ kind: 'component', slug: doc.slug }}
          crossKindSections={buildCrossKindSections('component')}
        >
          <ComponentDocPage doc={doc} />
        </DocLayout>
      );
    }

    case 'templates-index':
      return (
        <DocLayout
          sidebar={buildTemplateSidebar()}
          topLinks={docTopLinks}
          current={{ kind: route.kind }}
          crossKindSections={buildCrossKindSections('template')}
        >
          <TemplatesIndexPage />
        </DocLayout>
      );

    case 'template': {
      const doc = getTemplateDoc(route.slug);
      if (!doc) return <NotFound />;
      return (
        <DocLayout
          sidebar={buildTemplateSidebar()}
          topLinks={docTopLinks}
          current={{ kind: 'template', slug: doc.slug }}
          crossKindSections={buildCrossKindSections('template')}
        >
          <TemplateDocPage doc={doc} />
        </DocLayout>
      );
    }

    case 'guides-index':
      return (
        <DocLayout
          sidebar={buildGuideSidebar()}
          topLinks={docTopLinks}
          current={{ kind: route.kind }}
          crossKindSections={buildCrossKindSections('guide')}
        >
          <GuidesIndexPage />
        </DocLayout>
      );

    case 'guide': {
      const doc = getGuideDoc(route.slug);
      if (!doc) return <NotFound />;
      return (
        <DocLayout
          sidebar={buildGuideSidebar()}
          topLinks={docTopLinks}
          current={{ kind: 'guide', slug: doc.slug }}
          crossKindSections={buildCrossKindSections('guide')}
        >
          <GuidePage doc={doc} />
        </DocLayout>
      );
    }

    case 'preview':
      // Handled by Shell before reaching here; kept so the switch is exhaustive.
      // key: switching template from the preview dock must reset screen state.
    return <PreviewPage
        key={route.slug}
        slug={route.slug}
        initialScreen={route.screen}
        initialVariant={route.variant}
      />;

    case 'not-found':
      return <NotFound />;
  }
}
