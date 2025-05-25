import * as React from 'react';
import { Command, CommandInput, CommandList, CommandItem, CommandGroup, CommandSeparator } from 'cmdk';
import Fuse from 'fuse.js';

// Types for search items
interface CommandPaletteItem {
  id: string;
  label: string;
  type: 'agreement' | 'user' | 'action' | 'recent';
  action?: () => void;
}

interface CommandPaletteProps {
  agreements: CommandPaletteItem[];
  users: CommandPaletteItem[];
  actions: CommandPaletteItem[];
  recents: CommandPaletteItem[];
}

export const CommandPaletteContext = React.createContext<{ open: boolean; setOpen: (open: boolean) => void }>({ open: false, setOpen: () => {} });

const fuseOptions = {
  keys: ['label'],
  threshold: 0.3,
};

export const CommandPalette: React.FC<CommandPaletteProps> = ({ agreements, users, actions, recents }) => {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [filtered, setFiltered] = React.useState<CommandPaletteItem[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Combine all items for search
  const allItems = [
    ...actions,
    ...agreements,
    ...users,
    ...recents,
  ];

  const fuse = React.useMemo(() => new Fuse(allItems, fuseOptions), [allItems]);

  React.useEffect(() => {
    if (query.trim() === '') {
      setFiltered(allItems);
    } else {
      setFiltered(fuse.search(query).map((r) => r.item));
    }
  }, [query, allItems, fuse]);

  // Keyboard shortcut: Cmd/Ctrl+K
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Focus input when opened
  React.useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Keyboard navigation
  const [activeIndex, setActiveIndex] = React.useState(0);
  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        filtered[activeIndex]?.action?.();
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, filtered, activeIndex]);

  if (!open) return null;

  return (
    <Command className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-lg mx-auto">
        <CommandInput
          ref={inputRef}
          value={query}
          onValueChange={setQuery}
          placeholder="Search agreements, users, actions..."
          className="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-800"
        />
        <CommandList>
          <CommandGroup heading="Quick Actions">
            {filtered.filter((item) => item.type === 'action').map((item, idx) => (
              <CommandItem
                key={item.id}
                value={item.label}
                onSelect={() => {
                  item.action?.();
                  setOpen(false);
                }}
                className={activeIndex === idx ? 'bg-blue-100 dark:bg-blue-800' : ''}
              >
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Agreements">
            {filtered.filter((item) => item.type === 'agreement').map((item, idx) => (
              <CommandItem
                key={item.id}
                value={item.label}
                onSelect={() => {
                  item.action?.();
                  setOpen(false);
                }}
                className={activeIndex === idx ? 'bg-blue-100 dark:bg-blue-800' : ''}
              >
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Users">
            {filtered.filter((item) => item.type === 'user').map((item, idx) => (
              <CommandItem
                key={item.id}
                value={item.label}
                onSelect={() => {
                  item.action?.();
                  setOpen(false);
                }}
                className={activeIndex === idx ? 'bg-blue-100 dark:bg-blue-800' : ''}
              >
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Recent">
            {filtered.filter((item) => item.type === 'recent').map((item, idx) => (
              <CommandItem
                key={item.id}
                value={item.label}
                onSelect={() => {
                  item.action?.();
                  setOpen(false);
                }}
                className={activeIndex === idx ? 'bg-blue-100 dark:bg-blue-800' : ''}
              >
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </div>
    </Command>
  );
};

export default CommandPalette;
