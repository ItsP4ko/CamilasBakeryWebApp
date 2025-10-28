import api from './http';
import { API_ENDPOINTS, STORAGE_KEYS } from '@/constants';

export interface LoginResponse {
  success?: boolean;
  Success?: boolean;
  token?: string;
  Token?: string;
  username?: string;
  Username?: string;
  message?: string;
  Message?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface GoogleLoginPayload {
  GoogleToken: string;
}

/**
 * API cliente tipado para endpoints de autenticación
 */
export const authApi = {
  /**
   * Login tradicional con usuario y contraseña
   */
  login: (credentials: LoginCredentials) => {
    return api.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
  },

  /**
   * Login con Google OAuth
   */
  googleLogin: (googleToken: string) => {
    return api.post<LoginResponse>(API_ENDPOINTS.AUTH.GOOGLE_LOGIN, {
      GoogleToken: googleToken,
    });
  },
};


export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await authApi.login(credentials);
  return response.data;
};


export const logout = async (): Promise<void> => {
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
};