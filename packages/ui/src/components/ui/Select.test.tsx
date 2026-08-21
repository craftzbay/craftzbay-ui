import { describe, expect, it, vi } from 'vitest';
import { createRef, useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
} from './Select';
import { DesignSystemProvider } from './DesignSystemProvider';
import { mnStrings } from '@/lib/strings.mn';

function Demo(props: {
  defaultValue?: string;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'default' | 'error';
  disabled?: boolean;
  onValueChange?: (v: string) => void;
}) {
  return (
    <Select
      defaultValue={props.defaultValue}
      onValueChange={props.onValueChange}
      disabled={props.disabled}
    >
      <SelectTrigger
        aria-label="Status"
        placeholder="Pick one"
        size={props.size}
        tone={props.tone}
      />
      <SelectContent>
        <SelectGroup label="Active">
          <SelectItem value="open">Open</SelectItem>
          <SelectItem value="review">In review</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectItem value="closed" disabled>
          Closed
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

describe('Select', () => {
  it('renders a combobox trigger with placeholder and closed state', () => {
    render(<Demo />);
    const trigger = screen.getByRole('combobox', { name: 'Status' });
    expect(trigger).toHaveTextContent('Pick one');
    expect(trigger).toHaveAttribute('data-placeholder');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveClass('h-9', 'border-border-input');
  });

  it('trigger without aria-label / id is named after the placeholder (or the default string)', async () => {
    const { container, unmount } = render(
      <Select>
        <SelectTrigger placeholder="Pick one" />
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>,
    );
    const trigger = screen.getByRole('combobox', { name: 'Pick one' });
    expect(trigger).toHaveAttribute('aria-label', 'Pick one');
    expect(await axe(container)).toHaveNoViolations();
    unmount();

    const second = render(
      <Select>
        <SelectTrigger />
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(screen.getByRole('combobox', { name: 'Select…' })).toBeInTheDocument();
    second.unmount();

    const third = render(
      <DesignSystemProvider strings={mnStrings}>
        <Select>
          <SelectTrigger />
          <SelectContent>
            <SelectItem value="a">A</SelectItem>
          </SelectContent>
        </Select>
      </DesignSystemProvider>,
    );
    expect(
      screen.getByRole('combobox', { name: mnStrings.select.placeholder }),
    ).toBeInTheDocument();
    third.unmount();

    // An id implies an external <label htmlFor>; aria-label must not override it.
    render(
      <>
        <label htmlFor="status">Status</label>
        <Select>
          <SelectTrigger id="status" placeholder="Pick one" />
          <SelectContent>
            <SelectItem value="a">A</SelectItem>
          </SelectContent>
        </Select>
      </>,
    );
    const external = screen.getByRole('combobox', { name: 'Status' });
    expect(external).not.toHaveAttribute('aria-label');
  });

  it('size + tone classes', () => {
    render(<Demo size="lg" tone="error" />);
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveClass('h-10', 'border-danger');
  });

  it('defaultValue shows the selected label (uncontrolled) and picking fires onValueChange', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Demo defaultValue="open" onValueChange={onValueChange} />);
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveTextContent('Open');
    await user.click(trigger);
    const listbox = await screen.findByRole('listbox');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('group', { name: 'Active' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Open' })).toHaveAttribute('aria-selected', 'true');
    expect(listbox.querySelector('[aria-hidden].h-px')).not.toBeNull();
    await user.click(screen.getByRole('option', { name: 'In review' }));
    expect(onValueChange).toHaveBeenCalledWith('review');
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    expect(trigger).toHaveTextContent('In review');
  });

  it('controlled value follows state', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [v, setV] = useState('open');
      return (
        <Select value={v} onValueChange={setV}>
          <SelectTrigger aria-label="S" />
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      );
    }
    render(<Controlled />);
    await user.click(screen.getByRole('combobox'));
    await user.click(await screen.findByRole('option', { name: 'Closed' }));
    expect(screen.getByRole('combobox')).toHaveTextContent('Closed');
  });

  it('keyboard: Enter opens, arrows move, Enter selects, Escape closes and restores focus', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Demo onValueChange={onValueChange} />);
    await user.tab();
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveFocus();
    await user.keyboard('{Enter}');
    await screen.findByRole('listbox');
    await user.keyboard('{ArrowDown}');
    await waitFor(() =>
      expect(screen.getByRole('option', { name: 'In review' })).toHaveAttribute('data-highlighted'),
    );
    await user.keyboard('{Enter}');
    expect(onValueChange).toHaveBeenCalledWith('review');
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    expect(trigger).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    await screen.findByRole('listbox');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    expect(trigger).toHaveFocus();
  });

  it('disabled option cannot be chosen; disabled select cannot open', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { unmount } = render(<Demo onValueChange={onValueChange} />);
    await user.click(screen.getByRole('combobox'));
    const closed = await screen.findByRole('option', { name: 'Closed' });
    expect(closed).toHaveAttribute('data-disabled');
    expect(closed).toHaveAttribute('aria-disabled', 'true');
    unmount();
    render(<Demo disabled />);
    const trigger = screen.getByRole('combobox');
    expect(trigger).toBeDisabled();
    await user.click(trigger);
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('leadingIcon renders inside the item', async () => {
    const user = userEvent.setup();
    render(
      <Select>
        <SelectTrigger aria-label="S" />
        <SelectContent>
          <SelectItem value="a" leadingIcon={<svg data-testid="icon" />}>
            A
          </SelectItem>
        </SelectContent>
      </Select>,
    );
    await user.click(screen.getByRole('combobox'));
    expect(await screen.findByTestId('icon')).toBeInTheDocument();
  });

  it('forwards refs, merges className, spreads props', async () => {
    const triggerRef = createRef<HTMLButtonElement>();
    const contentRef = createRef<HTMLDivElement>();
    const itemRef = createRef<HTMLDivElement>();
    render(
      <Select open>
        <SelectTrigger ref={triggerRef} aria-label="S" className="w-40" data-testid="tr" />
        <SelectContent ref={contentRef} className="max-h-40" data-testid="ct">
          <SelectItem ref={itemRef} value="a" className="py-2" data-testid="it">
            A
          </SelectItem>
        </SelectContent>
      </Select>,
    );
    // While open, Radix hides everything outside the listbox from AT.
    expect(triggerRef.current).toBe(screen.getByRole('combobox', { hidden: true }));
    expect(triggerRef.current).toHaveClass('w-40', 'rounded-md');
    expect(triggerRef.current).toHaveAttribute('data-testid', 'tr');
    await screen.findByRole('listbox');
    expect(contentRef.current).toHaveClass('max-h-40', 'rounded-lg');
    expect(contentRef.current).toHaveAttribute('data-testid', 'ct');
    expect(itemRef.current).toBe(screen.getByRole('option', { name: 'A' }));
    expect(itemRef.current).toHaveClass('py-2', 'rounded-sm');
    expect(itemRef.current).toHaveAttribute('data-testid', 'it');
  });

  it('is axe-clean closed and open', async () => {
    const user = userEvent.setup();
    const { baseElement } = render(<Demo defaultValue="open" />);
    // `region` is a page-level rule; portals land directly in <body>.
    const opts = { rules: { region: { enabled: false } } };
    expect(await axe(baseElement, opts)).toHaveNoViolations();
    await user.click(screen.getByRole('combobox'));
    await screen.findByRole('listbox');
    expect(await axe(baseElement, opts)).toHaveNoViolations();
  });
});
