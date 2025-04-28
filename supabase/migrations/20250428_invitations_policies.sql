-- Enable Row Level Security
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Create a function to check if a user is an admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM profiles
        WHERE id = user_id
        AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policy: Admins can view all invitations
CREATE POLICY "admins_view_invitations" ON invitations
    FOR SELECT
    TO authenticated
    USING (is_admin(auth.uid()));

-- Policy: Admins can create invitations
CREATE POLICY "admins_create_invitations" ON invitations
    FOR INSERT
    TO authenticated
    WITH CHECK (is_admin(auth.uid()));

-- Policy: Admins can update invitations
CREATE POLICY "admins_update_invitations" ON invitations
    FOR UPDATE
    TO authenticated
    USING (is_admin(auth.uid()))
    WITH CHECK (is_admin(auth.uid()));

-- Policy: Anyone can validate their own invitation token
CREATE POLICY "validate_own_invitation" ON invitations
    FOR SELECT
    TO authenticated
    USING (
        email = auth.jwt() ->> 'email'
        AND status = 'pending'
        AND expires_at > CURRENT_TIMESTAMP
    );

-- Policy: Users can accept their own invitation
CREATE POLICY "accept_own_invitation" ON invitations
    FOR UPDATE
    TO authenticated
    USING (
        email = auth.jwt() ->> 'email'
        AND status = 'pending'
        AND expires_at > CURRENT_TIMESTAMP
    )
    WITH CHECK (
        email = auth.jwt() ->> 'email'
        AND status = 'accepted'
        AND user_id = auth.uid()
    );

-- Policy: Public can read invitation by token (for validation)
CREATE POLICY "read_invitation_by_token" ON invitations
    FOR SELECT
    TO anon
    USING (
        status = 'pending'
        AND expires_at > CURRENT_TIMESTAMP
    );
