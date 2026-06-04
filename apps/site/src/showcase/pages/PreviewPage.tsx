import { lazy, Suspense, useState } from 'react';
import { ArrowLeft } from '@/icons';
import { Spinner } from '@/components/ui/Spinner';
import { getBlockMeta } from '../blocks/meta';
import { routeToHash } from '../routing';
import { ThemeToggle, BrandSwitcher } from '../theme/Controls';
import { NotFound } from './NotFound';

const BlockPreview = lazy(() => import('../blocks/Preview'));

/**
 * Standalone template preview — its own browser tab. The template owns the
 * full viewport (its own sticky navs behave exactly as they would in a real
 * app); a small floating dock at the bottom-right carries "back to docs" plus
 * the live accent + theme controls. Navigation between a template's screens
 * happens inside the template itself.
 */
export function PreviewPage({ slug }: { slug: string }) {
  const doc = getBlockMeta(slug);
  const [screen, setScreen] = useState(() => doc?.screens[0]?.key ?? 'home');

  if (!doc) return <NotFound />;

  return (
    <div className="min-h-screen bg-background">
      <Suspense
        fallback={
          <div className="flex h-[60vh] items-center justify-center">
            <Spinner />
          </div>
        }
      >
        <BlockPreview slug={slug} screen={screen} setScreen={setScreen} />
      </Suspense>

      {/* Floating preview dock — bottom-right so the template renders edge to
          edge like a real deployment. */}
      <div className="fixed bottom-4 right-4 z-[var(--z-toast)] flex items-center gap-2 rounded-full border border-border bg-background/90 py-1.5 pl-3 pr-1.5 shadow-lg backdrop-blur">
        <a
          href={`#${routeToHash({ kind: 'template', slug })}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Docs
        </a>
        <span className="h-4 w-px bg-border" aria-hidden />
        <span className="hidden items-center gap-1.5 text-xs text-foreground-muted sm:flex">
          <span className="inline-flex size-1.5 rounded-full bg-accent" aria-hidden />
          <span className="font-medium text-foreground">{doc.name}</span>
        </span>
        <BrandSwitcher />
        <ThemeToggle />
      </div>
    </div>
  );
}
