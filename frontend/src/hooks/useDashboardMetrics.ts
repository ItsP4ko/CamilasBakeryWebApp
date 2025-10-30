import { useQuery } from "@tanstack/react-query";
import { getCantidadTortas } from "../api/tortas";
import {
  getPedidosPendientesHoy,
  getGananciaMensual,
  getPedidosEntregadosMensual,
} from "../api/pedidos";

// 🔹 Hook unificado usando React Query
export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ["dashboardMetrics"], 
    queryFn: async () => {
      const [tortasResult, pedidosResult, gananciaResult, entregadosResult] = await Promise.all([
        getCantidadTortas(),
        getPedidosPendientesHoy(),
        getGananciaMensual(),
        getPedidosEntregadosMensual(),
      ]);

      return {
        tortasCount: tortasResult.toString(),
        pedidosPendientes: pedidosResult.toString(),
        gananciaMensual: gananciaResult.toString(),
        pedidosEntregados: entregadosResult.toString(),
      };
    },
    staleTime: 0, // Siempre refresca cuando se invalida
    gcTime: 5 * 60 * 1000, // Cache por 5 minutos
  });
};
