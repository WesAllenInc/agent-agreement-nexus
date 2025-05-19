-- Create training_materials table
CREATE TABLE IF NOT EXISTS public.training_materials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    module_type TEXT NOT NULL, -- 'video', 'pdf', 'quiz'
    quiz_link TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_required BOOLEAN NOT NULL DEFAULT true,
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'archived'
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create training_modules table for organizing materials into modules
CREATE TABLE IF NOT EXISTS public.training_modules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'archived'
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create module_materials junction table
CREATE TABLE IF NOT EXISTS public.module_materials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    module_id UUID REFERENCES public.training_modules(id) ON DELETE CASCADE,
    material_id UUID REFERENCES public.training_materials(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(module_id, material_id)
);

-- Create training_completions table
CREATE TABLE IF NOT EXISTS public.training_completions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    material_id UUID REFERENCES public.training_materials(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'started', -- 'started', 'in_progress', 'completed'
    score INTEGER, -- For quizzes
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, material_id)
);

-- Create storage bucket for training materials
INSERT INTO storage.buckets (id, name, public)
VALUES ('training', 'training', false)
ON CONFLICT (id) DO NOTHING;

-- Add RLS policies
ALTER TABLE public.training_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_completions ENABLE ROW LEVEL SECURITY;

-- Policies for training_materials
CREATE POLICY "Admins can manage training materials"
    ON public.training_materials
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "All authenticated users can view active training materials"
    ON public.training_materials FOR SELECT
    USING (
        auth.role() = 'authenticated'
        AND status = 'active'
    );

-- Policies for training_modules
CREATE POLICY "Admins can manage training modules"
    ON public.training_modules
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "All authenticated users can view active training modules"
    ON public.training_modules FOR SELECT
    USING (
        auth.role() = 'authenticated'
        AND status = 'active'
    );

-- Policies for module_materials
CREATE POLICY "Admins can manage module materials"
    ON public.module_materials
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "All authenticated users can view module materials"
    ON public.module_materials FOR SELECT
    USING (
        auth.role() = 'authenticated'
    );

-- Policies for training_completions
CREATE POLICY "Users can view and update their own training completions"
    ON public.training_completions
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all training completions"
    ON public.training_completions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Storage policies for training materials
CREATE POLICY "Admins can upload training materials"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'training'
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "All authenticated users can view training materials"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'training'
        AND auth.role() = 'authenticated'
    );

-- Add updated_at triggers
CREATE TRIGGER set_updated_at_training_materials
    BEFORE UPDATE ON public.training_materials
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at_training_modules
    BEFORE UPDATE ON public.training_modules
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at_training_completions
    BEFORE UPDATE ON public.training_completions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();
