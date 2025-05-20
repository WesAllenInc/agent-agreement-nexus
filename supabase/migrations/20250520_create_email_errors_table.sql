-- Create email_errors table to track failed email attempts
CREATE TABLE IF NOT EXISTS email_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient TEXT NOT NULL,
    subject TEXT NOT NULL,
    error_message TEXT NOT NULL,
    template_type TEXT NOT NULL,
    attempt_count INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create index for faster lookups
CREATE INDEX email_errors_recipient_idx ON email_errors(recipient);
CREATE INDEX email_errors_template_type_idx ON email_errors(template_type);
CREATE INDEX email_errors_resolved_idx ON email_errors(resolved);

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
