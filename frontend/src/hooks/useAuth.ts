import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

/**
 * Hook para consumir el contexto de autenticación
 * Provee acceso a user, token, loading, error y funciones de login/logout
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
}
