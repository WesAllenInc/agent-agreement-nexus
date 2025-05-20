# Sentry Integration Guide

This guide explains how Sentry has been integrated into the Agent Agreement Nexus application for error tracking and monitoring.

## Setup

Sentry has been integrated into the application with the following components:

1. **Sentry Initialization**: Configured in `src/main.tsx`
2. **Error Boundary**: Added to `src/App.tsx`
3. **Error Tracking Utilities**: Available in `src/utils/errorTracking.ts`
4. **Global Error Handlers**: Set up in `src/main.tsx`

## Configuration

Before deploying to production, you need to:

1. Create a Sentry account at [sentry.io](https://sentry.io) if you don't have one
2. Create a new project in Sentry for your React application
3. Replace the placeholder DSN in `src/main.tsx` with your actual Sentry DSN:

```typescript
Sentry.init({
  dsn: "YOUR_ACTUAL_SENTRY_DSN", // Replace this with your Sentry DSN
  tracesSampleRate: 1.0, // Consider lowering this in production (e.g., 0.2)
  environment: import.meta.env.MODE || 'development',
});
```

## Usage

### Capturing Errors

You can capture errors throughout your application using the utility functions:

```typescript
import { captureException, captureMessage } from '../utils/errorTracking';

try {
  // Your code
} catch (error) {
  captureException(error as Error, { 
    context: 'Additional information about where this happened' 
  });
}

// Or capture a message
captureMessage('Something important happened', 'info', { 
  userId: user.id 
});
```

### Setting User Context

To associate errors with specific users:

```typescript
import { setUser } from '../utils/errorTracking';

// When user logs in
setUser({
  id: user.id,
  email: user.email,
  username: user.name,
  role: user.role
});

// When user logs out
setUser(null);
```

### Error Boundary

The application is already wrapped with Sentry's ErrorBoundary in `App.tsx`. This will catch and report any uncaught errors in your React components.

## Best Practices

1. **Don't log sensitive information**: Avoid logging passwords, tokens, or personal information
2. **Add context to errors**: Include relevant information that will help with debugging
3. **Use appropriate severity levels**: Use info, warning, error appropriately
4. **Monitor Sentry dashboard**: Regularly check your Sentry dashboard for new issues

## Environment Variables

For better security, consider moving the Sentry DSN to an environment variable:

```typescript
// In .env file
VITE_SENTRY_DSN=your_sentry_dsn

// In main.tsx
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  // other options
});
```

## Performance Considerations

Sentry can impact application performance if not configured properly. Consider:

1. Adjusting the `tracesSampleRate` to a lower value in production (e.g., 0.2 = 20% of transactions)
2. Using the `beforeSend` hook to filter out noisy errors
3. Setting appropriate rate limits in your Sentry project settings
