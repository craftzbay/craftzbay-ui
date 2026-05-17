import type { Meta, StoryObj } from '@storybook/react-vite';
import { Check, MessageSquare, Upload } from 'lucide-react';
import { Timeline, TimelineDescription, TimelineItem, TimelineTime, TimelineTitle } from './Timeline';

const meta: Meta = {
  title: 'Data Display/Timeline',
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Timeline className="max-w-md">
      <TimelineItem bullet={<Check className="size-3" />}>
        <TimelineTime>09:14</TimelineTime>
        <TimelineTitle>Pull request merged</TimelineTitle>
        <TimelineDescription>#142 feat: storybook + library mode</TimelineDescription>
      </TimelineItem>
      <TimelineItem bullet={<MessageSquare className="size-3" />}>
        <TimelineTime>09:02</TimelineTime>
        <TimelineTitle>Reviewer requested changes</TimelineTitle>
        <TimelineDescription>“Please add a story for IconButton.”</TimelineDescription>
      </TimelineItem>
      <TimelineItem bullet={<Upload className="size-3" />} isLast>
        <TimelineTime>08:41</TimelineTime>
        <TimelineTitle>Pushed 4 new commits</TimelineTitle>
        <TimelineDescription>main · craftzbay/design-system</TimelineDescription>
      </TimelineItem>
    </Timeline>
  ),
};
