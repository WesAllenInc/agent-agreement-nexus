import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { captureException } from '@/utils/errorTracking';
import { useAuth } from '@/hooks/useAuth';

// Email notification types
export type NotificationType = 
  | 'invite_sent' 
  | 'agreement_signed' 
  | 'agent_approved' 
  | 'training_assigned'
  | 'agreement_reminder'
  | 'training_reminder';

// Email payload interface
export interface EmailPayload {
  to: string;
  subject: string;
  templateType: NotificationType;
  templateData: Record<string, any>;
  cc?: string[];
  bcc?: string[];
}

// Email log interface
export interface EmailLog {
  id: string;
  notification_type: NotificationType;
  recipient: string;
  status: 'success' | 'failed';
  error_message?: string;
  sent_at: string;
  created_at: string;
}

// Email error interface for fallback logging
export interface EmailError {
  id: string;
  notification_type: NotificationType;
  recipient: string;
  error_message: string;
  payload: Record<string, any>;
  created_at: string;
  retry_count: number;
  last_retry_at?: string;
  resolved: boolean;
}

/**
 * Hook for sending email notifications and retrieving email logs
 */
export const useEmailNotifications = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  /**
   * Log email error to the email_errors table for fallback and retry
   */
  const logEmailError = useCallback(
    async (payload: EmailPayload, errorMessage: string) => {
      try {
        const { error } = await supabase.from('email_errors').insert({
          notification_type: payload.templateType,
          recipient: payload.to,
          error_message: errorMessage,
          payload: {
            ...payload,
            // Remove sensitive data if needed
            // For example, if payload contains tokens or passwords
          },
          retry_count: 0,
          resolved: false,
          created_by: user?.id || null
        });

        if (error) {
          console.error('Failed to log email error:', error);
          captureException(error, { context: 'Email error logging' });
        }
      } catch (err) {
        console.error('Exception logging email error:', err);
        captureException(err, { context: 'Email error logging exception' });
      }
    },
    [supabase, user]
  );

  /**
   * Send an email notification using the Supabase Edge Function
   * with fallback logging to email_errors table
   */
  const sendNotification = useCallback(
    async (payload: EmailPayload, silent = false) => {
      try {
        // Validate payload
        if (!payload.to || !payload.subject || !payload.templateType) {
          const error = 'Invalid email payload: missing required fields';
          if (!silent) {
            toast({
              title: 'Failed to send notification',
              description: error,
              variant: 'destructive',
            });
          }
          await logEmailError(payload, error);
          return { success: false, error };
        }

        // Call the Supabase Edge Function
        const { data, error } = await supabase.functions.invoke('sendNotification', {
          body: payload,
        });

        if (error) {
          if (!silent) {
            toast({
              title: 'Failed to send notification',
              description: error.message,
              variant: 'destructive',
            });
          }
          await logEmailError(payload, error.message);
          captureException(error, { context: 'Email notification function' });
          return { success: false, error: error.message };
        }

        if (!data.success) {
          if (!silent) {
            toast({
              title: 'Failed to send notification',
              description: data.error || 'Unknown error',
              variant: 'destructive',
            });
          }
          await logEmailError(payload, data.error || 'Unknown error');
          return { success: false, error: data.error };
        }

        // Log successful email to email_logs table
        try {
          const { error: logError } = await supabase.from('email_logs').insert({
            notification_type: payload.templateType,
            recipient: payload.to,
            status: 'success',
            sent_at: new Date().toISOString(),
            created_by: user?.id || null
          });
          
          if (logError) {
            console.error('Failed to log successful email:', logError);
            captureException(logError, { context: 'Email success logging' });
          }
        } catch (err) {
          console.error('Exception logging successful email:', err);
          captureException(err, { context: 'Email success logging exception' });
        }

        if (!silent) {
          toast({
            title: 'Notification sent',
            description: 'Email notification has been sent successfully',
            variant: 'default',
          });
        }
        return { success: true, message: data.message };
      } catch (error: any) {
        const errorMessage = error.message || 'Unknown error';
        if (!silent) {
          toast({
            title: 'Failed to send notification',
            description: errorMessage,
            variant: 'destructive',
          });
        }
        await logEmailError(payload, errorMessage);
        captureException(error, { context: 'Email notification exception' });
        return { success: false, error: errorMessage };
      }
    },
    [supabase, toast, logEmailError, user]
  );

  /**
   * Send an invitation email
   */
  const sendInvitationEmail = useCallback(
    async (email: string, inviteUrl: string) => {
      return sendNotification({
        to: email,
        subject: 'Welcome to Ireland Pay - Sales Agent Invitation',
        templateType: 'invite_sent',
        templateData: {
          inviteUrl,
        },
      });
    },
    [sendNotification]
  );

  /**
   * Send an agreement signed notification
   */
  const sendAgreementSignedNotification = useCallback(
    async (
      adminEmail: string,
      agentName: string,
      agreementName: string,
      signedDate: string,
      viewUrl: string,
      cc?: string[]
    ) => {
      return sendNotification({
        to: adminEmail,
        subject: `Agreement Signed: ${agreementName}`,
        templateType: 'agreement_signed',
        templateData: {
          agentName,
          agreementName,
          signedDate,
          viewUrl,
        },
        cc
      });
    },
    [sendNotification]
  );

  /**
   * Send an agent approved notification
   */
  const sendAgentApprovedNotification = useCallback(
    async (agentEmail: string, portalUrl: string) => {
      return sendNotification({
        to: agentEmail,
        subject: 'Your Ireland Pay Agent Account Has Been Approved',
        templateType: 'agent_approved',
        templateData: {
          portalUrl,
        },
      });
    },
    [sendNotification]
  );

  /**
   * Send a training assigned notification
   */
  const sendTrainingAssignedNotification = useCallback(
    async (
      agentEmail: string,
      trainingName: string,
      description: string,
      dueDate: string | null,
      trainingUrl: string
    ) => {
      return sendNotification({
        to: agentEmail,
        subject: `New Training Assigned: ${trainingName}`,
        templateType: 'training_assigned',
        templateData: {
          trainingName,
          description,
          dueDate,
          trainingUrl,
        },
      });
    },
    [sendNotification]
  );

  /**
   * Send an agreement reminder notification
   */
  const sendAgreementReminderNotification = useCallback(
    async (
      agentEmail: string,
      agreementName: string,
      dueDate: string | null,
      agreementUrl: string
    ) => {
      return sendNotification({
        to: agentEmail,
        subject: `Reminder: ${agreementName} Requires Your Signature`,
        templateType: 'agreement_reminder',
        templateData: {
          agreementName,
          dueDate,
          agreementUrl,
        },
      });
    },
    [sendNotification]
  );

  /**
   * Send a training reminder notification
   */
  const sendTrainingReminderNotification = useCallback(
    async (
      agentEmail: string,
      trainingName: string,
      status: string,
      dueDate: string | null,
      completionPercentage: number,
      trainingUrl: string
    ) => {
      return sendNotification({
        to: agentEmail,
        subject: `Reminder: Complete Your ${trainingName} Training`,
        templateType: 'training_reminder',
        templateData: {
          trainingName,
          status,
          dueDate,
          completionPercentage,
          trainingUrl,
        },
      });
    },
    [sendNotification]
  );

  /**
   * Get email logs
   */
  const getEmailLogs = useCallback(
    async (limit = 50, offset = 0) => {
      try {
        const { data, error } = await supabase
          .from('email_logs')
          .select('*')
          .order('sent_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (error) {
          captureException(error, { context: 'Fetching email logs' });
          throw error;
        }

        return data as EmailLog[];
      } catch (error) {
        captureException(error, { context: 'Email logs exception' });
        throw error;
      }
    },
    [supabase]
  );

  /**
   * Get email errors for monitoring and retry
   */
  const getEmailErrors = useCallback(
    async (limit = 50, offset = 0, includeResolved = false) => {
      try {
        let query = supabase
          .from('email_errors')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (!includeResolved) {
          query = query.eq('resolved', false);
        }
        
        const { data, error } = await query.range(offset, offset + limit - 1);

        if (error) {
          captureException(error, { context: 'Fetching email errors' });
          throw error;
        }

        return data as EmailError[];
      } catch (error) {
        captureException(error, { context: 'Email errors exception' });
        throw error;
      }
    },
    [supabase]
  );

  /**
   * Retry sending a failed email
   */
  const retryFailedEmail = useCallback(
    async (errorId: string) => {
      try {
        // Get the error record
        const { data: errorData, error: fetchError } = await supabase
          .from('email_errors')
          .select('*')
          .eq('id', errorId)
          .single();

        if (fetchError || !errorData) {
          toast({
            title: 'Failed to retry email',
            description: 'Could not find the email error record',
            variant: 'destructive',
          });
          return { success: false, error: 'Email error record not found' };
        }

        // Reconstruct the payload from the stored data
        const payload = errorData.payload as EmailPayload;
        
        // Attempt to send the email again
        const result = await sendNotification(payload);

        // Update the error record
        if (result.success) {
          await supabase.from('email_errors').update({
            resolved: true,
            last_retry_at: new Date().toISOString(),
            retry_count: errorData.retry_count + 1
          }).eq('id', errorId);

          toast({
            title: 'Email retry successful',
            description: 'The email has been sent successfully',
            variant: 'default',
          });
        } else {
          await supabase.from('email_errors').update({
            last_retry_at: new Date().toISOString(),
            retry_count: errorData.retry_count + 1,
            error_message: result.error || 'Unknown error during retry'
          }).eq('id', errorId);

          toast({
            title: 'Email retry failed',
            description: result.error || 'Failed to send the email',
            variant: 'destructive',
          });
        }

        return result;
      } catch (error: any) {
        const errorMessage = error.message || 'Unknown error';
        toast({
          title: 'Failed to retry email',
          description: errorMessage,
          variant: 'destructive',
        });
        captureException(error, { context: 'Email retry exception' });
        return { success: false, error: errorMessage };
      }
    },
    [supabase, sendNotification, toast]
  );

  /**
   * Query for email logs
   */
  const useEmailLogs = (limit = 50, offset = 0) => {
    return useQuery({
      queryKey: ['email-logs', limit, offset],
      queryFn: () => getEmailLogs(limit, offset),
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
    });
  };

  /**
   * Query for email errors
   */
  const useEmailErrors = (limit = 50, offset = 0, includeResolved = false) => {
    return useQuery({
      queryKey: ['email-errors', limit, offset, includeResolved],
      queryFn: () => getEmailErrors(limit, offset, includeResolved),
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
    });
  };

  return {
    sendNotification,
    sendInvitationEmail,
    sendAgreementSignedNotification,
    sendAgentApprovedNotification,
    sendTrainingAssignedNotification,
    sendAgreementReminderNotification,
    sendTrainingReminderNotification,
    getEmailLogs,
    getEmailErrors,
    useEmailLogs,
    useEmailErrors,
    retryFailedEmail,
    logEmailError
  };
};
