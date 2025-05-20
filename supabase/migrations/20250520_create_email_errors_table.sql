-- Create email_errors table to track failed email attempts
CREATE TABLE IF NOT EXISTS email_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient TEXT NOT NULL,
    notification_type TEXT NOT NULL,
    error_message TEXT NOT NULL,
    payload JSONB NOT NULL,
    retry_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_retry_at TIMESTAMP WITH TIME ZONE,
    resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id)
);

-- Create index for faster lookups
CREATE INDEX email_errors_recipient_idx ON email_errors(recipient);
CREATE INDEX email_errors_notification_type_idx ON email_errors(notification_type);
CREATE INDEX email_errors_resolved_idx ON email_errors(resolved);
CREATE INDEX email_errors_created_by_idx ON email_errors(created_by);

-- Enable Row Level Security
ALTER TABLE email_errors ENABLE ROW LEVEL SECURITY;

-- Only admins can view email errors
CREATE POLICY "Admins can view email errors" ON email_errors
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Only admins can insert email errors
CREATE POLICY "Admins can insert email errors" ON email_errors
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Only admins can update email errors
CREATE POLICY "Admins can update email errors" ON email_errors
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Create a function to mark email errors as resolved
CREATE OR REPLACE FUNCTION mark_email_error_resolved(error_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE email_errors
    SET resolved = true,
        resolved_at = now()
    WHERE id = error_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to retry a failed email
CREATE OR REPLACE FUNCTION retry_failed_email(error_id UUID)
RETURNS JSONB AS $$
DECLARE
    error_record email_errors;
    result JSONB;
BEGIN
    -- Get the error record
    SELECT * INTO error_record FROM email_errors WHERE id = error_id;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Email error record not found');
    END IF;
    
    -- Update the retry count and timestamp
    UPDATE email_errors
    SET retry_count = retry_count + 1,
        last_retry_at = now()
    WHERE id = error_id;
    
    -- Return the payload for processing by the application
    RETURN jsonb_build_object(
        'success', true, 
        'payload', error_record.payload, 
        'id', error_record.id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
