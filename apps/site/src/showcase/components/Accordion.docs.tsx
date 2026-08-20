import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/Accordion';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'accordion',
  name: 'Accordion',
  group: 'Layout',
  description:
    'Vertically stacked, collapsible sections. Use type="single" for FAQ-style "one open at a time"; type="multiple" for independent sections.',
  exports: ['Accordion', 'AccordionItem', 'AccordionTrigger', 'AccordionContent'],
  sourceFile: 'Accordion.tsx',
  examples: [
    {
      title: 'Single (collapsible)',
      preview: (
        <Accordion type="single" collapsible className="w-full max-w-md">
          <AccordionItem value="a">
            <AccordionTrigger>What is the refund policy?</AccordionTrigger>
            <AccordionContent>14 days, no questions asked.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>Do you support SSO?</AccordionTrigger>
            <AccordionContent>Yes — Team plan and above.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="c">
            <AccordionTrigger>Can I export my data?</AccordionTrigger>
            <AccordionContent>Yes, CSV and JSON. Settings → Export.</AccordionContent>
          </AccordionItem>
        </Accordion>
      ),
      code: `<Accordion type="single" collapsible>
  <AccordionItem value="a">
    <AccordionTrigger>What is the refund policy?</AccordionTrigger>
    <AccordionContent>14 days, no questions asked.</AccordionContent>
  </AccordionItem>
</Accordion>`,
    },
  ],
  api: [
    {
      title: 'Accordion (root)',
      rows: [
        {
          name: 'type',
          type: `'single' | 'multiple'`,
          required: true,
          description: 'Selection mode.',
        },
        {
          name: 'collapsible',
          type: 'boolean',
          default: 'false',
          description: 'Allow closing the active item (single mode).',
        },
        {
          name: 'value / defaultValue',
          type: 'string | string[]',
          description: 'Controlled / uncontrolled value.',
        },
        { name: 'onValueChange', type: '(v) => void', description: 'Fires on open/close.' },
      ],
    },
  ],
  accessibility: [
    'Backed by @radix-ui/react-accordion — Arrow keys cycle headers, Enter/Space toggles.',
  ],
  keyboard: [
    { key: 'Tab / Shift+Tab', action: 'Move focus between accordion headers.' },
    { key: 'Enter / Space', action: 'Toggle the focused item.' },
    { key: 'ArrowDown / ArrowUp', action: 'Move focus to the next / previous header.' },
    { key: 'Home / End', action: 'Move focus to the first / last header.' },
  ],
  related: [{ slug: 'tabs', reason: 'Horizontal alternative.' }],
};

export default doc;
