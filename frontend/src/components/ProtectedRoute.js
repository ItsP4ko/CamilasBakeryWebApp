import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants';
import api from '@/api/http';
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [hasCloudflareAuth, setHasCloudflareAuth] = useState(false);
    useEffect(() => {
        const checkCloudflareAuth = async () => {
            try {
                // Intentar hacer una petición simple a la API
                // Si Cloudflare tiene la cookie, dejará pasar
                await api.get('/api/Tortas');
                setHasCloudflareAuth(true);
            }
            catch (error) {
                setHasCloudflareAuth(false);
            }
            finally {
                setIsCheckingAuth(false);
            }
        };
        // Si no hay auth tradicional, verificar Cloudflare
        if (!isAuthenticated) {
            checkCloudflareAuth();
        }
        else {
            setIsCheckingAuth(false);
            setHasCloudflareAuth(true);
        }
    }, [isAuthenticated]);
    if (isCheckingAuth) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("div", { className: "text-primary-600", children: "Verificando autenticaci\u00F3n..." }) }));
    }
    if (!isAuthenticated && !hasCloudflareAuth) {
        return _jsx(Navigate, { to: ROUTES.LOGIN, replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
export default ProtectedRoute;
