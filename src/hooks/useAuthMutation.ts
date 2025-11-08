import { useMutation } from '@tanstack/react-query';
import { authService, LoginRequest } from '@/services/auth.service';

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (data) => {
      // Store tokens
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
    },
    onError: (error: any) => {
      console.error('Login error:', error.response?.data || error.message);
    },
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    },
  });
};
