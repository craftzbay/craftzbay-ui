import { describe, expect, it, vi } from 'vitest';
import { createRef, useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Combobox } from './Combobox';
import { DesignSystemProvider } from './DesignSystemProvider';
import { mnStrings } from '@/lib/strings.mn';

// `region` is a page-level landmark rule; irrelevant for a component rendered on a bare body.
const axeBody = () => axe(document.body, { rules: { region: { enabled: false } } });

const options = [
  { value: 'a', label: 'Apple' },
  { value: 'b', label: 'Banana', description: 'yellow' },
  { value: 'c', label: 'Cherry', disabled: true },
];

function Demo({
  initial = null as string | null,
  onChange,
  ...rest
}: { initial?: string | null; onChange?: (v: string | null) => void } & Partial<
  React.ComponentProps<typeof Combobox>
>) {
  const [v, setV] = useState<string | null>(initial);
  return (
    <Combobox
      label="Fruit"
      options={options}
      value={v}
      onChange={(n) => {
        setV(n);
        onChange?.(n);
      }}
      {...rest}
    />
  );
}

describe('Combobox', () => {
  it('trigger has listbox semantics and no nested button', () => {
    render(<Demo initial="a" />);
    const trigger = screen.getByRole('combobox', { name: 'Fruit' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).not.toHaveAttribute('aria-controls');
    expect(trigger.querySelector('button, [role="button"]')).toBeNull();
    const clear = screen.getByRole('button', { name: 'Clear selection' });
    expect(clear).not.toHaveAttribute('tabindex', '-1');
  });

  it('trigger name: label → aria-labelledby; none → placeholder; consumer id → external label', () => {
    const { unmount } = render(<Demo />);
    const labelled = screen.getByRole('combobox', { name: 'Fruit' });
    expect(labelled).toHaveAttribute('aria-labelledby', `${labelled.id}-label`);
    expect(labelled).not.toHaveAttribute('aria-label');
    unmount();

    const second = render(<Demo label={undefined} placeholder="Pick a fruit" />);
    expect(screen.getByRole('combobox', { name: 'Pick a fruit' })).not.toHaveAttribute(
      'aria-labelledby',
    );
    second.unmount();

    const third = render(<Demo label={undefined} />);
    expect(screen.getByRole('combobox', { name: 'Select…' })).toBeInTheDocument();
    third.unmount();

    render(
      <>
        <label htmlFor="ext">External</label>
        <Demo label={undefined} id="ext" />
      </>,
    );
    const external = screen.getByRole('combobox', { name: 'External' });
    expect(external).not.toHaveAttribute('aria-label');
  });

  it('unlabelled trigger is axe-clean', async () => {
    const { container } = render(<Demo label={undefined} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('shows placeholder when empty and the selected label when set', () => {
    const { unmount } = render(<Demo placeholder="Pick one" />);
    expect(screen.getByRole('combobox')).toHaveTextContent('Pick one');
    expect(screen.queryByRole('button', { name: 'Clear selection' })).toBeNull();
    unmount();
    render(<Demo initial="b" placeholder="Pick one" />);
    expect(screen.getByRole('combobox')).toHaveTextContent('Banana');
  });

  it('size classes', () => {
    const { rerender } = render(<Demo size="sm" />);
    expect(screen.getByRole('combobox')).toHaveClass('h-8');
    rerender(<Demo size="lg" />);
    expect(screen.getByRole('combobox')).toHaveClass('h-10');
  });

  it('opens, lists options, wires aria-controls, selects on click and closes; onChange gets the value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Demo onChange={onChange} />);
    const trigger = screen.getByRole('combobox', { name: 'Fruit' });
    await user.click(trigger);
    const listbox = await screen.findByRole('listbox');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await waitFor(() => expect(trigger).toHaveAttribute('aria-controls', listbox.id));
    expect(screen.getAllByRole('option')).toHaveLength(3);
    expect(screen.getByText('yellow')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Cherry/ })).toHaveAttribute('aria-disabled', 'true');
    await user.click(screen.getByRole('option', { name: /Banana/ }));
    expect(onChange).toHaveBeenCalledWith('b');
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    expect(screen.getByRole('combobox')).toHaveTextContent('Banana');
  });

  it('filters by label (not value) and shows the empty state', async () => {
    const user = userEvent.setup();
    render(<Demo />);
    await user.click(screen.getByRole('combobox'));
    const search = await screen.findByPlaceholderText('Search…');
    await user.type(search, 'ban');
    await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(1));
    expect(screen.getByRole('option', { name: /Banana/ })).toBeInTheDocument();
    await user.clear(search);
    // value ids are single letters; typing "a" must not match value "a" for Apple only
    await user.type(search, 'xyz');
    await waitFor(() => expect(screen.queryAllByRole('option')).toHaveLength(0));
    expect(screen.getByText('No results.')).toBeInTheDocument();
  });

  it('keyboard: Enter opens, arrows move, Enter selects, Escape closes and returns focus', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Demo onChange={onChange} />);
    const trigger = screen.getByRole('combobox');
    trigger.focus();
    await user.keyboard('{Enter}');
    await screen.findByRole('listbox');
    await waitFor(() => expect(screen.getByPlaceholderText('Search…')).toHaveFocus());
    await waitFor(() =>
      expect(screen.getByRole('option', { name: /Apple/ })).toHaveAttribute(
        'aria-selected',
        'true',
      ),
    );
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: /Banana/ })).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith('b');
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    await waitFor(() => expect(trigger).toHaveFocus());

    await user.keyboard('{Enter}');
    await screen.findByRole('listbox');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    expect(trigger).toHaveFocus();
  });

  it('clear button resets the value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Demo initial="a" onChange={onChange} />);
    expect(screen.getByRole('combobox')).toHaveTextContent('Apple');
    await user.click(screen.getByRole('button', { name: 'Clear selection' }));
    expect(onChange).toHaveBeenCalledWith(null);
    expect(screen.getByRole('combobox')).toHaveTextContent('Select…');
  });

  it('clearable={false} hides the clear button; disabled disables trigger and hides clear', () => {
    const { rerender } = render(<Demo initial="a" clearable={false} />);
    expect(screen.queryByRole('button', { name: 'Clear selection' })).toBeNull();
    rerender(<Demo initial="a" disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
    expect(screen.queryByRole('button', { name: 'Clear selection' })).toBeNull();
  });

  it('error / helperText wiring and consumer id', () => {
    const { rerender } = render(<Demo id="fruit" helperText="Pick a fruit" />);
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('id', 'fruit');
    expect(screen.getByText('Fruit')).toHaveAttribute('for', 'fruit');
    expect(document.getElementById(trigger.getAttribute('aria-describedby')!)).toHaveTextContent(
      'Pick a fruit',
    );
    expect(trigger).not.toHaveAttribute('aria-invalid');
    rerender(<Demo id="fruit" helperText="Pick a fruit" error="Required" />);
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
    expect(document.getElementById(trigger.getAttribute('aria-describedby')!)).toHaveTextContent(
      'Required',
    );
    expect(screen.queryByText('Pick a fruit')).toBeNull();
    expect(trigger).toHaveClass('border-danger');
  });

  it('forwards ref and merges className on the root', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <Combobox ref={ref} className="extra" value={null} onChange={() => {}} options={options} />,
    );
    expect(ref.current).toBe(container.firstElementChild);
    expect(ref.current).toHaveClass('extra', 'flex-col');
  });

  it('loadOptions mode shows selectedLabel before first open and keeps the picked label', async () => {
    const user = userEvent.setup();
    function Async() {
      const [v, setV] = useState<string | null>('b');
      return (
        <Combobox
          label="Fruit"
          value={v}
          onChange={setV}
          selectedLabel={v === 'b' ? 'Banana' : undefined}
          loadOptions={async (q) =>
            options.filter((o) => o.label.toLowerCase().includes(q.toLowerCase()))
          }
        />
      );
    }
    render(<Async />);
    const trigger = screen.getByRole('combobox', { name: 'Fruit' });
    expect(trigger).toHaveTextContent('Banana');
    await user.click(trigger);
    const apple = await screen.findByText('Apple');
    await user.click(apple);
    await waitFor(() =>
      expect(screen.getByRole('combobox', { name: 'Fruit' })).toHaveTextContent('Apple'),
    );
  });

  it('loadOptions is called with the query and a rejection shows the error text', async () => {
    const user = userEvent.setup();
    const loadOptions = vi.fn(async (q: string) => {
      if (q === 'bad') throw new Error('nope');
      return options.filter((o) => o.label.toLowerCase().includes(q.toLowerCase()));
    });
    render(<Combobox label="Fruit" value={null} onChange={() => {}} loadOptions={loadOptions} />);
    await user.click(screen.getByRole('combobox'));
    await screen.findByText('Apple');
    expect(loadOptions).toHaveBeenCalledWith('');
    const search = screen.getByPlaceholderText('Search…');
    await user.type(search, 'bad');
    expect(await screen.findByText("Couldn't load options.")).toBeInTheDocument();
    expect(screen.queryAllByRole('option')).toHaveLength(0);
    expect(screen.queryByText('No results.')).toBeNull();
    await user.clear(search);
    await screen.findByText('Apple');
    expect(screen.queryByText("Couldn't load options.")).toBeNull();
  });

  it('custom loadErrorText / emptyText win', async () => {
    const user = userEvent.setup();
    render(
      <Combobox
        label="F"
        value={null}
        onChange={() => {}}
        loadOptions={() => Promise.reject(new Error('x'))}
        loadErrorText="Server unavailable"
      />,
    );
    await user.click(screen.getByRole('combobox'));
    expect(await screen.findByText('Server unavailable')).toBeInTheDocument();
  });

  it('localises placeholder, search, empty and clear strings', async () => {
    const user = userEvent.setup();
    render(
      <DesignSystemProvider strings={mnStrings}>
        <Demo initial="a" />
      </DesignSystemProvider>,
    );
    expect(screen.getByRole('button', { name: mnStrings.combobox.clear })).toBeInTheDocument();
    await user.click(screen.getByRole('combobox'));
    const search = await screen.findByPlaceholderText(mnStrings.combobox.searchPlaceholder);
    await user.type(search, 'zzz');
    expect(await screen.findByText(mnStrings.combobox.empty)).toBeInTheDocument();
  });

  it('is axe-clean closed and open', async () => {
    const user = userEvent.setup();
    const { container } = render(<Demo initial="a" helperText="Pick" />);
    expect(await axe(container)).toHaveNoViolations();
    await user.click(screen.getByRole('combobox'));
    const listbox = await screen.findByRole('listbox');
    // the popover is a named dialog
    expect(screen.getByRole('dialog', { name: 'Fruit' })).toContainElement(listbox);
    expect(await axeBody()).toHaveNoViolations();
  });
});
