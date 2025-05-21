// Barrel file for components directory
// Export only the most commonly used components to avoid circular dependencies

// Export the PdfViewer component directly
export { PdfViewer } from './PdfViewer';

// Export the ProtectedRoute component
export { ProtectedRoute } from './ProtectedRoute';

// Export the OfflineNotification component
export { OfflineNotification } from './ui/offline-notification';

// Export the PWAStatus component
export { PWAStatus } from './ui/pwa-status';

// Note: For UI components, import from '@/components/ui' directly
// For other specific components, use direct paths
// e.g., import { Navigation } from '@/components/layout/Navigation';
