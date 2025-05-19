-- Migration to consolidate role management to use user_roles table as the single source of truth
-- This migration updates RLS policies to use user_roles instead of profiles.role

-- First, ensure any existing users have their roles properly migrated
-- This will add any roles from profiles.role to the user_roles table if they don't already exist
INSERT INTO user_roles (user_id, roles)
SELECT 
    p.id as user_id,
    ARRAY[p.role]::text[] as roles
FROM 
    profiles p
WHERE 
    NOT EXISTS (
        SELECT 1 FROM user_roles ur WHERE ur.user_id = p.id
    )
ON CONFLICT (user_id) 
DO UPDATE SET 
    roles = array_append(user_roles.roles, profiles.role)
FROM profiles
WHERE 
    user_roles.user_id = profiles.id 
    AND NOT (profiles.role = ANY(user_roles.roles))
    AND profiles.role IS NOT NULL;

-- Update RLS policies for training tables
DROP POLICY IF EXISTS "Admins can read all training materials" ON training_materials;
CREATE POLICY "Admins can read all training materials"
ON training_materials
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_roles.user_id = auth.uid()
        AND 'admin' = ANY(user_roles.roles)
    )
);

DROP POLICY IF EXISTS "Admins can update training materials" ON training_materials;
CREATE POLICY "Admins can update training materials"
ON training_materials
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_roles.user_id = auth.uid()
        AND 'admin' = ANY(user_roles.roles)
    )
);

DROP POLICY IF EXISTS "Admins can delete training materials" ON training_materials;
CREATE POLICY "Admins can delete training materials"
ON training_materials
FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_roles.user_id = auth.uid()
        AND 'admin' = ANY(user_roles.roles)
    )
);

-- Update RLS policies for agreement signatures
DROP POLICY IF EXISTS "Admins can read all signatures" ON agreement_signatures;
CREATE POLICY "Admins can read all signatures"
ON agreement_signatures
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_roles.user_id = auth.uid()
        AND 'admin' = ANY(user_roles.roles)
    )
);

-- Update RLS policies for agreements
DROP POLICY IF EXISTS "Admins can read all agreements" ON agreements;
CREATE POLICY "Admins can read all agreements"
ON agreements
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_roles.user_id = auth.uid()
        AND 'admin' = ANY(user_roles.roles)
    )
);

-- Update RLS policies for agent access
DROP POLICY IF EXISTS "Agents can read their own agreements" ON agreements;
CREATE POLICY "Agents can read their own agreements"
ON agreements
FOR SELECT
USING (
    user_id = auth.uid() 
    AND EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_roles.user_id = auth.uid()
        AND ('agent' = ANY(user_roles.roles) OR 'senior_agent' = ANY(user_roles.roles))
    )
);

DROP POLICY IF EXISTS "Agents can update their own agreements" ON agreements;
CREATE POLICY "Agents can update their own agreements"
ON agreements
FOR UPDATE
USING (
    user_id = auth.uid() 
    AND EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_roles.user_id = auth.uid()
        AND ('agent' = ANY(user_roles.roles) OR 'senior_agent' = ANY(user_roles.roles))
    )
);

-- Remove the role column from profiles as it's no longer needed
-- First create a backup of the profiles table with the role column
CREATE TABLE IF NOT EXISTS profiles_role_backup AS
SELECT id, role FROM profiles;

-- Then remove the role column from profiles
ALTER TABLE profiles DROP COLUMN IF EXISTS role;

-- Add a comment to document the change
COMMENT ON TABLE user_roles IS 'Stores user roles - this is the single source of truth for role management';
