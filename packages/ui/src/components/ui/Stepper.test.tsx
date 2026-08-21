import { describe, expect, it } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Stepper } from './Stepper';
import { DesignSystemProvider } from './DesignSystemProvider';
import { mnStrings } from '@/lib/strings.mn';

const steps = [
  { title: 'Workspace', description: 'Name it' },
  { title: 'Invite', description: 'Add people' },
  { title: 'Done' },
];

describe('Stepper', () => {
  it('renders an ordered list labelled "Progress" with aria-current on the active step', () => {
    render(<Stepper steps={steps} current={1} />);
    const list = screen.getByRole('list', { name: 'Progress' });
    expect(list.tagName).toBe('OL');
    expect(list).toHaveClass('items-center');
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(items[0]).not.toHaveAttribute('aria-current');
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    expect(items[2]).not.toHaveAttribute('aria-current');
  });

  it('announces sr-only state labels per step', () => {
    render(<Stepper steps={steps} current={1} />);
    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveTextContent('Workspace, Completed');
    expect(items[1]).toHaveTextContent('Invite, Current');
    expect(items[2]).toHaveTextContent('Done, Upcoming');
    expect(screen.getByText(', Current')).toHaveClass('sr-only');
  });

  it('marks completed steps with a check and accent fill; numbers otherwise', () => {
    render(<Stepper steps={steps} current={1} />);
    const items = screen.getAllByRole('listitem');
    const badge = (i: number) => items[i].querySelector('span[aria-hidden]') as HTMLElement;
    expect(badge(0)).toHaveClass('bg-accent');
    expect(badge(0).querySelector('svg')).not.toBeNull();
    expect(badge(1)).toHaveClass('border-accent');
    expect(badge(1)).toHaveTextContent('2');
    expect(badge(2)).toHaveClass('bg-background-muted');
    expect(badge(2)).toHaveTextContent('3');
  });

  it('vertical orientation shows descriptions; horizontal hides them', () => {
    const { rerender } = render(<Stepper steps={steps} current={0} orientation="vertical" />);
    expect(screen.getByRole('list')).toHaveClass('flex-col');
    expect(screen.getByText('Name it')).toBeInTheDocument();
    rerender(<Stepper steps={steps} current={0} />);
    expect(screen.queryByText('Name it')).toBeNull();
  });

  it('keeps a consumer aria-label and custom stateLabels', () => {
    render(
      <Stepper
        steps={steps}
        current={0}
        aria-label="Onboarding"
        stateLabels={{ complete: 'done', current: 'now', upcoming: 'later' }}
      />,
    );
    expect(screen.getByRole('list', { name: 'Onboarding' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')[0]).toHaveTextContent('Workspace, now');
    expect(screen.getAllByRole('listitem')[1]).toHaveTextContent('Invite, later');
  });

  it('uses Mongolian strings from the provider', () => {
    render(
      <DesignSystemProvider strings={mnStrings}>
        <Stepper steps={steps} current={1} />
      </DesignSystemProvider>,
    );
    expect(screen.getByRole('list', { name: 'Явц' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')[0]).toHaveTextContent('Дууссан');
    expect(screen.getAllByRole('listitem')[1]).toHaveTextContent('Одоогийн');
    expect(screen.getAllByRole('listitem')[2]).toHaveTextContent('Дараагийн');
  });

  it('forwards ref, merges className, spreads props', () => {
    const ref = createRef<HTMLOListElement>();
    render(<Stepper ref={ref} steps={steps} current={0} className="max-w-md" data-testid="st" />);
    expect(ref.current).toBe(screen.getByRole('list'));
    expect(ref.current).toHaveClass('max-w-md', 'flex');
    expect(ref.current).toHaveAttribute('data-testid', 'st');
  });

  it('is axe-clean in both orientations', async () => {
    const { container } = render(
      <div>
        <Stepper steps={steps} current={1} />
        <Stepper steps={steps} current={2} orientation="vertical" />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
