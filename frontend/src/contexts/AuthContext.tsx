import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginRequest, RegisterRequest, AuthContextType } from '../types/User';
import { auth } from '../services/authAPI';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = auth.getToken();
        const storedUser = auth.getStoredUser();

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);
          
          try {
            const currentUser = await auth.getProfile();
            setUser(currentUser);
            localStorage.setItem('authUser', JSON.stringify(currentUser));
          } catch (error) {
            console.error('Token validation failed:', error);
            await handleLogout();
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        await handleLogout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleLogin = async (credentials: LoginRequest): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await auth.login(credentials);
      
      if (response.success) {
        setToken(response.token);
        setUser(response.user);
        console.log('Login successful:', response.user.email);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (userData: RegisterRequest): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await auth.register(userData);
      
      if (response.success) {
        setToken(response.token);
        setUser(response.user);
        console.log('Registration successful:', response.user.email);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
      console.log('User logged out');
    }
  };

  const isAuthenticated = !!token && !!user;

  const contextValue: AuthContextType = {
    user,
    token,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    isAuthenticated,
    isLoading
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;