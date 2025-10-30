import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getIngredientes, createIngrediente, updateIngrediente, eliminarIngrediente } from '../api/ingredientes';
import { Ingrediente } from '../types/ingredientes';
import { toast } from 'react-toastify';

export function useIngredientes() {
    return useQuery<Ingrediente[]>({
        queryKey: ['ingredientes'],
        queryFn: getIngredientes,
        staleTime: 60000, // 1 minuto - considera los datos "frescos"
        gcTime: 5 * 60 * 1000, // 5 minutos en memoria
    });
}

export function useCreateIngrediente() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: createIngrediente,
      onMutate: async (nuevoIngrediente) => {
        // Cancela queries en vuelo
        await queryClient.cancelQueries({ queryKey: ['ingredientes'] });
        
        // Snapshot del estado anterior
        const previousIngredientes = queryClient.getQueryData<Ingrediente[]>(['ingredientes']);
        
        // Optimistic update: Agrega el ingrediente inmediatamente con ID temporal
        const tempIngrediente: Ingrediente = {
          idIngrediente: -Date.now(), // ID temporal negativo
          nombre: nuevoIngrediente.Nombre,
          unidadCompra: nuevoIngrediente.UnidadCompra,
          precioUnitario: nuevoIngrediente.PrecioUnitario,
          stock: 0,
        };
        
        queryClient.setQueryData<Ingrediente[]>(['ingredientes'], (old = []) => 
          [...old, tempIngrediente]
        );
        
        return { previousIngredientes };
      },
      onError: (err, newIngrediente, context) => {
        // Rollback en caso de error
        if (context?.previousIngredientes) {
          queryClient.setQueryData(['ingredientes'], context.previousIngredientes);
        }
        toast.error('Error al crear el ingrediente');
      },
      onSuccess: (responseData) => {
        // ✅ Actualiza con los datos reales del servidor SIN hacer refetch
        queryClient.setQueryData<Ingrediente[]>(['ingredientes'], (old = []) => {
          // Reemplaza el item temporal con el real del servidor
          return old.map(item => 
            item.idIngrediente < 0 ? responseData : item
          ).filter((item, index, self) => 
            // Elimina duplicados en caso de que el servidor ya haya devuelto el item
            index === self.findIndex(t => t.idIngrediente === item.idIngrediente)
          );
        });
        toast.success('Ingrediente creado exitosamente');
      },
      onSettled: () => {
        // Refresca desde el servidor para confirmar
        queryClient.invalidateQueries({ queryKey: ['ingredientes'] });
      },
    });
  }

export function useUpdateIngrediente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateIngrediente(id, data),
    onMutate: async ({ id, data }) => {
      // Cancela queries en vuelo
      await queryClient.cancelQueries({ queryKey: ['ingredientes'] });
      
      // Snapshot del estado anterior
      const previousIngredientes = queryClient.getQueryData<Ingrediente[]>(['ingredientes']);
      
      // Optimistic update: Actualiza inmediatamente en la UI
      queryClient.setQueryData<Ingrediente[]>(['ingredientes'], (old = []) =>
        old.map(ingrediente =>
          ingrediente.idIngrediente === id
            ? { ...ingrediente, ...data }
            : ingrediente
        )
      );
      
      return { previousIngredientes };
    },
    onError: (err, variables, context) => {
      // Rollback en caso de error
      if (context?.previousIngredientes) {
        queryClient.setQueryData(['ingredientes'], context.previousIngredientes);
      }
      toast.error('Error al actualizar el ingrediente');
    },
    onSuccess: () => {
      toast.success('Ingrediente actualizado exitosamente');
    },
    onSettled: () => {
      // Refresca desde el servidor para confirmar los datos finales
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] });
    },
  });
}

export function useDeleteIngrediente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => eliminarIngrediente(id),
    onMutate: async (id) => {
      // Cancela queries en vuelo
      await queryClient.cancelQueries({ queryKey: ['ingredientes'] });
      
      // Snapshot del estado anterior
      const previousIngredientes = queryClient.getQueryData<Ingrediente[]>(['ingredientes']);
      
      // Optimistic update: Elimina inmediatamente de la UI
      queryClient.setQueryData<Ingrediente[]>(['ingredientes'], (old = []) =>
        old.filter(ingrediente => ingrediente.idIngrediente !== id)
      );
      
      return { previousIngredientes };
    },
    onError: (err, id, context) => {
      // Rollback en caso de error
      if (context?.previousIngredientes) {
        queryClient.setQueryData(['ingredientes'], context.previousIngredientes);
      }
      toast.error('Error al eliminar el ingrediente');
    },
    onSuccess: () => {
      toast.success('Ingrediente eliminado exitosamente');
    },
    onSettled: () => {
      // Refresca desde el servidor para confirmar
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] });
    },
  });
}
