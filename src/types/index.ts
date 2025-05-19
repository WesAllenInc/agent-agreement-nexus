
export type UserRole = 'admin' | 'agent' | 'senior_agent';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Invitation {
  id: string;
  email: string;
  token: string;
  expires_at: string;
  created_at: string;
  created_by: string;
  status: 'pending' | 'accepted' | 'expired';
  accepted_at?: string;
  user_id?: string;
  metadata?: Record<string, any>;
}

export interface Agreement {
  id: string;
  user_id: string;
  status: 'draft' | 'submitted' | 'signed';
  created_at: string;
  updated_at: string;
  signed_at?: string;
  signature_data?: string;
  effective_date?: string;
}

export interface PartnerInfo {
  first_name: string;
  middle_name: string;
  last_name: string;
  legal_business_name: string;
  business_type: 'Corp' | 'LLC' | 'Sole Prop' | 'Other';
  tax_id: string;
  ss_number?: string;
  business_address: string;
  business_city: string;
  business_state: string;
  business_zip: string;
  business_phone: string;
  business_fax?: string;
  email: string;
  home_address: string;
  home_city: string;
  home_state: string;
  home_zip: string;
  home_phone: string;
}

export interface BankInfo {
  account_type: 'Checking' | 'Savings';
  bank_name: string;
  account_number: string;
  routing_number: string;
  bank_phone: string;
  bank_contact_name: string;
  check_attachment?: string;
  account_holder_name: string;
}

export interface ScheduleBOffice {
  name: string;
  address: string;
  phone: string;
}

export interface ScheduleBAgent {
  name: string;
  address: string;
  ssn: string;
}

export interface ScheduleB {
  offices?: Record<number, ScheduleBOffice>;
  agents?: Record<number, ScheduleBAgent>;
}

export interface AgreementData {
  partner_info: PartnerInfo;
  bank_info: BankInfo;
  schedule_b?: ScheduleB;
  signature_data?: string;
  signature_date?: string;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'invitation' | 'agreement' | 'signature';
}

export interface DashboardStats {
  totalAgents: number;
  pendingInvitations: number;
  submittedAgreements: number;
  signedAgreements: number;
  recentActivity: TimelineEvent[];
  invitationChartData: ChartData[];
  agreementStatusData: ChartData[];
}
