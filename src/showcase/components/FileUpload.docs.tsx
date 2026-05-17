import { FileUpload } from '@/components/ui/FileUpload';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'file-upload',
  name: 'FileUpload',
  group: 'Inputs',
  description:
    'Drag-and-drop file picker with click fallback. Reports selected files via onChange — does not perform the upload itself.',
  exports: ['FileUpload'],
  sourceFile: 'FileUpload.tsx',
  examples: [
    {
      title: 'Default',
      preview: <FileUpload className="w-full max-w-md" hint="PDF, PNG up to 5 MB" />,
      code: `<FileUpload hint="PDF, PNG up to 5 MB" onChange={(files) => upload(files)} />`,
    },
    {
      title: 'Multiple + accept',
      preview: <FileUpload className="w-full max-w-md" multiple accept="image/*" hint="Images only" />,
      code: `<FileUpload multiple accept="image/*" hint="Images only" />`,
    },
  ],
  api: [
    {
      rows: [
        { name: 'onChange', type: '(files: File[]) => void', description: 'Fires when files are dropped or picked.' },
        { name: 'accept', type: 'string', description: 'MIME types or extensions, comma-separated.' },
        { name: 'multiple', type: 'boolean', default: 'false', description: 'Allow more than one file.' },
        { name: 'maxSize', type: 'number', description: 'Per-file byte cap. Files over the cap trigger an error.' },
        { name: 'hint', type: 'string', description: 'Hint shown below the drop zone.' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables both drop and click.' },
      ],
    },
  ],
  accessibility: [
    'Drop zone is a button — Enter / Space open the OS file picker.',
    'Drag-over state announces via aria-live for screen readers.',
  ],
};

export default doc;
