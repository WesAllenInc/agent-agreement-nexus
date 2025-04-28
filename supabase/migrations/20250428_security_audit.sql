-- Create enum for audit event types
CREATE TYPE audit_event_type AS ENUM (
    'invitation_created',
    'invitation_sent',
    'invitation_validated',
    'invitation_accepted',
    'invitation_expired',
    'rate_limit_exceeded',
    'suspicious_activity'
);

-- Create security audit table
CREATE TABLE IF NOT EXISTS security_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type audit_event_type NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    ip_address INET,
    user_agent TEXT,
    event_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for faster querying
CREATE INDEX security_audit_logs_event_type_idx ON security_audit_logs(event_type);
CREATE INDEX security_audit_logs_user_id_idx ON security_audit_logs(user_id);
CREATE INDEX security_audit_logs_created_at_idx ON security_audit_logs(created_at);

-- Enable RLS
ALTER TABLE security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "admins_view_audit_logs" ON security_audit_logs
    FOR SELECT
    TO authenticated
    USING (is_admin(auth.uid()));

-- Service role can create audit logs
CREATE POLICY "service_role_create_audit_logs" ON security_audit_logs
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- Create function to log security events
CREATE OR REPLACE FUNCTION log_security_event(
    event_type audit_event_type,
    user_id UUID DEFAULT NULL,
    ip_address INET DEFAULT NULL,
    user_agent TEXT DEFAULT NULL,
    event_data JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO security_audit_logs (
        event_type,
        user_id,
        ip_address,
        user_agent,
        event_data
    )
    VALUES (
        event_type,
        user_id,
        ip_address,
        user_agent,
        event_data
    )
    RETURNING id INTO log_id;

    -- If it's a suspicious activity, notify admins
    IF event_type = 'suspicious_activity' THEN
        -- You can implement admin notification here
        -- For example, sending an email or creating a notification
        NULL;
    END IF;

    RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
