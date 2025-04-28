-- Create rate limits table
CREATE TABLE IF NOT EXISTS rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL,
    timestamp BIGINT NOT NULL,
    count INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX rate_limits_key_timestamp_idx ON rate_limits(key, timestamp);

-- Enable RLS
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Only the service role can access this table
CREATE POLICY "service_role_only" ON rate_limits
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Create function to clean up old rate limit records
CREATE OR REPLACE FUNCTION cleanup_rate_limits()
RETURNS void AS $$
BEGIN
    -- Delete records older than 24 hours
    DELETE FROM rate_limits
    WHERE timestamp < EXTRACT(EPOCH FROM (now() - INTERVAL '24 hours'));
END;
$$ LANGUAGE plpgsql;

-- Create a cron job to run cleanup every hour
SELECT cron.schedule(
    'cleanup-rate-limits',
    '0 * * * *',
    $$SELECT cleanup_rate_limits();$$
);
