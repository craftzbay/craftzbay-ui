import { lazy, Suspense } from 'react';
import { ArrowLeft } from '@/icons';
import { Spinner } from '@/components/ui/Spinner';
import { getBlockMeta } from '../blocks/meta';
import { routeToHash } from '../routing';
import { ThemeToggle, BrandSwitcher } from '../theme/Controls';
import { NotFound } from './NotFound';

const BlockPreview = lazy(() => import('../blocks/Preview'));

/**
 * Standalone block preview — what opens when a template is clicked. Its own
 * browser tab, no showcase navigation, just a slim chrome strip carrying the
 * live brand + theme controls. The block component loads lazily.
 */
export function PreviewPage({ slug }: { slug: string }) {
  const doc = getBlockMeta(slug);
  if (!doc) return <NotFound />;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-12 w-full max-w-[1600px] items-center gap-3 px-4">
          <a
            href={`#${routeToHash({ kind: 'template', slug })}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" aria-hidden />
            Docs
          </a>
          <span className="h-4 w-px bg-border" aria-hidden />
          <div className="flex items-center gap-2 text-xs text-foreground-muted">
            <span className="inline-flex size-1.5 rounded-full bg-accent" aria-hidden />
            Live preview · <span className="font-medium text-foreground">{doc.name}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <BrandSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="flex-1">
        <Suspense
          fallback={
            <div className="flex h-[60vh] items-center justify-center">
              <Spinner />
            </div>
          }
        >
          <BlockPreview slug={slug} />
        </Suspense>
      </div>
    </div>
  );
}
