import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  token: string | null;
  login: (email: string, password: string, role?: string) => Promise<User>;
  register: (name: string | any, email?: string, password?: string, role?: string) => Promise<User>;
  logout: () => void;
  updateUserProfileState: (updatedUser: User) => void;
  fetchCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('hirehub_token'));
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCurrentUser = async () => {
    try {
      const storedToken = localStorage.getItem('hirehub_token');
      if (!storedToken) {
        setUser(null);
        setLoading(false);
        return;
      }
      const response = await api.get('/auth/me');
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (error) {
      console.warn('Failed to fetch user profile:', error);
      setUser(null);
      localStorage.removeItem('hirehub_token');
      localStorage.removeItem('hirehub_refresh_token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string, role?: string): Promise<User> => {
    const response = await api.post('/auth/login', { email, password, role });
    const { user: userData, accessToken, refreshToken } = response.data.data;
    localStorage.setItem('hirehub_token', accessToken);
    localStorage.setItem('hirehub_refresh_token', refreshToken);
    setToken(accessToken);
    setUser(userData);
    return userData;
  };

  const register = async (name: string | any, email?: string, password?: string, role?: string): Promise<User> => {
    const payload = typeof name === 'object' ? name : { name, email, password, role };
    const response = await api.post('/auth/register', payload);
    const { user: userData, accessToken, refreshToken } = response.data.data;
    localStorage.setItem('hirehub_token', accessToken);
    localStorage.setItem('hirehub_refresh_token', refreshToken);
    setToken(accessToken);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('hirehub_token');
    localStorage.removeItem('hirehub_refresh_token');
    setToken(null);
    setUser(null);
  };

  const updateUserProfileState = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        token,
        login,
        register,
        logout,
        updateUserProfileState,
        fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
