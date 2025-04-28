import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RATE_LIMIT_WINDOW = 3600 // 1 hour in seconds
const MAX_ATTEMPTS = 5 // Maximum attempts per window

interface RateLimitConfig {
  key: string;        // Unique identifier (e.g., IP address or email)
  window?: number;    // Time window in seconds
  maxAttempts?: number; // Maximum attempts allowed in the window
}

export async function checkRateLimit(config: RateLimitConfig): Promise<boolean> {
  const { key, window = RATE_LIMIT_WINDOW, maxAttempts = MAX_ATTEMPTS } = config
  
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  const now = Math.floor(Date.now() / 1000)
  const windowStart = now - window

  // Clean up old rate limit records
  await supabaseClient
    .from('rate_limits')
    .delete()
    .lt('timestamp', windowStart)

  // Get current attempts
  const { data: attempts } = await supabaseClient
    .from('rate_limits')
    .select('count')
    .eq('key', key)
    .gte('timestamp', windowStart)
    .single()

  const currentAttempts = attempts?.count || 0

  if (currentAttempts >= maxAttempts) {
    return false // Rate limit exceeded
  }

  // Record this attempt
  await supabaseClient
    .from('rate_limits')
    .insert({
      key,
      timestamp: now,
      count: 1
    })

  return true // Within rate limit
}
