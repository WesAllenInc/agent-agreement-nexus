export type AgreementStatus = 'active' | 'archived' | 'executed';

export interface Agreement {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  status: AgreementStatus;
  created_at: string;
  updated_at: string;
  executed_at?: string;
  executed_by?: string;
  signature_data?: string;
  agent_name?: string;
  agent_email?: string;
}

export interface UploadAgreementParams {
  file: File;
  userId: string;
}

export interface ExecuteAgreementParams {
  agreementId: string;
  agentName: string;
  agentEmail: string;
  signatureData: string;
}
