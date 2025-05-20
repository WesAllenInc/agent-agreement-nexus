-- Create enum for attachment types
CREATE TYPE attachment_type AS ENUM ('B', 'C');

-- Create agreement_attachments table
CREATE TABLE IF NOT EXISTS agreement_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agreement_id UUID NOT NULL REFERENCES agreements(id) ON DELETE CASCADE,
    type attachment_type NOT NULL,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    content_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by UUID REFERENCES auth.users(id)
);

-- Create index for faster lookups
CREATE INDEX agreement_attachments_agreement_id_idx ON agreement_attachments(agreement_id);
CREATE INDEX agreement_attachments_type_idx ON agreement_attachments(type);

-- Enable Row Level Security
ALTER TABLE agreement_attachments ENABLE ROW LEVEL SECURITY;

-- Create a function to check if a user is associated with an agreement
CREATE OR REPLACE FUNCTION is_agreement_owner(agreement_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM agreements
        WHERE id = agreement_id
        AND user_id = user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if a user is an admin
CREATE OR REPLACE FUNCTION is_admin_user(user_id UUID)
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

-- Create a function to check if a user is a senior agent
CREATE OR REPLACE FUNCTION is_senior_agent_user(user_id UUID)
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

-- Policy: Users can view their own agreement attachments
CREATE POLICY "users_view_own_agreement_attachments" ON agreement_attachments
    FOR SELECT
    TO authenticated
    USING (
        is_agreement_owner(agreement_id, auth.uid())
    );

-- Policy: Users can insert their own agreement attachments
CREATE POLICY "users_insert_own_agreement_attachments" ON agreement_attachments
    FOR INSERT
    TO authenticated
    WITH CHECK (
        is_agreement_owner(agreement_id, auth.uid()) AND
        created_by = auth.uid()
    );

-- Policy: Users can update their own agreement attachments
CREATE POLICY "users_update_own_agreement_attachments" ON agreement_attachments
    FOR UPDATE
    TO authenticated
    USING (
        is_agreement_owner(agreement_id, auth.uid()) AND
        created_by = auth.uid()
    )
    WITH CHECK (
        is_agreement_owner(agreement_id, auth.uid()) AND
        created_by = auth.uid()
    );

-- Policy: Users can delete their own agreement attachments
CREATE POLICY "users_delete_own_agreement_attachments" ON agreement_attachments
    FOR DELETE
    TO authenticated
    USING (
        is_agreement_owner(agreement_id, auth.uid()) AND
        created_by = auth.uid()
    );

-- Policy: Admins can view all agreement attachments
CREATE POLICY "admins_view_all_agreement_attachments" ON agreement_attachments
    FOR SELECT
    TO authenticated
    USING (
        is_admin_user(auth.uid())
    );

-- Policy: Admins can insert agreement attachments
CREATE POLICY "admins_insert_agreement_attachments" ON agreement_attachments
    FOR INSERT
    TO authenticated
    WITH CHECK (
        is_admin_user(auth.uid())
    );

-- Policy: Admins can update agreement attachments
CREATE POLICY "admins_update_agreement_attachments" ON agreement_attachments
    FOR UPDATE
    TO authenticated
    USING (
        is_admin_user(auth.uid())
    )
    WITH CHECK (
        is_admin_user(auth.uid())
    );

-- Policy: Admins can delete agreement attachments
CREATE POLICY "admins_delete_agreement_attachments" ON agreement_attachments
    FOR DELETE
    TO authenticated
    USING (
        is_admin_user(auth.uid())
    );

-- Policy: Senior agents can view agreement attachments
CREATE POLICY "senior_agents_view_agreement_attachments" ON agreement_attachments
    FOR SELECT
    TO authenticated
    USING (
        is_senior_agent_user(auth.uid())
    );

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_agreement_attachments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_agreement_attachments_updated_at
BEFORE UPDATE ON agreement_attachments
FOR EACH ROW
EXECUTE FUNCTION update_agreement_attachments_updated_at();
