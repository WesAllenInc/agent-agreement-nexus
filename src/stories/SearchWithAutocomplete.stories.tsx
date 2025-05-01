import type { Meta, StoryObj } from '@storybook/react';
import { SearchWithAutocomplete } from '../components/ui/search/SearchWithAutocomplete';

interface MockItem {
  id: number;
  title: string;
}

const meta = {
  title: 'Components/SearchWithAutocomplete',
  component: SearchWithAutocomplete<MockItem>,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SearchWithAutocomplete<MockItem>>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockItems: MockItem[] = [
  { id: 1, title: 'Sales Agreement - John Doe' },
  { id: 2, title: 'Partner Agreement - Jane Smith' },
  { id: 3, title: 'Commission Agreement - Bob Wilson' },
];

const mockSearch = async (query: string): Promise<MockItem[]> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  return mockItems.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase())
  );
};

export const Default: Story = {
  args: {
    onSearch: mockSearch,
    onSelect: (item: MockItem) => console.log('Selected:', item),
    renderItem: (item: MockItem) => item.title,
    placeholder: 'Search agreements...',
    label: 'Search Agreements',
  },
};

export const WithCustomStyling: Story = {
  args: {
    ...Default.args,
    className: 'w-96',
    inputClassName: 'bg-gray-50',
    listboxClassName: 'bg-white shadow-xl',
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
  },
};
