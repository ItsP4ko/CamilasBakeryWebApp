import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  agregarDetallePedido,
  modificarDetallePedido,
  eliminarDetallePedido,
  agregarExtra,
  modificarExtra,
  eliminarExtra,
  agregarIngredienteExtra,
  modificarIngredienteExtra,
  eliminarIngredienteExtra,
} from '@/api/pedidosControl';

// ============================================
// HOOKS PARA DETALLES DEL PEDIDO
// ============================================

/**
 * Hook para agregar un detalle (producto) al pedido
 */
export const useAgregarDetallePedido = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pedidoId, idMedida, cantidad }: { pedidoId: number; idMedida: number; cantidad: number }) =>
      agregarDetallePedido(pedidoId, { idMedida, cantidad }),
    onMutate: async () => {
      toast.success('Producto agregado');
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pedido', variables.pedidoId] });
    },
    onError: () => {
      toast.error('Error al agregar producto');
    },
  });
};

/**
 * Hook para modificar la cantidad de un detalle
 */
export const useModificarDetallePedido = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ detallePedidoId, cantidad, pedidoId }: { detallePedidoId: number; cantidad: number; pedidoId: number }) =>
      modificarDetallePedido(detallePedidoId, { cantidad }),
    onMutate: async ({ pedidoId }) => {
      await queryClient.cancelQueries({ queryKey: ['pedido', pedidoId] });
      toast.success('Cantidad modificada');
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pedido', variables.pedidoId] });
    },
    onError: () => {
      toast.error('Error al modificar cantidad');
    },
  });
};

/**
 * Hook para eliminar un detalle del pedido
 */
export const useEliminarDetallePedido = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ detallePedidoId, pedidoId }: { detallePedidoId: number; pedidoId: number }) =>
      eliminarDetallePedido(detallePedidoId),
    onMutate: async ({ detallePedidoId, pedidoId }) => {
      await queryClient.cancelQueries({ queryKey: ['pedido', pedidoId] });
      const previousPedido = queryClient.getQueryData(['pedido', pedidoId]);
      
      queryClient.setQueryData(['pedido', pedidoId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          detallePedidos: old.detallePedidos?.filter((d: any) => d.idDetallePedido !== detallePedidoId)
        };
      });
      
      toast.success('Detalle eliminado');
      return { previousPedido };
    },
    onError: (error: any, variables, context: any) => {
      queryClient.setQueryData(['pedido', variables.pedidoId], context.previousPedido);
      toast.error('Error al eliminar detalle');
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pedido', variables.pedidoId] });
    },
  });
};

// ============================================
// HOOKS PARA EXTRAS
// ============================================

/**
 * Hook para agregar un extra a un detalle
 */
export const useAgregarExtra = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      detallePedidoId,
      idCostoExtra,
      cantidad,
      nota,
      pedidoId,
    }: {
      detallePedidoId: number;
      idCostoExtra: number;
      cantidad: number;
      nota?: string;
      pedidoId: number;
    }) => agregarExtra(detallePedidoId, { idCostoExtra, cantidad, nota }),
    onMutate: async () => {
      toast.success('Extra agregado');
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pedido', variables.pedidoId] });
    },
    onError: () => {
      toast.error('Error al agregar extra');
    },
  });
};

/**
 * Hook para modificar un extra
 */
export const useModificarExtra = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      extraId,
      cantidad,
      nota,
      pedidoId,
    }: {
      extraId: number;
      cantidad?: number;
      nota?: string;
      pedidoId: number;
    }) => modificarExtra(extraId, { cantidad, nota }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pedido', variables.pedidoId] });
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      toast.success('Extra modificado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al modificar extra');
    },
  });
};

/**
 * Hook para eliminar un extra
 */
export const useEliminarExtra = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ extraId, pedidoId }: { extraId: number; pedidoId: number }) =>
      eliminarExtra(extraId),
    onMutate: async ({ extraId, pedidoId }) => {
      await queryClient.cancelQueries({ queryKey: ['pedido', pedidoId] });
      const previousPedido = queryClient.getQueryData(['pedido', pedidoId]);
      
      queryClient.setQueryData(['pedido', pedidoId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          detallePedidos: old.detallePedidos?.map((d: any) => ({
            ...d,
            extras: d.extras?.filter((e: any) => e.idExtras !== extraId)
          }))
        };
      });
      
      toast.success('Extra eliminado');
      return { previousPedido };
    },
    onError: (error: any, variables, context: any) => {
      queryClient.setQueryData(['pedido', variables.pedidoId], context.previousPedido);
      toast.error('Error al eliminar extra');
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pedido', variables.pedidoId] });
    },
  });
};

// ============================================
// HOOKS PARA INGREDIENTES EXTRAS
// ============================================

/**
 * Hook para agregar un ingrediente extra a un detalle
 */
export const useAgregarIngredienteExtra = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      detallePedidoId,
      idIngrediente,
      cantidad,
      nota,
      pedidoId,
    }: {
      detallePedidoId: number;
      idIngrediente: number;
      cantidad: number;
      nota?: string;
      pedidoId: number;
    }) => agregarIngredienteExtra(detallePedidoId, { idIngrediente, cantidad, nota }),
    onMutate: async () => {
      toast.success('Ingrediente agregado');
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pedido', variables.pedidoId] });
    },
    onError: () => {
      toast.error('Error al agregar ingrediente');
    },
  });
};

/**
 * Hook para modificar un ingrediente extra
 */
export const useModificarIngredienteExtra = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ingredienteExtraId,
      cantidad,
      nota,
      pedidoId,
    }: {
      ingredienteExtraId: number;
      cantidad?: number;
      nota?: string;
      pedidoId: number;
    }) => modificarIngredienteExtra(ingredienteExtraId, { cantidad, nota }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pedido', variables.pedidoId] });
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      toast.success('Ingrediente extra modificado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al modificar ingrediente extra');
    },
  });
};

/**
 * Hook para eliminar un ingrediente extra
 */
export const useEliminarIngredienteExtra = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ingredienteExtraId, pedidoId }: { ingredienteExtraId: number; pedidoId: number }) =>
      eliminarIngredienteExtra(ingredienteExtraId),
    onMutate: async ({ ingredienteExtraId, pedidoId }) => {
      await queryClient.cancelQueries({ queryKey: ['pedido', pedidoId] });
      const previousPedido = queryClient.getQueryData(['pedido', pedidoId]);
      
      queryClient.setQueryData(['pedido', pedidoId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          detallePedidos: old.detallePedidos?.map((d: any) => ({
            ...d,
            ingredientesExtras: d.ingredientesExtras?.filter((i: any) => i.idIngredienteExtra !== ingredienteExtraId)
          }))
        };
      });
      
      toast.success('Ingrediente eliminado');
      return { previousPedido };
    },
    onError: (error: any, variables, context: any) => {
      queryClient.setQueryData(['pedido', variables.pedidoId], context.previousPedido);
      toast.error('Error al eliminar ingrediente');
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pedido', variables.pedidoId] });
    },
  });
};
