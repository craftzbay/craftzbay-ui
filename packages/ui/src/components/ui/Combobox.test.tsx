import { describe, expect, it } from 'vitest';
import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Combobox } from './Combobox';

const options = [
  { value: 'a', label: 'Apple' },
  { value: 'b', label: 'Banana' },
];

function Demo({ initial = null as string | null }) {
  const [v, setV] = useState<string | null>(initial);
  return <Combobox label="Fruit" options={options} value={v} onChange={setV} />;
}

describe('Combobox', () => {
  it('trigger has listbox semantics and no nested button', () => {
    render(<Demo initial="a" />);
    const trigger = screen.getByRole('combobox', { name: 'Fruit' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    expect(trigger).not.toHaveAttribute('aria-controls');
    expect(trigger.querySelector('button, [role="button"]')).toBeNull();
    const clear = screen.getByRole('button', { name: 'Clear selection' });
    expect(clear).not.toHaveAttribute('tabindex', '-1');
  });

  it('clear button resets the value', async () => {
    const user = userEvent.setup();
    render(<Demo initial="a" />);
    expect(screen.getByRole('combobox')).toHaveTextContent('Apple');
    await user.click(screen.getByRole('button', { name: 'Clear selection' }));
    expect(screen.getByRole('combobox')).toHaveTextContent('Select…');
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

  it('is axe-clean', async () => {
    const { container } = render(<Demo initial="a" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
