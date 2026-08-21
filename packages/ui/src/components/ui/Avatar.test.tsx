import { describe, expect, it } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Avatar, AvatarGroup } from './Avatar';
import { DesignSystemProvider } from './DesignSystemProvider';
import { mnStrings } from '@/lib/strings.mn';

describe('Avatar', () => {
  it('shows the fallback initials when there is no src', async () => {
    render(<Avatar fallback="JD" />);
    expect(await screen.findByText('JD')).toBeInTheDocument();
  });

  it('shows "?" when neither src nor fallback is given', async () => {
    render(<Avatar />);
    expect(await screen.findByText('?')).toBeInTheDocument();
  });

  it('applies size classes to the wrapper', () => {
    const { container, rerender } = render(<Avatar fallback="A" />);
    expect(container.firstElementChild).toHaveClass('size-8');
    rerender(<Avatar fallback="A" size="xl" />);
    expect(container.firstElementChild).toHaveClass('size-12');
  });

  it('renders a labelled status dot only when `status` is set', () => {
    const { rerender } = render(<Avatar fallback="A" />);
    expect(screen.queryByRole('img')).toBeNull();
    rerender(<Avatar fallback="A" status="online" />);
    const dot = screen.getByRole('img', { name: 'Status: online' });
    expect(dot).toHaveClass('bg-success');
  });

  it('forwards ref to the Radix root and merges className on the wrapper', () => {
    const ref = createRef<HTMLSpanElement>();
    const { container } = render(<Avatar ref={ref} fallback="A" className="extra" data-x="1" />);
    expect(container.firstElementChild).toHaveClass('extra', 'inline-flex');
    expect(ref.current).toHaveClass('rounded-full');
    expect(ref.current).toHaveAttribute('data-x', '1');
  });

  it('localises the status label', () => {
    render(
      <DesignSystemProvider strings={mnStrings}>
        <Avatar fallback="A" status="busy" />
      </DesignSystemProvider>,
    );
    expect(screen.getByRole('img').getAttribute('aria-label')).toContain('busy');
    expect(screen.getByRole('img').getAttribute('aria-label')).not.toMatch(/^Status:/);
  });

  it('is axe-clean', async () => {
    const { container } = render(
      <div>
        <Avatar fallback="JD" status="away" />
        <Avatar />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('AvatarGroup', () => {
  const people = ['AA', 'BB', 'CC', 'DD', 'EE', 'FF'];

  it('shows at most `max` avatars and a labelled overflow chip', async () => {
    render(
      <AvatarGroup max={3}>
        {people.map((p) => (
          <Avatar key={p} fallback={p} />
        ))}
      </AvatarGroup>,
    );
    expect(await screen.findByText('AA')).toBeInTheDocument();
    expect(screen.getByText('CC')).toBeInTheDocument();
    expect(screen.queryByText('DD')).toBeNull();
    expect(screen.getByLabelText('3 more')).toHaveTextContent('+3');
  });

  it('renders no overflow chip when everything fits', () => {
    render(
      <AvatarGroup max={6}>
        {people.map((p) => (
          <Avatar key={p} fallback={p} />
        ))}
      </AvatarGroup>,
    );
    expect(screen.queryByText(/^\+/)).toBeNull();
  });

  it('propagates size to children that do not set their own', () => {
    const { container } = render(
      <AvatarGroup size="lg">
        <Avatar fallback="AA" />
        <Avatar fallback="BB" size="xs" />
      </AvatarGroup>,
    );
    const wrappers = container.querySelectorAll('span.inline-flex');
    expect(wrappers[0]).toHaveClass('size-10');
    expect(wrappers[1]).toHaveClass('size-5');
  });

  it('forwards ref and spreads props on the group root', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <AvatarGroup ref={ref} data-testid="grp" className="gap-x">
        <Avatar fallback="AA" />
      </AvatarGroup>,
    );
    expect(ref.current).toBe(screen.getByTestId('grp'));
    expect(ref.current).toHaveClass('gap-x', 'flex');
  });

  it('localises the overflow label', () => {
    render(
      <DesignSystemProvider strings={mnStrings}>
        <AvatarGroup max={1}>
          <Avatar fallback="AA" />
          <Avatar fallback="BB" />
        </AvatarGroup>
      </DesignSystemProvider>,
    );
    expect(screen.getByText('+1').getAttribute('aria-label')).not.toBe('1 more');
    expect(screen.getByText('+1').getAttribute('aria-label')).toContain('1');
  });
});
