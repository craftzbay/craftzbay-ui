import { describe, expect, it, vi } from 'vitest';
import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders a labelled checkbox (label clicks toggle it)', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Agree" />);
    const box = screen.getByRole('checkbox', { name: 'Agree' });
    expect(box).toHaveAttribute('aria-checked', 'false');
    await user.click(screen.getByText('Agree'));
    expect(box).toHaveAttribute('aria-checked', 'true');
  });

  it('uncontrolled: defaultChecked + onCheckedChange payload', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox label="A" defaultChecked onCheckedChange={onCheckedChange} />);
    const box = screen.getByRole('checkbox');
    expect(box).toHaveAttribute('aria-checked', 'true');
    await user.click(box);
    expect(onCheckedChange).toHaveBeenCalledWith(false);
    expect(box).toHaveAttribute('aria-checked', 'false');
  });

  it('controlled: checked prop wins until the parent updates', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    const { rerender } = render(
      <Checkbox label="A" checked={false} onCheckedChange={onCheckedChange} />,
    );
    await user.click(screen.getByRole('checkbox'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false');
    rerender(<Checkbox label="A" checked onCheckedChange={onCheckedChange} />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
  });

  it('controlled round-trip through state', async () => {
    const user = userEvent.setup();
    function Demo() {
      const [v, setV] = useState(false);
      return <Checkbox label="A" checked={v} onCheckedChange={(c) => setV(c === true)} />;
    }
    render(<Demo />);
    await user.click(screen.getByRole('checkbox'));
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
  });

  it('indeterminate renders the mixed state with a minus icon', () => {
    const { container } = render(<Checkbox aria-label="All" checked="indeterminate" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'mixed');
    expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'indeterminate');
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('keyboard: Tab focuses, Space toggles', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="A" />);
    await user.tab();
    const box = screen.getByRole('checkbox');
    expect(box).toHaveFocus();
    await user.keyboard(' ');
    expect(box).toHaveAttribute('aria-checked', 'true');
  });

  it('disabled blocks interaction and dims the label', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox label="A" disabled onCheckedChange={onCheckedChange} />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
    await user.click(screen.getByText('A'));
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(screen.getByText('A')).toHaveClass('opacity-50');
  });

  it('wires description and error through aria-describedby (error first)', () => {
    const { rerender } = render(<Checkbox label="A" description="Why" />);
    let box = screen.getByRole('checkbox');
    let ids = box.getAttribute('aria-describedby')!.split(' ');
    expect(ids).toHaveLength(1);
    expect(document.getElementById(ids[0])).toHaveTextContent('Why');
    expect(box).not.toHaveAttribute('aria-invalid');

    rerender(<Checkbox label="A" description="Why" error="Required" aria-describedby="ext" />);
    box = screen.getByRole('checkbox');
    ids = box.getAttribute('aria-describedby')!.split(' ');
    expect(ids).toHaveLength(3);
    expect(document.getElementById(ids[0])).toHaveTextContent('Required');
    expect(document.getElementById(ids[1])).toHaveTextContent('Why');
    expect(ids[2]).toBe('ext');
    expect(box).toHaveAttribute('aria-invalid', 'true');
  });

  it('aria-invalid passthrough marks the box invalid without an error message', () => {
    render(<Checkbox label="A" aria-invalid />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('hideLabel keeps the label accessible and the description rendered', () => {
    render(<Checkbox label="Hidden" hideLabel description="Still here" />);
    expect(screen.getByRole('checkbox', { name: 'Hidden' })).toBeInTheDocument();
    expect(screen.getByText('Hidden')).toHaveClass('sr-only');
    expect(screen.getByText('Still here')).toBeInTheDocument();
  });

  it('consumer id is used for label association', () => {
    render(<Checkbox id="terms" label="Terms" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('id', 'terms');
    expect(screen.getByText('Terms')).toHaveAttribute('for', 'terms');
  });

  it('forwards ref to the button, className goes on the wrapper, props spread to the control', () => {
    const ref = createRef<HTMLButtonElement>();
    const { container } = render(
      <Checkbox ref={ref} label="A" className="extra" name="agree" value="yes" data-x="1" />,
    );
    expect(ref.current).toBe(screen.getByRole('checkbox'));
    expect(container.firstElementChild).toHaveClass('extra', 'flex-col');
    expect(ref.current).toHaveAttribute('data-x', '1');
    expect(ref.current).toHaveAttribute('value', 'yes');
  });

  it('is axe-clean', async () => {
    const { container } = render(
      <div>
        <Checkbox label="Plain" />
        <Checkbox label="Described" description="More" />
        <Checkbox label="Broken" error="Required" />
        <Checkbox aria-label="Mixed" checked="indeterminate" />
        <Checkbox label="Off" disabled />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
