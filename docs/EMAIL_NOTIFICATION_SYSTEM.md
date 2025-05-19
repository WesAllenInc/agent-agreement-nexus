# Email Notification System

## Overview

The Agent Agreement Nexus application includes a comprehensive email notification system that sends automated emails for key events in the application. The system uses Supabase Edge Functions with Nodemailer for email delivery and includes features like templating, logging, rate limiting, and retry mechanisms.

## Features

- **Event-Based Notifications**: Automatically sends emails for important events:
  - Invitation sent to new agents
  - Agreement signed by an agent
  - Agent account approved
  - Training assigned to agents
  - Reminders for pending agreements and training

- **HTML Email Templates**: Professionally designed, responsive email templates for each notification type

- **Logging & Monitoring**: All email activities are logged in the `email_logs` table for tracking and debugging

- **Error Handling**: Built-in retry mechanism for failed email deliveries

- **Rate Limiting**: Prevents abuse by limiting the number of emails that can be sent in a given time period

## Technical Implementation

### Database Structure

The system uses the following database tables:

- `email_logs`: Tracks all email notifications sent through the system
  - Fields: id, notification_type, recipient, status, error_message, sent_at, created_at

### Edge Functions

- `sendNotification`: Main edge function for sending all types of email notifications
  - Handles templating, sending, and logging of emails
  - Includes retry logic for failed deliveries
  - Implements rate limiting to prevent abuse

### React Hooks

- `useEmailNotifications`: React hook for interacting with the email notification system
  - Provides methods for sending different types of notifications
  - Handles error states and provides feedback to the user
  - Includes query methods for retrieving email logs

## Usage Examples

### Sending an Invitation Email

```typescript
const { sendInvitationEmail } = useEmailNotifications();

// Send invitation
await sendInvitationEmail(
  'agent@example.com',
  'https://example.com/accept-invitation?token=abc123'
);
```

### Sending an Agreement Signed Notification

```typescript
const { sendAgreementSignedNotification } = useEmailNotifications();

// Notify admin when an agreement is signed
await sendAgreementSignedNotification(
  'admin@example.com',
  'John Doe',
  'Sales Agent Agreement',
  '2025-05-19',
  'https://example.com/agreements/123',
  ['cc1@example.com', 'cc2@example.com'] // Optional CC recipients
);
```

### Sending a Training Assignment Notification

```typescript
const { sendTrainingAssignedNotification } = useEmailNotifications();

// Notify agent of new training
await sendTrainingAssignedNotification(
  'agent@example.com',
  'Sales Process Training',
  'Learn about our sales process and procedures',
  '2025-06-01', // Due date
  'https://example.com/training'
);
```

### Viewing Email Logs

```typescript
const { useEmailLogs } = useEmailNotifications();

// Get email logs
const { data: logs, isLoading } = useEmailLogs(50, 0); // Limit 50, offset 0
```

## Configuration

The email notification system uses the following environment variables:

- `SMTP_HOST`: SMTP server hostname
- `SMTP_PORT`: SMTP server port
- `SMTP_USER`: SMTP username
- `SMTP_PASS`: SMTP password
- `SMTP_FROM`: From email address
- `PUBLIC_APP_URL`: Public URL of the application (for links in emails)

## Security Considerations

- All email templates are server-side rendered to prevent XSS attacks
- Rate limiting is implemented to prevent abuse
- Row Level Security (RLS) policies restrict access to email logs
- No sensitive information is included in email templates

## Troubleshooting

If emails are not being sent:

1. Check the `email_logs` table for error messages
2. Verify SMTP credentials in environment variables
3. Check rate limiting settings
4. Ensure the Edge Function is properly deployed

## Future Enhancements

- Email template customization in admin interface
- Email scheduling for delayed delivery
- Email analytics (open rates, click rates)
- Email preferences for users (opt-out options)
