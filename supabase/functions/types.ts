export interface ValidateTokenResponse {
  valid: boolean;
  error?: string;
  email?: string;
}

export interface CreateUserFromInvitationResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    role: string;
  };
  error?: string;
}

export interface SendInviteEmailResponse {
  success: boolean;
  message?: string;
  id?: string;
  error?: string;
}

export interface InvitationData {
  id: string;
  email: string;
  token: string;
  expires_at: string;
  created_at: string;
  created_by: string;
  accepted_at?: string;
}
