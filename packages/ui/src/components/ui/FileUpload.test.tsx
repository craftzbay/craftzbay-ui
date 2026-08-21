import { describe, expect, it, vi } from 'vitest';
import { createRef, useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { FileUpload } from './FileUpload';
import { DesignSystemProvider } from './DesignSystemProvider';
import { mnStrings } from '@/lib/strings.mn';

const mk = (name: string, size = 10, type = 'text/plain', lastModified = 1_700_000_000_000) => {
  const f = new File([new Uint8Array(size)], name, { type, lastModified });
  return f;
};

describe('FileUpload', () => {
  it('renders the drop zone copy, hint and a hidden file input', () => {
    render(<FileUpload hint="PDF up to 5MB" />);
    expect(screen.getByText('Drop files here, or click to browse')).toBeInTheDocument();
    expect(screen.getByText('PDF up to 5MB')).toBeInTheDocument();
    const input = screen.getByLabelText(/Drop files here/);
    expect(input).toHaveAttribute('type', 'file');
    expect(input).toHaveClass('sr-only');
  });

  it('uncontrolled: picking files lists them with a formatted size and calls onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FileUpload onChange={onChange} />);
    await user.upload(screen.getByLabelText(/Drop files here/), mk('a.txt', 2048));
    expect(screen.getByText('a.txt')).toBeInTheDocument();
    expect(screen.getByText('2.0 KB')).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledWith([expect.objectContaining({ name: 'a.txt' })]);
  });

  it('formats bytes and megabytes', async () => {
    const user = userEvent.setup();
    render(<FileUpload multiple />);
    await user.upload(screen.getByLabelText(/Drop files here/), [
      mk('tiny.txt', 512),
      mk('big.txt', 3 * 1024 * 1024),
    ]);
    expect(screen.getByText('512 B')).toBeInTheDocument();
    expect(screen.getByText('3.0 MB')).toBeInTheDocument();
  });

  it('single mode keeps only the first file; multiple appends', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<FileUpload />);
    const input = () => screen.getByLabelText(/Drop files here/);
    await user.upload(input(), [mk('a.txt'), mk('b.txt')]);
    expect(screen.getByText('a.txt')).toBeInTheDocument();
    expect(screen.queryByText('b.txt')).toBeNull();
    await user.upload(input(), mk('c.txt'));
    expect(screen.queryByText('a.txt')).toBeNull();
    expect(screen.getByText('c.txt')).toBeInTheDocument();

    rerender(<FileUpload multiple />);
    await user.upload(input(), mk('d.txt'));
    expect(screen.getByText('c.txt')).toBeInTheDocument();
    expect(screen.getByText('d.txt')).toBeInTheDocument();
  });

  it('remove buttons are labelled per file and remove the right one', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FileUpload multiple onChange={onChange} />);
    await user.upload(screen.getByLabelText(/Drop files here/), [mk('a.txt'), mk('b.txt')]);
    await user.click(screen.getByRole('button', { name: 'Remove a.txt' }));
    expect(screen.queryByText('a.txt')).toBeNull();
    expect(screen.getByText('b.txt')).toBeInTheDocument();
    expect(onChange).toHaveBeenLastCalledWith([expect.objectContaining({ name: 'b.txt' })]);
  });

  it('controlled: value drives the list, onChange reports the next list', async () => {
    const user = userEvent.setup();
    function Demo() {
      const [files, setFiles] = useState<File[]>([mk('seed.txt')]);
      return <FileUpload multiple value={files} onChange={setFiles} />;
    }
    render(<Demo />);
    expect(screen.getByText('seed.txt')).toBeInTheDocument();
    await user.upload(screen.getByLabelText(/Drop files here/), mk('new.txt'));
    expect(screen.getByText('new.txt')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Remove seed.txt' }));
    expect(screen.queryByText('seed.txt')).toBeNull();
  });

  it('controlled without a parent update does not change the list', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FileUpload value={[]} onChange={onChange} />);
    await user.upload(screen.getByLabelText(/Drop files here/), mk('x.txt'));
    expect(onChange).toHaveBeenCalled();
    expect(screen.queryByText('x.txt')).toBeNull();
  });

  it('duplicate file names produce unique keys (no React key warning) and both render', async () => {
    const user = userEvent.setup();
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<FileUpload multiple />);
    const input = screen.getByLabelText(/Drop files here/);
    await user.upload(input, mk('dup.txt', 10, 'text/plain', 1));
    await user.upload(input, mk('dup.txt', 10, 'text/plain', 1));
    expect(screen.getAllByText('dup.txt')).toHaveLength(2);
    expect(screen.getAllByRole('button', { name: 'Remove dup.txt' })).toHaveLength(2);
    expect(error).not.toHaveBeenCalledWith(
      expect.stringContaining('same key'),
      expect.anything(),
      expect.anything(),
      expect.anything(),
    );
    expect(error.mock.calls.flat().join(' ')).not.toMatch(/same key/);
    error.mockRestore();
  });

  it('rejects oversized files with reason "size" (no onChange)', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onReject = vi.fn();
    render(<FileUpload maxSize={100} onChange={onChange} onReject={onReject} />);
    await user.upload(screen.getByLabelText(/Drop files here/), mk('huge.txt', 200));
    expect(onReject).toHaveBeenCalledWith([expect.objectContaining({ name: 'huge.txt' })], 'size');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('drop: wrong types are rejected with reason "type", matching ones added', () => {
    const onChange = vi.fn();
    const onReject = vi.fn();
    render(<FileUpload accept=".pdf,image/*" multiple onChange={onChange} onReject={onReject} />);
    const zone = screen.getByText(/Drop files here/).closest('label')!;
    const files = [
      mk('doc.pdf', 10, 'application/pdf'),
      mk('pic.png', 10, 'image/png'),
      mk('notes.txt', 10, 'text/plain'),
    ];
    fireEvent.dragEnter(zone);
    expect(zone).toHaveClass('border-accent');
    fireEvent.drop(zone, { dataTransfer: { files } });
    expect(zone).not.toHaveClass('border-accent');
    expect(onReject).toHaveBeenCalledWith([expect.objectContaining({ name: 'notes.txt' })], 'type');
    expect(onChange).toHaveBeenCalledWith([
      expect.objectContaining({ name: 'doc.pdf' }),
      expect.objectContaining({ name: 'pic.png' }),
    ]);
  });

  it('disabled: input disabled, zone inert, drops ignored', () => {
    const onChange = vi.fn();
    render(<FileUpload disabled onChange={onChange} />);
    const input = screen.getByLabelText(/Drop files here/);
    expect(input).toBeDisabled();
    const zone = input.closest('label')!;
    expect(zone).toHaveClass('pointer-events-none');
    fireEvent.dragEnter(zone);
    expect(zone).not.toHaveClass('border-accent');
    fireEvent.drop(zone, { dataTransfer: { files: [mk('a.txt')] } });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('forwards ref and merges className on the root', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<FileUpload ref={ref} className="extra" />);
    expect(ref.current).toBe(container.firstElementChild);
    expect(ref.current).toHaveClass('extra', 'flex-col');
  });

  it('localises copy, size units and remove labels', async () => {
    const user = userEvent.setup();
    render(
      <DesignSystemProvider strings={mnStrings}>
        <FileUpload />
      </DesignSystemProvider>,
    );
    expect(screen.getByText(mnStrings.fileUpload.drop)).toBeInTheDocument();
    await user.upload(screen.getByLabelText(mnStrings.fileUpload.drop), mk('a.txt', 2048));
    expect(
      screen.getByRole('button', {
        name: mnStrings.fileUpload.remove.replace('{name}', 'a.txt'),
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(mnStrings.fileUpload.kilobytes.replace('{n}', '2.0')),
    ).toBeInTheDocument();
  });

  it('is axe-clean empty and with files', async () => {
    const user = userEvent.setup();
    const { container } = render(<FileUpload hint="Any file" />);
    expect(await axe(container)).toHaveNoViolations();
    await user.upload(screen.getByLabelText(/Drop files here/), mk('a.txt'));
    expect(await axe(container)).toHaveNoViolations();
  });
});
