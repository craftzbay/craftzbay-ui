import { Slider } from '@/components/ui/Slider';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'slider',
  name: 'Slider',
  group: 'Inputs',
  description:
    'Single-handle or range slider for numeric input where the exact value matters less than the relative position.',
  exports: ['Slider'],
  sourceFile: 'Slider.tsx',
  examples: [
    {
      title: 'Single value',
      preview: <Slider defaultValue={[40]} className="w-full max-w-sm" />,
      code: `<Slider defaultValue={[40]} />`,
    },
    {
      title: 'Range',
      description: 'Pass two values to render a range with two handles.',
      preview: <Slider defaultValue={[20, 70]} className="w-full max-w-sm" />,
      code: `<Slider defaultValue={[20, 70]} />`,
    },
    {
      title: 'Stepped',
      preview: (
        <Slider defaultValue={[50]} min={0} max={100} step={10} className="w-full max-w-sm" />
      ),
      code: `<Slider defaultValue={[50]} min={0} max={100} step={10} />`,
    },
  ],
  api: [
    {
      rows: [
        { name: 'value', type: 'number[]', description: 'Controlled value(s).' },
        { name: 'defaultValue', type: 'number[]', description: 'Uncontrolled initial value(s).' },
        { name: 'min', type: 'number', default: '0', description: 'Minimum.' },
        { name: 'max', type: 'number', default: '100', description: 'Maximum.' },
        { name: 'step', type: 'number', default: '1', description: 'Increment per arrow press.' },
        {
          name: 'onValueChange',
          type: '(value: number[]) => void',
          description: 'Fires on every move.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables interaction.',
        },
      ],
    },
  ],
  accessibility: [
    'Arrow keys: ±step. PageUp/PageDown: ±step×10. Home / End: min / max.',
    'Each handle has aria-valuenow / aria-valuemin / aria-valuemax.',
  ],
  keyboard: [
    { key: 'ArrowRight / ArrowUp', action: 'Increase by one `step`.' },
    { key: 'ArrowLeft / ArrowDown', action: 'Decrease by one `step`.' },
    { key: 'PageUp / PageDown', action: 'Change by ten steps.' },
    { key: 'Home / End', action: 'Jump to `min` / `max`.' },
    { key: 'Tab', action: 'Move between thumbs in a range slider.' },
  ],
};

export default doc;
