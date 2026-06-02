import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../Card';
import { Separator } from '../Separator';
import { ScrollArea } from '../ScrollArea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../Accordion';

describe('Layout (smoke)', () => {
  it('Card composes sub-components', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Hello</CardTitle>
          <CardDescription>World</CardDescription>
        </CardHeader>
        <CardContent>Body</CardContent>
      </Card>,
    );
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('World')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
  });

  it('Card is axe-clean', async () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
      </Card>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Separator renders both orientations', () => {
    const { rerender, container } = render(<Separator />);
    expect(container.firstChild).toBeInTheDocument();
    rerender(<Separator orientation="vertical" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('ScrollArea renders children', () => {
    render(
      <ScrollArea className="h-24">
        <p>scrollable</p>
      </ScrollArea>,
    );
    expect(screen.getByText('scrollable')).toBeInTheDocument();
  });

  it('Accordion renders triggers + content', () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="a">
          <AccordionTrigger>Question</AccordionTrigger>
          <AccordionContent>Answer</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(screen.getByRole('button', { name: 'Question' })).toBeInTheDocument();
  });

  it('Accordion is axe-clean', async () => {
    const { container } = render(
      <Accordion type="single" collapsible>
        <AccordionItem value="a">
          <AccordionTrigger>Q</AccordionTrigger>
          <AccordionContent>A</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
