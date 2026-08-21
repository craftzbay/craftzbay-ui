import { describe, expect, it, vi } from 'vitest';
import { createRef, useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import type { DateRange } from 'react-day-picker';
import { DatePicker, DateRangePicker } from './DatePicker';
import { DesignSystemProvider } from './DesignSystemProvider';
import { mnStrings } from '@/lib/strings.mn';

const axeBody = () => axe(document.body, { rules: { region: { enabled: false } } });

describe('DatePicker', () => {
  it('renders a labelled combobox trigger with placeholder and closed state', () => {
    render(<DatePicker label="Date of birth" onChange={() => {}} />);
    const trigger = screen.getByRole('combobox', { name: 'Date of birth' });
    expect(trigger).toHaveTextContent('Pick a date');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-controls');
    expect(screen.queryByRole('grid')).toBeNull();
  });

  it('trigger name: label → aria-labelledby; no label → placeholder', async () => {
    const { unmount } = render(<DatePicker label="Date of birth" onChange={() => {}} />);
    const labelled = screen.getByRole('combobox', { name: 'Date of birth' });
    expect(labelled).toHaveAttribute('aria-labelledby', `${labelled.id}-label`);
    expect(labelled).not.toHaveAttribute('aria-label');
    unmount();

    const { container } = render(<DatePicker onChange={() => {}} />);
    expect(screen.getByRole('combobox', { name: 'Pick a date' })).toHaveAttribute(
      'aria-label',
      'Pick a date',
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('shows the value as yyyy-MM-dd by default and via formatDate', () => {
    const d = new Date(2024, 5, 5);
    const { rerender } = render(<DatePicker label="D" value={d} onChange={() => {}} />);
    expect(screen.getByRole('combobox')).toHaveTextContent('2024-06-05');
    rerender(<DatePicker label="D" value={d} onChange={() => {}} formatDate={() => 'custom'} />);
    expect(screen.getByRole('combobox')).toHaveTextContent('custom');
  });

  it('opens on click, selecting a day calls onChange with a Date and closes; focus returns', async () => {
    const user = userEvent.setup();
    function Demo() {
      const [d, setD] = useState<Date | undefined>(new Date(2024, 5, 1));
      return <DatePicker label="D" value={d} onChange={setD} />;
    }
    render(<Demo />);
    const trigger = screen.getByRole('combobox', { name: 'D' });
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const grid = await screen.findByRole('grid');
    expect(trigger.getAttribute('aria-controls')).toBe(grid.closest('[id$="-calendar"]')?.id);
    // opens on the value's month, named after the label
    expect(screen.getByRole('dialog', { name: 'D' })).toContainElement(grid);
    expect(grid).toHaveAttribute('aria-label', 'June 2024');
    await user.click(screen.getByRole('button', { name: /June 15th/ }));
    await waitFor(() => expect(screen.queryByRole('grid')).toBeNull());
    expect(screen.getByRole('combobox', { name: 'D' })).toHaveTextContent('2024-06-15');
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'D' })).toHaveFocus());
  });

  it('Escape closes the popover and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<DatePicker label="D" onChange={() => {}} />);
    const trigger = screen.getByRole('combobox');
    await user.click(trigger);
    await screen.findByRole('grid');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('grid')).toBeNull());
    expect(trigger).toHaveFocus();
  });

  it('error wires aria-invalid + aria-describedby', () => {
    render(<DatePicker label="D" onChange={() => {}} error="Required" />);
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
    const id = trigger.getAttribute('aria-describedby')!;
    expect(document.getElementById(id)).toHaveTextContent('Required');
  });

  it('disabled trigger does not open', async () => {
    const user = userEvent.setup();
    render(<DatePicker label="D" onChange={() => {}} disabled />);
    const trigger = screen.getByRole('combobox');
    expect(trigger).toBeDisabled();
    await user.click(trigger);
    expect(screen.queryByRole('grid')).toBeNull();
  });

  it('fromDate / toDate disable days outside the range', async () => {
    const user = userEvent.setup();
    render(
      <DatePicker
        label="D"
        value={new Date(2024, 5, 15)}
        onChange={() => {}}
        fromDate={new Date(2024, 5, 10)}
        toDate={new Date(2024, 5, 20)}
      />,
    );
    await user.click(screen.getByRole('combobox'));
    await screen.findByRole('grid');
    expect(screen.getByRole('button', { name: /June 5th/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: /June 25th/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: /June 15th/ })).not.toBeDisabled();
  });

  it('forwards ref and applies className to the root', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<DatePicker ref={ref} className="extra" onChange={() => {}} />);
    expect(ref.current).toBe(container.firstElementChild);
    expect(ref.current).toHaveClass('extra');
  });

  it('localises the placeholder', () => {
    render(
      <DesignSystemProvider strings={mnStrings}>
        <DatePicker label="D" onChange={() => {}} />
      </DesignSystemProvider>,
    );
    expect(screen.getByRole('combobox')).toHaveTextContent(mnStrings.datePicker.pickDate);
  });

  it('is axe-clean closed and open', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <DatePicker label="D" value={new Date(2024, 5, 1)} onChange={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
    await user.click(screen.getByRole('combobox'));
    await screen.findByRole('grid');
    expect(await axeBody()).toHaveNoViolations();
  });
});

describe('DateRangePicker', () => {
  it('renders placeholder, partial and full ranges', () => {
    const { rerender } = render(<DateRangePicker label="Period" onChange={() => {}} />);
    expect(screen.getByRole('combobox', { name: 'Period' })).toHaveTextContent('Pick a range');
    rerender(
      <DateRangePicker label="Period" value={{ from: new Date(2024, 0, 1) }} onChange={() => {}} />,
    );
    expect(screen.getByRole('combobox')).toHaveTextContent('2024-01-01');
    rerender(
      <DateRangePicker
        label="Period"
        value={{ from: new Date(2024, 0, 1), to: new Date(2024, 0, 31) }}
        onChange={() => {}}
      />,
    );
    expect(screen.getByRole('combobox')).toHaveTextContent('2024-01-01 – 2024-01-31');
  });

  it('unlabelled trigger is named after the placeholder', () => {
    render(<DateRangePicker onChange={() => {}} placeholder="Period" />);
    expect(screen.getByRole('combobox', { name: 'Period' })).toBeInTheDocument();
  });

  it('opens two months and builds a range across two clicks', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    function Demo() {
      const [r, setR] = useState<DateRange | undefined>({ from: new Date(2024, 5, 1) });
      return (
        <DateRangePicker
          label="Period"
          value={r}
          onChange={(n) => {
            onChange(n);
            setR(n);
          }}
        />
      );
    }
    render(<Demo />);
    await user.click(screen.getByRole('combobox'));
    const grids = await screen.findAllByRole('grid');
    expect(grids).toHaveLength(2);
    expect(grids[0]).toHaveAttribute('aria-label', 'June 2024');
    await user.click(screen.getByRole('button', { name: /June 10th/ }));
    const last = onChange.mock.calls.at(-1)![0] as DateRange;
    expect(last.from?.getDate()).toBe(1);
    expect(last.to?.getDate()).toBe(10);
    // range stays open for adjustments
    expect(screen.getAllByRole('grid')).toHaveLength(2);
  });

  it('localises the placeholder', () => {
    render(
      <DesignSystemProvider strings={mnStrings}>
        <DateRangePicker label="P" onChange={() => {}} />
      </DesignSystemProvider>,
    );
    expect(screen.getByRole('combobox')).toHaveTextContent(mnStrings.datePicker.pickRange);
  });
});
