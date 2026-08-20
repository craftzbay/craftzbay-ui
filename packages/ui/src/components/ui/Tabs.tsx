'use client';

import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from '@/lib/cva';

/* -----------------------------------------------------------------------------
 *  Two visual variants — `underline` (refined-minimal default) and `pills`.
 *  Variant is set on `TabsList`; trigger styles auto-derive via data-attr.
 * --------------------------------------------------------------------------- */

export const Tabs = TabsPrimitive.Root;

const list = cva('inline-flex items-center', {
  variants: {
    variant: {
      underline: 'gap-4 border-b border-border w-full',
      pills: 'gap-1 rounded-lg bg-background-muted p-1',
    },
    size: {
      sm: 'h-9 text-xs',
      md: 'h-10 text-sm',
      lg: 'h-11 text-sm',
    },
  },
  defaultVariants: { variant: 'underline', size: 'md' },
});

export interface TabsListProps
  extends ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof list> {}

export const TabsList = forwardRef<ElementRef<typeof TabsPrimitive.List>, TabsListProps>(
  function TabsList({ className, variant = 'underline', size, ...props }, ref) {
    return (
      <TabsPrimitive.List
        ref={ref}
        data-variant={variant}
        className={cn(list({ variant, size }), className)}
        {...props}
      />
    );
  },
);
TabsList.displayName = 'TabsList';

export const TabsTrigger = forwardRef<
  ElementRef<typeof TabsPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(function TabsTrigger({ className, ...props }, ref) {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        'inline-flex items-center gap-2 whitespace-nowrap font-medium',
        'outline-none transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:pointer-events-none disabled:opacity-50',
        // Underline variant
        '[[data-variant=underline]_&]:relative [[data-variant=underline]_&]:h-full',
        '[[data-variant=underline]_&]:px-1 [[data-variant=underline]_&]:text-foreground-muted',
        '[[data-variant=underline]_&]:hover:text-foreground',
        '[[data-variant=underline]_&]:data-[state=active]:text-foreground',
        '[[data-variant=underline]_&]:data-[state=active]:after:absolute',
        '[[data-variant=underline]_&]:data-[state=active]:after:inset-x-0',
        '[[data-variant=underline]_&]:data-[state=active]:after:-bottom-px',
        '[[data-variant=underline]_&]:data-[state=active]:after:h-0.5',
        '[[data-variant=underline]_&]:data-[state=active]:after:bg-accent',
        // Pills variant
        '[[data-variant=pills]_&]:h-full [[data-variant=pills]_&]:rounded-md [[data-variant=pills]_&]:px-3',
        '[[data-variant=pills]_&]:text-foreground-muted',
        '[[data-variant=pills]_&]:hover:text-foreground',
        '[[data-variant=pills]_&]:data-[state=active]:bg-card',
        '[[data-variant=pills]_&]:data-[state=active]:text-foreground',
        '[[data-variant=pills]_&]:data-[state=active]:shadow-xs',
        className,
      )}
      {...props}
    />
  );
});
TabsTrigger.displayName = 'TabsTrigger';

export const TabsContent = forwardRef<
  ElementRef<typeof TabsPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(function TabsContent({ className, ...props }, ref) {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        'mt-4 outline-none',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className,
      )}
      {...props}
    />
  );
});
TabsContent.displayName = 'TabsContent';

/**
 * @example Underline (default)
 *   <Tabs defaultValue="overview">
 *     <TabsList>
 *       <TabsTrigger value="overview">Overview</TabsTrigger>
 *       <TabsTrigger value="activity">Activity</TabsTrigger>
 *     </TabsList>
 *     <TabsContent value="overview">…</TabsContent>
 *     <TabsContent value="activity">…</TabsContent>
 *   </Tabs>
 *
 * @example Pills
 *   <TabsList variant="pills"><TabsTrigger value="all">All</TabsTrigger>…</TabsList>
 *
 * @do Use `underline` at the top of a page or panel. Use `pills` inside a
 *      card or for filter-style switches.
 * @dont Mix variants on the same screen — pick one and commit.
 */
