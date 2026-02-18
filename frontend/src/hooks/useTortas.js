import { useQuery } from '@tanstack/react-query';
import { getTortas } from '../api/tortas';
import { queryKeys } from '../api/queryKeys';
export function useTortas() {
    return useQuery({
        queryKey: queryKeys.tortas.all,
        queryFn: getTortas,
    });
}
