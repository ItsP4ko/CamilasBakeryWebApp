import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getIngredientes, createIngrediente, updateIngrediente, eliminarIngrediente } from '../api/ingredientes';
import { Ingrediente } from '../types/ingredientes';
import { toast } from 'react-toastify';
import { queryKeys } from '../api/queryKeys';
import { PagedResult } from '../types/pagination';

export function useIngredientes(page: number = 1, pageSize: number = 20) {
  return useQuery<PagedResult<Ingrediente>>({
    queryKey: [...queryKeys.ingredientes.all, 'page', page, pageSize],
    queryFn: () => getIngredientes(page, pageSize),
    staleTime: 0, // Siempre refetch después de invalidación
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
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ingredientes.all });
    }
  });
}

export function useUpdateIngrediente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateIngrediente(id, data),
    onError: () => {
      toast.error('Error al actualizar el ingrediente');
    },
    onSuccess: () => {
      toast.success('Ingrediente actualizado exitosamente');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ingredientes.all });
    }
  });
}

export function useDeleteIngrediente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => eliminarIngrediente(id),
    onError: () => {
      toast.error('Error al eliminar el ingrediente');
    },
    onSuccess: () => {
      toast.success('Ingrediente eliminado exitosamente');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ingredientes.all });
    }
  });
}
