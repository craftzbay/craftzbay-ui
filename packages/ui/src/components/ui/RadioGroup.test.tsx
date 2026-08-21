import { describe, expect, it, vi } from 'vitest';
import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { RadioGroup, RadioItem } from './RadioGroup';

function Options() {
  return (
    <>
      <RadioItem value="daily" label="Daily" description="Every morning" />
      <RadioItem value="weekly" label="Weekly" />
      <RadioItem value="never" label="Never" />
    </>
  );
}

describe('RadioGroup', () => {
  it('renders a radiogroup with labelled radios and descriptions', () => {
    render(
      <RadioGroup aria-label="Frequency" defaultValue="weekly">
        <Options />
      </RadioGroup>,
    );
    const group = screen.getByRole('radiogroup', { name: 'Frequency' });
    expect(group).toHaveAttribute('aria-orientation', 'vertical');
    expect(group).toHaveClass('flex-col');
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    expect(screen.getByRole('radio', { name: 'Weekly' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Daily' })).toHaveAccessibleDescription(
      'Every morning',
    );
  });

  it('horizontal orientation sets attribute + row layout', () => {
    render(
      <RadioGroup aria-label="F" orientation="horizontal">
        <Options />
      </RadioGroup>,
    );
    const group = screen.getByRole('radiogroup');
    expect(group).toHaveAttribute('aria-orientation', 'horizontal');
    expect(group).toHaveClass('flex-row');
  });

  it('uncontrolled: clicking a label checks the radio and fires onValueChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <RadioGroup aria-label="F" onValueChange={onChange}>
        <Options />
      </RadioGroup>,
    );
    await user.click(screen.getByText('Never'));
    expect(onChange).toHaveBeenCalledWith('never');
    expect(screen.getByRole('radio', { name: 'Never' })).toBeChecked();
  });

  it('controlled: value follows state', async () => {
    const user = userEvent.setup();
    function Demo() {
      const [v, setV] = useState('daily');
      return (
        <RadioGroup aria-label="F" value={v} onValueChange={setV}>
          <Options />
        </RadioGroup>
      );
    }
    render(<Demo />);
    expect(screen.getByRole('radio', { name: 'Daily' })).toBeChecked();
    await user.click(screen.getByRole('radio', { name: 'Weekly' }));
    expect(screen.getByRole('radio', { name: 'Weekly' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Daily' })).not.toBeChecked();
  });

  it('arrow keys move + select following orientation (vertical: Down/Up)', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <RadioGroup aria-label="F" defaultValue="daily" onValueChange={onChange}>
        <Options />
      </RadioGroup>,
    );
    await user.tab();
    expect(screen.getByRole('radio', { name: 'Daily' })).toHaveFocus();
    // Radix moves focus in a setTimeout and checks the radio on focus only
    // while an arrow key is still held — hold the key across that tick.
    await user.keyboard('{ArrowDown>}');
    await user.keyboard('{/ArrowDown}');
    expect(screen.getByRole('radio', { name: 'Weekly' })).toHaveFocus();
    expect(onChange).toHaveBeenLastCalledWith('weekly');
    expect(screen.getByRole('radio', { name: 'Weekly' })).toBeChecked();
    await user.keyboard('{ArrowUp>}');
    await user.keyboard('{/ArrowUp}');
    expect(screen.getByRole('radio', { name: 'Daily' })).toHaveFocus();
    expect(onChange).toHaveBeenLastCalledWith('daily');
    // ArrowRight is ignored in a vertical group.
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Daily' })).toHaveFocus();
  });

  it('horizontal: ArrowRight/ArrowLeft navigate and wrap', async () => {
    const user = userEvent.setup();
    render(
      <RadioGroup aria-label="F" orientation="horizontal" defaultValue="never">
        <Options />
      </RadioGroup>,
    );
    await user.tab();
    expect(screen.getByRole('radio', { name: 'Never' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Daily' })).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('radio', { name: 'Never' })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: 'Never' })).toHaveFocus();
  });

  it('only one tab stop; Space checks the focused radio', async () => {
    const user = userEvent.setup();
    render(
      <RadioGroup aria-label="F">
        <Options />
      </RadioGroup>,
    );
    await user.tab();
    expect(screen.getByRole('radio', { name: 'Daily' })).toHaveFocus();
    await user.keyboard(' ');
    expect(screen.getByRole('radio', { name: 'Daily' })).toBeChecked();
    await user.tab();
    expect(screen.getAllByRole('radio').some((r) => r === document.activeElement)).toBe(false);
  });

  it('disabled item cannot be chosen; hideLabel keeps the name', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <RadioGroup aria-label="F" onValueChange={onChange}>
        <RadioItem value="a" label="A" disabled />
        <RadioItem value="b" label="B" hideLabel />
      </RadioGroup>,
    );
    await user.click(screen.getByRole('radio', { name: 'A' }));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('radio', { name: 'A' })).toBeDisabled();
    expect(screen.getByText('B')).toHaveClass('sr-only');
  });

  it('forwards refs, merges className, spreads props', () => {
    const groupRef = createRef<HTMLDivElement>();
    const itemRef = createRef<HTMLButtonElement>();
    render(
      <RadioGroup ref={groupRef} aria-label="F" className="gap-6" data-testid="rg">
        <RadioItem ref={itemRef} value="a" label="A" className="items-center" data-testid="ri" />
      </RadioGroup>,
    );
    expect(groupRef.current).toBe(screen.getByRole('radiogroup'));
    expect(groupRef.current).toHaveClass('gap-6', 'flex');
    expect(groupRef.current).toHaveAttribute('data-testid', 'rg');
    expect(itemRef.current).toBe(screen.getByRole('radio'));
    expect(itemRef.current).toHaveAttribute('data-testid', 'ri');
    // className on RadioItem lands on its wrapper row
    expect(itemRef.current?.parentElement).toHaveClass('items-center');
  });

  it('is axe-clean', async () => {
    const { container } = render(
      <RadioGroup aria-label="Frequency" defaultValue="weekly">
        <Options />
      </RadioGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
