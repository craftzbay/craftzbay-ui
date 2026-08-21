import { describe, expect, it } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { TopNav, TopNavLink } from './TopNav';
import { DesignSystemProvider } from './DesignSystemProvider';
import { mnStrings } from '@/lib/strings.mn';

function Demo(props: { navLabel?: string }) {
  return (
    <TopNav
      logo={<span>Logo</span>}
      navLabel={props.navLabel}
      nav={
        <>
          <TopNavLink href="/" active>
            Home
          </TopNavLink>
          <TopNavLink href="/docs">Docs</TopNavLink>
        </>
      }
      search={<input aria-label="Search" />}
      actions={<button type="button">Account</button>}
    />
  );
}

describe('TopNav', () => {
  it('renders a banner with logo, nav landmark, search and actions', () => {
    render(<Demo />);
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('sticky', 'h-14');
    expect(screen.getByText('Logo')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Account' })).toBeInTheDocument();
  });

  it('omits the nav landmark and slots that are not provided', () => {
    render(<TopNav logo={<span>Logo</span>} />);
    expect(screen.queryByRole('navigation')).toBeNull();
    expect(screen.getByRole('banner').children).toHaveLength(1);
  });

  it('navLabel overrides the default nav name', () => {
    render(<Demo navLabel="Main" />);
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
  });

  it('uses the Mongolian nav label from the provider', () => {
    render(
      <DesignSystemProvider strings={mnStrings}>
        <Demo />
      </DesignSystemProvider>,
    );
    expect(screen.getByRole('navigation', { name: 'Үндсэн' })).toBeInTheDocument();
  });

  it('forwards ref, merges className, spreads props', () => {
    const ref = createRef<HTMLElement>();
    render(<TopNav ref={ref} logo="L" className="px-8" data-testid="tn" />);
    expect(ref.current).toBe(screen.getByRole('banner'));
    expect(ref.current).toHaveClass('px-8', 'sticky');
    expect(ref.current).toHaveAttribute('data-testid', 'tn');
  });

  it('is axe-clean', async () => {
    const { container } = render(<Demo />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('TopNavLink', () => {
  it('renders an anchor with aria-current only when active', () => {
    render(<Demo />);
    const home = screen.getByRole('link', { name: 'Home' });
    const docs = screen.getByRole('link', { name: 'Docs' });
    expect(home).toHaveAttribute('href', '/');
    expect(home).toHaveAttribute('aria-current', 'page');
    expect(home).toHaveClass('text-foreground');
    expect(docs).not.toHaveAttribute('aria-current');
    expect(docs).toHaveClass('text-foreground-muted');
  });

  it('asChild renders the child element with merged props', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <TopNavLink ref={ref} asChild active className="extra" data-testid="lnk">
        <a href="/router" data-router="1">
          Router
        </a>
      </TopNavLink>,
    );
    const a = screen.getByRole('link', { name: 'Router' });
    expect(ref.current).toBe(a);
    expect(a).toHaveAttribute('href', '/router');
    expect(a).toHaveAttribute('data-router', '1');
    expect(a).toHaveAttribute('data-testid', 'lnk');
    expect(a).toHaveAttribute('aria-current', 'page');
    expect(a).toHaveClass('extra', 'inline-flex', 'h-9');
    // only one element rendered — no wrapping <a>
    expect(screen.getAllByRole('link')).toHaveLength(1);
  });

  it('forwards ref and merges className without asChild', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <TopNavLink ref={ref} href="/x" className="px-0">
        X
      </TopNavLink>,
    );
    expect(ref.current?.tagName).toBe('A');
    expect(ref.current).toHaveClass('px-0', 'rounded-md');
  });
});
