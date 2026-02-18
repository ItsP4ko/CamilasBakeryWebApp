import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/pedidos';
import { toast } from 'react-toastify';
import { queryKeys } from '../api/queryKeys';
export function usePedidos(pageNumber = 1, pageSize = 100) {
    return useQuery({
        queryKey: queryKeys.pedidos.list({ pageNumber, pageSize }),
        queryFn: () => api.getPedidos(pageNumber, pageSize),
        staleTime: 30000, // Cache por 30 segundos
        gcTime: 5 * 60 * 1000, // Mantener en memoria 5 minutos
    });
}
export function usePedidoCompleto(id) {
    return useQuery({
        queryKey: queryKeys.pedidos.detail(id),
        queryFn: () => api.getPedidoById(id),
        enabled: !!id,
        staleTime: 60000, // Cache por 1 minuto (pedidos completos cambian menos)
        gcTime: 10 * 60 * 1000, // 10 minutos en memoria
    });
}
export function useCrearPedido() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (pedido) => api.crearPedido(pedido),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.pedidos.all });
            toast.success('Pedido creado exitosamente');
        },
        onError: (error) => {
            const errorMessage = error.response?.data?.message || 'Error al crear el pedido';
            toast.error(errorMessage);
        },
    });
}
export function useActualizarPedido() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => api.actualizarPedido(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.pedidos.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.pedidos.detail(variables.id) });
            toast.success('Pedido actualizado exitosamente');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Error al actualizar el pedido');
        },
    });
}
export function useEliminarPedido() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => api.eliminarPedido(id),
        onSuccess: () => {
            // Invalida todas las queries de pedidos
            queryClient.invalidateQueries({ queryKey: queryKeys.pedidos.all });
            toast.success('Pedido eliminado exitosamente');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Error al eliminar el pedido');
        },
    });
}
