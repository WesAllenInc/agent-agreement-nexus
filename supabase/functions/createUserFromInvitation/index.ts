import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { checkRateLimit } from '../_shared/rateLimit.ts'
import { 
  logSecurityEvent, 
  sanitizeInput, 
  validateEmail,
  validatePassword,
  getSecurityHeaders 
} from '../_shared/security.ts'
import { CreateUserFromInvitationResponse } from '../types.ts'

console.log("Hello from createUserFromInvitation!")

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { token, email, password } = await req.json()
    const clientIp = req.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = req.headers.get('user-agent') || 'unknown'

    // Input validation
    if (!token || !email || !password) {
      throw new Error('Token, email, and password are required')
    }

    // Sanitize inputs
    const sanitizedToken = sanitizeInput(token)
    const sanitizedEmail = sanitizeInput(email)

    // Validate email format
    if (!validateEmail(sanitizedEmail)) {
      throw new Error('Invalid email format')
    }

    // Validate password strength
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors[0])
    }

    // Check rate limit
    const isWithinLimit = await checkRateLimit({
      key: `create_user:${clientIp}`,
      window: 3600,
      maxAttempts: 5
    })

    if (!isWithinLimit) {
      await logSecurityEvent('rate_limit_exceeded', {
        ip: clientIp,
        userAgent,
        eventData: { email: sanitizedEmail }
      })
      throw new Error('Too many attempts. Please try again later.')
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify the invitation is valid
    const { data: invitation, error: invitationError } = await supabaseClient
      .from('invitations')
      .select('*')
      .eq('token', sanitizedToken)
      .eq('email', sanitizedEmail)
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())
      .single()

    if (invitationError || !invitation) {
      await logSecurityEvent('invitation_accepted', {
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

    // Create the user account
    const { data: userData, error: createUserError } = await supabaseClient.auth.admin.createUser({
      email: sanitizedEmail,
      password,
      email_confirm: true
    })

    if (createUserError) {
      await logSecurityEvent('invitation_accepted', {
        ip: clientIp,
        userAgent,
        eventData: { 
          email: sanitizedEmail,
          success: false,
          error: createUserError.message
        }
      })
      throw createUserError
    }

    // Create the user profile with role
    const { error: createProfileError } = await supabaseClient
      .from('profiles')
      .insert({
        id: userData.user.id,
        email: userData.user.email,
        role: 'sales_agent',
        first_name: '',
        last_name: '',
        created_at: new Date().toISOString()
      })

    if (createProfileError) {
      // Rollback user creation if profile creation fails
      await supabaseClient.auth.admin.deleteUser(userData.user.id)
      await logSecurityEvent('invitation_accepted', {
        ip: clientIp,
        userAgent,
        eventData: { 
          email: sanitizedEmail,
          success: false,
          error: 'Failed to create user profile'
        }
      })
      throw createProfileError
    }

    // Mark invitation as accepted
    const { error: updateInvitationError } = await supabaseClient
      .from('invitations')
      .update({
        status: 'accepted',
        accepted_at: new Date().toISOString(),
        user_id: userData.user.id
      })
      .eq('id', invitation.id)

    if (updateInvitationError) {
      // Log error but don't fail the request
      console.error('Failed to update invitation:', updateInvitationError)
    }

    // Log successful account creation
    await logSecurityEvent('invitation_accepted', {
      ip: clientIp,
      userAgent,
      userId: userData.user.id,
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
        success: true,
        user: {
          id: userData.user.id,
          email: userData.user.email,
          role: 'sales_agent'
        }
      } as CreateUserFromInvitationResponse),
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
        success: false,
        error: error.message
      } as CreateUserFromInvitationResponse),
      { headers, status: 400 }
    )
  }
})
