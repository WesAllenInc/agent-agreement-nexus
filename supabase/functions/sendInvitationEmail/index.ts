import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@1.0.0";

interface InvitationEmailPayload {
  email: string;
  inviteLink: string;
  residualPercent: number;
  token: string;
}

serve(async (req) => {
  try {
    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get the request body
    const { email, inviteLink, residualPercent, token } = await req.json() as InvitationEmailPayload;

    // Validate inputs
    if (!email || !inviteLink || !token) {
      return new Response(
        JSON.stringify({ error: "Email, inviteLink, and token are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Verify the invitation exists
    const { data: invitation, error: invitationError } = await supabaseClient
      .from("invitations")
      .select("id, email, token, expires_at")
      .eq("token", token)
      .eq("email", email)
      .single();

    if (invitationError || !invitation) {
      return new Response(
        JSON.stringify({ error: "Invalid invitation" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Initialize Resend with API key
    const resend = new Resend(Deno.env.get("RESEND_API_KEY") ?? "");
    
    // Get the inviter's name (admin who created the invitation)
    const { data: admin, error: adminError } = await supabaseClient
      .from("profiles")
      .select("first_name, last_name")
      .eq("role", "admin")
      .limit(1)
      .single();
    
    const inviterName = adminError || !admin 
      ? "The Administrator" 
      : `${admin.first_name} ${admin.last_name}`;
    
    // Format expiration date
    const expirationDate = invitation.expires_at
      ? new Date(invitation.expires_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : undefined;
    
    // Get company name from settings
    const { data: settings, error: settingsError } = await supabaseClient
      .from("settings")
      .select("company_name")
      .limit(1)
      .single();
    
    const companyName = settingsError || !settings?.company_name
      ? "Agent Agreement Nexus"
      : settings.company_name;
    
    // Send email using Resend
    let emailSent = false;
    let emailError = null;
    
    try {
      const { data: emailData, error: emailSendError } = await resend.emails.send({
        from: `${companyName} <notifications@agent-agreement-nexus.com>`,
        to: email,
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
                <p>Hello,</p>
                <p>${inviterName} has invited you to join ${companyName} as a Sales Agent${residualPercent ? ` with a residual percentage of ${residualPercent}%` : ''}.</p>
                <p>To accept this invitation and complete your registration, please click the button below:</p>
                <a href="${inviteLink}" class="button">Accept Invitation</a>
                <p>This invitation link will expire ${expirationDate ? `on ${expirationDate}` : 'in 7 days'}.</p>
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
          
          Hello,
          
          ${inviterName} has invited you to join ${companyName} as a Sales Agent${residualPercent ? ` with a residual percentage of ${residualPercent}%` : ''}.
          
          To accept this invitation and complete your registration, please visit the following link:
          ${inviteLink}
          
          This invitation link will expire ${expirationDate ? `on ${expirationDate}` : 'in 7 days'}.
          
          If you have any questions, please contact your administrator.
          
          This email was sent from an unmonitored address. Please do not reply to this email.
          
          © ${new Date().getFullYear()} ${companyName}. All rights reserved.
        `,
      });
      
      if (emailSendError) {
        throw emailSendError;
      }
      
      emailSent = true;
      console.log(`Invitation email sent to ${email} with ID: ${emailData?.id}`);
    } catch (error) {
      emailError = error;
      console.error("Error sending invitation email:", error);
      
      // Log the email error
      await supabaseClient
        .from("email_errors")
        .insert({
          recipient: email,
          subject: `You've been invited to join ${companyName} as a Sales Agent`,
          error_message: error.message || "Unknown error",
          template_type: "invite",
          attempt_count: 1,
        });
    }
    
    // Log the email attempt regardless of success or failure
    const { error: logError } = await supabaseClient
      .from("email_logs")
      .insert([
        {
          recipient: email,
          subject: `You've been invited to join ${companyName} as a Sales Agent`,
          template: "invitation",
          status: emailSent ? "sent" : "failed",
          error: emailError ? emailError.message : null,
          metadata: {
            inviteLink,
            residualPercent,
            expiresAt: invitation.expires_at,
          },
        },
      ]);

    if (logError) {
      console.error("Error logging email:", logError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Invitation email sent successfully",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
