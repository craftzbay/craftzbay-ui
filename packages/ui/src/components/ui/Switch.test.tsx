import { describe, expect, it, vi } from 'vitest';
import { createRef, useState } from 'react';
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

  it('reflects defaultChecked (uncontrolled) and toggles its own state', async () => {
    render(<Switch label="Notifications" defaultChecked />);
    const sw = screen.getByRole('switch');
    expect(sw).toBeChecked();
    expect(sw).toHaveAttribute('data-state', 'checked');
    await userEvent.click(sw);
    expect(sw).not.toBeChecked();
  });

  it('controlled: state follows the checked prop', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    function Demo() {
      const [on, setOn] = useState(false);
      return (
        <Switch
          label="Digest"
          checked={on}
          onCheckedChange={(v) => {
            onChange(v);
            setOn(v);
          }}
        />
      );
    }
    render(<Demo />);
    const sw = screen.getByRole('switch');
    expect(sw).not.toBeChecked();
    await user.click(sw);
    expect(onChange).toHaveBeenCalledWith(true);
    expect(sw).toBeChecked();
  });

  it('is keyboard-accessible (Space toggles)', async () => {
    const onChange = vi.fn();
    render(<Switch label="Notifications" onCheckedChange={onChange} />);
    const sw = screen.getByRole('switch');
    sw.focus();
    await userEvent.keyboard(' ');
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('wires description via aria-describedby and merges consumer ids', () => {
    render(<Switch label="2FA" description="Required for admins." aria-describedby="extra" />);
    const sw = screen.getByRole('switch');
    expect(sw).toHaveAccessibleDescription(/Required for admins\./);
    expect(sw.getAttribute('aria-describedby')).toMatch(/ extra$/);
  });

  it('sizes, label position and hideLabel', () => {
    const { container, rerender } = render(<Switch label="A" size="sm" labelPosition="before" />);
    const sw = screen.getByRole('switch');
    expect(sw).toHaveClass('h-4', 'w-7');
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.firstElementChild?.tagName).toBe('DIV'); // label block first
    rerender(<Switch label="A" hideLabel />);
    expect(screen.getByText('A')).toHaveClass('sr-only');
    expect(screen.getByRole('switch', { name: 'A' })).toHaveClass('h-5', 'w-9');
  });

  it('disabled blocks interaction and dims the label', async () => {
    const onChange = vi.fn();
    render(<Switch label="A" disabled onCheckedChange={onChange} />);
    const sw = screen.getByRole('switch');
    expect(sw).toBeDisabled();
    await userEvent.click(sw);
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByText('A')).toHaveClass('opacity-50');
  });

  it('forwards ref to the switch button; className goes on the wrapper; props spread', () => {
    const ref = createRef<HTMLButtonElement>();
    const { container } = render(
      <Switch ref={ref} label="A" className="mt-4" data-testid="sw" id="custom" />,
    );
    expect(ref.current).toBe(screen.getByRole('switch'));
    expect(ref.current).toHaveAttribute('data-testid', 'sw');
    expect(ref.current).toHaveAttribute('id', 'custom');
    expect(container.firstElementChild).toHaveClass('mt-4', 'inline-flex');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <div>
        <Switch label="Notifications" />
        <Switch label="Digest" description="Weekly" defaultChecked />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
