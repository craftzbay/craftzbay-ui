import { describe, expect, it, vi } from 'vitest';
import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableSortHeader,
} from './Table';
import { DesignSystemProvider } from './DesignSystemProvider';
import { mnStrings } from '@/lib/strings.mn';

type Sort = { key: string; direction: 'asc' | 'desc' } | null;

function SortableDemo(props: { onSort?: (k: string, d: 'asc' | 'desc') => void }) {
  const [sort, setSort] = useState<Sort>(null);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableSortHeader
            sortKey="name"
            currentSort={sort}
            onSortChange={(k, d) => {
              props.onSort?.(k, d);
              setSort({ key: k, direction: d });
            }}
          >
            Name
          </TableSortHeader>
          <TableSortHeader
            sortKey="amount"
            align="right"
            currentSort={sort}
            onSortChange={(k, d) => setSort({ key: k, direction: d })}
          >
            Amount
          </TableSortHeader>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Anu</TableCell>
          <TableCell align="right">1,200</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

describe('Table', () => {
  it('renders table semantics with caption, header, body, footer', () => {
    render(
      <Table>
        <TableCaption>Invoices</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead align="center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Anu</TableCell>
            <TableCell align="center">Paid</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell>1</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );
    const table = screen.getByRole('table', { name: 'Invoices' });
    expect(table).toHaveClass('w-full', 'border-collapse');
    expect(screen.getAllByRole('columnheader')).toHaveLength(2);
    expect(screen.getByRole('columnheader', { name: 'Status' })).toHaveClass('text-center');
    expect(screen.getAllByRole('rowgroup')).toHaveLength(3);
    expect(table.querySelector('thead')).toHaveClass('sticky', 'top-0');
    expect(table.querySelector('tfoot')).toHaveClass('font-medium');
  });

  it('align="right" adds text-right + tabular on head and cells', () => {
    render(<SortableDemo />);
    expect(screen.getByRole('columnheader', { name: 'Amount' })).toHaveClass(
      'text-right',
      'tabular',
    );
    expect(screen.getByRole('cell', { name: '1,200' })).toHaveClass('text-right', 'tabular');
    expect(screen.getByRole('cell', { name: 'Anu' })).toHaveClass('text-left');
    expect(screen.getByRole('cell', { name: 'Anu' })).not.toHaveClass('tabular');
  });

  it('uppercase header opt-in', () => {
    render(
      <table>
        <thead>
          <tr>
            <TableHead uppercase>A</TableHead>
            <TableHead>B</TableHead>
          </tr>
        </thead>
      </table>,
    );
    expect(screen.getByRole('columnheader', { name: 'A' })).toHaveClass('uppercase');
    expect(screen.getByRole('columnheader', { name: 'B' })).not.toHaveClass('uppercase');
  });

  it('containerClassName + maxHeight land on the scroll wrapper', () => {
    render(
      <Table containerClassName="rounded-lg border" maxHeight="24rem" data-testid="t">
        <TableBody>
          <TableRow>
            <TableCell>x</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    const wrapper = screen.getByTestId('t').parentElement as HTMLElement;
    expect(wrapper).toHaveClass('overflow-auto', 'rounded-lg', 'border');
    expect(wrapper.style.maxHeight).toBe('24rem');
  });

  it('no inline style on the wrapper without maxHeight', () => {
    render(
      <Table data-testid="t">
        <TableBody />
      </Table>,
    );
    expect(screen.getByTestId('t').parentElement).not.toHaveAttribute('style');
  });

  it('TableRow selected: data-state always, aria-selected only with role="row"', () => {
    render(
      <table>
        <tbody>
          <TableRow selected data-testid="plain">
            <td>a</td>
          </TableRow>
          <TableRow selected role="row" data-testid="grid">
            <td>b</td>
          </TableRow>
          <TableRow data-testid="none">
            <td>c</td>
          </TableRow>
        </tbody>
      </table>,
    );
    expect(screen.getByTestId('plain')).toHaveAttribute('data-state', 'selected');
    expect(screen.getByTestId('plain')).not.toHaveAttribute('aria-selected');
    expect(screen.getByTestId('grid')).toHaveAttribute('data-state', 'selected');
    expect(screen.getByTestId('grid')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByTestId('none')).not.toHaveAttribute('data-state');
    expect(screen.getByTestId('none')).not.toHaveAttribute('aria-selected');
  });

  it('TableSortHeader: aria-sort only on the active column; click cycles asc → desc → asc', async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();
    render(<SortableDemo onSort={onSort} />);
    const name = screen.getByRole('columnheader', { name: 'Name' });
    const amount = screen.getByRole('columnheader', { name: 'Amount' });
    expect(name).not.toHaveAttribute('aria-sort');
    expect(amount).not.toHaveAttribute('aria-sort');

    await user.click(screen.getByRole('button', { name: 'Name' }));
    expect(onSort).toHaveBeenLastCalledWith('name', 'asc');
    expect(name).toHaveAttribute('aria-sort', 'ascending');
    expect(amount).not.toHaveAttribute('aria-sort');

    await user.click(screen.getByRole('button', { name: 'Name' }));
    expect(onSort).toHaveBeenLastCalledWith('name', 'desc');
    expect(name).toHaveAttribute('aria-sort', 'descending');

    await user.click(screen.getByRole('button', { name: 'Name' }));
    expect(onSort).toHaveBeenLastCalledWith('name', 'asc');
    expect(name).toHaveAttribute('aria-sort', 'ascending');

    // Switching column starts at asc and clears the other.
    await user.click(screen.getByRole('button', { name: 'Amount' }));
    expect(amount).toHaveAttribute('aria-sort', 'ascending');
    expect(name).not.toHaveAttribute('aria-sort');
  });

  it('TableSortHeader is keyboard operable and right-aligned variant reverses the row', async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();
    render(<SortableDemo onSort={onSort} />);
    await user.tab(); // scroll wrapper
    await user.tab();
    expect(screen.getByRole('button', { name: 'Name' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onSort).toHaveBeenCalledWith('name', 'asc');
    expect(screen.getByRole('button', { name: 'Amount' })).toHaveClass('flex-row-reverse');
  });

  it('forwards refs, merges className, spreads props on every primitive', () => {
    const table = createRef<HTMLTableElement>();
    const head = createRef<HTMLTableSectionElement>();
    const body = createRef<HTMLTableSectionElement>();
    const foot = createRef<HTMLTableSectionElement>();
    const row = createRef<HTMLTableRowElement>();
    const th = createRef<HTMLTableCellElement>();
    const td = createRef<HTMLTableCellElement>();
    const caption = createRef<HTMLTableCaptionElement>();
    const sort = createRef<HTMLTableCellElement>();
    render(
      <Table ref={table} className="text-xs" data-testid="table">
        <TableCaption ref={caption} className="mt-0" />
        <TableHeader ref={head} className="z-20">
          <TableRow ref={row} className="h-12" data-testid="row">
            <TableHead ref={th} className="w-10" data-testid="th">
              H
            </TableHead>
            <TableSortHeader
              ref={sort}
              sortKey="k"
              currentSort={null}
              onSortChange={() => {}}
              className="w-20"
              data-testid="sort"
            >
              S
            </TableSortHeader>
          </TableRow>
        </TableHeader>
        <TableBody ref={body} className="divide-y">
          <TableRow>
            <TableCell ref={td} className="py-1" data-testid="td">
              c
            </TableCell>
          </TableRow>
        </TableBody>
        <TableFooter ref={foot} className="border-0" />
      </Table>,
    );
    expect(table.current?.tagName).toBe('TABLE');
    expect(table.current).toHaveClass('text-xs', 'w-full');
    expect(table.current).toHaveAttribute('data-testid', 'table');
    expect(caption.current?.tagName).toBe('CAPTION');
    expect(caption.current).toHaveClass('mt-0');
    expect(head.current?.tagName).toBe('THEAD');
    expect(head.current).toHaveClass('z-20', 'sticky');
    expect(body.current?.tagName).toBe('TBODY');
    expect(body.current).toHaveClass('divide-y');
    expect(foot.current?.tagName).toBe('TFOOT');
    expect(foot.current).toHaveClass('border-0');
    expect(row.current?.tagName).toBe('TR');
    expect(row.current).toHaveClass('h-12', 'border-b');
    expect(row.current).toHaveAttribute('data-testid', 'row');
    expect(th.current?.tagName).toBe('TH');
    expect(th.current).toHaveClass('w-10', 'h-10');
    expect(td.current?.tagName).toBe('TD');
    expect(td.current).toHaveClass('py-1', 'px-3');
    expect(sort.current?.tagName).toBe('TH');
    expect(sort.current).toHaveClass('w-20', 'p-0');
    expect(sort.current).toHaveAttribute('data-testid', 'sort');
  });

  it('scroll wrapper is a focusable, named group with a visible focus ring', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <Table data-testid="t">
        <TableBody />
      </Table>,
    );
    const wrapper = screen.getByTestId('t').parentElement as HTMLElement;
    expect(wrapper).toHaveAttribute('tabindex', '0');
    expect(wrapper).toHaveAttribute('role', 'group');
    expect(wrapper).toHaveAccessibleName('Scrollable table');
    expect(wrapper).toHaveClass('focus-visible:ring-2', 'focus-visible:ring-offset-2');
    await user.tab();
    expect(wrapper).toHaveFocus();

    rerender(
      <Table data-testid="t" scrollLabel="Invoices">
        <TableBody />
      </Table>,
    );
    expect(wrapper).toHaveAccessibleName('Invoices');

    rerender(
      <DesignSystemProvider strings={mnStrings}>
        <Table data-testid="t">
          <TableBody />
        </Table>
      </DesignSystemProvider>,
    );
    expect(screen.getByTestId('t').parentElement).toHaveAccessibleName(
      mnStrings.table.scrollRegion,
    );
  });

  it('is axe-clean (two tables on one page do not clash as landmarks)', async () => {
    const { container } = render(
      <div>
        <SortableDemo />
        <SortableDemo />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
