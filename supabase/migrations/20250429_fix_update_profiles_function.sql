-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS public.update_profiles_updated_at();

-- Recreate the function with explicit search_path
CREATE OR REPLACE FUNCTION public.update_profiles_updated_at()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Ensure the trigger is properly set up
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_profiles_updated_at();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.update_profiles_updated_at() TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_profiles_updated_at() TO service_role;
