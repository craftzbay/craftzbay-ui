import { lazy, Suspense } from 'react';
import { ArrowLeft } from '@/icons';
import { Spinner } from '@/components/ui/Spinner';
import { getBlockMeta } from '../blocks/meta';
import { routeToHash } from '../routing';
import { ThemeToggle, BrandSwitcher } from '../theme/Controls';
import { NotFound } from './NotFound';

const BlockPreview = lazy(() => import('../blocks/Preview'));

/**
 * Standalone block preview — its own browser tab, no showcase navigation. The
 * block fills the whole viewport; the only chrome is a small floating dock at
 * the bottom carrying "back to docs" + the live brand / theme controls, so it
 * never intrudes on the template itself.
 */
export function PreviewPage({ slug }: { slug: string }) {
  const doc = getBlockMeta(slug);
  if (!doc) return <NotFound />;

  return (
    <div className="min-h-screen bg-background">
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Spinner />
          </div>
        }
      >
        <BlockPreview slug={slug} />
      </Suspense>

      {/* Floating control dock */}
      <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
        <div className="flex items-center gap-1.5 rounded-full border border-border bg-background/90 p-1.5 shadow-lg backdrop-blur">
          <a
            href={`#${routeToHash({ kind: 'template', slug })}`}
            title="Back to docs"
            aria-label="Back to docs"
            className="inline-flex size-8 items-center justify-center rounded-full text-foreground-muted transition-colors hover:bg-background-muted hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden />
          </a>

          <span className="hidden px-1 text-xs text-foreground-muted sm:inline">{doc.name}</span>
          <span className="h-4 w-px bg-border" aria-hidden />

          <BrandSwitcher compact />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
