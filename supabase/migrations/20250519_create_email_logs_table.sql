-- Create email logs table for tracking email notifications
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_type TEXT NOT NULL,
  recipient TEXT NOT NULL,
  status TEXT NOT NULL,
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add comment to table
COMMENT ON TABLE email_logs IS 'Logs of all email notifications sent through the system';

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS email_logs_notification_type_idx ON email_logs (notification_type);
CREATE INDEX IF NOT EXISTS email_logs_recipient_idx ON email_logs (recipient);
CREATE INDEX IF NOT EXISTS email_logs_status_idx ON email_logs (status);
CREATE INDEX IF NOT EXISTS email_logs_sent_at_idx ON email_logs (sent_at);

-- Set up Row Level Security (RLS)
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view all logs
CREATE POLICY admin_select_email_logs ON email_logs
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Create policy for admins to insert logs
CREATE POLICY admin_insert_email_logs ON email_logs
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Allow service role to manage logs (for edge functions)
CREATE POLICY service_role_email_logs ON email_logs
  USING (auth.jwt() ->> 'role' = 'service_role');
