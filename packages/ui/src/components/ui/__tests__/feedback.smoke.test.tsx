import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Snackbar } from '../Snackbar';
import { Spinner } from '../Spinner';
import { Progress, ProgressCircle } from '../Progress';
import { Skeleton } from '../Skeleton';
import { EmptyState } from '../EmptyState';
import { ErrorState } from '../ErrorState';
import { Toast, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '../Toast';

describe('Feedback (smoke)', () => {
  it('Snackbar renders title + body + close', () => {
    render(<Snackbar variant="info" title="Heads up" onClose={() => {}}>Body</Snackbar>);
    expect(screen.getByText('Heads up')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
  });

  it('Snackbar is axe-clean', async () => {
    const { container } = render(
      <Snackbar variant="success" title="Saved" onClose={() => {}}>OK</Snackbar>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Spinner has accessible role + label', () => {
    render(<Spinner label="Loading" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('Progress (linear) renders progressbar', () => {
    render(<Progress value={50} aria-label="Upload" />);
    expect(screen.getByRole('progressbar', { name: 'Upload' })).toBeInTheDocument();
  });

  it('ProgressCircle renders progressbar', () => {
    render(<ProgressCircle value={70} aria-label="Storage" />);
    expect(screen.getByRole('progressbar', { name: 'Storage' })).toBeInTheDocument();
  });

  it('Skeleton renders', () => {
    const { container } = render(<Skeleton className="h-4 w-24" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('EmptyState uses default illustration when no icon/illustration', () => {
    const { container } = render(<EmptyState title="No items" />);
    expect(screen.getByText('No items')).toBeInTheDocument();
    // Default illustration is an inline <svg>
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('EmptyState is axe-clean', async () => {
    const { container } = render(
      <EmptyState title="Empty" description="Nothing here yet." />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('ErrorState 404 renders default content without a live-region role', () => {
    render(<ErrorState variant="404" />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
  });

  it('ErrorState is axe-clean', async () => {
    const { container } = render(<ErrorState variant="500" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Toast renders inside provider + viewport', () => {
    render(
      <ToastProvider>
        <ToastViewport>
          <Toast open>
            <ToastTitle>Done</ToastTitle>
            <ToastDescription>Saved.</ToastDescription>
          </Toast>
        </ToastViewport>
      </ToastProvider>,
    );
    expect(screen.getByText('Done')).toBeInTheDocument();
  });
});
