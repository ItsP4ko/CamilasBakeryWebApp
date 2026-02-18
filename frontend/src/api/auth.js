import api from './http';
import { API_ENDPOINTS, STORAGE_KEYS } from '@/constants';
/**
 * API cliente tipado para endpoints de autenticación
 */
export const authApi = {
    /**
     * Login tradicional con usuario y contraseña
     */
    login: (credentials) => {
        return api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    },
    /**
     * Login con Google OAuth
     */
    googleLogin: (googleToken) => {
        return api.post(API_ENDPOINTS.AUTH.GOOGLE_LOGIN, {
            GoogleToken: googleToken,
        });
    },
};
export const login = async (credentials) => {
    const response = await authApi.login(credentials);
    return response.data;
};
export const logout = async () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
};
