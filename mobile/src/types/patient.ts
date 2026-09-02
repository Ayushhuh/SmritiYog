// Patient types for the mobile app

export interface Patient {
  id: number;
  uid: string;
  full_name: string;
  preferred_name: string;
  date_of_birth: string;
  gender: string;
  preferred_language: string;
  phone_number: string;
  created_at: string;
  updated_at: string;
}

export interface PatientAuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  patient: Patient;
  preferred_language: string;
}
