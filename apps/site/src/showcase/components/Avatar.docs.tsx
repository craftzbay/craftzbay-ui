import { Avatar, AvatarGroup } from '@/components/ui/Avatar';
import type { ComponentDoc } from '../registry/types';

/* Inline SVG portrait placeholder — keeps the docs free of third-party image hosts. */
const AVATAR_SRC =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" fill="#cbd5e1"/><circle cx="48" cy="38" r="18" fill="#475569"/><path d="M14 92c4-20 18-30 34-30s30 10 34 30Z" fill="#475569"/></svg>`,
  );

const doc: ComponentDoc = {
  slug: 'avatar',
  name: 'Avatar',
  group: 'Data Display',
  description:
    'User / entity avatar with image, fallback initials, and optional status dot. Use AvatarGroup to overlap multiple avatars with a +N suffix.',
  exports: ['Avatar', 'AvatarGroup'],
  i18n: 'Reads `avatar.status` (status dot label) and `avatar.more` (AvatarGroup overflow count).',
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
          <Avatar src={AVATAR_SRC} alt="Avery" fallback="AV" />
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
