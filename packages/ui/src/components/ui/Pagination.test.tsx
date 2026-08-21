import { describe, expect, it, vi } from 'vitest';
import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Pagination } from './Pagination';
import { DesignSystemProvider } from './DesignSystemProvider';
import { mnStrings } from '@/lib/strings.mn';

describe('Pagination', () => {
  it('renders a nav landmark, numbered pages with aria-current, and the summary', () => {
    render(
      <Pagination page={2} pageCount={5} onPageChange={() => {}} totalItems={95} pageSize={20} />,
    );
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
    expect(screen.getByText('Showing 21–40 of 95')).toHaveClass('tabular');
    const current = screen.getByRole('button', { name: 'Page 2' });
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current).toHaveClass('bg-accent');
    expect(screen.getByRole('button', { name: 'Page 3' })).not.toHaveAttribute('aria-current');
    expect(screen.getAllByRole('button', { name: /^Page \d+$/ })).toHaveLength(5);
  });

  it('collapses long ranges with gaps around the current page', () => {
    render(<Pagination page={10} pageCount={20} onPageChange={() => {}} />);
    const labels = screen.getAllByRole('button', { name: /^Page \d+$/ }).map((b) => b.textContent);
    expect(labels).toEqual(['1', '9', '10', '11', '20']);
    expect(screen.getAllByText('…')).toHaveLength(2);
  });

  it('fires onPageChange for numbers, prev/next, first/last; ignores no-ops', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination page={3} pageCount={10} onPageChange={onPageChange} />);
    await user.click(screen.getByRole('button', { name: 'Page 4' }));
    expect(onPageChange).toHaveBeenLastCalledWith(4);
    await user.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(onPageChange).toHaveBeenLastCalledWith(2);
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenLastCalledWith(4);
    await user.click(screen.getByRole('button', { name: 'Go to first page' }));
    expect(onPageChange).toHaveBeenLastCalledWith(1);
    await user.click(screen.getByRole('button', { name: 'Go to last page' }));
    expect(onPageChange).toHaveBeenLastCalledWith(10);
    onPageChange.mockClear();
    await user.click(screen.getByRole('button', { name: 'Page 3' }));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('controlled page moves when the parent updates', async () => {
    const user = userEvent.setup();
    function Demo() {
      const [page, setPage] = useState(1);
      return <Pagination page={page} pageCount={4} onPageChange={setPage} />;
    }
    render(<Demo />);
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeEnabled();
  });

  it('disables prev/first at the start and next/last at the end', () => {
    const { rerender } = render(<Pagination page={1} pageCount={3} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Go to first page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeEnabled();
    rerender(<Pagination page={3} pageCount={3} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Go to last page' })).toBeDisabled();
  });

  it('showJump={false} hides first/last', () => {
    render(<Pagination page={1} pageCount={3} onPageChange={() => {}} showJump={false} />);
    expect(screen.queryByRole('button', { name: 'Go to first page' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Go to last page' })).toBeNull();
  });

  it('empty state: zero pages disables everything and shows 0–0', () => {
    render(
      <Pagination page={1} pageCount={0} onPageChange={() => {}} totalItems={0} pageSize={20} />,
    );
    expect(screen.getByText('Showing 0–0 of 0')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
    expect(screen.queryByRole('button', { name: /^Page \d+$/ })).toBeNull();
  });

  it('page-size select is labelled and calls onPageSizeChange with a number', async () => {
    const user = userEvent.setup();
    const onPageSizeChange = vi.fn();
    render(
      <Pagination
        page={1}
        pageCount={5}
        onPageChange={() => {}}
        totalItems={100}
        pageSize={20}
        pageSizeOptions={[10, 20, 50]}
        onPageSizeChange={onPageSizeChange}
      />,
    );
    const trigger = screen.getByRole('combobox', { name: 'Rows per page' });
    expect(trigger).toHaveTextContent('20 / page');
    await user.click(trigger);
    await user.click(await screen.findByRole('option', { name: '50 / page' }));
    expect(onPageSizeChange).toHaveBeenCalledWith(50);
  });

  it('labels prop overrides individual strings', () => {
    render(
      <Pagination
        page={1}
        pageCount={2}
        onPageChange={() => {}}
        labels={{ next: 'Forward', page: (n) => `Go ${n}` }}
      />,
    );
    expect(screen.getByRole('button', { name: 'Forward' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go 2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeInTheDocument();
  });

  it('uses Mongolian strings from the provider', () => {
    render(
      <DesignSystemProvider strings={mnStrings}>
        <Pagination page={2} pageCount={5} onPageChange={() => {}} totalItems={95} pageSize={20} />
      </DesignSystemProvider>,
    );
    expect(screen.getByRole('navigation', { name: 'Хуудаслалт' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Дараах хуудас' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2-р хуудас' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByText('21–40 / 95')).toBeInTheDocument();
  });

  it('forwards ref, keeps aria-label, merges className, spreads props', () => {
    const ref = createRef<HTMLElement>();
    render(
      <Pagination
        ref={ref}
        page={1}
        pageCount={2}
        onPageChange={() => {}}
        aria-label="Results"
        className="mt-4"
        data-testid="pg"
      />,
    );
    expect(ref.current).toBe(screen.getByRole('navigation', { name: 'Results' }));
    expect(ref.current).toHaveClass('mt-4', 'flex');
    expect(ref.current).toHaveAttribute('data-testid', 'pg');
  });

  it('is axe-clean', async () => {
    const { container } = render(
      <Pagination
        page={2}
        pageCount={5}
        onPageChange={() => {}}
        totalItems={95}
        pageSize={20}
        pageSizeOptions={[10, 20]}
        onPageSizeChange={() => {}}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
