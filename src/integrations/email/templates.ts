import { DEFAULT_FROM_EMAIL, DEFAULT_FROM_NAME } from './client';

// Base template interface
export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
  from?: string;
}

// Template data interfaces
export interface InviteTemplateData {
  inviteeName: string;
  inviterName: string;
  invitationUrl: string;
  companyName?: string;
  residualPercent?: number;
  expirationDate?: string;
}

export interface AgreementSignedTemplateData {
  agentName: string;
  agreementTitle: string;
  agreementUrl: string;
  signedDate: string;
  adminDashboardUrl?: string;
}

export interface AgentApprovedTemplateData {
  agentName: string;
  dashboardUrl: string;
  supportEmail?: string;
}

export interface TrainingAssignedTemplateData {
  agentName: string;
  trainingTitle: string;
  trainingUrl: string;
  dueDate?: string;
  assignedBy?: string;
}

// Template generators
export const generateInviteTemplate = (data: InviteTemplateData): EmailTemplate => {
  const companyName = data.companyName || 'Our Company';
  
  return {
    subject: `You've been invited to join ${companyName} as a Sales Agent`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Agent Invitation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 5px; }
            .content { padding: 20px 0; }
            .button { display: inline-block; background-color: #4f46e5; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin: 20px 0; }
            .footer { font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Welcome to ${companyName}!</h1>
          </div>
          <div class="content">
            <p>Hello ${data.inviteeName},</p>
            <p>${data.inviterName} has invited you to join ${companyName} as a Sales Agent${data.residualPercent ? ` with a residual percentage of ${data.residualPercent}%` : ''}.</p>
            <p>To accept this invitation and complete your registration, please click the button below:</p>
            <a href="${data.invitationUrl}" class="button">Accept Invitation</a>
            <p>This invitation link will expire ${data.expirationDate ? `on ${data.expirationDate}` : 'in 7 days'}.</p>
            <p>If you have any questions, please contact your administrator.</p>
          </div>
          <div class="footer">
            <p>This email was sent from an unmonitored address. Please do not reply to this email.</p>
            <p>&copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
          </div>
        </body>
      </html>
    `,
    text: `
      Welcome to ${companyName}!
      
      Hello ${data.inviteeName},
      
      ${data.inviterName} has invited you to join ${companyName} as a Sales Agent${data.residualPercent ? ` with a residual percentage of ${data.residualPercent}%` : ''}.
      
      To accept this invitation and complete your registration, please visit the following link:
      ${data.invitationUrl}
      
      This invitation link will expire ${data.expirationDate ? `on ${data.expirationDate}` : 'in 7 days'}.
      
      If you have any questions, please contact your administrator.
      
      This email was sent from an unmonitored address. Please do not reply to this email.
      
      © ${new Date().getFullYear()} ${companyName}. All rights reserved.
    `,
    from: `"${DEFAULT_FROM_NAME}" <${DEFAULT_FROM_EMAIL}>`
  };
};

export const generateAgreementSignedTemplate = (data: AgreementSignedTemplateData): EmailTemplate => {
  return {
    subject: `Agreement Signed: ${data.agreementTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Agreement Signed</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 5px; }
            .content { padding: 20px 0; }
            .button { display: inline-block; background-color: #4f46e5; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin: 20px 0; }
            .footer { font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Agreement Signed</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>We're pleased to inform you that ${data.agentName} has signed the "${data.agreementTitle}" agreement on ${data.signedDate}.</p>
            <p>You can view the signed agreement by clicking the button below:</p>
            <a href="${data.agreementUrl}" class="button">View Agreement</a>
            ${data.adminDashboardUrl ? `
            <p>Administrators can view all agreements on the dashboard:</p>
            <a href="${data.adminDashboardUrl}" class="button">Admin Dashboard</a>
            ` : ''}
            <p>Thank you for using Agent Agreement Nexus.</p>
          </div>
          <div class="footer">
            <p>This email was sent from an unmonitored address. Please do not reply to this email.</p>
            <p>&copy; ${new Date().getFullYear()} Agent Agreement Nexus. All rights reserved.</p>
          </div>
        </body>
      </html>
    `,
    text: `
      Agreement Signed
      
      Hello,
      
      We're pleased to inform you that ${data.agentName} has signed the "${data.agreementTitle}" agreement on ${data.signedDate}.
      
      You can view the signed agreement at the following link:
      ${data.agreementUrl}
      
      ${data.adminDashboardUrl ? `
      Administrators can view all agreements on the dashboard:
      ${data.adminDashboardUrl}
      ` : ''}
      
      Thank you for using Agent Agreement Nexus.
      
      This email was sent from an unmonitored address. Please do not reply to this email.
      
      © ${new Date().getFullYear()} Agent Agreement Nexus. All rights reserved.
    `,
    from: `"${DEFAULT_FROM_NAME}" <${DEFAULT_FROM_EMAIL}>`
  };
};

export const generateAgentApprovedTemplate = (data: AgentApprovedTemplateData): EmailTemplate => {
  const supportEmail = data.supportEmail || 'support@agent-agreement-nexus.com';
  
  return {
    subject: 'Your Agent Account Has Been Approved',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Agent Account Approved</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 5px; }
            .content { padding: 20px 0; }
            .button { display: inline-block; background-color: #4f46e5; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin: 20px 0; }
            .footer { font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Account Approved!</h1>
          </div>
          <div class="content">
            <p>Hello ${data.agentName},</p>
            <p>Congratulations! Your agent account has been approved. You now have full access to the Agent Agreement Nexus platform.</p>
            <p>You can access your dashboard by clicking the button below:</p>
            <a href="${data.dashboardUrl}" class="button">Go to Dashboard</a>
            <p>From your dashboard, you can:</p>
            <ul>
              <li>View and sign agreements</li>
              <li>Complete required training</li>
              <li>Submit banking information</li>
              <li>Track your commissions</li>
            </ul>
            <p>If you have any questions or need assistance, please contact us at <a href="mailto:${supportEmail}">${supportEmail}</a>.</p>
          </div>
          <div class="footer">
            <p>This email was sent from an unmonitored address. Please do not reply to this email.</p>
            <p>&copy; ${new Date().getFullYear()} Agent Agreement Nexus. All rights reserved.</p>
          </div>
        </body>
      </html>
    `,
    text: `
      Account Approved!
      
      Hello ${data.agentName},
      
      Congratulations! Your agent account has been approved. You now have full access to the Agent Agreement Nexus platform.
      
      You can access your dashboard at the following link:
      ${data.dashboardUrl}
      
      From your dashboard, you can:
      - View and sign agreements
      - Complete required training
      - Submit banking information
      - Track your commissions
      
      If you have any questions or need assistance, please contact us at ${supportEmail}.
      
      This email was sent from an unmonitored address. Please do not reply to this email.
      
      © ${new Date().getFullYear()} Agent Agreement Nexus. All rights reserved.
    `,
    from: `"${DEFAULT_FROM_NAME}" <${DEFAULT_FROM_EMAIL}>`
  };
};

export const generateTrainingAssignedTemplate = (data: TrainingAssignedTemplateData): EmailTemplate => {
  return {
    subject: `New Training Assigned: ${data.trainingTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Training Assigned</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 5px; }
            .content { padding: 20px 0; }
            .button { display: inline-block; background-color: #4f46e5; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin: 20px 0; }
            .footer { font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>New Training Assigned</h1>
          </div>
          <div class="content">
            <p>Hello ${data.agentName},</p>
            <p>A new training module titled "${data.trainingTitle}" has been assigned to you${data.assignedBy ? ` by ${data.assignedBy}` : ''}.</p>
            ${data.dueDate ? `<p><strong>Due Date:</strong> ${data.dueDate}</p>` : ''}
            <p>To access and complete this training, please click the button below:</p>
            <a href="${data.trainingUrl}" class="button">Start Training</a>
            <p>Completing all assigned training modules is an important part of your role as an agent.</p>
          </div>
          <div class="footer">
            <p>This email was sent from an unmonitored address. Please do not reply to this email.</p>
            <p>&copy; ${new Date().getFullYear()} Agent Agreement Nexus. All rights reserved.</p>
          </div>
        </body>
      </html>
    `,
    text: `
      New Training Assigned
      
      Hello ${data.agentName},
      
      A new training module titled "${data.trainingTitle}" has been assigned to you${data.assignedBy ? ` by ${data.assignedBy}` : ''}.
      
      ${data.dueDate ? `Due Date: ${data.dueDate}` : ''}
      
      To access and complete this training, please visit the following link:
      ${data.trainingUrl}
      
      Completing all assigned training modules is an important part of your role as an agent.
      
      This email was sent from an unmonitored address. Please do not reply to this email.
      
      © ${new Date().getFullYear()} Agent Agreement Nexus. All rights reserved.
    `,
    from: `"${DEFAULT_FROM_NAME}" <${DEFAULT_FROM_EMAIL}>`
  };
};
