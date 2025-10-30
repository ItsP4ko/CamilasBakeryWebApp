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

      // Actualiza la cache optimistamente para todas las queries de pedidos
      queryClient.setQueriesData<PagedResult<PedidoResumen>>(
        { queryKey: ['pedidos'] },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            items: oldData.items.map((p) => {
              if (p.idPedido === pedidoActualizado.idPedido) {
                // Actualiza solo los campos que cambiaron
                return { 
                  ...p,
                  ...(pedidoActualizado.fecha !== undefined && { fecha: pedidoActualizado.fecha }),
                  ...(pedidoActualizado.estado !== undefined && { estado: pedidoActualizado.estado }),
                  ...(pedidoActualizado.metodoDePago !== undefined && { metodoDePago: pedidoActualizado.metodoDePago }),
                  ...(pedidoActualizado.nota !== undefined && { nota: pedidoActualizado.nota }),
                };
              }
              return p;
            }),
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
      
      // Notifica al usuario del error
      console.warn("⚠️ No se pudo actualizar el pedido. Reintentando...");
    },

    // ✅ Éxito: Refetch inmediato del backend
    onSuccess: async () => {
      console.log("✅ Pedido actualizado correctamente");
      
      // Fuerza refetch inmediato desde el backend (ignora cache)
      await queryClient.refetchQueries({ 
        queryKey: ["dashboardMetrics"],
        type: 'active'
      });
      
      // También refresca pedidos
      await queryClient.refetchQueries({ 
        queryKey: ["pedidos"],
        type: 'active'
      });
    },

    // 🔄 No hace nada adicional en settled
    onSettled: () => {
      // El refetch ya se hizo en onSuccess
    },
  });
};
