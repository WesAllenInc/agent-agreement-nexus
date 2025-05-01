import { useCallback } from 'react';

export const useA11y = () => {
  const handleKeyboardNavigation = useCallback((event: React.KeyboardEvent, callback: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  }, []);

  const getAriaProps = (role: string, label: string) => ({
    role,
    'aria-label': label,
    tabIndex: 0,
  });

  return {
    handleKeyboardNavigation,
    getAriaProps,
  };
};
