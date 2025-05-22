import type { Meta, StoryObj } from '@storybook/react';
import Dashboard from './Dashboard';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Import the actual store modules
import * as storeModule from '../../state/store';
import * as trainingStoreModule from '../../state/trainingStore';

// Create mock stores for Storybook
const mockStore = {
  user: {
    id: '123',
    email: 'agent@example.com',
    fullName: 'Agent User',
    roles: ['agent']
  },
  isAuthenticated: true,
  isLoading: false
};

const mockTrainingStore = {
  trainingModules: [
    {
      id: '1',
      title: 'Getting Started',
      description: 'Introduction to the platform',
      status: 'active',
      materials: [
        { id: '101', title: 'Welcome', isCompleted: true },
        { id: '102', title: 'Basic Navigation', isCompleted: false }
      ]
    }
  ],
  getCompletionPercentage: () => 50,
  isCertified: () => false,
  fetchTrainingModules: () => Promise.resolve(),
  fetchTrainingCompletions: () => Promise.resolve()
};

// Mock the store hooks
vi.mock('../../state/store', async () => ({
  ...await vi.importActual('../../state/store'),
  useStore: () => mockStore
}));

vi.mock('../../state/trainingStore', async () => ({
  ...await vi.importActual('../../state/trainingStore'),
  useTrainingStore: () => mockTrainingStore
}));

const meta = {
  title: 'Pages/Agent/Dashboard',
  component: Dashboard,
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
} satisfies Meta<typeof Dashboard>;

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
    vi.mocked(storeModule.useStore).mockReturnValue({
      ...mockStore,
      isLoading: true
    });
    return <Dashboard />
  }
};

export const Certified: Story = {
  parameters: {
    mockData: {
      isCertified: true,
      completionPercentage: 100
    }
  },
  render: () => {
    // Override the mock for this specific story
    vi.mocked(trainingStoreModule.useTrainingStore).mockReturnValue({
      ...mockTrainingStore,
      getCompletionPercentage: () => 100,
      isCertified: () => true
    });
    return <Dashboard />
  }
};
