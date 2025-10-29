import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/pedidos';
import * as types from '../types/pedidos';
import { toast } from 'react-toastify';

export function usePedidos(pageNumber: number = 1, pageSize: number = 100) {
    return useQuery<types.PagedResult<types.PedidoResumen>>({
        queryKey: ['pedidos', pageNumber, pageSize],
        queryFn: () => api.getPedidos(pageNumber, pageSize),
        staleTime: 30000, // Cache por 30 segundos
        gcTime: 5 * 60 * 1000, // Mantener en memoria 5 minutos
    });
}

export function usePedidoCompleto(id: number) {
    return useQuery<types.Pedido>({
      queryKey: ['pedido', id],
      queryFn: () => api.getPedidoById(id),
      enabled: !!id,
      staleTime: 60000, // Cache por 1 minuto (pedidos completos cambian menos)
      gcTime: 10 * 60 * 1000, // 10 minutos en memoria
    });
}

export function useCrearPedido() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pedido: types.CrearPedidoDTO) => api.crearPedido(pedido),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      toast.success('Pedido creado exitosamente');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Error al crear el pedido';
      toast.error(errorMessage);
    },
  });
}

export function useActualizarPedido() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: types.ActualizarPedidoDTO }) => 
      api.actualizarPedido(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      queryClient.invalidateQueries({ queryKey: ['pedido', variables.id] });
      toast.success('Pedido actualizado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al actualizar el pedido');
    },
  });
}

export function useEliminarPedido() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.eliminarPedido(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      toast.success('Pedido eliminado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al eliminar el pedido');
    },
  });
}