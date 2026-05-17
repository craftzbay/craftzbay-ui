import type { Preview } from '@storybook/react-vite';
import { withThemeByClassName } from '@storybook/addon-themes';
import '../src/styles/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          'Foundations',
          'Primitives',
          ['Button', 'IconButton', 'Input', 'Textarea'],
          'Overlays',
          'Navigation',
          'Data Display',
          'Patterns',
        ],
      },
    },
    a11y: { test: 'todo' },
    backgrounds: { disable: true },
    layout: 'padded',
  },
  decorators: [
    withThemeByClassName({
      themes: { light: '', dark: 'dark' },
      defaultTheme: 'light',
    }),
  ],
};

export default preview;
