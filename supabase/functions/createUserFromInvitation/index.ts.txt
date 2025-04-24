
// Supabase Edge Function: createUserFromInvitation

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const { token, email, password } = await req.json();
    
    if (!token || !email || !password) {
      return new Response(
        JSON.stringify({ error: "Token, email, and password are required" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }
    
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    
    // Verify the invitation
    const { data: invitation, error: invitationError } = await supabaseClient
      .from("invitations")
      .select("*")
      .eq("token", token)
      .eq("email", email)
      .eq("status", "pending")
      .single();
      
    if (invitationError || !invitation) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired invitation" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }
    
    // Check if the invitation has expired
    const expiresAt = new Date(invitation.expires_at);
    const now = new Date();
    
    if (now > expiresAt) {
      // Update the invitation status to expired
      await supabaseClient
        .from("invitations")
        .update({ status: "expired" })
        .eq("id", invitation.id);
        
      return new Response(
        JSON.stringify({ error: "Invitation has expired" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }
    
    // Create the user account
    const { data: userData, error: userError } = await supabaseClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      role: "sales_agent",
    });
    
    if (userError) {
      return new Response(
        JSON.stringify({ error: userError.message }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }
    
    // Update the invitation status to accepted
    await supabaseClient
      .from("invitations")
      .update({ status: "accepted" })
      .eq("id", invitation.id);
      
    // Log the activity
    await supabaseClient
      .from("activity_log")
      .insert({
        title: "Invitation accepted",
        description: `${email} accepted invitation and created account`,
        user_id: userData.user.id,
        invitation_id: invitation.id,
        type: "invitation",
      });
      
    // Create an initial empty agreement for the user
    const { data: agreement, error: agreementError } = await supabaseClient
      .from("agreements")
      .insert({
        user_id: userData.user.id,
        status: "draft",
      })
      .select()
      .single();
      
    if (agreementError) {
      console.error("Failed to create initial agreement:", agreementError);
    } else {
      // Log agreement creation
      await supabaseClient
        .from("activity_log")
        .insert({
          title: "Agreement created",
          description: `Initial agreement created for ${email}`,
          user_id: userData.user.id,
          agreement_id: agreement.id,
          type: "agreement",
        });
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        user: {
          id: userData.user.id,
          email: userData.user.email,
          role: "sales_agent",
        } 
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
