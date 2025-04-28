import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { SendInviteEmailResponse } from '../types.ts'
import { createTransport } from 'https://esm.sh/nodemailer@6.9.1'

console.log("Hello from sendInviteEmail!")

const generateToken = () => {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, adminUserId } = await req.json()

    if (!email || !adminUserId) {
      throw new Error('Email and adminUserId are required')
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check if user already exists
    const { data: existingUser } = await supabaseClient.auth.admin.getUserByEmail(email)
    if (existingUser) {
      throw new Error('A user with this email already exists')
    }

    // Check if there's an active invitation
    const { data: existingInvitation } = await supabaseClient
      .from('invitations')
      .select('*')
      .eq('email', email)
      .is('accepted_at', null)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (existingInvitation) {
      throw new Error('An active invitation already exists for this email')
    }

    // Generate invitation token
    const token = generateToken()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // Expires in 7 days

    // Create invitation record
    const { data: invitation, error: createError } = await supabaseClient
      .from('invitations')
      .insert({
        email,
        token,
        expires_at: expiresAt.toISOString(),
        created_by: adminUserId,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (createError) throw createError

    // Create email transporter
    const transporter = createTransport({
      host: Deno.env.get('SMTP_HOST'),
      port: Number(Deno.env.get('SMTP_PORT')),
      secure: true,
      auth: {
        user: Deno.env.get('SMTP_USER'),
        pass: Deno.env.get('SMTP_PASS')
      }
    })

    // Generate invitation URL
    const inviteUrl = `${Deno.env.get('PUBLIC_APP_URL')}/accept-invitation?token=${token}&email=${encodeURIComponent(email)}`

    // Send invitation email
    await transporter.sendMail({
      from: `"Ireland Pay" <${Deno.env.get('SMTP_FROM')}>`,
      to: email,
      subject: 'Welcome to Ireland Pay - Sales Agent Invitation',
      html: `
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
            <a href="${inviteUrl}"
               style="background-color: #3182ce; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; font-weight: bold;">
              Create Your Account
            </a>
          </div>
          
          <p style="color: #718096; font-size: 0.9em;">
            If the button doesn't work, copy and paste this link into your browser:
            <br>
            <a href="${inviteUrl}" style="color: #3182ce; word-break: break-all;">
              ${inviteUrl}
            </a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          
          <p style="color: #718096; font-size: 0.8em; text-align: center;">
            If you didn't expect this invitation, please ignore this email.
          </p>
        </div>
      `
    })

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Invitation sent successfully',
        id: invitation.id
      } as SendInviteEmailResponse),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      } as SendInviteEmailResponse),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})
