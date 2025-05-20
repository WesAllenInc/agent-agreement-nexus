import { Resend } from 'resend';

// Initialize Resend with API key from environment variables
const resendApiKey = import.meta.env.VITE_RESEND_API_KEY || '';

if (!resendApiKey) {
  console.warn('Resend API key is not set. Email functionality will not work.');
}

export const resend = new Resend(resendApiKey);

// Default sender information
export const DEFAULT_FROM_EMAIL = import.meta.env.VITE_EMAIL_FROM || 'notifications@agent-agreement-nexus.com';
export const DEFAULT_FROM_NAME = 'Agent Agreement Nexus';

// Maximum number of retry attempts for failed emails
export const MAX_RETRY_ATTEMPTS = 3;
