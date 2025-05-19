-- Create training assignments table to track which modules are assigned to which agents
CREATE TABLE IF NOT EXISTS training_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES training_modules(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL CHECK (status IN ('assigned', 'in_progress', 'completed', 'overdue')),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, module_id)
);

-- Add comment to table
COMMENT ON TABLE training_assignments IS 'Tracks training modules assigned to agents';

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS training_assignments_user_id_idx ON training_assignments (user_id);
CREATE INDEX IF NOT EXISTS training_assignments_module_id_idx ON training_assignments (module_id);
CREATE INDEX IF NOT EXISTS training_assignments_status_idx ON training_assignments (status);
CREATE INDEX IF NOT EXISTS training_assignments_due_date_idx ON training_assignments (due_date);

-- Set up Row Level Security (RLS)
ALTER TABLE training_assignments ENABLE ROW LEVEL SECURITY;

-- Create policy for agents to view their own assignments
CREATE POLICY agent_select_own_assignments ON training_assignments
  FOR SELECT USING (
    auth.uid() = user_id
  );

-- Create policy for admins to view all assignments
CREATE POLICY admin_select_all_assignments ON training_assignments
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Create policy for admins to insert assignments
CREATE POLICY admin_insert_assignments ON training_assignments
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Create policy for admins to update assignments
CREATE POLICY admin_update_assignments ON training_assignments
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Create policy for agents to update their own assignments (for marking as completed)
CREATE POLICY agent_update_own_assignments ON training_assignments
  FOR UPDATE USING (
    auth.uid() = user_id
  ) WITH CHECK (
    auth.uid() = user_id AND 
    (NEW.status = 'in_progress' OR NEW.status = 'completed')
  );

-- Create trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_training_assignments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_training_assignments_updated_at
BEFORE UPDATE ON training_assignments
FOR EACH ROW
EXECUTE FUNCTION update_training_assignments_updated_at();
