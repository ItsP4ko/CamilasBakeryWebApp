import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Edit2, Trash2, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { getTortas, createMedida, updateMedida, deleteMedida } from '@/api/tortas';
import PopupConfirm from '@/components/general/PopupConfirm';
import { Torta, Medida } from '@/types/tortas';

const GestionMedidas: React.FC = () => {
  const { tortaId } = useParams<{ tortaId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [medidaSeleccionada, setMedidaSeleccionada] = useState<Medida | null>(null);

  // Query para obtener la torta
  const { data: tortas, isLoading } = useQuery<Torta[]>({
    queryKey: ['tortas'],
    queryFn: getTortas,
  });

  const torta = tortas?.find(t => t.IdTorta === parseInt(tortaId || '0'));

  // Mutations
  const createMutation = useMutation({
    mutationFn: (tamano: string) => createMedida(parseInt(tortaId || '0'), tamano),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tortas'] });
      toast.success('Medida creada exitosamente');
      setShowCreateModal(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al crear la medida');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, tamano }: { id: number; tamano: string }) => updateMedida(id, tamano),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tortas'] });
      toast.success('Medida actualizada exitosamente');
      setShowEditModal(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al actualizar la medida');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteMedida(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tortas'] });
      toast.success('Medida eliminada exitosamente');
      setShowDeleteModal(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al eliminar la medida');
    },
  });

  const handleCreate = (values: { tamano: string }) => {
    createMutation.mutate(values.tamano);
  };

  const handleEdit = (values: { tamano: string }) => {
    if (medidaSeleccionada) {
      updateMutation.mutate({ id: medidaSeleccionada.IdMedida, tamano: values.tamano });
    }
  };

  const handleDelete = () => {
    if (medidaSeleccionada) {
      deleteMutation.mutate(medidaSeleccionada.IdMedida);
      setMedidaSeleccionada(null);
    }
  };

  const handleModificarContenido = (medidaId: number) => {
    navigate(`/tortas/${tortaId}/medidas/${medidaId}`);
  };

  if (isLoading) {
    return <div className="text-center py-10 text-gray-600 dark:text-gray-400">Cargando...</div>;
  }

  if (!torta) {
    return <div className="text-center py-10 text-gray-600 dark:text-gray-400">Torta no encontrada</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-10 px-4 sm:px-6">
      {/* Header con botón de volver */}
      <div className="mb-6 sm:mb-8">
        <button
          onClick={() => navigate('/tortas')}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 mb-3 sm:mb-4 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          Volver a Tortas
        </button>
        
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">
          Gestión de Medidas - {torta.Nombre}
        </h1>
      </div>

      {/* Botón de agregar medida */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6"
      >
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 sm:py-2 text-sm sm:text-base bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          Nueva Medida
        </button>
      </motion.div>

      {/* Lista de medidas */}
      {torta.Medidas.length === 0 ? (
        <div className="text-center py-10 text-sm sm:text-base text-gray-500 dark:text-gray-400">
          No hay medidas disponibles para esta torta
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {torta.Medidas.map((medida) => (
            <motion.div
              key={medida.IdMedida}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-700 rounded-xl border-2 border-gray-200 dark:border-gray-600 p-4 sm:p-5 hover:shadow-lg transition-all"
            >
              <div className="mb-3 sm:mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  Medida: {medida.Tamano}
                </h3>
                <div className="border-t border-gray-200 dark:border-gray-600 pt-2 sm:pt-3 mt-2 sm:mt-3 space-y-1">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Costo Total:</span> ${medida.CostoTotal.toFixed(2)}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Precio Venta:</span> ${medida.PrecioVenta.toFixed(2)}
                  </p>
                  <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium">
                    <span>Ganancia:</span> ${medida.Ganancia.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => {
                    setMedidaSeleccionada(medida);
                    setShowEditModal(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500 text-xs sm:text-sm"
                >
                  <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  Editar
                </button>
                
                <button
                  onClick={() => {
                    setMedidaSeleccionada(medida);
                    setShowDeleteModal(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50 text-xs sm:text-sm"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  Eliminar
                </button>
                
                <button
                  onClick={() => handleModificarContenido(medida.IdMedida)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded hover:bg-green-200 dark:hover:bg-green-900/50 text-xs sm:text-sm"
                >
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                  Contenido
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal para crear medida */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">Nueva Medida</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleCreate({ tamano: formData.get('tamano') as string });
            }} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tamaño de la Medida
                </label>
                <input
                  name="tamano"
                  type="text"
                  required
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Ej: Pequeña, Mediana, Grande"
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 sm:mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-gray-300 dark:disabled:bg-gray-600"
                >
                  {createMutation.isPending ? 'Creando...' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {medidaSeleccionada && (
        <>
          {/* Modal para editar medida */}
          {showEditModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">Editar Medida</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleEdit({ tamano: formData.get('tamano') as string });
                }} className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tamaño de la Medida
                    </label>
                    <input
                      name="tamano"
                      type="text"
                      defaultValue={medidaSeleccionada.Tamano}
                      required
                      className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 sm:mt-6">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={updateMutation.isPending}
                      className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-gray-300 dark:disabled:bg-gray-600"
                    >
                      {updateMutation.isPending ? 'Guardando...' : 'Guardar'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <PopupConfirm
            isOpen={showDeleteModal}
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={handleDelete}
            title="Eliminar Medida"
            message="¿Estás seguro de que deseas eliminar esta medida?"
            itemName={medidaSeleccionada.Tamano}
          />
        </>
      )}
    </div>
  );
};

export default GestionMedidas;