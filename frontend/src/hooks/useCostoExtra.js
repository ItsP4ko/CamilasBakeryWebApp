import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createCostoExtra, getCostosExtra, updateCostoExtra, eliminarCostoExtra } from '../api/costoExtra';
import { toast } from 'react-toastify';
import { queryKeys } from '../api/queryKeys';
export function useCostoExtra(page = 1, pageSize = 20) {
    return useQuery({
        queryKey: ['costosExtra', page, pageSize],
        queryFn: () => getCostosExtra(page, pageSize),
        staleTime: 60000, // 1 minuto
        gcTime: 5 * 60 * 1000, // 5 minutos en memoria
    });
}
export function useCreateCostoExtra() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createCostoExtra,
        onError: (err) => {
            toast.error('Error al crear el costo extra');
        },
        onSuccess: () => {
            toast.success('Costo extra creado exitosamente');
            // Invalidate all queries to refresh the list
            queryClient.invalidateQueries({ queryKey: queryKeys.costosExtras.all });
        },
    });
}
export function useUpdateCostoExtra() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateCostoExtra(id, data),
        onError: () => {
            toast.error('Error al actualizar el costo extra');
        },
        onSuccess: () => {
            toast.success('Costo extra actualizado exitosamente');
            queryClient.invalidateQueries({ queryKey: queryKeys.costosExtras.all });
        },
    });
}
export function useDeleteCostoExtra() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => eliminarCostoExtra(id),
        onError: () => {
            toast.error('Error al eliminar el costo extra');
        },
        onSuccess: () => {
            toast.success('Costo extra eliminado exitosamente');
            queryClient.invalidateQueries({ queryKey: queryKeys.costosExtras.all });
        },
    });
}
