export type AgreementStatus = 'active' | 'archived';

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
}

export interface UploadAgreementParams {
  file: File;
  userId: string;
}
