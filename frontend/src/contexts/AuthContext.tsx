import React, { createContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { authApi, LoginResponse } from '@/api/auth';
import { STORAGE_KEYS } from '@/constants';
import { normalizeBackendResponse } from '@/utils/apiHelpers';

interface AuthContextType {
  user: string | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  loginTraditional: (username: string, password: string) => Promise<boolean>;
  loginWithGoogle: (googleToken: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEYS.USER)
  );
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEYS.TOKEN)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!token;

  const loginTraditional = useCallback(async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.login({ username, password });
      const normalized = normalizeBackendResponse<LoginResponse>(response.data);

      if (normalized.success && normalized.token) {
        const userName = normalized.username || username;

        localStorage.setItem(STORAGE_KEYS.TOKEN, normalized.token);
        localStorage.setItem(STORAGE_KEYS.USER, userName);

        setToken(normalized.token);
        setUser(userName);
        setLoading(false);
        return true;
      } else {
        const errorMsg = normalized.message || 'Error desconocido';
        setError(errorMsg);
        setLoading(false);
        return false;
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.response?.data?.Message || 'Error al iniciar sesión';
      setError(errorMsg);
      setLoading(false);
      return false;
    }
  }, []);

  const loginWithGoogle = useCallback(async (googleToken: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.googleLogin(googleToken);
      const normalized = normalizeBackendResponse<LoginResponse>(response.data);

      if (normalized.success && normalized.token) {
        const userName = normalized.username || '';

        localStorage.setItem(STORAGE_KEYS.TOKEN, normalized.token);
        localStorage.setItem(STORAGE_KEYS.USER, userName);

        setToken(normalized.token);
        setUser(userName);
        setLoading(false);
        return true;
      } else {
        const errorMsg = normalized.message || 'Error desconocido';
        setError(errorMsg);
        setLoading(false);
        return false;
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.response?.data?.Message || 'Error al iniciar sesión con Google';
      setError(errorMsg);
      setLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setToken(null);
    setUser(null);
    globalThis.location.href = '/login';
  }, []);

  const value: AuthContextType = {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    loginTraditional,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
