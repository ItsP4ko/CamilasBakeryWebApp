import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getIngredientes, createIngrediente, updateIngrediente, eliminarIngrediente } from '../api/ingredientes';
import { toast } from 'react-toastify';
import { queryKeys } from '../api/queryKeys';
export function useIngredientes(page = 1, pageSize = 20) {
    return useQuery({
        queryKey: ['ingredientes', page, pageSize],
        queryFn: () => getIngredientes(page, pageSize),
        staleTime: 60000, // 1 minuto - considera los datos "frescos"
        gcTime: 5 * 60 * 1000, // 5 minutos en memoria
    });
}
export function useCreateIngrediente() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createIngrediente,
        onError: (err) => {
            toast.error('Error al crear el ingrediente');
        },
        onSuccess: () => {
            toast.success('Ingrediente creado exitosamente');
            // Invalidate all ingredients queries to refresh the list
            queryClient.invalidateQueries({ queryKey: queryKeys.ingredientes.all });
        },
    });
}
export function useUpdateIngrediente() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateIngrediente(id, data),
        onError: () => {
            toast.error('Error al actualizar el ingrediente');
        },
        onSuccess: () => {
            toast.success('Ingrediente actualizado exitosamente');
            queryClient.invalidateQueries({ queryKey: queryKeys.ingredientes.all });
        },
    });
}
export function useDeleteIngrediente() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => eliminarIngrediente(id),
        onError: () => {
            toast.error('Error al eliminar el ingrediente');
        },
        onSuccess: () => {
            toast.success('Ingrediente eliminado exitosamente');
            queryClient.invalidateQueries({ queryKey: queryKeys.ingredientes.all });
        },
    });
}
