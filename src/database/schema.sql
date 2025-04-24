
-- Create tables for the Sales Agent Agreement Portal

-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'sales_agent');
CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'expired');
CREATE TYPE agreement_status AS ENUM ('draft', 'submitted', 'signed');
CREATE TYPE business_type AS ENUM ('Corp', 'LLC', 'Sole Prop', 'Other');
CREATE TYPE account_type AS ENUM ('Checking', 'Savings');

-- Create users table extension
-- Note: This table already exists in Supabase but we're adding a role column
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'sales_agent';

-- Create invitations table
CREATE TABLE IF NOT EXISTS invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  status invitation_status DEFAULT 'pending',
  UNIQUE(email, status)
);

-- Create agreements table
CREATE TABLE IF NOT EXISTS agreements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  status agreement_status DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  signed_at TIMESTAMP WITH TIME ZONE,
  signature_data TEXT,
  effective_date DATE
);

-- Create partner_info table
CREATE TABLE IF NOT EXISTS partner_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agreement_id UUID NOT NULL REFERENCES agreements(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT NOT NULL,
  legal_business_name TEXT NOT NULL,
  business_type business_type NOT NULL,
  tax_id TEXT,
  ss_number TEXT,
  business_address TEXT NOT NULL,
  business_city TEXT NOT NULL,
  business_state TEXT NOT NULL,
  business_zip TEXT NOT NULL,
  business_phone TEXT NOT NULL,
  business_fax TEXT,
  email TEXT NOT NULL,
  home_address TEXT NOT NULL,
  home_city TEXT NOT NULL,
  home_state TEXT NOT NULL,
  home_zip TEXT NOT NULL,
  home_phone TEXT NOT NULL
);

-- Create bank_info table
CREATE TABLE IF NOT EXISTS bank_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agreement_id UUID NOT NULL REFERENCES agreements(id) ON DELETE CASCADE,
  account_type account_type NOT NULL,
  bank_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  routing_number TEXT NOT NULL,
  bank_phone TEXT NOT NULL,
  bank_contact_name TEXT NOT NULL,
  check_attachment TEXT,
  account_holder_name TEXT NOT NULL
);

-- Create activity_log table for the timeline
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  agreement_id UUID REFERENCES agreements(id),
  invitation_id UUID REFERENCES invitations(id),
  type TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create functions for automatic updating of timestamp columns
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating the updated_at column
CREATE TRIGGER update_agreements_updated_at
BEFORE UPDATE ON agreements
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Create RLS policies

-- Enable RLS on all tables
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Invitations policies
CREATE POLICY "Admins can read all invitations"
ON invitations FOR SELECT
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can insert invitations"
ON invitations FOR INSERT
TO authenticated
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can update invitations"
ON invitations FOR UPDATE
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');

-- Agreements policies
CREATE POLICY "Admins can read all agreements"
ON agreements FOR SELECT
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Sales agents can read their own agreements"
ON agreements FOR SELECT
TO authenticated
USING (user_id = auth.uid() AND auth.jwt() ->> 'role' = 'sales_agent');

CREATE POLICY "Sales agents can insert their own agreements"
ON agreements FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid() AND auth.jwt() ->> 'role' = 'sales_agent');

CREATE POLICY "Sales agents can update their own agreements"
ON agreements FOR UPDATE
TO authenticated
USING (user_id = auth.uid() AND auth.jwt() ->> 'role' = 'sales_agent');

-- Partner info policies
CREATE POLICY "Admins can read all partner info"
ON partner_info FOR SELECT
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Sales agents can read their own partner info"
ON partner_info FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM agreements
  WHERE agreements.id = partner_info.agreement_id
  AND agreements.user_id = auth.uid()
  AND auth.jwt() ->> 'role' = 'sales_agent'
));

CREATE POLICY "Sales agents can insert their own partner info"
ON partner_info FOR INSERT
TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM agreements
  WHERE agreements.id = partner_info.agreement_id
  AND agreements.user_id = auth.uid()
  AND auth.jwt() ->> 'role' = 'sales_agent'
));

CREATE POLICY "Sales agents can update their own partner info"
ON partner_info FOR UPDATE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM agreements
  WHERE agreements.id = partner_info.agreement_id
  AND agreements.user_id = auth.uid()
  AND auth.jwt() ->> 'role' = 'sales_agent'
));

-- Bank info policies
CREATE POLICY "Admins can read all bank info"
ON bank_info FOR SELECT
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Sales agents can read their own bank info"
ON bank_info FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM agreements
  WHERE agreements.id = bank_info.agreement_id
  AND agreements.user_id = auth.uid()
  AND auth.jwt() ->> 'role' = 'sales_agent'
));

CREATE POLICY "Sales agents can insert their own bank info"
ON bank_info FOR INSERT
TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM agreements
  WHERE agreements.id = bank_info.agreement_id
  AND agreements.user_id = auth.uid()
  AND auth.jwt() ->> 'role' = 'sales_agent'
));

CREATE POLICY "Sales agents can update their own bank info"
ON bank_info FOR UPDATE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM agreements
  WHERE agreements.id = bank_info.agreement_id
  AND agreements.user_id = auth.uid()
  AND auth.jwt() ->> 'role' = 'sales_agent'
));

-- Activity log policies
CREATE POLICY "Admins can read all activity logs"
ON activity_log FOR SELECT
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Sales agents can read their own activity logs"
ON activity_log FOR SELECT
TO authenticated
USING (
  (user_id = auth.uid() AND auth.jwt() ->> 'role' = 'sales_agent')
  OR
  (agreement_id IN (
    SELECT id FROM agreements
    WHERE user_id = auth.uid()
  ))
);

CREATE POLICY "Allow all authenticated users to insert activity logs"
ON activity_log FOR INSERT
TO authenticated
WITH CHECK (true);
