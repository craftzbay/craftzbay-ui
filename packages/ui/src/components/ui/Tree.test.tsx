import { describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Tree } from './Tree';

const data = [
  {
    id: 'src',
    label: 'src',
    children: [
      { id: 'index.ts', label: 'index.ts' },
      { id: 'app.tsx', label: 'app.tsx' },
    ],
  },
  { id: 'readme', label: 'README.md' },
];

describe('Tree', () => {
  it('exposes APG tree semantics with a single tab stop', () => {
    render(<Tree aria-label="Files" data={data} defaultExpanded={['src']} />);
    const items = screen.getAllByRole('treeitem');
    expect(items).toHaveLength(4);
    expect(items.filter((i) => i.tabIndex === 0)).toHaveLength(1);
    expect(items[0]).toHaveAttribute('aria-expanded', 'true');
    expect(items[0]).toHaveAttribute('aria-level', '1');
    expect(items[0]).toHaveAttribute('aria-setsize', '2');
    expect(items[0]).toHaveAttribute('aria-posinset', '1');
    expect(items[1]).toHaveAttribute('aria-level', '2');
    expect(items[1]).toHaveAttribute('aria-posinset', '1');
    expect(items[1]).toHaveAttribute('aria-setsize', '2');
  });

  it('navigates with arrows, Home/End, and selects with Enter', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Tree aria-label="Files" data={data} onSelect={onSelect} />);
    const [src, readme] = screen.getAllByRole('treeitem');
    await user.tab();
    expect(src).toHaveFocus();
    expect(src).toHaveAttribute('aria-expanded', 'false');

    await user.keyboard('{ArrowRight}');
    expect(src).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByRole('treeitem')).toHaveLength(4);

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('treeitem', { name: 'index.ts' })).toHaveFocus();

    await user.keyboard('{ArrowLeft}');
    expect(src).toHaveFocus();

    await user.keyboard('{End}');
    expect(readme).toHaveFocus();
    await user.keyboard('{Home}');
    expect(src).toHaveFocus();

    await user.keyboard('{ArrowLeft}');
    expect(src).toHaveAttribute('aria-expanded', 'false');

    await user.keyboard('{ArrowDown}{Enter}');
    expect(onSelect).toHaveBeenCalledWith('readme');
    expect(readme).toHaveAttribute('aria-selected', 'true');
  });

  it('supports controlled expanded + selected', async () => {
    const user = userEvent.setup();
    function Demo() {
      const [expanded, setExpanded] = useState<string[]>([]);
      const [selected, setSelected] = useState<string>();
      return (
        <Tree
          aria-label="Files"
          data={data}
          expanded={expanded}
          onExpandedChange={setExpanded}
          selected={selected}
          onSelectedChange={setSelected}
        />
      );
    }
    render(<Demo />);
    await user.click(screen.getByText('src'));
    expect(screen.getByRole('treeitem', { name: /src/ })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('treeitem', { name: /src/ })).toHaveAttribute('aria-selected', 'true');
  });

  it('is axe-clean', async () => {
    const { container } = render(<Tree aria-label="Files" data={data} defaultExpanded={['src']} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
