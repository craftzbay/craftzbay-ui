import { describe, expect, it } from 'vitest';
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { MultiSelect } from './MultiSelect';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

function Demo({ initial = [] as string[] }) {
  const [v, setV] = useState<string[]>(initial);
  return (
    <>
      <MultiSelect label="Fruit" options={options} value={v} onChange={setV} />
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

  it('Backspace on an empty query removes the last chip', async () => {
    const user = userEvent.setup();
    render(<Demo initial={['apple', 'cherry']} />);
    const input = screen.getByLabelText('Fruit');
    await user.click(input);
    await user.keyboard('{Backspace}');
    expect(screen.getByTestId('value')).toHaveTextContent('apple');
    expect(screen.getByTestId('value')).not.toHaveTextContent('cherry');
  });

  it('is axe-clean', async () => {
    const { container } = render(<Demo initial={['apple']} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
