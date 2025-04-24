
// Supabase Edge Function: sendInviteEmail

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    const { email } = await req.json();
    
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    
    // Get user info from request
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401 
        }
      );
    }

    // Verify if the user is an admin
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(authHeader);
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401 
        }
      );
    }

    // Check if user has admin role
    const { data: userData, error: roleError } = await supabaseClient
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (roleError || userData?.role !== "admin") {
      return new Response(
        JSON.stringify({ error: "Only admins can send invitations" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 403 
        }
      );
    }

    // Generate a secure token
    const token = crypto.randomUUID();
    
    // Set expiration date (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    // Insert invitation into database
    const { data: invitation, error: invitationError } = await supabaseClient
      .from("invitations")
      .insert({
        email,
        token,
        expires_at: expiresAt.toISOString(),
        created_by: user.id,
        status: "pending",
      })
      .select()
      .single();
      
    if (invitationError) {
      // Handle duplicate email case
      if (invitationError.message?.includes("duplicate")) {
        return new Response(
          JSON.stringify({ error: "An invitation for this email already exists" }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 409 
          }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to create invitation" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500 
        }
      );
    }
    
    // Log the activity
    await supabaseClient
      .from("activity_log")
      .insert({
        title: "Invitation sent",
        description: `Invitation sent to ${email}`,
        user_id: user.id,
        invitation_id: invitation.id,
        type: "invitation",
      });
    
    // Send email with invitation link
    const client = new SmtpClient();
    
    // Connect to SMTP server (use environment variables in production)
    await client.connectTLS({
      hostname: Deno.env.get("SMTP_HOSTNAME") || "smtp.example.com",
      port: Number(Deno.env.get("SMTP_PORT")) || 587,
      username: Deno.env.get("SMTP_USERNAME") || "user@example.com",
      password: Deno.env.get("SMTP_PASSWORD") || "password",
    });
    
    const frontendUrl = Deno.env.get("FRONTEND_URL") || "http://localhost:8080";
    const invitationLink = `${frontendUrl}/accept-invitation?token=${token}&email=${encodeURIComponent(email)}`;
    
    // Send email
    await client.send({
      from: Deno.env.get("SMTP_FROM") || "Ireland Pay <noreply@irelandpay.com>",
      to: email,
      subject: "Invitation to Ireland Pay Sales Agent Portal",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #0284c7;">Ireland Pay Sales Agent Portal</h2>
          <p>You have been invited to join the Ireland Pay Sales Agent Portal.</p>
          <p>Click the button below to create your account and complete your sales agent agreement:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${invitationLink}" style="background-color: #0284c7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Accept Invitation
            </a>
          </div>
          <p>This invitation link will expire in 7 days.</p>
          <p>If you have any questions, please contact support@irelandpay.com.</p>
          <hr style="margin-top: 30px; border: none; border-top: 1px solid #e5e7eb;" />
          <p style="font-size: 12px; color: #6b7280;">
            WLJ Innovations LLC d/b/a Ireland Pay<br />
            5000 SW 75th Ave, Suite 402, Miami, FL 33155
          </p>
        </div>
      `,
    });
    
    await client.close();
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Invitation sent successfully",
        id: invitation.id
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
    
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
