import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { checkRateLimit } from '../_shared/rateLimit.ts'
import { 
  logSecurityEvent, 
  sanitizeInput, 
  validateEmail, 
  getSecurityHeaders 
} from '../_shared/security.ts'
import { ValidateTokenResponse } from '../types.ts'

console.log("Hello from validateToken!")

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { token, email } = await req.json()
    const clientIp = req.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = req.headers.get('user-agent') || 'unknown'

    // Input validation
    if (!token || !email) {
      throw new Error('Token and email are required')
    }

    // Sanitize inputs
    const sanitizedToken = sanitizeInput(token)
    const sanitizedEmail = sanitizeInput(email)

    // Validate email format
    if (!validateEmail(sanitizedEmail)) {
      throw new Error('Invalid email format')
    }

    // Check rate limit
    const isWithinLimit = await checkRateLimit({
      key: `validate_token:${clientIp}`,
      window: 3600,
      maxAttempts: 10
    })

    if (!isWithinLimit) {
      await logSecurityEvent('rate_limit_exceeded', {
        ip: clientIp,
        userAgent,
        eventData: { email: sanitizedEmail }
      })
      throw new Error('Too many validation attempts. Please try again later.')
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check if invitation exists and is valid
    const { data: invitation, error: invitationError } = await supabaseClient
      .from('invitations')
      .select('*')
      .eq('token', sanitizedToken)
      .eq('email', sanitizedEmail)
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())
      .single()

    if (invitationError || !invitation) {
      await logSecurityEvent('invitation_validated', {
        ip: clientIp,
        userAgent,
        eventData: { 
          email: sanitizedEmail,
          success: false,
          error: invitationError?.message || 'Invalid or expired invitation'
        }
      })
      throw new Error('This invitation link has expired or is invalid')
    }

    // Log successful validation
    await logSecurityEvent('invitation_validated', {
      ip: clientIp,
      userAgent,
      eventData: { 
        email: sanitizedEmail,
        success: true,
        invitationId: invitation.id
      }
    })

    const headers = {
      ...corsHeaders,
      ...getSecurityHeaders(),
      'Content-Type': 'application/json'
    }

    return new Response(
      JSON.stringify({
        valid: true,
        email: sanitizedEmail
      } as ValidateTokenResponse),
      { headers, status: 200 }
    )

  } catch (error) {
    const headers = {
      ...corsHeaders,
      ...getSecurityHeaders(),
      'Content-Type': 'application/json'
    }

    return new Response(
      JSON.stringify({
        valid: false,
        error: error.message
      } as ValidateTokenResponse),
      { headers, status: 400 }
    )
  }
})
