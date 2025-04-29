-- Drop existing RLS policies if they exist
DROP POLICY IF EXISTS "Users can view own agreements" ON agreements;
DROP POLICY IF EXISTS "Users can insert own agreements" ON agreements;
DROP POLICY IF EXISTS "Users can update own agreements" ON agreements;
DROP POLICY IF EXISTS "Users can delete own agreements" ON agreements;

-- Create new RLS policies that check for admin role
CREATE POLICY "Users can view own agreements or admins can view all"
    ON agreements
    FOR SELECT
    USING (
        auth.uid() = user_id
        OR EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND 'admin' = ANY(roles)
        )
    );

CREATE POLICY "Users can insert own agreements"
    ON agreements
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own agreements or admins can update all"
    ON agreements
    FOR UPDATE
    USING (
        auth.uid() = user_id
        OR EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND 'admin' = ANY(roles)
        )
    );

CREATE POLICY "Users can delete own agreements or admins can delete all"
    ON agreements
    FOR DELETE
    USING (
        auth.uid() = user_id
        OR EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND 'admin' = ANY(roles)
        )
    );

-- Update storage policies for agreements bucket
DROP POLICY IF EXISTS "Users can view own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;

CREATE POLICY "Users can view own files or admins can view all"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'agreements'
        AND (
            (storage.foldername(name))[1] = auth.uid()::text
            OR EXISTS (
                SELECT 1 FROM user_roles
                WHERE user_id = auth.uid()
                AND 'admin' = ANY(roles)
            )
        )
    );

CREATE POLICY "Users can upload own files"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'agreements'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can update own files or admins can update all"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'agreements'
        AND (
            (storage.foldername(name))[1] = auth.uid()::text
            OR EXISTS (
                SELECT 1 FROM user_roles
                WHERE user_id = auth.uid()
                AND 'admin' = ANY(roles)
            )
        )
    );

CREATE POLICY "Users can delete own files or admins can delete all"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'agreements'
        AND (
            (storage.foldername(name))[1] = auth.uid()::text
            OR EXISTS (
                SELECT 1 FROM user_roles
                WHERE user_id = auth.uid()
                AND 'admin' = ANY(roles)
            )
        )
    );
