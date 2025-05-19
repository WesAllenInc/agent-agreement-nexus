-- Add residual_percentage field to invitations table
ALTER TABLE invitations 
ADD COLUMN residual_percentage NUMERIC(5,2) DEFAULT 0.00 CHECK (residual_percentage >= 0 AND residual_percentage <= 100);

-- Update the metadata schema to include residual percentage
COMMENT ON COLUMN invitations.residual_percentage IS 'Preset residual percentage for the agent (0-100)';

-- Create a new view for pending invitations with residual percentage
CREATE OR REPLACE VIEW pending_invites AS
SELECT 
    id,
    email,
    token,
    expires_at,
    created_at,
    created_by,
    residual_percentage,
    metadata
FROM 
    invitations
WHERE 
    status = 'pending'
    AND expires_at > CURRENT_TIMESTAMP;

-- Grant access to the view for authenticated users with management roles
CREATE POLICY "management_view_pending_invites" ON pending_invites
    FOR SELECT
    TO authenticated
    USING (has_management_role(auth.uid()));

-- Update the invitation email template to include residual percentage information
-- This would be implemented in the actual email sending function
-- For now, we're just adding the database structure
