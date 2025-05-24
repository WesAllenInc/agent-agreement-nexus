import type { Preview } from "@storybook/react";
import "../src/index.css";

// Global Storybook parameters so that components render with the same tailwind
// styling, themes, etc. as the main app.
const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#000000" },
      ],
    },
  },
};

export default preview;
