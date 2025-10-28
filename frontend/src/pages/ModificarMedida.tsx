import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Plus, Edit2, Trash2, Package, DollarSign } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  getMedida,
  addIngredienteToMedida,
  updateIngredienteMedida,
  removeIngredienteFromMedida,
  addCostoExtraToMedida,
  removeCostoExtraFromMedida,
} from '@/api/tortas';
import { useCostoExtra } from '@/hooks/useCostoExtra';
import PopupAgregarIngredienteMedida from '@/components/tortas/PopupAgregarIngredienteMedida';
import PopupConfirm from '@/components/general/PopupConfirm';
import Select from 'react-select';
import { MedidaDetalle } from '@/types/tortas';

const ModificarMedida: React.FC = () => {
  const { tortaId, medidaId } = useParams<{ tortaId: string; medidaId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showAddIngrediente, setShowAddIngrediente] = useState(false);
  const [showAddCosto, setShowAddCosto] = useState(false);
  const [showEditIngrediente, setShowEditIngrediente] = useState(false);
  const [showDeleteIngrediente, setShowDeleteIngrediente] = useState(false);
  const [showDeleteCosto, setShowDeleteCosto] = useState(false);
  const [ingredienteSeleccionado, setIngredienteSeleccionado] = useState<any>(null);
  const [costoSeleccionado, setCostoSeleccionado] = useState<any>(null);
  const [costoExtraSeleccionado, setCostoExtraSeleccionado] = useState<any>(null);
  const [cantidadCosto, setCantidadCosto] = useState<string>('');

  // Queries
  const { data: medida, isLoading } = useQuery<MedidaDetalle>({
    queryKey: ['medida', medidaId],
    queryFn: () => getMedida(parseInt(medidaId || '0')),
    enabled: !!medidaId,
  });

  const { data: costosExtra } = useCostoExtra();

  // Mutations
  const addIngredienteMutation = useMutation({
    mutationFn: (data: { ingredienteId: number; cantidad: number; unidad: string }) =>
      addIngredienteToMedida(parseInt(medidaId || '0'), data.ingredienteId, data.cantidad, data.unidad),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medida', medidaId] });
      queryClient.invalidateQueries({ queryKey: ['tortas'] });
      toast.success('Ingrediente agregado exitosamente');
    },
    onError: () => {
      toast.error('Error al agregar el ingrediente');
    },
  });

  const updateIngredienteMutation = useMutation({
    mutationFn: (data: { id: number; cantidad: number; unidad: string }) =>
      updateIngredienteMedida(data.id, data.cantidad, data.unidad),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medida', medidaId] });
      queryClient.invalidateQueries({ queryKey: ['tortas'] });
      toast.success('Ingrediente actualizado exitosamente');
      setShowEditIngrediente(false);
    },
    onError: () => {
      toast.error('Error al actualizar el ingrediente');
    },
  });

  const removeIngredienteMutation = useMutation({
    mutationFn: (id: number) => removeIngredienteFromMedida(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medida', medidaId] });
      queryClient.invalidateQueries({ queryKey: ['tortas'] });
      toast.success('Ingrediente eliminado exitosamente');
      setShowDeleteIngrediente(false);
    },
    onError: () => {
      toast.error('Error al eliminar el ingrediente');
    },
  });

  const addCostoMutation = useMutation({
    mutationFn: (data: { costoExtraId: number; cantidad: number }) =>
      addCostoExtraToMedida(parseInt(medidaId || '0'), data.costoExtraId, data.cantidad),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medida', medidaId] });
      queryClient.invalidateQueries({ queryKey: ['tortas'] });
      toast.success('Costo extra agregado exitosamente');
      setShowAddCosto(false);
      setCostoExtraSeleccionado(null);
      setCantidadCosto('');
    },
    onError: () => {
      toast.error('Error al agregar el costo extra');
    },
  });

  const removeCostoMutation = useMutation({
    mutationFn: (id: number) => removeCostoExtraFromMedida(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medida', medidaId] });
      queryClient.invalidateQueries({ queryKey: ['tortas'] });
      toast.success('Costo extra eliminado exitosamente');
      setShowDeleteCosto(false);
    },
    onError: () => {
      toast.error('Error al eliminar el costo extra');
    },
  });

  // Handlers
  const handleAddIngrediente = (ingrediente: any) => {
    addIngredienteMutation.mutate({
      ingredienteId: ingrediente.idIngrediente,
      cantidad: ingrediente.cantidad,
      unidad: ingrediente.unidad,
    });
  };

  const handleUpdateIngrediente = (values: { cantidad: string; unidad: string }) => {
    if (ingredienteSeleccionado) {
      updateIngredienteMutation.mutate({
        id: ingredienteSeleccionado.IdMedidaIngrediente,
        cantidad: parseFloat(values.cantidad),
        unidad: values.unidad,
      });
    }
  };

  const handleDeleteIngrediente = () => {
    if (ingredienteSeleccionado) {
      removeIngredienteMutation.mutate(ingredienteSeleccionado.IdMedidaIngrediente);
      setIngredienteSeleccionado(null);
    }
  };

  const handleAddCosto = () => {
    if (costoExtraSeleccionado && cantidadCosto) {
      addCostoMutation.mutate({
        costoExtraId: costoExtraSeleccionado.value,
        cantidad: parseFloat(cantidadCosto),
      });
    }
  };

  const handleDeleteCosto = () => {
    if (costoSeleccionado) {
      removeCostoMutation.mutate(costoSeleccionado.IdMedidaCostoExtra);
      setCostoSeleccionado(null);
    }
  };

  // Opciones para el selector de costos extra
  const opcionesCostos = costosExtra?.map((c: any) => ({
    value: c.idCostoExtra,
    label: `${c.nombre} - $${c.precioUnitario?.toLocaleString('es-AR')}`,
  })) || [];

  if (isLoading) {
    return <div className="text-center py-10">Cargando...</div>;
  }

  if (!medida) {
    return <div className="text-center py-10">Medida no encontrada</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(`/tortas/${tortaId}/medidas`)}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a Medidas
        </button>

        <h1 className="text-3xl font-bold text-primary-900">
          Contenido de Medida - {medida.Tamano}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda: Ingredientes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sección de Ingredientes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border-2 border-primary-200 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Package className="w-6 h-6 text-primary-600" />
                <h2 className="text-xl font-bold text-primary-900">Ingredientes</h2>
              </div>
              <button
                onClick={() => setShowAddIngrediente(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm"
              >
                <Plus className="w-4 h-4" />
                Agregar
              </button>
            </div>

            <div className="space-y-2">
              {medida.Ingredientes?.length === 0 ? (
                <p className="text-primary-500 text-center py-4">No hay ingredientes agregados</p>
              ) : (
                medida.Ingredientes?.map((ing) => (
                  <div
                    key={ing.IdMedidaIngrediente}
                    className="flex items-center justify-between p-3 bg-primary-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-primary-900">{ing.NombreIngrediente}</p>
                      <p className="text-sm text-primary-600">
                        {ing.CantidadUsada} {ing.UnidadUsada} • ${ing.CostoTotal.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setIngredienteSeleccionado(ing);
                          setShowEditIngrediente(true);
                        }}
                        className="p-1.5 text-primary-600 hover:bg-primary-200 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setIngredienteSeleccionado(ing);
                          setShowDeleteIngrediente(true);
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-primary-200">
              <p className="text-right text-primary-700 font-medium">
                Subtotal Ingredientes: ${medida.CostoIngredientes.toFixed(2)}
              </p>
            </div>
          </motion.div>

          {/* Sección de Costos Extra */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border-2 border-primary-200 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold text-primary-900">Costos Extra</h2>
              </div>
              <button
                onClick={() => setShowAddCosto(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
              >
                <Plus className="w-4 h-4" />
                Agregar
              </button>
            </div>

            <div className="space-y-2">
              {medida.CostosExtra?.length === 0 ? (
                <p className="text-primary-500 text-center py-4">No hay costos extra agregados</p>
              ) : (
                medida.CostosExtra?.map((costo) => (
                  <div
                    key={costo.IdMedidaCostoExtra}
                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-primary-900">{costo.NombreCostoExtra}</p>
                      <p className="text-sm text-primary-600">
                        {costo.CantidadUsada} unidad • ${costo.CostoTotal.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setCostoSeleccionado(costo);
                        setShowDeleteCosto(true);
                      }}
                      className="p-1.5 text-red-600 hover:bg-red-100 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-green-200">
              <p className="text-right text-primary-700 font-medium">
                Subtotal Extras: ${medida.CostoExtras.toFixed(2)}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Columna derecha: Resumen */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-5 text-white sticky top-6"
          >
            <h2 className="text-xl font-bold mb-4"><strong>Resumen</strong></h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Costo Ingredientes:</span>
                <span className="font-medium">${medida.CostoIngredientes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Costo Extras:</span>
                <span className="font-medium">${medida.CostoExtras.toFixed(2)}</span>
              </div>
              <div className="border-t border-white/20 pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Costo Total:</span>
                  <span>${medida.CostoTotal.toFixed(2)}</span>
                </div>
              </div>
              <div className="border-t border-white/20 pt-3">
                <div className="flex justify-between">
                  <span>Precio Venta (x2.7):</span>
                  <span className="font-medium">${medida.PrecioVenta.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-300 font-bold mt-2">
                  <span>Ganancia:</span>
                  <span>${medida.Ganancia.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <PopupAgregarIngredienteMedida
        isOpen={showAddIngrediente}
        onClose={() => setShowAddIngrediente(false)}
        onSave={handleAddIngrediente}
      />

      {/* Modal para agregar costo extra */}
      <AnimatePresence>
        {showAddCosto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddCosto(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6"
            >
              <h3 className="text-xl font-bold text-primary-900 mb-4">Agregar Costo Extra</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Costo Extra
                  </label>
                  <Select
                    options={opcionesCostos}
                    value={costoExtraSeleccionado}
                    onChange={setCostoExtraSeleccionado}
                    placeholder="Seleccionar costo extra..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={cantidadCosto}
                    onChange={(e) => setCantidadCosto(e.target.value)}
                    className="w-full px-4 py-2 border border-primary-300 rounded-lg"
                    placeholder="Ej: 1, 0.5..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddCosto(false)}
                  className="px-4 py-2 text-primary-700 hover:bg-primary-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddCosto}
                  disabled={!costoExtraSeleccionado || !cantidadCosto}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300"
                >
                  Agregar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal para editar ingrediente */}
      <AnimatePresence>
        {showEditIngrediente && ingredienteSeleccionado && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditIngrediente(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6"
            >
              <h3 className="text-xl font-bold text-primary-900 mb-4">Editar Ingrediente</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleUpdateIngrediente({
                  cantidad: formData.get('cantidad') as string,
                  unidad: ingredienteSeleccionado.UnidadUsada,
                });
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Ingrediente
                  </label>
                  <input
                    type="text"
                    value={ingredienteSeleccionado.NombreIngrediente}
                    disabled
                    className="w-full px-4 py-2 bg-gray-100 text-gray-600 border border-primary-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Cantidad
                  </label>
                  <input
                    name="cantidad"
                    type="number"
                    step="0.01"
                    min="0.01"
                    defaultValue={ingredienteSeleccionado.CantidadUsada}
                    required
                    className="w-full px-4 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Unidad
                  </label>
                  <input
                    type="text"
                    value={ingredienteSeleccionado.UnidadUsada}
                    disabled
                    className="w-full px-4 py-2 bg-gray-100 text-gray-600 border border-primary-300 rounded-lg"
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowEditIngrediente(false)}
                    className="px-4 py-2 text-primary-700 hover:bg-primary-100 rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={updateIngredienteMutation.isPending}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-gray-300"
                  >
                    {updateIngredienteMutation.isPending ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal para confirmar eliminación de ingrediente */}
      {ingredienteSeleccionado && (
        <PopupConfirm
          isOpen={showDeleteIngrediente}
          onCancel={() => setShowDeleteIngrediente(false)}
          onConfirm={handleDeleteIngrediente}
          title="Eliminar Ingrediente"
          message={`¿Estás seguro de eliminar este ingrediente?`}
          itemName={ingredienteSeleccionado.NombreIngrediente}
        />
      )}

      {/* Modal para confirmar eliminación de costo */}
      {costoSeleccionado && (
        <PopupConfirm
          isOpen={showDeleteCosto}
          onCancel={() => setShowDeleteCosto(false)}
          onConfirm={handleDeleteCosto}
          title="Eliminar Costo Extra"
          message={`¿Estás seguro de eliminar este costo extra?`}
          itemName={costoSeleccionado.NombreCostoExtra}
        />
      )}
    </div>
  );
};

export default ModificarMedida;