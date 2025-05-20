import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { Resend } from 'https://esm.sh/resend@1.0.0'
import { rateLimit } from '../_shared/rateLimit.ts'

console.log("Email Notification Service initialized")

// Email template types
type NotificationType = 
  | 'invite_sent' 
  | 'agreement_signed' 
  | 'agent_approved' 
  | 'training_assigned'
  | 'agreement_reminder'
  | 'training_reminder';

interface EmailPayload {
  to: string;
  subject: string;
  templateType: NotificationType;
  templateData: Record<string, any>;
  cc?: string[];
  bcc?: string[];
}

interface NotificationResponse {
  success: boolean;
  message?: string;
  error?: string;
  id?: string;
}

// Email templates
const emailTemplates = {
  invite_sent: (data: any) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <img src="${Deno.env.get('PUBLIC_APP_URL')}/lovable-uploads/692c0e22-35ce-4558-9822-df60e105764d.png" 
           alt="Ireland Pay Logo" 
           style="max-width: 200px; margin: 20px auto; display: block;">
      
      <h1 style="color: #1a365d; text-align: center;">Welcome to Ireland Pay!</h1>
      
      <p style="color: #4a5568; line-height: 1.6;">
        You've been invited to join Ireland Pay as a Sales Agent. We're excited to have you on board!
      </p>
      
      <p style="color: #4a5568; line-height: 1.6;">
        To get started, click the button below to create your account. This invitation will expire in 7 days.
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.inviteUrl}"
           style="background-color: #3182ce; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; font-weight: bold;">
          Create Your Account
        </a>
      </div>
      
      <p style="color: #718096; font-size: 0.9em;">
        If the button doesn't work, copy and paste this link into your browser:
        <br>
        <a href="${data.inviteUrl}" style="color: #3182ce; word-break: break-all;">
          ${data.inviteUrl}
        </a>
      </p>
      
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
      
      <p style="color: #718096; font-size: 0.8em; text-align: center;">
        If you didn't expect this invitation, please ignore this email.
      </p>
    </div>
  `,
  
  agreement_signed: (data: any) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <img src="${Deno.env.get('PUBLIC_APP_URL')}/lovable-uploads/692c0e22-35ce-4558-9822-df60e105764d.png" 
           alt="Ireland Pay Logo" 
           style="max-width: 200px; margin: 20px auto; display: block;">
      
      <h1 style="color: #1a365d; text-align: center;">Agreement Signed</h1>
      
      <p style="color: #4a5568; line-height: 1.6;">
        This is to confirm that <strong>${data.agentName}</strong> has signed the <strong>${data.agreementName}</strong> agreement.
      </p>
      
      <div style="background-color: #f7fafc; border-left: 4px solid #3182ce; padding: 15px; margin: 20px 0;">
        <p style="color: #4a5568; margin: 0;">
          <strong>Agreement:</strong> ${data.agreementName}<br>
          <strong>Signed by:</strong> ${data.agentName}<br>
          <strong>Signed on:</strong> ${data.signedDate}<br>
        </p>
      </div>
      
      <p style="color: #4a5568; line-height: 1.6;">
        You can view the signed agreement by clicking the button below.
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.viewUrl}"
           style="background-color: #3182ce; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; font-weight: bold;">
          View Agreement
        </a>
      </div>
      
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
      
      <p style="color: #718096; font-size: 0.8em; text-align: center;">
        This is an automated notification from the Ireland Pay Agent Agreement Nexus system.
      </p>
    </div>
  `,
  
  agent_approved: (data: any) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <img src="${Deno.env.get('PUBLIC_APP_URL')}/lovable-uploads/692c0e22-35ce-4558-9822-df60e105764d.png" 
           alt="Ireland Pay Logo" 
           style="max-width: 200px; margin: 20px auto; display: block;">
      
      <h1 style="color: #1a365d; text-align: center;">Account Approved</h1>
      
      <p style="color: #4a5568; line-height: 1.6;">
        Congratulations! Your Ireland Pay agent account has been approved.
      </p>
      
      <p style="color: #4a5568; line-height: 1.6;">
        You now have full access to the Agent Portal where you can view agreements, complete training, 
        and access all the tools you need to succeed as an Ireland Pay agent.
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.portalUrl}"
           style="background-color: #3182ce; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; font-weight: bold;">
          Go to Agent Portal
        </a>
      </div>
      
      <p style="color: #4a5568; line-height: 1.6;">
        If you have any questions, please contact your account manager.
      </p>
      
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
      
      <p style="color: #718096; font-size: 0.8em; text-align: center;">
        This is an automated notification from the Ireland Pay Agent Agreement Nexus system.
      </p>
    </div>
  `,
  
  training_assigned: (data: any) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <img src="${Deno.env.get('PUBLIC_APP_URL')}/lovable-uploads/692c0e22-35ce-4558-9822-df60e105764d.png" 
           alt="Ireland Pay Logo" 
           style="max-width: 200px; margin: 20px auto; display: block;">
      
      <h1 style="color: #1a365d; text-align: center;">New Training Assigned</h1>
      
      <p style="color: #4a5568; line-height: 1.6;">
        New training has been assigned to you in the Ireland Pay Agent Portal.
      </p>
      
      <div style="background-color: #f7fafc; border-left: 4px solid #3182ce; padding: 15px; margin: 20px 0;">
        <p style="color: #4a5568; margin: 0;">
          <strong>Training Module:</strong> ${data.trainingName}<br>
          <strong>Due Date:</strong> ${data.dueDate || 'Not specified'}<br>
          <strong>Description:</strong> ${data.description || 'No description provided'}
        </p>
      </div>
      
      <p style="color: #4a5568; line-height: 1.6;">
        Please log in to your Agent Portal to complete this training at your earliest convenience.
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.trainingUrl}"
           style="background-color: #3182ce; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; font-weight: bold;">
          Start Training
        </a>
      </div>
      
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
      
      <p style="color: #718096; font-size: 0.8em; text-align: center;">
        This is an automated notification from the Ireland Pay Agent Agreement Nexus system.
      </p>
    </div>
  `,
  
  agreement_reminder: (data: any) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <img src="${Deno.env.get('PUBLIC_APP_URL')}/lovable-uploads/692c0e22-35ce-4558-9822-df60e105764d.png" 
           alt="Ireland Pay Logo" 
           style="max-width: 200px; margin: 20px auto; display: block;">
      
      <h1 style="color: #1a365d; text-align: center;">Agreement Signature Reminder</h1>
      
      <p style="color: #4a5568; line-height: 1.6;">
        This is a friendly reminder that you have an agreement that requires your signature.
      </p>
      
      <div style="background-color: #f7fafc; border-left: 4px solid #f6ad55; padding: 15px; margin: 20px 0;">
        <p style="color: #4a5568; margin: 0;">
          <strong>Agreement:</strong> ${data.agreementName}<br>
          <strong>Status:</strong> Awaiting Signature<br>
          <strong>Due Date:</strong> ${data.dueDate || 'As soon as possible'}
        </p>
      </div>
      
      <p style="color: #4a5568; line-height: 1.6;">
        Please log in to your Agent Portal to review and sign this agreement.
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.agreementUrl}"
           style="background-color: #3182ce; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; font-weight: bold;">
          Sign Agreement
        </a>
      </div>
      
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
      
      <p style="color: #718096; font-size: 0.8em; text-align: center;">
        This is an automated notification from the Ireland Pay Agent Agreement Nexus system.
      </p>
    </div>
  `,
  
  training_reminder: (data: any) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <img src="${Deno.env.get('PUBLIC_APP_URL')}/lovable-uploads/692c0e22-35ce-4558-9822-df60e105764d.png" 
           alt="Ireland Pay Logo" 
           style="max-width: 200px; margin: 20px auto; display: block;">
      
      <h1 style="color: #1a365d; text-align: center;">Training Completion Reminder</h1>
      
      <p style="color: #4a5568; line-height: 1.6;">
        This is a friendly reminder that you have training modules that need to be completed.
      </p>
      
      <div style="background-color: #f7fafc; border-left: 4px solid #f6ad55; padding: 15px; margin: 20px 0;">
        <p style="color: #4a5568; margin: 0;">
          <strong>Training Module:</strong> ${data.trainingName}<br>
          <strong>Status:</strong> ${data.status || 'Incomplete'}<br>
          <strong>Due Date:</strong> ${data.dueDate || 'As soon as possible'}<br>
          <strong>Completion:</strong> ${data.completionPercentage || '0'}%
        </p>
      </div>
      
      <p style="color: #4a5568; line-height: 1.6;">
        Please log in to your Agent Portal to complete your required training.
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.trainingUrl}"
           style="background-color: #3182ce; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; font-weight: bold;">
          Continue Training
        </a>
      </div>
      
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
      
      <p style="color: #718096; font-size: 0.8em; text-align: center;">
        This is an automated notification from the Ireland Pay Agent Agreement Nexus system.
      </p>
    </div>
  `
};

// Log email notifications for debugging and tracking
const logEmailNotification = async (
  supabaseClient: any,
  type: NotificationType,
  recipient: string,
  status: 'success' | 'failed',
  errorMessage?: string
) => {
  try {
    await supabaseClient
      .from('email_logs')
      .insert({
        notification_type: type,
        recipient,
        status,
        error_message: errorMessage,
        sent_at: new Date().toISOString()
      });
  } catch (error) {
    console.error('Failed to log email notification:', error);
  }
};

// Retry mechanism for email sending
const sendEmailWithRetry = async (
  resend: Resend,
  emailOptions: {
    from: string;
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
    cc?: string | string[];
    bcc?: string | string[];
  },
  maxRetries = 3,
  delay = 1000
): Promise<{success: boolean, id?: string, error?: any}> => {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const { data, error } = await resend.emails.send(emailOptions);
      
      if (error) {
        throw error;
      }
      
      return { success: true, id: data?.id };
    } catch (error) {
      retries++;
      console.error(`Email send attempt ${retries} failed:`, error);
      
      if (retries >= maxRetries) {
        return { success: false, error };
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * retries));
    }
  }
  
  return { success: false, error: new Error('Max retries reached') };
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Apply rate limiting (100 emails per hour)
    const rateLimitResult = await rateLimit(req, 'email_notifications', 100, 60 * 60);
    if (!rateLimitResult.success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Rate limit exceeded: ${rateLimitResult.message}`
        } as NotificationResponse),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 429
        }
      );
    }

    const payload = await req.json() as EmailPayload;
    const { to, subject, templateType, templateData, cc, bcc } = payload;

    if (!to || !subject || !templateType || !templateData) {
      throw new Error('Missing required fields: to, subject, templateType, or templateData');
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Initialize Resend with API key
    const resend = new Resend(Deno.env.get('RESEND_API_KEY') ?? '');
    
    // Get company name from settings or use default
    const { data: settings, error: settingsError } = await supabaseClient
      .from("settings")
      .select("company_name")
      .limit(1)
      .single();
    
    const companyName = settingsError || !settings?.company_name
      ? "Agent Agreement Nexus"
      : settings.company_name;

    // Get the email template
    const template = emailTemplates[templateType];
    if (!template) {
      throw new Error(`Template not found for type: ${templateType}`);
    }

    // Generate HTML content
    const html = template(templateData);

    // Prepare email options
    const emailOptions = {
      from: `${companyName} <${Deno.env.get('RESEND_FROM_EMAIL') || 'notifications@agent-agreement-nexus.com'}>`,
      to,
      subject,
      html,
      ...(cc && cc.length > 0 ? { cc } : {}),
      ...(bcc && bcc.length > 0 ? { bcc } : {})
    };

    // Send email with retry mechanism
    const sendResult = await sendEmailWithRetry(resend, emailOptions);
    
    if (!sendResult.success) {
      throw sendResult.error || new Error('Failed to send email');
    }

    // Log successful email
    await logEmailNotification(supabaseClient, templateType, to, 'success');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email notification sent successfully'
      } as NotificationResponse),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error sending notification:', error);
    
    // Create Supabase client for logging
    try {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
      
      // Extract email details for logging
      const payload = await req.json() as EmailPayload;
      if (payload.to && payload.templateType) {
        await logEmailNotification(
          supabaseClient, 
          payload.templateType, 
          payload.to, 
          'failed', 
          error.message
        );
      }
    } catch (logError) {
      console.error('Error logging email failure:', logError);
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      } as NotificationResponse),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
