import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Edit2, Trash2, Package } from 'lucide-react';
import { usePedidoCompleto } from '@/hooks/usePedidos';
import PopupConfirm from '@/components/general/PopupConfirm';
import PopupSeleccionarProducto from '@/components/pedidos/PopupSeleccionarProducto';
import PopupAgregarExtras from '@/components/pedidos/PopupAgregarExtras';
import PopupAgregarIngredientesExtras from '@/components/pedidos/PopupAgregarIngredientesExtras';
import {
  useModificarDetallePedido,
  useEliminarDetallePedido,
  useAgregarDetallePedido,
  useEliminarExtra,
  useModificarExtra,
  useAgregarExtra,
  useEliminarIngredienteExtra,
  useModificarIngredienteExtra,
  useAgregarIngredienteExtra
} from '@/hooks/usePedidosControl';

const ModificarPedido: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const pedidoId = Number(id);
  
  const { data: pedido, isLoading, error } = usePedidoCompleto(pedidoId);
  
  const modificarDetalle = useModificarDetallePedido();
  const eliminarDetalle = useEliminarDetallePedido();
  const agregarDetalle = useAgregarDetallePedido();
  const eliminarExtra = useEliminarExtra();
  const modificarExtra = useModificarExtra();
  const agregarExtra = useAgregarExtra();
  const eliminarIngExtra = useEliminarIngredienteExtra();
  const modificarIngExtra = useModificarIngredienteExtra();
  const agregarIngExtra = useAgregarIngredienteExtra();
  
  const [editingDetalle, setEditingDetalle] = useState<number | null>(null);
  const [editingCantidad, setEditingCantidad] = useState<number>(1);
  
  // Estados para modales
  const [showAgregarProducto, setShowAgregarProducto] = useState(false);
  const [showAgregarExtras, setShowAgregarExtras] = useState<number | null>(null);
  const [showAgregarIngredientes, setShowAgregarIngredientes] = useState<number | null>(null);
  
  // Estados para confirmación
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    type: 'detalle' | 'extra' | 'ingrediente' | null;
    id: number | null;
    title?: string;
  }>({
    isOpen: false,
    type: null,
    id: null
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Error state
  if (error || !pedido) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
          Error al cargar el pedido
        </div>
        <button
          onClick={() => navigate('/pedidos')}
          className="mt-4 flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a pedidos
        </button>
      </div>
    );
  }

  const handleModificarCantidad = (detalleId: number) => {
    if (editingCantidad > 0) {
      modificarDetalle.mutate(
        {
          detallePedidoId: detalleId,
          cantidad: editingCantidad,
          pedidoId
        },
        {
          onSuccess: () => {
            setEditingDetalle(null);
          }
        }
      );
    }
  };
  
  const handleEliminarDetalle = (detalleId: number, nombreTorta: string) => {
    setConfirmDelete({
      isOpen: true,
      type: 'detalle',
      id: detalleId,
      title: nombreTorta
    });
  };

  const handleEliminarExtra = (extraId: number, nombreExtra: string) => {
    setConfirmDelete({
      isOpen: true,
      type: 'extra',
      id: extraId,
      title: nombreExtra
    });
  };

  const handleEliminarIngredienteExtra = (ingExtraId: number, nombreIng: string) => {
    setConfirmDelete({
      isOpen: true,
      type: 'ingrediente',
      id: ingExtraId,
      title: nombreIng
    });
  };
  
  const confirmarEliminacion = () => {
    if (confirmDelete.id === null) return;
    
    const closeConfirm = () => setConfirmDelete({ isOpen: false, type: null, id: null });
    
    switch (confirmDelete.type) {
      case 'detalle':
        eliminarDetalle.mutate(
          { detallePedidoId: confirmDelete.id, pedidoId },
          { onSettled: closeConfirm }
        );
        break;
      case 'extra':
        eliminarExtra.mutate(
          { extraId: confirmDelete.id, pedidoId },
          { onSettled: closeConfirm }
        );
        break;
      case 'ingrediente':
        eliminarIngExtra.mutate(
          { ingredienteExtraId: confirmDelete.id, pedidoId },
          { onSettled: closeConfirm }
        );
        break;
    }
  };
  
  const handleAgregarProducto = (producto: any) => {
    agregarDetalle.mutate({
      pedidoId,
      idMedida: producto.idMedida,
      cantidad: producto.cantidad
    });
    setShowAgregarProducto(false);
  };
  
  const handleAgregarExtras = (extras: any[]) => {
    if (!showAgregarExtras) return;
    
    extras.forEach(extra => {
      agregarExtra.mutate({
        detallePedidoId: showAgregarExtras,
        idCostoExtra: extra.idCostoExtra,
        cantidad: extra.cantidad,
        nota: extra.nota,
        pedidoId
      });
    });
    
    setShowAgregarExtras(null);
  };
  
  const handleAgregarIngredientes = (ingredientes: any[]) => {
    if (!showAgregarIngredientes) return;
    
    ingredientes.forEach(ing => {
      agregarIngExtra.mutate({
        detallePedidoId: showAgregarIngredientes,
        idIngrediente: ing.idIngrediente,
        cantidad: ing.cantidad,
        nota: ing.nota,
        pedidoId
      });
    });
    
    setShowAgregarIngredientes(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-8 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/pedidos')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Modificar Pedido #{pedido.idPedido}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Cliente: {pedido.nombreCliente}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total del pedido</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            ${pedido.total?.toLocaleString('es-AR')}
          </p>
        </div>
      </div>

      {/* Botón Agregar Producto */}
      <div className="mb-4">
        <button
          onClick={() => setShowAgregarProducto(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Agregar Producto al Pedido
        </button>
      </div>

      {/* Lista de Detalles */}
      <div className="space-y-4">
        {pedido.detallePedidos && pedido.detallePedidos.length > 0 ? (
          pedido.detallePedidos.map((detalle) => (
            <motion.div
              key={detalle.idDetallePedido}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              {/* Encabezado del detalle */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary-100 dark:bg-primary-900 p-2 rounded-lg">
                    <Package className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {detalle.nombreTorta} - {detalle.tamanoMedida}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Precio base: ${(detalle.precioMomentoMedida / detalle.cantidad)?.toLocaleString('es-AR')} x {detalle.cantidad}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleEliminarDetalle(detalle.idDetallePedido, `${detalle.nombreTorta} - ${detalle.tamanoMedida}`)}
                  disabled={eliminarDetalle.isPending}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Eliminar detalle"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Cantidad editable */}
              <div className="flex items-center gap-4 mb-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Cantidad:
                </label>
                {editingDetalle === detalle.idDetallePedido ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={editingCantidad}
                      onChange={(e) => setEditingCantidad(Number(e.target.value))}
                      className="w-20 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                    <button
                      onClick={() => handleModificarCantidad(detalle.idDetallePedido)}
                      disabled={modificarDetalle.isPending}
                      className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {modificarDetalle.isPending ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button
                      onClick={() => setEditingDetalle(null)}
                      className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {detalle.cantidad}
                    </span>
                    <button
                      onClick={() => {
                        setEditingDetalle(detalle.idDetallePedido);
                        setEditingCantidad(detalle.cantidad);
                      }}
                      className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                      title="Editar cantidad"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              {/* Extras */}
              {detalle.extras && detalle.extras.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Extras:
                    </h4>
                    <button
                      onClick={() => setShowAgregarExtras(detalle.idDetallePedido)}
                      className="text-xs flex items-center gap-1 px-2 py-1 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded"
                    >
                      <Plus className="w-3 h-3" />
                      Agregar Extra
                    </button>
                  </div>
                  <div className="space-y-2">
                    {detalle.extras.map((extra) => (
                      <div
                        key={extra.idExtras}
                        className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg"
                      >
                        <div className="flex-1">
                          <span className="text-sm text-gray-900 dark:text-gray-100">
                            {extra.nombreCostoExtra} x{extra.cantidad}
                          </span>
                          {extra.nota && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              Nota: {extra.nota}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            ${extra.precioMomento?.toLocaleString('es-AR')}
                          </span>
                          <button
                            onClick={() => handleEliminarExtra(extra.idExtras, extra.nombreCostoExtra)}
                            disabled={eliminarExtra.isPending}
                            className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {!detalle.extras || detalle.extras.length === 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setShowAgregarExtras(detalle.idDetallePedido)}
                    className="text-sm flex items-center gap-1 px-3 py-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar Extra
                  </button>
                </div>
              )}
              {/* Ingredientes Extras */}
              {detalle.ingredientesExtras && detalle.ingredientesExtras.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Ingredientes Extras:
                    </h4>
                    <button
                      onClick={() => setShowAgregarIngredientes(detalle.idDetallePedido)}
                      className="text-xs flex items-center gap-1 px-2 py-1 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded"
                    >
                      <Plus className="w-3 h-3" />
                      Agregar Ingrediente
                    </button>
                  </div>
                  <div className="space-y-2">
                    {detalle.ingredientesExtras.map((ing) => (
                      <div
                        key={ing.idIngredienteExtra}
                        className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg"
                      >
                        <div className="flex-1">
                          <span className="text-sm text-gray-900 dark:text-gray-100">
                            {ing.nombreIngrediente} - {ing.cantidad} {ing.unidadCompra}
                          </span>
                          {ing.nota && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              Nota: {ing.nota}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            ${ing.precioMomento?.toLocaleString('es-AR')}
                          </span>
                          <button
                            onClick={() => handleEliminarIngredienteExtra(ing.idIngredienteExtra, ing.nombreIngrediente)}
                            disabled={eliminarIngExtra.isPending}
                            className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {!detalle.ingredientesExtras || detalle.ingredientesExtras.length === 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setShowAgregarIngredientes(detalle.idDetallePedido)}
                    className="text-sm flex items-center gap-1 px-3 py-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar Ingrediente Extra
                  </button>
                </div>
              )}

              {/* Total del producto */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Subtotal:
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  ${detalle.totalProducto?.toLocaleString('es-AR')}
                </span>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              No hay detalles en este pedido
            </p>
          </div>
        )}
      </div>
      
      {/* Popup de confirmación */}
      <PopupConfirm
        isOpen={confirmDelete.isOpen}
        onCancel={() => setConfirmDelete({ isOpen: false, type: null, id: null })}
        onConfirm={confirmarEliminacion}
        title="Confirmar Eliminación"
        message={`¿Estás seguro de eliminar "${confirmDelete.title}"?`}
      />
      
      {/* Popup Agregar Producto */}
      <PopupSeleccionarProducto
        isOpen={showAgregarProducto}
        onClose={() => setShowAgregarProducto(false)}
        onSelect={handleAgregarProducto}
      />
      
      {/* Popup Agregar Extras */}
      <PopupAgregarExtras
        isOpen={showAgregarExtras !== null}
        onClose={() => setShowAgregarExtras(null)}
        onSave={handleAgregarExtras}
      />
      
      {/* Popup Agregar Ingredientes Extras */}
      <PopupAgregarIngredientesExtras
        isOpen={showAgregarIngredientes !== null}
        onClose={() => setShowAgregarIngredientes(null)}
        onSave={handleAgregarIngredientes}
      />
    </div>
  );
};

export default ModificarPedido;