// Export all email functionality
export * from './client';
export * from './templates';
export * from './service';

// Export a default object for easier imports
import { resend, DEFAULT_FROM_EMAIL, DEFAULT_FROM_NAME } from './client';
import * as templates from './templates';
import * as service from './service';

const email = {
  client: resend,
  defaults: {
    fromEmail: DEFAULT_FROM_EMAIL,
    fromName: DEFAULT_FROM_NAME,
  },
  templates,
  sendEmail: service.sendEmail,
  retryFailedEmails: service.retryFailedEmails,
};

export default email;
