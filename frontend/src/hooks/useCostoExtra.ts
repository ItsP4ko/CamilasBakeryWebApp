import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createCostoExtra, getCostosExtra, updateCostoExtra, eliminarCostoExtra } from '../api/costoExtra';
import { CostoExtra } from '../types/costoExtra';
import { toast } from 'react-toastify';

export function useCostoExtra() {
    return useQuery<CostoExtra[]>({
        queryKey: ['costosExtra'],
        queryFn: getCostosExtra,
        staleTime: 60000, // 1 minuto - considera los datos "frescos"
        gcTime: 5 * 60 * 1000, // 5 minutos en memoria
    });
}

export function useCreateCostoExtra() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: createCostoExtra,
      onMutate: async (nuevoCostoExtra) => {
        // Cancela queries en vuelo
        await queryClient.cancelQueries({ queryKey: ['costosExtra'] });
        
        // Snapshot del estado anterior
        const previousCostosExtra = queryClient.getQueryData<CostoExtra[]>(['costosExtra']);
        
        // Optimistic update: Agrega el costo extra inmediatamente con ID temporal
        const tempCostoExtra: CostoExtra = {
          idCostoExtra: -Date.now(), // ID temporal negativo
          nombre: nuevoCostoExtra.Nombre,
          precioUnitario: nuevoCostoExtra.PrecioUnitario,
          nota: nuevoCostoExtra.Nota,
          stock: null,
        };
        
        queryClient.setQueryData<CostoExtra[]>(['costosExtra'], (old = []) => 
          [...old, tempCostoExtra]
        );
        
        return { previousCostosExtra };
      },
      onError: (err, newCostoExtra, context) => {
        // Rollback en caso de error
        if (context?.previousCostosExtra) {
          queryClient.setQueryData(['costosExtra'], context.previousCostosExtra);
        }
        toast.error('Error al crear el costo extra');
      },
      onSuccess: (responseData) => {
        // ✅ Actualiza con los datos reales del servidor SIN hacer refetch
        queryClient.setQueryData<CostoExtra[]>(['costosExtra'], (old = []) => {
          // Reemplaza el item temporal con el real del servidor
          return old.map(item => 
            item.idCostoExtra < 0 ? responseData : item
          ).filter((item, index, self) => 
            // Elimina duplicados en caso de que el servidor ya haya devuelto el item
            index === self.findIndex(t => t.idCostoExtra === item.idCostoExtra)
          );
        });
        toast.success('Costo extra creado exitosamente');
      },
      onSettled: () => {
        // Refresca desde el servidor para confirmar
        queryClient.invalidateQueries({ queryKey: ['costosExtra'] });
      },
    });
  }

export function useUpdateCostoExtra() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateCostoExtra(id, data),
    onMutate: async ({ id, data }) => {
      // Cancela queries en vuelo
      await queryClient.cancelQueries({ queryKey: ['costosExtra'] });
      
      // Snapshot del estado anterior
      const previousCostosExtra = queryClient.getQueryData<CostoExtra[]>(['costosExtra']);
      
      // Optimistic update: Actualiza inmediatamente en la UI
      queryClient.setQueryData<CostoExtra[]>(['costosExtra'], (old = []) =>
        old.map(costoExtra =>
          costoExtra.idCostoExtra === id
            ? { ...costoExtra, ...data }
            : costoExtra
        )
      );
      
      return { previousCostosExtra };
    },
    onError: (err, variables, context) => {
      // Rollback en caso de error
      if (context?.previousCostosExtra) {
        queryClient.setQueryData(['costosExtra'], context.previousCostosExtra);
      }
      toast.error('Error al actualizar el costo extra');
    },
    onSuccess: () => {
      toast.success('Costo extra actualizado exitosamente');
    },
    onSettled: () => {
      // Refresca desde el servidor para confirmar los datos finales
      queryClient.invalidateQueries({ queryKey: ['costosExtra'] });
    },
  });
}

export function useDeleteCostoExtra() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => eliminarCostoExtra(id),
    onMutate: async (id) => {
      // Cancela queries en vuelo
      await queryClient.cancelQueries({ queryKey: ['costosExtra'] });
      
      // Snapshot del estado anterior
      const previousCostosExtra = queryClient.getQueryData<CostoExtra[]>(['costosExtra']);
      
      // Optimistic update: Elimina inmediatamente de la UI
      queryClient.setQueryData<CostoExtra[]>(['costosExtra'], (old = []) =>
        old.filter(costoExtra => costoExtra.idCostoExtra !== id)
      );
      
      return { previousCostosExtra };
    },
    onError: (err, id, context) => {
      // Rollback en caso de error
      if (context?.previousCostosExtra) {
        queryClient.setQueryData(['costosExtra'], context.previousCostosExtra);
      }
      toast.error('Error al eliminar el costo extra');
    },
    onSuccess: () => {
      toast.success('Costo extra eliminado exitosamente');
    },
    onSettled: () => {
      // Refresca desde el servidor para confirmar
      queryClient.invalidateQueries({ queryKey: ['costosExtra'] });
    },
  });
}
