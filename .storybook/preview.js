import '../src/index.css';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  a11y: {
    // Enable accessibility checks for all stories
    element: '#storybook-root',
    config: {
      rules: [
        {
          // Ensure all form elements have labels
          id: 'label',
          enabled: true,
        },
        {
          // Ensure all interactive elements are keyboard accessible
          id: 'keyboard',
          enabled: true,
        },
      ],
    },
    options: {},
    manual: true,
  },
}; 