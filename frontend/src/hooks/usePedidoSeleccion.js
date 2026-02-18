import { useQuery } from '@tanstack/react-query';
import { getTortasSimple, getMedidasPorTorta } from '../api/pedidoSeleccion';
// Hook para obtener todas las tortas (solo id y nombre)
export function useTortasSimple() {
    return useQuery({
        queryKey: ['tortasSimple'],
        queryFn: getTortasSimple,
    });
}
// Hook para obtener medidas de una torta específica
export function useMedidasPorTorta(idTorta) {
    return useQuery({
        queryKey: ['medidasPorTorta', idTorta],
        queryFn: () => getMedidasPorTorta(idTorta),
        enabled: !!idTorta, // Solo ejecuta si hay un idTorta válido
    });
}
