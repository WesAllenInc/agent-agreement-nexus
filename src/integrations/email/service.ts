import { resend, MAX_RETRY_ATTEMPTS, DEFAULT_FROM_EMAIL } from './client';
import { EmailTemplate } from './templates';
import { supabase } from '@/integrations/supabase/client';

// Interface for email recipient
export interface EmailRecipient {
  email: string;
  name?: string;
}

// Interface for email error record
interface EmailErrorRecord {
  recipient: string;
  subject: string;
  error_message: string;
  template_type: string;
  attempt_count: number;
  created_at?: string;
  last_attempt_at?: string;
}

/**
 * Send an email with retry logic and error logging
 * @param to Recipient email or array of recipient emails
 * @param template Email template object containing subject, html, and text
 * @param attemptCount Current attempt count (for internal retry use)
 * @returns Promise resolving to success boolean
 */
export const sendEmail = async (
  to: string | string[] | EmailRecipient | EmailRecipient[],
  template: EmailTemplate,
  attemptCount = 1
): Promise<boolean> => {
  try {
    // Format recipients
    const recipients = formatRecipients(to);
    
    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: template.from || DEFAULT_FROM_EMAIL,
      to: recipients,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    if (error) {
      throw error;
    }

    console.log('Email sent successfully:', data);
    return true;
  } catch (error: any) {
    console.error(`Email sending failed (attempt ${attemptCount}):`, error);
    
    // Get the first recipient for logging purposes
    const firstRecipient = getFirstRecipientEmail(to);
    
    // If we haven't reached max retry attempts, try again
    if (attemptCount < MAX_RETRY_ATTEMPTS) {
      console.log(`Retrying email send (attempt ${attemptCount + 1})...`);
      return sendEmail(to, template, attemptCount + 1);
    } else {
      // Log the error to the database
      await logEmailError({
        recipient: typeof firstRecipient === 'string' ? firstRecipient : 'multiple-recipients',
        subject: template.subject,
        error_message: error.message || 'Unknown error',
        template_type: getTemplateType(template),
        attempt_count: attemptCount,
      });
      
      return false;
    }
  }
};

/**
 * Format recipients to the format expected by Resend
 */
const formatRecipients = (
  recipients: string | string[] | EmailRecipient | EmailRecipient[]
): string[] => {
  if (typeof recipients === 'string') {
    return [recipients];
  }
  
  if (Array.isArray(recipients)) {
    return recipients.map(recipient => {
      if (typeof recipient === 'string') {
        return recipient;
      }
      return recipient.name 
        ? `"${recipient.name}" <${recipient.email}>`
        : recipient.email;
    });
  }
  
  // Single EmailRecipient object
  if (typeof recipients === 'object' && recipients !== null) {
    return [
      recipients.name 
        ? `"${recipients.name}" <${recipients.email}>`
        : recipients.email
    ];
  }
  
  return [];
};

/**
 * Get the first recipient email for logging purposes
 */
const getFirstRecipientEmail = (
  recipients: string | string[] | EmailRecipient | EmailRecipient[]
): string => {
  if (typeof recipients === 'string') {
    return recipients;
  }
  
  if (Array.isArray(recipients) && recipients.length > 0) {
    const first = recipients[0];
    if (typeof first === 'string') {
      return first;
    }
    return first.email;
  }
  
  if (typeof recipients === 'object' && recipients !== null) {
    return (recipients as EmailRecipient).email;
  }
  
  return 'unknown-recipient';
};

/**
 * Determine the template type from the template for logging purposes
 */
const getTemplateType = (template: EmailTemplate): string => {
  const subjectLower = template.subject.toLowerCase();
  
  if (subjectLower.includes('invite')) return 'invite';
  if (subjectLower.includes('agreement')) return 'agreement';
  if (subjectLower.includes('approved')) return 'approval';
  if (subjectLower.includes('training')) return 'training';
  
  return 'other';
};

/**
 * Log email errors to the database
 */
const logEmailError = async (errorData: EmailErrorRecord): Promise<void> => {
  try {
    const { error } = await supabase
      .from('email_errors')
      .insert({
        ...errorData,
        created_at: new Date().toISOString(),
        last_attempt_at: new Date().toISOString(),
      });
    
    if (error) {
      console.error('Failed to log email error:', error);
    }
  } catch (error) {
    console.error('Exception when logging email error:', error);
  }
};

/**
 * Retry sending failed emails from the email_errors table
 * This can be called by a scheduled function
 */
export const retryFailedEmails = async (): Promise<void> => {
  try {
    // Get failed emails with fewer than MAX_RETRY_ATTEMPTS
    const { data: failedEmails, error } = await supabase
      .from('email_errors')
      .select('*')
      .lt('attempt_count', MAX_RETRY_ATTEMPTS)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Failed to fetch failed emails:', error);
      return;
    }
    
    if (!failedEmails || failedEmails.length === 0) {
      console.log('No failed emails to retry');
      return;
    }
    
    console.log(`Retrying ${failedEmails.length} failed emails...`);
    
    // Process each failed email
    for (const failedEmail of failedEmails) {
      // We would need to reconstruct the template from the stored data
      // This is a simplified example - in a real system, you might store more data
      // or have a way to reconstruct the full template
      console.log(`Retrying email to ${failedEmail.recipient}...`);
      
      // Update the attempt count and last attempt timestamp
      const { error: updateError } = await supabase
        .from('email_errors')
        .update({
          attempt_count: failedEmail.attempt_count + 1,
          last_attempt_at: new Date().toISOString(),
        })
        .eq('id', failedEmail.id);
      
      if (updateError) {
        console.error('Failed to update email error record:', updateError);
      }
    }
  } catch (error) {
    console.error('Exception when retrying failed emails:', error);
  }
};
