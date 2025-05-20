-- Create ACH info table for agent banking information
CREATE TABLE IF NOT EXISTS ach_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    bank_name TEXT NOT NULL,
    routing_number TEXT NOT NULL,
    account_number TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    -- Add constraints for validation
    CONSTRAINT valid_routing_number CHECK (length(routing_number) = 9 AND routing_number ~ '^[0-9]+$'),
    CONSTRAINT valid_account_number CHECK (length(account_number) BETWEEN 4 AND 17 AND account_number ~ '^[0-9]+$')
);

-- Create index for faster lookups
CREATE INDEX ach_info_user_id_idx ON ach_info(user_id);

-- Create RLS policies for ACH info
ALTER TABLE ach_info ENABLE ROW LEVEL SECURITY;

-- Users can only view their own ACH info
CREATE POLICY "users_can_view_own_ach_info" ON ach_info
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Users can only insert their own ACH info
CREATE POLICY "users_can_insert_own_ach_info" ON ach_info
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Users can only update their own ACH info
CREATE POLICY "users_can_update_own_ach_info" ON ach_info
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Admins can view all ACH info
CREATE POLICY "admins_can_view_all_ach_info" ON ach_info
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Create a function to mask account numbers for display
CREATE OR REPLACE FUNCTION mask_account_number(account_number TEXT)
RETURNS TEXT AS $$
BEGIN
    -- Show only the last 4 digits of the account number
    RETURN CASE
        WHEN length(account_number) <= 4 THEN account_number
        ELSE REPEAT('*', length(account_number) - 4) || RIGHT(account_number, 4)
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a secure view for displaying masked account information
CREATE OR REPLACE VIEW ach_info_masked AS
SELECT
    id,
    user_id,
    bank_name,
    routing_number,
    mask_account_number(account_number) AS masked_account_number,
    created_at,
    updated_at
FROM ach_info;

-- Apply the same RLS policies to the masked view
ALTER VIEW ach_info_masked OWNER TO postgres;
GRANT SELECT ON ach_info_masked TO authenticated;

-- Create RLS policies for the masked view
CREATE POLICY "users_can_view_own_ach_info_masked" ON ach_info_masked
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_ach_info_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ach_info_updated_at
BEFORE UPDATE ON ach_info
FOR EACH ROW
EXECUTE FUNCTION update_ach_info_updated_at();
