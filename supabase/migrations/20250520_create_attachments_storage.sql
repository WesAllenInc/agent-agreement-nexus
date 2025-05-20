-- Create storage bucket for agreement attachments
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES ('attachments', 'attachments', false, false, 10485760, ARRAY['application/pdf']::text[])
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security for the storage bucket
ALTER TABLE storage.objects SECURITY LABEL FOR anon TO 'off';
ALTER TABLE storage.objects SECURITY LABEL FOR authenticated TO 'on';
ALTER TABLE storage.objects SECURITY LABEL FOR service_role TO 'on';

-- Create policy to allow users to read their own attachments
CREATE POLICY "Users can read their own agreement attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'attachments' AND
    (storage.foldername(name))[1] IN (
        SELECT id::text
        FROM agreements
        WHERE user_id = auth.uid()
    )
);

-- Create policy to allow users to insert their own attachments
CREATE POLICY "Users can upload their own agreement attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'attachments' AND
    (storage.foldername(name))[1] IN (
        SELECT id::text
        FROM agreements
        WHERE user_id = auth.uid()
    )
);

-- Create policy to allow users to update their own attachments
CREATE POLICY "Users can update their own agreement attachments"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'attachments' AND
    (storage.foldername(name))[1] IN (
        SELECT id::text
        FROM agreements
        WHERE user_id = auth.uid()
    )
);

-- Create policy to allow users to delete their own attachments
CREATE POLICY "Users can delete their own agreement attachments"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'attachments' AND
    (storage.foldername(name))[1] IN (
        SELECT id::text
        FROM agreements
        WHERE user_id = auth.uid()
    )
);

-- Create policy to allow admins to read all attachments
CREATE POLICY "Admins can read all agreement attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'attachments' AND
    EXISTS (
        SELECT 1
        FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Create policy to allow admins to insert attachments
CREATE POLICY "Admins can upload all agreement attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'attachments' AND
    EXISTS (
        SELECT 1
        FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Create policy to allow admins to update attachments
CREATE POLICY "Admins can update all agreement attachments"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'attachments' AND
    EXISTS (
        SELECT 1
        FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Create policy to allow admins to delete attachments
CREATE POLICY "Admins can delete all agreement attachments"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'attachments' AND
    EXISTS (
        SELECT 1
        FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Create policy to allow senior agents to read attachments
CREATE POLICY "Senior agents can read agreement attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'attachments' AND
    EXISTS (
        SELECT 1
        FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'senior_agent'
    )
);
