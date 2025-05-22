import type { Meta, StoryObj } from '@storybook/react';
import ActivityLogs from './ActivityLogs';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Import the actual store module
import * as logStoreModule from '../../state/logStore';

// Create mock store for Storybook
const mockLogStore = {
  logs: [
    {
      id: '1',
      user_id: '123',
      user_email: 'agent@example.com',
      action: 'login',
      details: { ip: '192.168.1.1', device: 'Chrome/Windows' },
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      user_id: '123',
      user_email: 'agent@example.com',
      action: 'training_complete',
      details: { module_id: '1', module_name: 'Getting Started' },
      created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: '3',
      user_id: '456',
      user_email: 'admin@example.com',
      action: 'agreement_upload',
      details: { agreement_id: '1', agreement_name: 'Standard Contract' },
      created_at: new Date(Date.now() - 172800000).toISOString()
    }
  ],
  totalLogs: 3,
  currentPage: 1,
  pageSize: 10,
  isLoading: false,
  filters: {
    action: null,
    user: null,
    dateRange: null
  },
  fetchLogs: () => Promise.resolve(),
  setFilters: () => {},
  setCurrentPage: () => {},
  setPageSize: () => {}
};

// Mock the store hook
vi.mock('../../state/logStore', async () => ({
  ...await vi.importActual('../../state/logStore'),
  useLogStore: () => mockLogStore
}));

const meta = {
  title: 'Pages/Admin/ActivityLogs',
  component: ActivityLogs,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof ActivityLogs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Loading: Story = {
  parameters: {
    mockData: {
      isLoading: true
    }
  },
  render: () => {
    // Override the mock for this specific story
    vi.mocked(logStoreModule.useLogStore).mockReturnValue({
      ...mockLogStore,
      isLoading: true
    });
    return <ActivityLogs />
  }
};

export const NoLogs: Story = {
  parameters: {
    mockData: {
      logs: [],
      totalLogs: 0
    }
  },
  render: () => {
    // Override the mock for this specific story
    vi.mocked(logStoreModule.useLogStore).mockReturnValue({
      ...mockLogStore,
      logs: [],
      totalLogs: 0
    });
    return <ActivityLogs />
  }
};

export const FilteredByLogin: Story = {
  parameters: {
    mockData: {
      filters: {
        action: 'login',
        user: null,
        dateRange: null
      },
      logs: [
        {
          id: '1',
          user_id: '123',
          user_email: 'agent@example.com',
          action: 'login',
          details: { ip: '192.168.1.1', device: 'Chrome/Windows' },
          created_at: new Date().toISOString()
        }
      ],
      totalLogs: 1
    }
  },
  render: () => {
    // Override the mock for this specific story
    vi.mocked(logStoreModule.useLogStore).mockReturnValue({
      ...mockLogStore,
      logs: [
        {
          id: '1',
          user_id: '123',
          user_email: 'agent@example.com',
          action: 'login',
          details: { ip: '192.168.1.1', device: 'Chrome/Windows' },
          created_at: new Date().toISOString()
        }
      ],
      totalLogs: 1,
      filters: {
        action: 'login',
        user: null,
        dateRange: null
      }
    });
    return <ActivityLogs />
  }
};
