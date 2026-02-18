import { useQuery } from '@tanstack/react-query';
import { getMedidaDetalle } from '../api/medidaDetalle';
export function useMedidaDetalle(medidaId) {
    return useQuery({
        queryKey: ['medidaDetalle', medidaId],
        queryFn: () => getMedidaDetalle(medidaId),
        enabled: !!medidaId,
    });
}
