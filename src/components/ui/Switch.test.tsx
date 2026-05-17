import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Switch } from './Switch';

describe('Switch', () => {
  it('toggles when clicked', async () => {
    const onChange = vi.fn();
    render(<Switch label="Notifications" onCheckedChange={onChange} />);
    await userEvent.click(screen.getByRole('switch', { name: 'Notifications' }));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('reflects defaultChecked', () => {
    render(<Switch label="Notifications" defaultChecked />);
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('is keyboard-accessible (Space toggles)', async () => {
    const onChange = vi.fn();
    render(<Switch label="Notifications" onCheckedChange={onChange} />);
    const sw = screen.getByRole('switch');
    sw.focus();
    await userEvent.keyboard(' ');
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Switch label="Notifications" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
