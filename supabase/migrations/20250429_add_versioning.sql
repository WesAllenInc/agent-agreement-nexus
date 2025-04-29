-- Create agreement_versions table
CREATE TABLE agreement_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agreement_id UUID REFERENCES agreements(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    changes_summary TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    UNIQUE(agreement_id, version_number)
);

-- Create agreement_audit_logs table
CREATE TABLE agreement_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agreement_id UUID REFERENCES agreements(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    action_type TEXT NOT NULL,
    action_details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies for agreement_versions
ALTER TABLE agreement_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own agreement versions"
    ON agreement_versions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM agreements
            WHERE agreements.id = agreement_versions.agreement_id
            AND (agreements.user_id = auth.uid()
                OR EXISTS (
                    SELECT 1 FROM user_roles
                    WHERE user_id = auth.uid()
                    AND 'admin' = ANY(roles)
                )
            )
        )
    );

CREATE POLICY "Only admins can create versions"
    ON agreement_versions
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND 'admin' = ANY(roles)
        )
    );

-- Add RLS policies for audit_logs
ALTER TABLE agreement_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view audit logs"
    ON agreement_audit_logs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND 'admin' = ANY(roles)
        )
    );

CREATE POLICY "System can create audit logs"
    ON agreement_audit_logs
    FOR INSERT
    WITH CHECK (true);

-- Create function to automatically create initial version
CREATE OR REPLACE FUNCTION create_initial_version()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO agreement_versions (
        agreement_id,
        version_number,
        file_path,
        file_size,
        created_by,
        changes_summary
    ) VALUES (
        NEW.id,
        1,
        NEW.file_path,
        NEW.file_size,
        auth.uid(),
        'Initial version'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new agreements
CREATE TRIGGER on_agreement_created
    AFTER INSERT ON agreements
    FOR EACH ROW
    EXECUTE FUNCTION create_initial_version();

-- Create function to log audit events
CREATE OR REPLACE FUNCTION log_agreement_audit()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO agreement_audit_logs (
        agreement_id,
        user_id,
        action_type,
        action_details,
        ip_address
    ) VALUES (
        NEW.id,
        auth.uid(),
        TG_OP,
        jsonb_build_object(
            'old_data', to_jsonb(OLD),
            'new_data', to_jsonb(NEW)
        ),
        current_setting('request.headers')::json->>'x-forwarded-for'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for audit logging
CREATE TRIGGER agreement_audit_insert
    AFTER INSERT ON agreements
    FOR EACH ROW
    EXECUTE FUNCTION log_agreement_audit();

CREATE TRIGGER agreement_audit_update
    AFTER UPDATE ON agreements
    FOR EACH ROW
    EXECUTE FUNCTION log_agreement_audit();

CREATE TRIGGER agreement_audit_delete
    AFTER DELETE ON agreements
    FOR EACH ROW
    EXECUTE FUNCTION log_agreement_audit();
