import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface SecurityContext {
  ip: string;
  userAgent: string;
  userId?: string;
  eventData?: Record<string, any>;
}

export async function logSecurityEvent(
  eventType: string,
  context: SecurityContext
) {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  await supabaseClient.rpc('log_security_event', {
    event_type: eventType,
    user_id: context.userId,
    ip_address: context.ip,
    user_agent: context.userAgent,
    event_data: context.eventData || {}
  })
}

export function sanitizeInput(input: string): string {
  // Remove any potentially dangerous characters
  return input.replace(/[<>]/g, '')
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = []
  
  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export async function detectSuspiciousActivity(
  context: SecurityContext
): Promise<boolean> {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // Check for multiple failed attempts
  const { data: failedAttempts } = await supabaseClient
    .from('security_audit_logs')
    .select('count')
    .eq('ip_address', context.ip)
    .eq('event_type', 'rate_limit_exceeded')
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

  if ((failedAttempts?.[0]?.count || 0) > 10) {
    await logSecurityEvent('suspicious_activity', {
      ...context,
      eventData: {
        reason: 'Multiple rate limit violations',
        ...context.eventData
      }
    })
    return true
  }

  return false
}

export function getSecurityHeaders() {
  return {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline';",
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  }
}
