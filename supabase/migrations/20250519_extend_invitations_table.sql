-- Extend invitations table with residual_percent field
ALTER TABLE invitations
ADD COLUMN IF NOT EXISTS residual_percent NUMERIC(5, 2) DEFAULT 0.00 CHECK (residual_percent >= 0 AND residual_percent <= 100);

-- Update the token generation to ensure it's cryptographically secure
-- Create a function to generate secure tokens
CREATE OR REPLACE FUNCTION generate_secure_token()
RETURNS TEXT AS $$
DECLARE
    token TEXT;
BEGIN
    -- Generate a secure random token using gen_random_uuid() and encode it to base64
    token := encode(digest(gen_random_uuid()::text || now()::text, 'sha256'), 'base64');
    -- Remove any non-alphanumeric characters and trim to 32 characters
    token := regexp_replace(token, '[^a-zA-Z0-9]', '', 'g');
    RETURN substring(token, 1, 32);
END;
$$ LANGUAGE plpgsql;

-- Create a trigger function to automatically set the token and expires_at if not provided
CREATE OR REPLACE FUNCTION set_invitation_defaults()
RETURNS TRIGGER AS $$
BEGIN
    -- Set token if not provided
    IF NEW.token IS NULL THEN
        NEW.token := generate_secure_token();
    END IF;
    
    -- Set expires_at if not provided (default 7 days)
    IF NEW.expires_at IS NULL THEN
        NEW.expires_at := CURRENT_TIMESTAMP + INTERVAL '7 days';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to set defaults before insert
CREATE TRIGGER set_invitation_defaults_trigger
    BEFORE INSERT ON invitations
    FOR EACH ROW
    EXECUTE FUNCTION set_invitation_defaults();

-- Update the RLS policies to include residual_percent in the WITH CHECK clauses
DROP POLICY IF EXISTS "admins_create_invitations" ON invitations;
CREATE POLICY "admins_create_invitations" ON invitations
    FOR INSERT
    TO authenticated
    WITH CHECK (
        is_admin(auth.uid()) AND
        email IS NOT NULL AND
        residual_percent IS NOT NULL AND
        residual_percent >= 0 AND
        residual_percent <= 100
    );

DROP POLICY IF EXISTS "senior_agents_create_invitations" ON invitations;
CREATE POLICY "senior_agents_create_invitations" ON invitations
    FOR INSERT
    TO authenticated
    WITH CHECK (
        is_senior_agent(auth.uid()) AND
        email IS NOT NULL AND
        residual_percent IS NOT NULL AND
        residual_percent >= 0 AND
        residual_percent <= 100
    );
