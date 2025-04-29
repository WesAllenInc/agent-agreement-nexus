import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { checkRateLimit } from '../_shared/rateLimit.ts';
import { logSecurityEvent, validateEmail } from '../_shared/security.ts';
import { ValidateTokenResponse } from '../types.ts';

console.log("Debug: validateToken function started");

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    console.log("Debug: Handling CORS preflight request");
    return new Response('ok', { 
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/plain'
      }
    });
  }

  try {
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    console.log("Debug: Processing request");
    const { token, email } = await req.json();
    const clientIp = req.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    console.log("Debug: Received parameters:", { token, email, clientIp });

    // Input validation
    if (!token || !email) {
      console.log("Debug: Missing required parameters");
      throw new Error('Token and email are required');
    }

    // Validate email format
    if (!validateEmail(email)) {
      console.log("Debug: Invalid email format:", email);
      throw new Error('Invalid email format');
    }

    // Check rate limit
    const isWithinLimit = await checkRateLimit({
      key: `validate_token:${clientIp}`,
      window: 3600,
      maxAttempts: 10
    });

    if (!isWithinLimit) {
      console.log("Debug: Rate limit exceeded for IP:", clientIp);
      await logSecurityEvent('rate_limit_exceeded', {
        ip: clientIp,
        userAgent,
        eventData: { email }
      });
      throw new Error('Too many attempts. Please try again later.');
    }

    console.log("Debug: Rate limit check passed");

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log("Debug: Checking invitation in database");

    // Check if invitation exists and is valid
    const { data: invitation, error: invitationError } = await supabaseClient
      .from('invitations')
      .select('*')
      .eq('token', token)
      .eq('email', email)
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())
      .single();

    console.log("Debug: Database response:", { invitation, error: invitationError });

    if (invitationError || !invitation) {
      console.log("Debug: Invalid or expired invitation");
      await logSecurityEvent('invalid_invitation_attempt', {
        ip: clientIp,
        userAgent,
        eventData: { 
          email,
          error: invitationError?.message || 'Invalid or expired invitation'
        }
      });
      throw new Error('This invitation link has expired or is invalid');
    }

    // Log successful validation
    await logSecurityEvent('invitation_validated', {
      ip: clientIp,
      userAgent,
      eventData: { 
        email,
        invitationId: invitation.id
      }
    });

    console.log("Debug: Invitation validated successfully");

    return new Response(
      JSON.stringify({
        valid: true,
        invitation: {
          id: invitation.id,
          email: invitation.email,
          expiresAt: invitation.expires_at
        }
      } as ValidateTokenResponse),
      {
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200
      }
    );

  } catch (error) {
    console.error("Debug: Error in validateToken:", error);
    return new Response(
      JSON.stringify({
        valid: false,
        error: error.message
      } as ValidateTokenResponse),
      {
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400
      }
    );
  }
});
