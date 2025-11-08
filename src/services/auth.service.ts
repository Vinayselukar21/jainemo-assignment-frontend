import { apiClient } from '@/lib/api/client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role?: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface LogoutResponse {
  message: string;
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      '/api/auth/login',
      credentials
    );
    return response.data;
  },

  logout: async (): Promise<LogoutResponse> => {
    const response = await apiClient.post<LogoutResponse>('/api/auth/logout');
    return response.data;
  },

  refreshToken: async (): Promise<{ accessToken: string; refreshToken?: string }> => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    const response = await apiClient.post(
      '/api/auth/refresh',
      {},
      {
        headers: {
          'Cookie': `accessToken=${accessToken}; refreshToken=${refreshToken}`
        }
      }
    );
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  },
};
