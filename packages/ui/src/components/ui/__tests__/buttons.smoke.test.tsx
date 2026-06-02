import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Plus, Trash2 } from '../../../icons';
import { IconButton } from '../IconButton';
import { Pagination } from '../Pagination';

describe('Buttons (smoke)', () => {
  it('IconButton renders with required aria-label', () => {
    render(<IconButton aria-label="Add" icon={<Plus />} />);
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });

  it('IconButton is axe-clean', async () => {
    const { container } = render(<IconButton aria-label="Delete" icon={<Trash2 />} variant="ghost" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Pagination renders numbered pages + nav buttons', () => {
    render(<Pagination page={3} pageCount={10} totalItems={200} pageSize={20} onPageChange={() => {}} />);
    expect(screen.getByRole('navigation', { name: /pagination/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
  });

  it('Pagination is axe-clean', async () => {
    const { container } = render(
      <Pagination page={1} pageCount={5} totalItems={50} pageSize={10} onPageChange={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
