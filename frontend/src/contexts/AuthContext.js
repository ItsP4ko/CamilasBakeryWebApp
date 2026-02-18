import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useState, useCallback } from 'react';
import { authApi } from '@/api/auth';
import { STORAGE_KEYS } from '@/constants';
import { normalizeBackendResponse } from '@/utils/apiHelpers';
export const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => localStorage.getItem(STORAGE_KEYS.USER));
    const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEYS.TOKEN));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const isAuthenticated = !!token;
    const loginTraditional = useCallback(async (username, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authApi.login({ username, password });
            const normalized = normalizeBackendResponse(response.data);
            if (normalized.success && normalized.token) {
                const userName = normalized.username || username;
                localStorage.setItem(STORAGE_KEYS.TOKEN, normalized.token);
                localStorage.setItem(STORAGE_KEYS.USER, userName);
                setToken(normalized.token);
                setUser(userName);
                setLoading(false);
                return true;
            }
            else {
                const errorMsg = normalized.message || 'Error desconocido';
                setError(errorMsg);
                setLoading(false);
                return false;
            }
        }
        catch (err) {
            const errorMsg = err.response?.data?.message || err.response?.data?.Message || 'Error al iniciar sesión';
            setError(errorMsg);
            setLoading(false);
            return false;
        }
    }, []);
    const loginWithGoogle = useCallback(async (googleToken) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authApi.googleLogin(googleToken);
            const normalized = normalizeBackendResponse(response.data);
            if (normalized.success && normalized.token) {
                const userName = normalized.username || '';
                localStorage.setItem(STORAGE_KEYS.TOKEN, normalized.token);
                localStorage.setItem(STORAGE_KEYS.USER, userName);
                setToken(normalized.token);
                setUser(userName);
                setLoading(false);
                return true;
            }
            else {
                const errorMsg = normalized.message || 'Error desconocido';
                setError(errorMsg);
                setLoading(false);
                return false;
            }
        }
        catch (err) {
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
    const value = {
        user,
        token,
        loading,
        error,
        isAuthenticated,
        loginTraditional,
        loginWithGoogle,
        logout,
    };
    return _jsx(AuthContext.Provider, { value: value, children: children });
};
