'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface TopNavProps extends HTMLAttributes<HTMLElement> {
  /** Logo / wordmark slot. Shown on the far left. */
  logo: ReactNode;
  /** Primary navigation links — typically a list of `<TopNavLink>`. */
  nav?: ReactNode;
  /** Search / command bar slot — fills the centre on wide screens. */
  search?: ReactNode;
  /** Right-aligned cluster — notifications, theme toggle, user menu. */
  actions?: ReactNode;
}

/**
 * App-level top bar. Layout: `logo · nav · search · actions`. Search and nav
 * are optional.
 *
 * @example
 *   <TopNav
 *     logo={<Logo />}
 *     nav={<><TopNavLink href="/" active>Home</TopNavLink>…</>}
 *     search={<Input type="search" placeholder="Search…" />}
 *     actions={<><Bell /><Avatar /></>}
 *   />
 *
 * @do Pick one primary nav style — links here or in the Sidebar, not both.
 * @dont Stack two rows of navigation in the TopNav. If you need tabs as well,
 *       put them below the bar inside the page content.
 */
export const TopNav = forwardRef<HTMLElement, TopNavProps>(function TopNav(
  { logo, nav, search, actions, className, ...props },
  ref,
) {
  return (
    <header
      ref={ref}
      className={cn(
        'sticky top-0 z-[var(--z-sticky)] flex h-14 w-full items-center gap-4',
        'border-b border-border bg-background px-4',
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-6 shrink-0">
        {logo}
        {nav && <nav className="hidden md:flex items-center gap-1">{nav}</nav>}
      </div>
      {search && <div className="flex-1 max-w-md mx-auto">{search}</div>}
      {actions && <div className="ml-auto flex items-center gap-2 shrink-0">{actions}</div>}
    </header>
  );
});
TopNav.displayName = 'TopNav';

export interface TopNavLinkProps extends HTMLAttributes<HTMLAnchorElement> {
  href: string;
  active?: boolean;
}

export const TopNavLink = forwardRef<HTMLAnchorElement, TopNavLinkProps>(function TopNavLink(
  { href, active, className, children, ...props },
  ref,
) {
  return (
    <a
      ref={ref}
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'inline-flex h-9 items-center rounded-md px-3 text-sm font-medium outline-none',
        'transition-colors duration-[var(--duration-fast)]',
        active ? 'text-foreground' : 'text-foreground-muted hover:text-foreground',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
});
TopNavLink.displayName = 'TopNavLink';
