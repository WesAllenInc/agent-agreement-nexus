import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

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

/**
 * Hook for sending email notifications and retrieving email logs
 */
export const useEmailNotifications = () => {
  const { toast } = useToast();

  /**
   * Send an email notification using the Supabase Edge Function
   */
  const sendNotification = useCallback(
    async (payload: EmailPayload) => {
      try {
        const { data, error } = await supabase.functions.invoke('sendNotification', {
          body: payload,
        });

        if (error) {
          toast({
            title: 'Failed to send notification',
            description: error.message,
            variant: 'destructive',
          });
          return { success: false, error: error.message };
        }

        if (!data.success) {
          toast({
            title: 'Failed to send notification',
            description: data.error || 'Unknown error',
            variant: 'destructive',
          });
          return { success: false, error: data.error };
        }

        toast({
          title: 'Notification sent',
          description: 'Email notification has been sent successfully',
          variant: 'default',
        });
        return { success: true, message: data.message };
      } catch (error: any) {
        toast({
          title: 'Failed to send notification',
          description: error.message || 'Unknown error',
          variant: 'destructive',
        });
        return { success: false, error: error.message };
      }
    },
    [supabase, toast]
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
      const { data, error } = await supabase
        .from('email_logs')
        .select('*')
        .order('sent_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw error;
      }

      return data as EmailLog[];
    },
    [supabase]
  );

  /**
   * Query for email logs
   */
  const useEmailLogs = (limit = 50, offset = 0) => {
    return useQuery({
      queryKey: ['email-logs', limit, offset],
      queryFn: () => getEmailLogs(limit, offset),
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
    useEmailLogs,
  };
};
