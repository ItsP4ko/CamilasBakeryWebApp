import { QueryClient } from '@tanstack/react-query';
// ✅ Configuración global optimizada de React Query
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30000, // 30 segundos por defecto
            gcTime: 5 * 60 * 1000, // 5 minutos en memoria
            retry: 1, // Solo 1 reintento en caso de error
            refetchOnWindowFocus: false, // No refetch al cambiar de tab
        },
    },
});
