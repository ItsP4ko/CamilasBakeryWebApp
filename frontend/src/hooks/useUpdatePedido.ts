import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  actualizarEstadoPedido,
  actualizarPedidoEncabezado,
} from "../api/pedidos";
import { PagedResult, PedidoResumen } from "../types/pedidos";

export const useUpdatePedido = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pedido: any) => {
      const id = pedido.idPedido;
      const body: Record<string, any> = {};

      if (pedido._soloEstado) {
        await actualizarEstadoPedido(id, pedido.estado);
        return;
      }

      if (pedido._cambioFecha) {
        let fechaNormalizada = "";

        if (/^\d{2}\/\d{2}\/\d{4}$/.test(pedido.fecha)) {
          const [dd, mm, yyyy] = pedido.fecha.split("/");
          fechaNormalizada = `${yyyy}-${mm}-${dd}`;
        } else {
          fechaNormalizada = pedido.fecha;
        }

        body.Fecha = fechaNormalizada;
      }

      if (pedido._cambioMetodo) body.MetodoDePago = pedido.metodoDePago;
      if (pedido._cambioNota) body.Nota = pedido.nota;
      if (pedido._cambioEstado) body.Estado = pedido.estado;

      if (Object.keys(body).length === 0) return;

      await actualizarPedidoEncabezado(id, body);
    },

    // ✅ Actualización optimista (UI instantánea)
    onMutate: async (pedidoActualizado) => {
      // Cancela cualquier refetch en curso
      await queryClient.cancelQueries({ queryKey: ['pedidos'] });

      // Guarda snapshot del estado anterior para rollback
      const previousQueries = queryClient.getQueriesData({ queryKey: ['pedidos'] });

      // Actualiza la cache optimistamente para todas las páginas
      queryClient.setQueriesData<PagedResult<PedidoResumen>>(
        { queryKey: ['pedidos'] },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            items: oldData.items.map((p) =>
              p.idPedido === pedidoActualizado.idPedido
                ? { 
                    ...p, 
                    fecha: pedidoActualizado.fecha ?? p.fecha,
                    estado: pedidoActualizado.estado ?? p.estado,
                    metodoDePago: pedidoActualizado.metodoDePago ?? p.metodoDePago,
                  }
                : p
            ),
          };
        }
      );

      // Retorna el snapshot para rollback si falla
      return { previousQueries };
    },

    // ❌ Revierte cambios si falla
    onError: (err, pedido, context) => {
      console.error("❌ Error al actualizar pedido:", err);
      
      if (context?.previousQueries) {
        // Restaura el estado anterior
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    // 🔄 Siempre refresca después para sincronizar con el servidor
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardMetrics"] });
    },
  });
};
