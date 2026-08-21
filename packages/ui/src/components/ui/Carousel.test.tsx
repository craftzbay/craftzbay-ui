import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';

/* jsdom has no layout, so Embla cannot compute slides in view. A small fake
 * API lets the tests drive `select` / `slidesInView` deterministically. */
type Handler = (api: unknown) => void;
const fake = {
  index: 0,
  count: 3,
  handlers: new Map<string, Set<Handler>>(),
  canScrollPrev: vi.fn(() => fake.index > 0),
  canScrollNext: vi.fn(() => fake.index < fake.count - 1),
  slidesInView: vi.fn(() => [fake.index]),
  slideNodes: vi.fn(() => Array.from({ length: fake.count }, () => ({}))),
  scrollPrev: vi.fn(() => fake.goTo(fake.index - 1)),
  scrollNext: vi.fn(() => fake.goTo(fake.index + 1)),
  on(evt: string, h: Handler) {
    if (!fake.handlers.has(evt)) fake.handlers.set(evt, new Set());
    fake.handlers.get(evt)!.add(h);
    return fake;
  },
  off(evt: string, h: Handler) {
    fake.handlers.get(evt)?.delete(h);
    return fake;
  },
  emit(evt: string) {
    fake.handlers.get(evt)?.forEach((h) => h(fake));
  },
  goTo(i: number) {
    if (i < 0 || i >= fake.count) return;
    fake.index = i;
    fake.emit('select');
    fake.emit('slidesInView');
  },
  reset() {
    fake.index = 0;
    fake.count = 3;
    fake.handlers.clear();
    fake.scrollPrev.mockClear();
    fake.scrollNext.mockClear();
  },
};

vi.mock('embla-carousel-react', () => ({
  default: () => [() => {}, fake],
}));

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './Carousel';
import { DesignSystemProvider } from './DesignSystemProvider';
import { mnStrings } from '@/lib/strings.mn';

function Demo(props: Partial<React.ComponentProps<typeof Carousel>>) {
  return (
    <Carousel {...props}>
      <CarouselContent>
        {[0, 1, 2].map((i) => (
          <CarouselItem key={i} index={i}>
            <button type="button">Slide button {i + 1}</button>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

beforeEach(() => fake.reset());

describe('Carousel', () => {
  it('renders a labelled carousel region with slide groups and default labels', () => {
    render(<Demo />);
    const region = screen.getByRole('region', { name: 'Carousel' });
    expect(region).toHaveAttribute('aria-roledescription', 'carousel');
    const slides = screen.getAllByRole('group', { hidden: true });
    expect(slides).toHaveLength(3);
    expect(slides[0]).toHaveAttribute('aria-roledescription', 'slide');
    expect(slides[0]).toHaveAttribute('aria-label', '1 of 3');
    expect(slides[2]).toHaveAttribute('aria-label', '3 of 3');
    expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });

  it('consumer aria-label wins; aria-labelledby suppresses the default label', () => {
    const { rerender } = render(<Demo aria-label="Featured" />);
    expect(screen.getByRole('region', { name: 'Featured' })).toBeInTheDocument();
    rerender(
      <>
        <h2 id="h">Gallery</h2>
        <Demo aria-labelledby="h" />
      </>,
    );
    const region = screen.getByRole('region', { name: 'Gallery' });
    expect(region).not.toHaveAttribute('aria-label');
    rerender(<Demo aria-label={undefined} />);
    expect(screen.getByRole('region', { name: 'Carousel' })).toBeInTheDocument();
  });

  it('off-screen slides are inert / aria-hidden; the visible one is live', () => {
    render(<Demo />);
    const slides = screen.getAllByRole('group', { hidden: true });
    expect(slides[0]).not.toHaveAttribute('aria-hidden');
    expect(slides[0]).not.toHaveAttribute('inert');
    expect(slides[1]).toHaveAttribute('aria-hidden', 'true');
    expect(slides[1]).toHaveAttribute('inert');
    expect(slides[2]).toHaveAttribute('inert');
    // only the visible slide's button is in the accessibility tree
    expect(screen.getAllByRole('button', { name: /Slide button/ })).toHaveLength(1);
  });

  it('prev/next buttons reflect scroll ability and move the carousel', async () => {
    const user = userEvent.setup();
    render(<Demo />);
    const prev = screen.getByRole('button', { name: 'Previous' });
    const next = screen.getByRole('button', { name: 'Next' });
    expect(prev).toBeDisabled();
    expect(next).not.toBeDisabled();
    await user.click(next);
    expect(fake.scrollNext).toHaveBeenCalledOnce();
    expect(prev).not.toBeDisabled();
    let slides = screen.getAllByRole('group', { hidden: true });
    expect(slides[1]).not.toHaveAttribute('inert');
    expect(slides[0]).toHaveAttribute('inert');
    await user.click(next);
    expect(next).toBeDisabled();
    await user.click(prev);
    slides = screen.getAllByRole('group', { hidden: true });
    expect(slides[1]).not.toHaveAttribute('inert');
  });

  it('arrow keys inside the region scroll (horizontal: ←/→, vertical: ↑/↓)', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Demo />);
    screen.getByRole('button', { name: /Slide button/ }).focus();
    await user.keyboard('{ArrowRight}');
    expect(fake.scrollNext).toHaveBeenCalledTimes(1);
    await user.keyboard('{ArrowLeft}');
    expect(fake.scrollPrev).toHaveBeenCalledTimes(1);
    await user.keyboard('{ArrowDown}');
    expect(fake.scrollNext).toHaveBeenCalledTimes(1);

    rerender(<Demo orientation="vertical" />);
    screen.getByRole('button', { name: /Slide button/ }).focus();
    await user.keyboard('{ArrowDown}');
    expect(fake.scrollNext).toHaveBeenCalledTimes(2);
    await user.keyboard('{ArrowUp}');
    expect(fake.scrollPrev).toHaveBeenCalledTimes(2);
  });

  it('consumer onKeyDown runs first and preventDefault stops the built-in handling', async () => {
    const user = userEvent.setup();
    const onKeyDown = vi.fn((e: React.KeyboardEvent) => e.preventDefault());
    render(<Demo onKeyDown={onKeyDown} />);
    screen.getByRole('button', { name: /Slide button/ }).focus();
    await user.keyboard('{ArrowRight}');
    expect(onKeyDown).toHaveBeenCalled();
    expect(fake.scrollNext).not.toHaveBeenCalled();
  });

  it('orientation classes on content, items and buttons', () => {
    const { container, rerender } = render(<Demo />);
    expect(container.querySelector('.overflow-hidden > div')).toHaveClass('-ml-4');
    expect(screen.getAllByRole('group', { hidden: true })[0]).toHaveClass('pl-4');
    expect(screen.getByRole('button', { name: 'Previous' })).toHaveClass('-left-12');
    rerender(<Demo orientation="vertical" />);
    expect(container.querySelector('.overflow-hidden > div')).toHaveClass('flex-col', '-mt-4');
    expect(screen.getAllByRole('group', { hidden: true })[0]).toHaveClass('pt-4');
    expect(screen.getByRole('button', { name: 'Previous' })).toHaveClass('-top-12', 'rotate-90');
  });

  it('setApi receives the embla api', () => {
    const setApi = vi.fn();
    render(<Demo setApi={setApi} />);
    expect(setApi).toHaveBeenCalledWith(fake);
  });

  it('slides without `index` stay live and unlabelled', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>A</CarouselItem>
          <CarouselItem aria-label="Custom">B</CarouselItem>
        </CarouselContent>
      </Carousel>,
    );
    const slides = screen.getAllByRole('group');
    expect(slides[0]).not.toHaveAttribute('aria-label');
    expect(slides[0]).not.toHaveAttribute('inert');
    expect(slides[1]).toHaveAttribute('aria-label', 'Custom');
  });

  it('reacts to external reInit (slide count changes)', () => {
    render(<Demo />);
    act(() => {
      fake.count = 5;
      fake.emit('reInit');
    });
    expect(screen.getAllByRole('group', { hidden: true })[0]).toHaveAttribute(
      'aria-label',
      '1 of 5',
    );
  });

  it('sub-components throw outside <Carousel>', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<CarouselNext />)).toThrow(/inside <Carousel>/);
    error.mockRestore();
  });

  it('forwards refs and merges className / props', () => {
    const rootRef = createRef<HTMLDivElement>();
    const itemRef = createRef<HTMLDivElement>();
    const nextRef = createRef<HTMLButtonElement>();
    render(
      <Carousel ref={rootRef} className="extra" data-testid="root">
        <CarouselContent className="c-x">
          <CarouselItem ref={itemRef} index={0} className="i-x">
            x
          </CarouselItem>
        </CarouselContent>
        <CarouselNext ref={nextRef} className="n-x" aria-label="Forward" />
      </Carousel>,
    );
    expect(rootRef.current).toBe(screen.getByTestId('root'));
    expect(rootRef.current).toHaveClass('extra', 'relative');
    expect(itemRef.current).toHaveClass('i-x', 'basis-full');
    expect(nextRef.current).toBe(screen.getByRole('button', { name: 'Forward' }));
    expect(nextRef.current).toHaveClass('n-x');
  });

  it('localises region, slide and button labels', () => {
    render(
      <DesignSystemProvider strings={mnStrings}>
        <Demo />
      </DesignSystemProvider>,
    );
    expect(screen.getByRole('region', { name: 'Гүйлгэгч' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Өмнөх' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Дараах' })).toBeInTheDocument();
    expect(screen.getAllByRole('group', { hidden: true })[0]).toHaveAttribute(
      'aria-label',
      '1 / 3',
    );
  });

  it('is axe-clean', async () => {
    const { container } = render(<Demo />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
