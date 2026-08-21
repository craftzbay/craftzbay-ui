import { Avatar, AvatarGroup } from '@/components/ui/Avatar';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'avatar',
  name: 'Avatar',
  group: 'Data Display',
  description:
    'User / entity avatar with image, fallback initials, and optional status dot. Use AvatarGroup to overlap multiple avatars with a +N suffix.',
  exports: ['Avatar', 'AvatarGroup'],
  sourceFile: 'Avatar.tsx',
  examples: [
    {
      title: 'Sizes + status',
      preview: (
        <div className="flex items-center gap-4">
          <Avatar fallback="AB" size="xs" />
          <Avatar fallback="CD" size="sm" status="online" />
          <Avatar fallback="EF" size="md" status="busy" />
          <Avatar fallback="GH" size="lg" status="away" />
          <Avatar fallback="IJ" size="xl" status="offline" />
        </div>
      ),
      code: `<Avatar fallback="CD" size="sm" status="online" />
<Avatar fallback="EF" size="md" status="busy" />`,
    },
    {
      title: 'Image with fallback',
      preview: (
        <div className="flex items-center gap-3">
          <Avatar src="https://i.pravatar.cc/96?img=8" alt="Avery" fallback="AV" />
          <Avatar src="/broken.png" alt="Missing" fallback="MZ" />
        </div>
      ),
      code: `<Avatar src="/avatars/avery.jpg" alt="Avery" fallback="AV" />`,
    },
    {
      title: 'Group',
      preview: (
        <AvatarGroup max={4}>
          <Avatar fallback="A" />
          <Avatar fallback="B" />
          <Avatar fallback="C" />
          <Avatar fallback="D" />
          <Avatar fallback="E" />
          <Avatar fallback="F" />
        </AvatarGroup>
      ),
      code: `<AvatarGroup max={4}>
  <Avatar fallback="A" />
  <Avatar fallback="B" />
  <Avatar fallback="C" />
  <Avatar fallback="D" />
  <Avatar fallback="E" />
  <Avatar fallback="F" />
</AvatarGroup>`,
    },
  ],
  api: [
    {
      title: 'Avatar',
      rows: [
        { name: 'src', type: 'string', description: 'Image URL.' },
        { name: 'alt', type: 'string', description: 'Image alt text.' },
        {
          name: 'fallback',
          type: 'string',
          required: true,
          description: '2-character initials shown when no image.',
        },
        {
          name: 'size',
          type: `'xs' | 'sm' | 'md' | 'lg' | 'xl'`,
          default: `'md'`,
          description: 'Diameter.',
        },
        {
          name: 'status',
          type: `'online' | 'busy' | 'away' | 'offline'`,
          description: 'Status dot in the bottom-right.',
        },
      ],
    },
    {
      title: 'AvatarGroup',
      rows: [
        {
          name: 'max',
          type: 'number',
          default: '3',
          description: 'How many avatars render before showing "+N".',
        },
      ],
    },
  ],
  accessibility: [
    'Backed by @radix-ui/react-avatar — image falls back gracefully on load error.',
    'Fallback initials are rendered if no image; alt text describes the image when present.',
  ],
};

export default doc;
