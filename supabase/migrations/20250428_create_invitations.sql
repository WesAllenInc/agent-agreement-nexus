-- Create enum for invitation status
CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'expired');

-- Create invitations table
CREATE TABLE IF NOT EXISTS invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    status invitation_status DEFAULT 'pending',
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by UUID NOT NULL REFERENCES auth.users(id),
    accepted_at TIMESTAMP WITH TIME ZONE,
    user_id UUID REFERENCES auth.users(id),
    metadata JSONB DEFAULT '{}'::jsonb,

    -- Add constraints
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT future_expiry CHECK (expires_at > created_at),
    CONSTRAINT valid_acceptance CHECK (
        (status = 'accepted' AND accepted_at IS NOT NULL AND user_id IS NOT NULL) OR
        (status != 'accepted' AND accepted_at IS NULL AND user_id IS NULL)
    )
);

-- Create index for faster lookups
CREATE INDEX invitations_email_idx ON invitations(email);
CREATE INDEX invitations_token_idx ON invitations(token);
CREATE INDEX invitations_status_idx ON invitations(status);

-- Create function to automatically expire invitations
CREATE OR REPLACE FUNCTION check_invitation_expiry()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.expires_at <= CURRENT_TIMESTAMP AND NEW.status = 'pending' THEN
        NEW.status := 'expired';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update status when expired
CREATE TRIGGER check_expiry
    BEFORE INSERT OR UPDATE ON invitations
    FOR EACH ROW
    EXECUTE FUNCTION check_invitation_expiry();

-- Create function to clean up old expired invitations
CREATE OR REPLACE FUNCTION cleanup_expired_invitations()
RETURNS void AS $$
BEGIN
    -- Delete expired invitations older than 30 days
    DELETE FROM invitations
    WHERE status = 'expired'
    AND created_at < CURRENT_TIMESTAMP - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Create a cron job to run cleanup every day at midnight
SELECT cron.schedule(
    'cleanup-expired-invitations',
    '0 0 * * *',
    $$SELECT cleanup_expired_invitations();$$
);
