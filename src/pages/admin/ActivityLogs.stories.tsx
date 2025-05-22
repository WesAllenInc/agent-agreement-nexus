import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';

// Instead of importing the actual component which depends on hooks,
// we'll create a standalone mock component that looks the same but doesn't use any hooks
const MockActivityLogs = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Activity Logs</h1>
      <div className="bg-card rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-48">
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2">
                <option value="">All Actions</option>
                <option value="login">Login</option>
                <option value="agreement_view">Agreement View</option>
                <option value="agreement_sign">Agreement Sign</option>
              </select>
            </div>
            <div className="w-full sm:w-48">
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2">
                <option value="">All Users</option>
                <option value="agent@example.com">agent@example.com</option>
                <option value="admin@example.com">admin@example.com</option>
              </select>
            </div>
          </div>
          <div className="w-full md:w-auto">
            <div className="flex gap-2">
              <input type="date" className="h-10 rounded-md border border-input bg-background px-3 py-2" />
              <input type="date" className="h-10 rounded-md border border-input bg-background px-3 py-2" />
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Time</th>
                <th className="text-left py-3 px-4">User</th>
                <th className="text-left py-3 px-4">Action</th>
                <th className="text-left py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">{new Date().toLocaleString()}</td>
                <td className="py-3 px-4">agent@example.com</td>
                <td className="py-3 px-4">login</td>
                <td className="py-3 px-4">IP: 192.168.1.1, Device: Chrome/Windows</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">{new Date(Date.now() - 86400000).toLocaleString()}</td>
                <td className="py-3 px-4">agent@example.com</td>
                <td className="py-3 px-4">training_complete</td>
                <td className="py-3 px-4">Module: Getting Started</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">{new Date(Date.now() - 172800000).toLocaleString()}</td>
                <td className="py-3 px-4">admin@example.com</td>
                <td className="py-3 px-4">agreement_upload</td>
                <td className="py-3 px-4">Agreement: Standard Contract</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-muted-foreground">
            Showing 1-3 of 3 entries
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 rounded-md bg-primary text-primary-foreground" disabled>Previous</button>
            <button className="px-3 py-2 rounded-md bg-primary text-primary-foreground" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Empty loading state component
const MockActivityLogsLoading = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Activity Logs</h1>
      <div className="bg-card rounded-lg shadow p-6">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    </div>
  );
};

// Empty state component
const MockActivityLogsEmpty = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Activity Logs</h1>
      <div className="bg-card rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-48">
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2">
                <option value="">All Actions</option>
              </select>
            </div>
            <div className="w-full sm:w-48">
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2">
                <option value="">All Users</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <p className="text-muted-foreground">No activity logs found</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// We don't need the mock store anymore since we're using static components

const meta = {
  title: 'Pages/Admin/ActivityLogs',
  component: MockActivityLogs,
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
} satisfies Meta<typeof MockActivityLogs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Loading: Story = {
  render: () => <MockActivityLogsLoading />
};

export const NoLogs: Story = {
  render: () => <MockActivityLogsEmpty />
};

export const FilteredByLogin: Story = {
  render: () => <MockActivityLogs />
};
