import React from 'react';
import { useEffect } from 'react';

/**
 * Theme decorator for Storybook
 * Shows components in both light and dark modes side by side
 */
export const ThemeDecorator = (StoryFn: () => React.ReactElement) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 max-w-[1200px] mx-auto">
      <div className="p-6 border rounded-lg shadow-sm bg-white">
        <h3 className="mb-4 text-sm font-medium text-gray-500">Light Mode</h3>
        <div className="light" data-theme="light">
          <StoryFn />
        </div>
      </div>
      <div className="p-6 border rounded-lg shadow-sm bg-slate-950">
        <h3 className="mb-4 text-sm font-medium text-gray-400">Dark Mode</h3>
        <div className="dark" data-theme="dark">
          <StoryFn />
        </div>
      </div>
    </div>
  );
};

/**
 * Creates a custom variant of a story with ThemeDecorator
 * Usage: export const WithThemes = createThemeVariant(Default);
 */
export const createThemeVariant = (Story: any) => {
  const ThemeVariant = { ...Story };
  ThemeVariant.decorators = [ThemeDecorator];
  ThemeVariant.parameters = {
    ...ThemeVariant.parameters,
    docs: {
      ...ThemeVariant.parameters?.docs,
      description: {
        ...ThemeVariant.parameters?.docs?.description,
        story: 'This story shows the component in both light and dark modes.'
      }
    }
  };
  return ThemeVariant;
};
