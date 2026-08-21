import { describe, expect, it } from 'vitest';
import { createRef, useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { MultiSelect } from './MultiSelect';
import { DesignSystemProvider } from './DesignSystemProvider';
import { mnStrings } from '@/lib/strings.mn';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana', description: 'Yellow' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'durian', label: 'Durian', disabled: true },
];

function Demo({
  initial = [] as string[],
  ...rest
}: {
  initial?: string[];
  maxVisibleChips?: number;
  clearable?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
}) {
  const [v, setV] = useState<string[]>(initial);
  return (
    <>
      <MultiSelect label="Fruit" options={options} value={v} onChange={setV} {...rest} />
      <output data-testid="value">{v.join(',')}</output>
    </>
  );
}

describe('MultiSelect', () => {
  it('associates the label with the combobox input', () => {
    render(<Demo />);
    const input = screen.getByLabelText('Fruit');
    expect(input.tagName).toBe('INPUT');
    expect(input).toHaveAttribute('role', 'combobox');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).toHaveAttribute('aria-haspopup', 'listbox');
    expect(input).toHaveAttribute('placeholder', 'Select…');
  });

  it('labelled input carries aria-labelledby; unlabelled falls back to the placeholder; id defers to an external label', async () => {
    const { unmount } = render(<Demo />);
    const labelled = screen.getByRole('combobox', { name: 'Fruit' });
    expect(labelled).toHaveAttribute('aria-labelledby', `${labelled.id}-label`);
    expect(labelled).not.toHaveAttribute('aria-label');
    unmount();

    const second = render(<MultiSelect options={options} value={[]} onChange={() => {}} />);
    expect(screen.getByRole('combobox', { name: 'Select…' })).toHaveAttribute(
      'aria-label',
      'Select…',
    );
    expect(await axe(second.container)).toHaveNoViolations();
    second.unmount();

    render(
      <>
        <label htmlFor="ext">External</label>
        <MultiSelect id="ext" options={options} value={[]} onChange={() => {}} />
      </>,
    );
    expect(screen.getByRole('combobox', { name: 'External' })).not.toHaveAttribute('aria-label');
  });

  it('type + ArrowDown + Enter selects an option', async () => {
    const user = userEvent.setup();
    render(<Demo />);
    const input = screen.getByLabelText('Fruit');
    await user.click(input);
    expect(input).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard('ban');
    await user.keyboard('{ArrowDown}{Enter}');
    expect(screen.getByTestId('value')).toHaveTextContent('banana');
    expect(screen.getByText('Banana', { selector: 'span.truncate' })).toBeInTheDocument();
  });

  it('opens with ArrowDown, wires aria-controls to the list, Escape closes', async () => {
    const user = userEvent.setup();
    render(<Demo />);
    const input = screen.getByLabelText('Fruit');
    input.focus();
    await user.keyboard('{ArrowDown}');
    const list = await screen.findByRole('listbox');
    expect(input).toHaveAttribute('aria-expanded', 'true');
    await waitFor(() => expect(input).toHaveAttribute('aria-controls', list.id));
    expect(screen.getByText('Yellow')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'false'));
    expect(input).not.toHaveAttribute('aria-controls');
  });

  it('clicking an option toggles it; disabled options are inert', async () => {
    const user = userEvent.setup();
    render(<Demo initial={['apple']} />);
    await user.click(screen.getByLabelText('Fruit'));
    const list = await screen.findByRole('listbox');
    const cherry = list.querySelector('[data-value="cherry"]') as HTMLElement;
    await user.click(cherry);
    expect(screen.getByTestId('value')).toHaveTextContent('apple,cherry');
    const apple = list.querySelector('[data-value="apple"]') as HTMLElement;
    await user.click(apple);
    expect(screen.getByTestId('value')).toHaveTextContent('cherry');
    const durian = list.querySelector('[data-value="durian"]') as HTMLElement;
    expect(durian).toHaveAttribute('aria-disabled', 'true');
  });

  it('shows the empty text when nothing matches', async () => {
    const user = userEvent.setup();
    render(<Demo />);
    await user.click(screen.getByLabelText('Fruit'));
    await user.keyboard('zzz');
    expect(await screen.findByText('No results.')).toBeInTheDocument();
  });

  it('Backspace on an empty query removes the last chip', async () => {
    const user = userEvent.setup();
    render(<Demo initial={['apple', 'cherry']} />);
    const input = screen.getByLabelText('Fruit');
    await user.click(input);
    await user.keyboard('{Backspace}');
    expect(screen.getByTestId('value')).toHaveTextContent('apple');
    expect(screen.getByTestId('value')).not.toHaveTextContent('cherry');
  });

  it('chip remove + clear all buttons; clearable={false} hides clear', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Demo initial={['apple', 'banana']} />);
    await user.click(screen.getByRole('button', { name: 'Remove Apple' }));
    expect(screen.getByTestId('value')).toHaveTextContent('banana');
    await user.click(screen.getByRole('button', { name: 'Clear all' }));
    expect(screen.getByTestId('value')).toHaveTextContent('');
    expect(screen.queryByRole('button', { name: 'Clear all' })).toBeNull();
    unmount();
    render(<Demo initial={['apple']} clearable={false} />);
    expect(screen.queryByRole('button', { name: 'Clear all' })).toBeNull();
  });

  it('maxVisibleChips collapses the remainder into +N', () => {
    render(<Demo initial={['apple', 'banana', 'cherry']} maxVisibleChips={2} />);
    expect(screen.getByText('+1')).toBeInTheDocument();
    expect(screen.queryByText('Cherry', { selector: 'span.truncate' })).toBeNull();
    expect(screen.getByLabelText('Fruit')).not.toHaveAttribute('placeholder');
  });

  it('helper text and error wire aria-describedby / aria-invalid', () => {
    const { rerender } = render(<Demo helperText="Pick up to 3" />);
    const input = screen.getByLabelText('Fruit');
    expect(input).toHaveAccessibleDescription('Pick up to 3');
    expect(input).not.toHaveAttribute('aria-invalid');
    rerender(<Demo helperText="Pick up to 3" error="Required" />);
    expect(screen.getByLabelText('Fruit')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText('Fruit')).toHaveAccessibleDescription('Required');
    expect(screen.queryByText('Pick up to 3')).toBeNull();
  });

  it('disabled: input disabled, field aria-disabled, menu does not open', async () => {
    const user = userEvent.setup();
    render(<Demo disabled />);
    const input = screen.getByLabelText('Fruit');
    expect(input).toBeDisabled();
    expect(input.closest('[aria-disabled="true"]')).not.toBeNull();
    await user.click(input);
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('uses Mongolian strings from the provider', async () => {
    const user = userEvent.setup();
    render(
      <DesignSystemProvider strings={mnStrings}>
        <Demo initial={['apple']} />
      </DesignSystemProvider>,
    );
    expect(screen.getByRole('button', { name: 'Apple-г устгах' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Бүгдийг цэвэрлэх' })).toBeInTheDocument();
    await user.click(screen.getByLabelText('Fruit'));
    await user.keyboard('zzz');
    expect(await screen.findByText('Илэрц алга')).toBeInTheDocument();
  });

  it('forwards ref to the wrapper, merges className, honours id', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <MultiSelect
        ref={ref}
        id="fruit-id"
        label="Fruit"
        options={options}
        value={[]}
        onChange={() => {}}
        className="w-80"
      />,
    );
    expect(ref.current?.tagName).toBe('DIV');
    expect(ref.current).toHaveClass('w-80', 'flex-col');
    expect(screen.getByLabelText('Fruit')).toHaveAttribute('id', 'fruit-id');
  });

  it('is axe-clean closed and open', async () => {
    const user = userEvent.setup();
    const { baseElement } = render(<Demo initial={['apple']} />);
    // `region` is a page-level rule; portals land directly in <body>.
    const opts = { rules: { region: { enabled: false } } };
    expect(await axe(baseElement, opts)).toHaveNoViolations();
    await user.click(screen.getByLabelText('Fruit'));
    await screen.findByRole('listbox');
    expect(await axe(baseElement, opts)).toHaveNoViolations();
  });
});
