-- Add senior_agent role to the system

-- Update is_admin function to include senior_agent role check
CREATE OR REPLACE FUNCTION is_senior_agent(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM profiles
        WHERE id = user_id
        AND role = 'senior_agent'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update invitations policies to allow senior_agents to view and manage invitations

-- Policy: Senior agents can view all invitations
CREATE POLICY "senior_agents_view_invitations" ON invitations
    FOR SELECT
    TO authenticated
    USING (is_senior_agent(auth.uid()));

-- Policy: Senior agents can create invitations
CREATE POLICY "senior_agents_create_invitations" ON invitations
    FOR INSERT
    TO authenticated
    WITH CHECK (is_senior_agent(auth.uid()));

-- Policy: Senior agents can update invitations
CREATE POLICY "senior_agents_update_invitations" ON invitations
    FOR UPDATE
    TO authenticated
    USING (is_senior_agent(auth.uid()))
    WITH CHECK (is_senior_agent(auth.uid()));

-- Update agreements RLS policies to allow senior agents to view agent agreements
CREATE POLICY "senior_agents_view_agreements" ON agreements
    FOR SELECT
    TO authenticated
    USING (
        -- Senior agents can view agreements for agents they manage
        (is_senior_agent(auth.uid()) AND 
         EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = agreements.user_id
            AND profiles.role = 'agent'
         ))
    );

-- Create a function to check if a user has admin or senior_agent role
CREATE OR REPLACE FUNCTION has_management_role(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM profiles
        WHERE id = user_id
        AND (role = 'admin' OR role = 'senior_agent')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a view to show agent onboarding status for senior agents and admins
CREATE OR REPLACE VIEW agent_onboarding_status AS
SELECT 
    p.id,
    p.email,
    p.first_name,
    p.last_name,
    p.role,
    p.created_at,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM agreements a 
            WHERE a.user_id = p.id AND a.status = 'signed'
        ) THEN true
        ELSE false
    END as has_signed_agreement,
    (
        SELECT COUNT(*) FROM agreements a 
        WHERE a.user_id = p.id
    ) as agreement_count,
    (
        SELECT MAX(a.updated_at) FROM agreements a 
        WHERE a.user_id = p.id
    ) as last_agreement_date
FROM 
    profiles p
WHERE 
    p.role = 'agent';

-- Grant access to the view for authenticated users with management roles
CREATE POLICY "management_view_agent_status" ON agent_onboarding_status
    FOR SELECT
    TO authenticated
    USING (has_management_role(auth.uid()));
