import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants';
import api from '@/api/http';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
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
      } catch (error) {
        setHasCloudflareAuth(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    // Si no hay auth tradicional, verificar Cloudflare
    if (!isAuthenticated) {
      checkCloudflareAuth();
    } else {
      setIsCheckingAuth(false);
      setHasCloudflareAuth(true);
    }
  }, [isAuthenticated]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-primary-600">Verificando autenticación...</div>
      </div>
    );
  }

  if (!isAuthenticated && !hasCloudflareAuth) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
