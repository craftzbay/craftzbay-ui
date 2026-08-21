import { describe, expect, it, vi } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion';

function Demo(props: Partial<Parameters<typeof Accordion>[0]>) {
  return (
    <Accordion type="single" collapsible {...(props as object)}>
      <AccordionItem value="a">
        <AccordionTrigger>First</AccordionTrigger>
        <AccordionContent>First body</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Second</AccordionTrigger>
        <AccordionContent>Second body</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

describe('Accordion', () => {
  it('renders closed triggers with aria-expanded=false and no content', () => {
    render(<Demo />);
    const first = screen.getByRole('button', { name: 'First' });
    expect(first).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('First body')).toBeNull();
  });

  it('opens on click and wires aria-controls to the region', async () => {
    const user = userEvent.setup();
    render(<Demo />);
    const first = screen.getByRole('button', { name: 'First' });
    await user.click(first);
    expect(first).toHaveAttribute('aria-expanded', 'true');
    const region = screen.getByRole('region', { name: 'First' });
    expect(first).toHaveAttribute('aria-controls', region.id);
    expect(region).toHaveTextContent('First body');
  });

  it('uncontrolled: defaultValue opens an item; single type closes the other', async () => {
    const user = userEvent.setup();
    render(<Demo defaultValue="a" />);
    expect(screen.getByText('First body')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Second' }));
    expect(screen.queryByText('First body')).toBeNull();
    expect(screen.getByText('Second body')).toBeInTheDocument();
  });

  it('controlled: value wins and onValueChange reports the clicked item', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Demo value="a" onValueChange={onValueChange} />);
    await user.click(screen.getByRole('button', { name: 'Second' }));
    expect(onValueChange).toHaveBeenCalledWith('b');
    // Parent did not update → still showing the controlled value.
    expect(screen.getByText('First body')).toBeInTheDocument();
    expect(screen.queryByText('Second body')).toBeNull();
  });

  it('type="multiple" keeps several items open', async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="multiple">
        <AccordionItem value="a">
          <AccordionTrigger>First</AccordionTrigger>
          <AccordionContent>First body</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>Second</AccordionTrigger>
          <AccordionContent>Second body</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    await user.click(screen.getByRole('button', { name: 'First' }));
    await user.click(screen.getByRole('button', { name: 'Second' }));
    expect(screen.getByText('First body')).toBeInTheDocument();
    expect(screen.getByText('Second body')).toBeInTheDocument();
  });

  it('keyboard: Enter/Space toggle, ArrowDown/Up move between triggers', async () => {
    const user = userEvent.setup();
    render(<Demo />);
    const first = screen.getByRole('button', { name: 'First' });
    const second = screen.getByRole('button', { name: 'Second' });
    await user.tab();
    expect(first).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(first).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard(' ');
    expect(first).toHaveAttribute('aria-expanded', 'false');
    await user.keyboard('{ArrowDown}');
    expect(second).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(first).toHaveFocus();
    await user.keyboard('{End}');
    expect(second).toHaveFocus();
    await user.keyboard('{Home}');
    expect(first).toHaveFocus();
  });

  it('forwards refs and merges className on item, trigger and content', () => {
    const itemRef = createRef<HTMLDivElement>();
    const triggerRef = createRef<HTMLButtonElement>();
    render(
      <Accordion type="single" defaultValue="a">
        <AccordionItem ref={itemRef} value="a" className="item-x" data-testid="item">
          <AccordionTrigger ref={triggerRef} className="trig-x">
            First
          </AccordionTrigger>
          <AccordionContent className="content-x">Body</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(itemRef.current).toBe(screen.getByTestId('item'));
    expect(itemRef.current).toHaveClass('item-x', 'border-b');
    expect(triggerRef.current).toBe(screen.getByRole('button', { name: 'First' }));
    expect(triggerRef.current).toHaveClass('trig-x');
    expect(screen.getByText('Body')).toHaveClass('content-x');
  });

  it('has no axe violations closed and open', async () => {
    const { container } = render(<Demo defaultValue="a" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
