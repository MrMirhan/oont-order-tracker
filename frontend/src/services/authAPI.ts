import axios from 'axios';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../types/User';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const authAPI = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

authAPI.interceptors.request.use(
  (config) => {
    console.log(`Auth API Request: ${config.method?.toUpperCase()} ${config.url}`);

    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('Auth API Request Error:', error);
    return Promise.reject(error);
  }
);

authAPI.interceptors.response.use(
  (response) => {
    console.log(`Auth API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('Auth API Response Error:', error.response?.data || error.message);

    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      if (window.location.pathname !== '/login') {
        window.location.reload();
      }
    }

    return Promise.reject(error);
  }
);

export const auth = {
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await authAPI.post('/register', userData);

      const normalizedResponse: AuthResponse = {
        success: response.data.success,
        token: response.data.data.token,
        user: response.data.data.user,
        message: response.data.message
      };

      if (normalizedResponse.success && normalizedResponse.token) {
        localStorage.setItem('authToken', normalizedResponse.token);
        localStorage.setItem('authUser', JSON.stringify(normalizedResponse.user));
      }

      return normalizedResponse;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await authAPI.post('/login', credentials);

      const normalizedResponse: AuthResponse = {
        success: response.data.success,
        token: response.data.data.token,
        user: response.data.data.user,
        message: response.data.message
      };

      if (normalizedResponse.success && normalizedResponse.token) {
        localStorage.setItem('authToken', normalizedResponse.token);
        localStorage.setItem('authUser', JSON.stringify(normalizedResponse.user));
      }

      return normalizedResponse;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  logout: async (): Promise<void> => {
    try {
      await authAPI.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    }
  },

  getProfile: async (): Promise<User> => {
    try {
      const response = await authAPI.get('/me');
      return response.data.data;
    } catch (error: any) {
      console.error('Profile fetch error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('authUser');
    return !!(token && user);
  },

  getToken: (): string | null => {
    return localStorage.getItem('authToken');
  },

  getStoredUser: (): User | null => {
    const userStr = localStorage.getItem('authUser');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('authUser');
      }
    }
    return null;
  },

  refreshToken: async (): Promise<string | null> => {
    try {
      const response = await authAPI.post<{ token: string }>('/refresh');
      const newToken = response.data.token;

      if (newToken) {
        localStorage.setItem('authToken', newToken);
        return newToken;
      }

      return null;
    } catch (error) {
      console.error('Token refresh error:', error);
      return null;
    }
  }
};

export default authAPI;