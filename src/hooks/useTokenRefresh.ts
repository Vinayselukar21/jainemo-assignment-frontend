import { useEffect, useRef } from 'react';
import { authService } from '@/services/auth.service';

const TOKEN_REFRESH_INTERVAL = 14 * 60 * 1000; // 14 minutes (before 15 min expiry)

export const useTokenRefresh = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const refreshAccessToken = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (!accessToken || !refreshToken) {
        return;
      }

      try {
        const response = await authService.refreshToken();
        
        if (response.accessToken) {
          localStorage.setItem('accessToken', response.accessToken);
        }
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        // Clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    };

    // Set up automatic token refresh
    const isAuthenticated = !!localStorage.getItem('accessToken');
    if (isAuthenticated) {
      // Refresh immediately on mount if needed
      refreshAccessToken();
      
      // Then set up periodic refresh
      intervalRef.current = setInterval(refreshAccessToken, TOKEN_REFRESH_INTERVAL);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
};
