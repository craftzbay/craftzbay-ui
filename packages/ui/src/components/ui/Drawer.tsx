'use client';

import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
} from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';
import { cn } from '@/lib/utils';

type Direction = 'top' | 'right' | 'bottom' | 'left';

export const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: ComponentPropsWithoutRef<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
);
Drawer.displayName = 'Drawer';

export const DrawerTrigger = DrawerPrimitive.Trigger;
export const DrawerPortal = DrawerPrimitive.Portal;
export const DrawerClose = DrawerPrimitive.Close;

export const DrawerOverlay = forwardRef<
  ElementRef<typeof DrawerPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(function DrawerOverlay({ className, ...props }, ref) {
  return (
    <DrawerPrimitive.Overlay
      ref={ref}
      className={cn('bg-overlay fixed inset-0 z-[var(--z-overlay)]', className)}
      {...props}
    />
  );
});
DrawerOverlay.displayName = 'DrawerOverlay';

// Edge-anchored sides pad by the matching safe-area inset (consumers set viewport-fit=cover).
const directionStyles: Record<Direction, string> = {
  bottom:
    'inset-x-0 bottom-0 mt-24 flex h-auto max-h-[90vh] flex-col rounded-t-xl border-t border-border pb-[env(safe-area-inset-bottom)]',
  top: 'inset-x-0 top-0 mb-24 flex h-auto max-h-[90vh] flex-col rounded-b-xl border-b border-border',
  left: 'inset-y-0 left-0 flex h-full w-[420px] max-w-[90vw] flex-col rounded-r-xl border-r border-border pl-[env(safe-area-inset-left)]',
  right:
    'inset-y-0 right-0 flex h-full w-[420px] max-w-[90vw] flex-col rounded-l-xl border-l border-border pr-[env(safe-area-inset-right)]',
};

const handleStyles: Record<Direction, string> = {
  bottom: 'mx-auto mt-3 h-1.5 w-12 rounded-full bg-border',
  top: 'mx-auto mb-3 h-1.5 w-12 rounded-full bg-border order-last',
  left: 'mx-1.5 my-auto h-12 w-1.5 rounded-full bg-border order-last self-stretch shrink-0',
  right: 'mx-1.5 my-auto h-12 w-1.5 rounded-full bg-border shrink-0 self-stretch',
};

export interface DrawerContentProps extends ComponentPropsWithoutRef<
  typeof DrawerPrimitive.Content
> {
  /** Side the drawer slides in from. Default `bottom`. */
  direction?: Direction;
  /** Hide the drag handle. */
  hideHandle?: boolean;
}

export const DrawerContent = forwardRef<
  ElementRef<typeof DrawerPrimitive.Content>,
  DrawerContentProps
>(function DrawerContent({ className, direction = 'bottom', hideHandle, children, ...props }, ref) {
  const isHorizontal = direction === 'left' || direction === 'right';
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        ref={ref}
        className={cn(
          'bg-card fixed z-[var(--z-modal)]',
          directionStyles[direction],
          isHorizontal && 'flex-row',
          className,
        )}
        {...props}
      >
        {!hideHandle && <div aria-hidden className={handleStyles[direction]} />}
        <div className={cn('min-h-0 min-w-0 flex-1', isHorizontal && 'flex flex-col')}>
          {children}
        </div>
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
});
DrawerContent.displayName = 'DrawerContent';

export function DrawerHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('grid gap-1 p-4 text-center sm:text-left', className)} {...props} />;
}
DrawerHeader.displayName = 'DrawerHeader';

export function DrawerFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...props} />;
}
DrawerFooter.displayName = 'DrawerFooter';

export const DrawerTitle = forwardRef<
  ElementRef<typeof DrawerPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(function DrawerTitle({ className, ...props }, ref) {
  return (
    <DrawerPrimitive.Title
      ref={ref}
      className={cn('text-lg font-semibold', className)}
      {...props}
    />
  );
});
DrawerTitle.displayName = 'DrawerTitle';

export const DrawerDescription = forwardRef<
  ElementRef<typeof DrawerPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(function DrawerDescription({ className, ...props }, ref) {
  return (
    <DrawerPrimitive.Description
      ref={ref}
      className={cn('text-foreground-muted text-sm', className)}
      {...props}
    />
  );
});
DrawerDescription.displayName = 'DrawerDescription';
