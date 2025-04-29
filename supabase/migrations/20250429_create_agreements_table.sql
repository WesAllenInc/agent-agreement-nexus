-- Create agreements table
CREATE TABLE IF NOT EXISTS public.agreements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies
ALTER TABLE public.agreements ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own agreements
CREATE POLICY "Users can view their own agreements"
    ON public.agreements FOR SELECT
    USING (auth.uid() = user_id);

-- Allow admins to view all agreements
CREATE POLICY "Admins can view all agreements"
    ON public.agreements FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Add updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.agreements
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

-- Create storage bucket for agreements
INSERT INTO storage.buckets (id, name, public)
VALUES ('agreements', 'agreements', false);

-- Add storage policies for agreements bucket
CREATE POLICY "Users can upload their own agreements"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'agreements'
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can view their own agreements"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'agreements'
        AND (
            auth.role() = 'authenticated'
            AND (storage.foldername(name))[1] = auth.uid()::text
        )
    );

CREATE POLICY "Admins can view all agreements"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'agreements'
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );
