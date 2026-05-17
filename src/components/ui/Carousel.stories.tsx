import type { Meta, StoryObj } from '@storybook/react-vite';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './Carousel';

const meta: Meta = {
  title: 'Data Display/Carousel',
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="mx-auto w-full max-w-md px-12">
      <Carousel>
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, i) => (
            <CarouselItem key={i}>
              <div className="flex aspect-video items-center justify-center rounded-md border border-border bg-card text-3xl font-medium">
                {i + 1}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
};

export const MultiItem: Story = {
  render: () => (
    <div className="mx-auto w-full max-w-2xl px-12">
      <Carousel opts={{ align: 'start' }}>
        <CarouselContent>
          {Array.from({ length: 8 }).map((_, i) => (
            <CarouselItem key={i} className="basis-1/3">
              <div className="flex aspect-square items-center justify-center rounded-md border border-border bg-card text-xl font-medium">
                #{i + 1}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
};
