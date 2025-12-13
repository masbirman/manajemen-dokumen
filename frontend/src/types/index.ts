// Base Types
export interface Unit {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface Type {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface Pptk {
  id: number;
  name: string;
  unit_id: number;
  unit?: Unit;
  created_at?: string;
  updated_at?: string;
}

export interface Record {
  id: number;
  unit_id: number;
  type_id: number;
  pptk_id: number;
  nilai: number;
  uraian?: string;
  pdf_path?: string;
  pdf_url?: string;
  created_by?: number;
  created_at: string;
  updated_at: string;
  unit?: Unit;
  type?: Type;
  pptk?: Pptk;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email?: string;
  avatar_url?: string | null;
  unit_id?: number;
  pptk_id?: number;
  roles?: string[];
  permissions?: string[];
}

// API Response Types
export interface OptionsResponse {
  units: Unit[];
  types: Type[];
  pptks: Pptk[];
}

export interface RecordsResponse {
  data: Record[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface StoreRecordRequest {
  unit_id: number;
  type_id: number;
  pptk_id: number;
  nilai: number;
  uraian?: string;
  pdf?: File;
}

export interface ApiError {
  message: string;
  errors?: {
    [key: string]: string[];
  };
}

// Auth Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  user: User;
  roles: string[];
  permissions: string[];
  unit?: Unit;
  pptk?: Pptk;
  token: string;
}

// Scanner Types
export interface ScannedPage {
  id: string;
  imageData: string; // base64
  croppedData?: string; // base64 after cropping
}

export interface ScannerMode {
  type: 'single' | 'multi';
}
