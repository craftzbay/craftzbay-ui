import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from '../Pagination';
import { Progress, ProgressCircle } from '../Progress';
import { DataGrid } from '../DataGrid';
import { LineChart } from '../Chart';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSortHeader,
} from '../Table';
import { formatNumber, getDateTimeFormat } from '../../../lib/format';

describe('Pagination zero state', () => {
  it('shows 0 of 0 and disables next/last when there are no pages', () => {
    render(
      <Pagination page={1} pageCount={0} totalItems={0} pageSize={20} onPageChange={() => {}} />,
    );
    expect(screen.getByText(/0.*0.*0/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /last/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
  });
});

describe('Progress clamp', () => {
  it('clamps value into [0, max] for aria + transform', () => {
    const { rerender } = render(<Progress value={150} aria-label="Upload" />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '100');
    rerender(<Progress value={-20} aria-label="Upload" />);
    expect(bar).toHaveAttribute('aria-valuenow', '0');
    rerender(<Progress value={5} max={10} aria-label="Upload" />);
    expect(bar).toHaveAttribute('aria-valuenow', '5');
    expect(bar).toHaveAttribute('aria-valuemax', '10');
  });

  it('ProgressCircle accepts size tokens and numbers', () => {
    const { container, rerender } = render(<ProgressCircle value={120} aria-label="Storage" />);
    expect(container.querySelector('svg')).toHaveAttribute('width', '36');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    rerender(<ProgressCircle value={10} size="lg" aria-label="Storage" />);
    expect(container.querySelector('svg')).toHaveAttribute('width', '48');
    rerender(<ProgressCircle value={10} size={20} aria-label="Storage" />);
    expect(container.querySelector('svg')).toHaveAttribute('width', '20');
  });
});

describe('DataGrid column visibility', () => {
  const rows = [{ id: 1, name: 'A', when: new Date('2026-08-20T02:05:00Z') }];
  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'when', header: 'When' },
  ];

  it('never hides the last visible column (controlled)', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DataGrid
        rows={rows}
        columns={columns}
        columnVisibility={{ when: false }}
        onColumnVisibilityChange={onChange}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Column visibility' }));
    const item = await screen.findByRole('menuitemcheckbox', { name: 'Name' });
    expect(item).toHaveAttribute('aria-disabled', 'true');
    await user.click(item);
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getAllByRole('columnheader', { hidden: true })).toHaveLength(1);
  });

  it('formats Date cells via formatDate', () => {
    render(<DataGrid rows={rows} columns={columns} />);
    expect(screen.getByText('2026-08-20 10:05')).toBeInTheDocument();
  });
});

describe('Chart roving focus', () => {
  const data = [
    { x: 'Jan', y: 1 },
    { x: 'Feb', y: 2 },
    { x: 'Mar', y: 3 },
  ];

  it('exposes one tab stop per series and moves with arrow keys', () => {
    const { container } = render(
      <LineChart data={data} caption="Rev" series={[{ name: 'S', data }]} />,
    );
    expect(container.querySelectorAll('svg [tabindex="0"]')).toHaveLength(1);
    expect(container.querySelectorAll('circle[tabindex]')).toHaveLength(0);
    const g = container.querySelector('svg g[tabindex="0"]') as SVGGElement;
    fireEvent.focus(g);
    const live = container.querySelector('[aria-live="polite"]');
    expect(live?.textContent).toBe('S — Mar: 3');
    fireEvent.keyDown(g, { key: 'ArrowLeft' });
    expect(live?.textContent).toBe('S — Feb: 2');
    fireEvent.keyDown(g, { key: 'Home' });
    expect(live?.textContent).toBe('S — Jan: 1');
  });
});

describe('Table aria-sort', () => {
  it('sets aria-sort only on the active column', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableSortHeader
              sortKey="a"
              currentSort={{ key: 'a', direction: 'desc' }}
              onSortChange={() => {}}
            >
              A
            </TableSortHeader>
            <TableSortHeader
              sortKey="b"
              currentSort={{ key: 'a', direction: 'desc' }}
              onSortChange={() => {}}
            >
              B
            </TableSortHeader>
            <TableHead align="right">N</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow selected>
            <TableCell>1</TableCell>
            <TableCell>2</TableCell>
            <TableCell align="right">3</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    const [a, b, n] = screen.getAllByRole('columnheader');
    expect(a).toHaveAttribute('aria-sort', 'descending');
    expect(b).not.toHaveAttribute('aria-sort');
    expect(n).toHaveClass('text-right', 'tabular');
    const row = screen.getAllByRole('row')[1];
    expect(row).toHaveAttribute('data-state', 'selected');
    expect(row).not.toHaveAttribute('aria-selected');
  });
});

describe('format', () => {
  it('normalises -0 and caches Intl formatters', () => {
    expect(formatNumber(-0.001)).toBe('0');
    expect(formatNumber(-0)).toBe('0');
    expect(formatNumber(-0.5, { maximumFractionDigits: 0 })).toBe('-1');
    expect(getDateTimeFormat('UTC')).toBe(getDateTimeFormat('UTC'));
  });
});
