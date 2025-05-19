-- Add status field to profiles table with default values
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'review'));

-- Add comment to explain the status field
COMMENT ON COLUMN profiles.status IS 'Approval status of the user: pending (default), approved, rejected, or review';

-- Update existing profiles to be approved by default (to avoid breaking existing accounts)
UPDATE profiles SET status = 'approved' WHERE status = 'pending';

-- Create an index for better query performance
CREATE INDEX IF NOT EXISTS profiles_status_idx ON profiles (status);

-- Create a function to set default status on new users
CREATE OR REPLACE FUNCTION set_default_profile_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Set default status to 'pending' for new users
  NEW.status = 'pending';
  
  -- Admins are automatically approved
  IF NEW.role = 'admin' THEN
    NEW.status = 'approved';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to set default status on new profiles
DROP TRIGGER IF EXISTS set_default_profile_status_trigger ON profiles;
CREATE TRIGGER set_default_profile_status_trigger
BEFORE INSERT ON profiles
FOR EACH ROW
EXECUTE FUNCTION set_default_profile_status();
