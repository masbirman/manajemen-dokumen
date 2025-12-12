const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ApiResponse<T> {
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}/api${endpoint}`;

    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    // Don't set Content-Type for FormData
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'An error occurred');
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string) {
    const response = await this.request<{ user: any; token: string }>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(response.token);
    return response;
  }

  async register(name: string, email: string, password: string, password_confirmation: string) {
    const response = await this.request<{ user: any; token: string }>('/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, password_confirmation }),
    });
    this.setToken(response.token);
    return response;
  }

  async logout() {
    await this.request('/logout', { method: 'POST' });
    this.setToken(null);
  }

  async getUser() {
    return this.request<any>('/user');
  }

  // Options (dropdowns)
  async getOptions() {
    return this.request<{
      units: { id: number; name: string; code: string | null }[];
      types: { id: number; name: string; code: string | null }[];
      pptks: { id: number; name: string; nip: string | null; unit_id: number; unit?: { id: number; name: string } }[];
    }>('/options');
  }

  async getPptksByUnit(unitId: number) {
    return this.request<{ id: number; name: string; nip: string | null }[]>(
      `/pptks-by-unit/${unitId}`
    );
  }

  // Records
  async getRecords(params?: { page?: number; per_page?: number; unit_id?: number; type_id?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.unit_id) queryParams.append('unit_id', params.unit_id.toString());
    if (params?.type_id) queryParams.append('type_id', params.type_id.toString());
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.request<PaginatedResponse<any>>(`/records${query}`);
  }

  async createRecord(data: FormData) {
    return this.request<ApiResponse<any>>('/records', {
      method: 'POST',
      body: data,
    });
  }

  async updateRecord(id: number, data: FormData) {
    // Add _method for Laravel method spoofing
    data.append('_method', 'PUT');
    return this.request<ApiResponse<any>>(`/records/${id}`, {
      method: 'POST',
      body: data,
    });
  }

  async deleteRecord(id: number) {
    return this.request<ApiResponse<void>>(`/records/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient();
export default api;
