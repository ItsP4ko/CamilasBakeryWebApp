import { useQuery } from '@tanstack/react-query';
import { getReporteStock } from '../api/reportes';
/**
 * Hook para obtener el reporte de stock de ingredientes y costos extra
 */
export const useReporteStock = (filtros) => {
    return useQuery({
        queryKey: ['reporteStock', filtros],
        queryFn: () => getReporteStock(filtros),
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
};
