import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion';

const meta: Meta = { title: 'Layout/Accordion' };
export default meta;
type Story = StoryObj;

export const Single: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[28rem]">
      <AccordionItem value="a"><AccordionTrigger>What is the refund policy?</AccordionTrigger><AccordionContent>14 days, no questions asked.</AccordionContent></AccordionItem>
      <AccordionItem value="b"><AccordionTrigger>Do you support SSO?</AccordionTrigger><AccordionContent>Yes — SAML and OIDC on the Team plan.</AccordionContent></AccordionItem>
      <AccordionItem value="c"><AccordionTrigger>Can I export my data?</AccordionTrigger><AccordionContent>Yes — JSON or CSV from Settings → Export.</AccordionContent></AccordionItem>
    </Accordion>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" className="w-[28rem]">
      <AccordionItem value="a"><AccordionTrigger>Item one</AccordionTrigger><AccordionContent>One.</AccordionContent></AccordionItem>
      <AccordionItem value="b"><AccordionTrigger>Item two</AccordionTrigger><AccordionContent>Two.</AccordionContent></AccordionItem>
    </Accordion>
  ),
};
