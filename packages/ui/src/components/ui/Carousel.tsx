import { createContext, forwardRef, useCallback, useContext, useEffect, useState, type HTMLAttributes } from 'react';
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IconButton } from './IconButton';

type CarouselApi = UseEmblaCarouselType[1];
type CarouselOptions = Parameters<typeof useEmblaCarousel>[0];

interface CarouselContextValue {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: CarouselApi;
  canPrev: boolean;
  canNext: boolean;
  scrollPrev: () => void;
  scrollNext: () => void;
  orientation: 'horizontal' | 'vertical';
}

const CarouselContext = createContext<CarouselContextValue | null>(null);

function useCarousel() {
  const ctx = useContext(CarouselContext);
  if (!ctx) throw new Error('Carousel components must be used inside <Carousel>');
  return ctx;
}

export interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
  opts?: CarouselOptions;
  orientation?: 'horizontal' | 'vertical';
  setApi?: (api: CarouselApi) => void;
}

/**
 * Embla-backed carousel. Compose with `<CarouselContent>`, `<CarouselItem>`,
 * `<CarouselPrevious>`, and `<CarouselNext>`.
 */
export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(function Carousel(
  { opts, orientation = 'horizontal', setApi, className, children, ...props },
  ref,
) {
  const [carouselRef, api] = useEmblaCarousel({ ...opts, axis: orientation === 'horizontal' ? 'x' : 'y' });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback((api: CarouselApi) => {
    if (!api) return;
    setCanPrev(api.canScrollPrev());
    setCanNext(api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!api) return;
    setApi?.(api);
    onSelect(api);
    api.on('reInit', onSelect).on('select', onSelect);
    return () => {
      api.off('reInit', onSelect).off('select', onSelect);
    };
  }, [api, onSelect, setApi]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        canPrev,
        canNext,
        scrollPrev: () => api?.scrollPrev(),
        scrollNext: () => api?.scrollNext(),
        orientation,
      }}
    >
      <div ref={ref} className={cn('relative', className)} role="region" aria-roledescription="carousel" {...props}>
        {children}
      </div>
    </CarouselContext.Provider>
  );
});

export const CarouselContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CarouselContent({ className, ...props }, ref) {
    const { carouselRef, orientation } = useCarousel();
    return (
      <div ref={carouselRef} className="overflow-hidden">
        <div
          ref={ref}
          className={cn(
            'flex',
            orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col',
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);

export const CarouselItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CarouselItem({ className, ...props }, ref) {
    const { orientation } = useCarousel();
    return (
      <div
        ref={ref}
        role="group"
        aria-roledescription="slide"
        className={cn(
          'min-w-0 shrink-0 grow-0 basis-full',
          orientation === 'horizontal' ? 'pl-4' : 'pt-4',
          className,
        )}
        {...props}
      />
    );
  },
);

export function CarouselPrevious({ className }: { className?: string }) {
  const { canPrev, scrollPrev, orientation } = useCarousel();
  return (
    <IconButton
      aria-label="Previous"
      variant="outline"
      disabled={!canPrev}
      onClick={scrollPrev}
      icon={<ChevronLeft />}
      className={cn(
        'absolute z-10',
        orientation === 'horizontal'
          ? '-left-12 top-1/2 -translate-y-1/2'
          : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
        className,
      )}
    />
  );
}

export function CarouselNext({ className }: { className?: string }) {
  const { canNext, scrollNext, orientation } = useCarousel();
  return (
    <IconButton
      aria-label="Next"
      variant="outline"
      disabled={!canNext}
      onClick={scrollNext}
      icon={<ChevronRight />}
      className={cn(
        'absolute z-10',
        orientation === 'horizontal'
          ? '-right-12 top-1/2 -translate-y-1/2'
          : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
        className,
      )}
    />
  );
}
