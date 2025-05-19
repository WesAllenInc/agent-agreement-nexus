-- Create agreement_signatures table
CREATE TABLE IF NOT EXISTS public.agreement_signatures (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    agreement_id UUID REFERENCES public.agreements(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    signature_path TEXT NOT NULL,
    signed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies
ALTER TABLE public.agreement_signatures ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own signatures
CREATE POLICY "Users can view their own signatures"
    ON public.agreement_signatures FOR SELECT
    USING (auth.uid() = user_id);

-- Allow users to insert their own signatures
CREATE POLICY "Users can insert their own signatures"
    ON public.agreement_signatures FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow admins to view all signatures
CREATE POLICY "Admins can view all signatures"
    ON public.agreement_signatures FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Add updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.agreement_signatures
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

-- Add storage policy for signatures
CREATE POLICY "Users can upload their own signatures"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'agreements'
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = auth.uid()::text
        AND (storage.foldername(name))[2] = 'signatures'
    );

-- Add index for faster queries
CREATE INDEX idx_agreement_signatures_agreement_id ON public.agreement_signatures(agreement_id);
CREATE INDEX idx_agreement_signatures_user_id ON public.agreement_signatures(user_id);
