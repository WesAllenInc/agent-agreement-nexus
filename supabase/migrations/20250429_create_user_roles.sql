-- Create user_roles table
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    roles TEXT[] DEFAULT ARRAY['user'],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Add RLS policies
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own roles
CREATE POLICY "Users can read their own roles"
    ON user_roles
    FOR SELECT
    USING (auth.uid() = user_id);

-- Allow admins to read all roles
CREATE POLICY "Admins can read all roles"
    ON user_roles
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid()
        AND 'admin' = ANY(roles)
    ));

-- Allow admins to update roles
CREATE POLICY "Admins can update roles"
    ON user_roles
    FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid()
        AND 'admin' = ANY(roles)
    ));

-- Create function to automatically create user_roles on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_roles (user_id, roles)
    VALUES (NEW.id, ARRAY['user']);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();
