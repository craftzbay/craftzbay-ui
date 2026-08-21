import { describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Calendar } from './Calendar';
import { DesignSystemProvider } from './DesignSystemProvider';
import { mnStrings } from '@/lib/strings.mn';

const june = new Date(2024, 5, 1); // June 2024; June 15 is a Saturday

describe('Calendar', () => {
  it('renders a month grid with default labels and dropdown caption', () => {
    render(<Calendar defaultMonth={june} />);
    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous month' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next month' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Calendar navigation' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Choose the month' })).toHaveTextContent('June');
    expect(screen.getByRole('combobox', { name: 'Choose the year' })).toHaveTextContent('2024');
  });

  it('weeks start on Monday by default and can be overridden', () => {
    const { container, rerender } = render(<Calendar defaultMonth={june} />);
    // RDP hides the weekday row from AT; read the cells directly.
    let headers = container.querySelectorAll('thead th');
    expect(headers).toHaveLength(7);
    expect(headers[0]).toHaveAttribute('aria-label', 'Monday');
    expect(headers[0]).toHaveTextContent(/^Mo/);
    expect(headers[6]).toHaveAttribute('aria-label', 'Sunday');
    rerender(<Calendar defaultMonth={june} weekStartsOn={0} />);
    headers = container.querySelectorAll('thead th');
    expect(headers[0]).toHaveAttribute('aria-label', 'Sunday');
  });

  it('single mode: selecting a day calls onSelect and styles the cell (class on td, button inside)', async () => {
    const user = userEvent.setup();
    function Demo() {
      const [d, setD] = useState<Date | undefined>();
      return <Calendar mode="single" defaultMonth={june} selected={d} onSelect={setD} />;
    }
    render(<Demo />);
    const day = screen.getByRole('button', { name: /June 15th/ });
    await user.click(day);
    const cell = day.closest('td')!;
    expect(cell).toHaveAttribute('aria-selected', 'true');
    expect(cell.className).toContain('[&_button]:bg-accent');
    expect(cell.querySelector('button')).toBe(day);
  });

  it('controlled selected renders as selected; onSelect receives the Date', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Calendar
        mode="single"
        defaultMonth={june}
        selected={new Date(2024, 5, 10)}
        onSelect={onSelect}
      />,
    );
    expect(screen.getByRole('button', { name: /June 10th/ }).closest('td')).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await user.click(screen.getByRole('button', { name: /June 20th/ }));
    expect(onSelect).toHaveBeenCalled();
    const picked = onSelect.mock.calls[0][0] as Date;
    expect(picked.getDate()).toBe(20);
    expect(picked.getMonth()).toBe(5);
  });

  it('next / previous buttons move the month', async () => {
    const user = userEvent.setup();
    render(<Calendar defaultMonth={june} />);
    await user.click(screen.getByRole('button', { name: 'Next month' }));
    expect(screen.getByRole('combobox', { name: 'Choose the month' })).toHaveTextContent('July');
    await user.click(screen.getByRole('button', { name: 'Previous month' }));
    await user.click(screen.getByRole('button', { name: 'Previous month' }));
    expect(screen.getByRole('combobox', { name: 'Choose the month' })).toHaveTextContent('May');
  });

  it('keyboard: arrow keys move focus between days; Enter selects', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Calendar mode="single" defaultMonth={june} onSelect={onSelect} />);
    const start = screen.getByRole('button', { name: /June 15th/ });
    start.focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: /June 16th/ })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('button', { name: /June 23rd/ })).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('button', { name: /June 22nd/ })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect((onSelect.mock.calls[0][0] as Date).getDate()).toBe(22);
  });

  it('disabled matcher disables days', () => {
    render(
      <Calendar mode="single" defaultMonth={june} disabled={{ before: new Date(2024, 5, 10) }} />,
    );
    expect(screen.getByRole('button', { name: /June 5th/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: /June 15th/ })).not.toBeDisabled();
  });

  it('consumer labels and classNames merge with the defaults; className on root', () => {
    const { container } = render(
      <Calendar
        defaultMonth={june}
        className="extra"
        labels={{ labelNext: () => 'Forward' }}
        classNames={{ weekday: 'wk-x' }}
      />,
    );
    expect(screen.getByRole('button', { name: 'Forward' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous month' })).toBeInTheDocument();
    expect(container.querySelector('thead th')).toHaveClass('wk-x');
    expect(container.firstElementChild).toHaveClass('extra', 'rounded-lg');
  });

  it('localises nav labels', () => {
    render(
      <DesignSystemProvider strings={mnStrings}>
        <Calendar defaultMonth={june} />
      </DesignSystemProvider>,
    );
    expect(screen.getByRole('button', { name: 'Өмнөх сар' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Дараах сар' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Сар сонгох' })).toBeInTheDocument();
  });

  it('is axe-clean', async () => {
    const { container } = render(
      <Calendar mode="single" defaultMonth={june} selected={new Date(2024, 5, 15)} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
