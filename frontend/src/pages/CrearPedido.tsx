import React, { useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Plus, Trash2, Edit } from 'lucide-react';
import { useCrearPedido } from '@/hooks/usePedidos';
import { CrearPedidoDTO } from '@/types/pedidos';

// ✅ Lazy load de popups (solo se cargan cuando se abren)
const PopupSeleccionarProducto = lazy(() => import('@/components/pedidos/PopupSeleccionarProducto'));
const PopupAgregarExtras = lazy(() => import('@/components/pedidos/PopupAgregarExtras'));
const PopupAgregarIngredientesExtras = lazy(() => import('@/components/pedidos/PopupAgregarIngredientesExtras'));

interface Extra {
  idCostoExtra: number;
  nombreCostoExtra: string;
  nota: string;
  cantidad: number;
}

interface IngredienteExtra {
  idIngrediente: number;
  nombreIngrediente: string;
  nota: string;
  cantidad: number;
}

interface ProductoPedido {
  idMedida: number;
  nombreTorta: string;
  nombreMedida: string;
  cantidad: number;
  extras: Extra[];
  ingredientesExtras: IngredienteExtra[];
}

const CrearPedido: React.FC = () => {
  const navigate = useNavigate();
  const crearPedidoMutation = useCrearPedido();

  const [nombreCliente, setNombreCliente] = useState('');
  const [telefonoCliente, setTelefonoCliente] = useState('');
  const [fecha, setFecha] = useState('');
  const [nota, setNota] = useState('');
  const [metodoDePago, setMetodoDePago] = useState('Definir');
  const [productos, setProductos] = useState<ProductoPedido[]>([]);
  
  // Estados para popups
  const [popupProductoOpen, setPopupProductoOpen] = useState(false);
  const [popupExtrasOpen, setPopupExtrasOpen] = useState(false);
  const [popupIngredientesOpen, setPopupIngredientesOpen] = useState(false);
  const [productoEditandoIndex, setProductoEditandoIndex] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🎯 [CrearPedido] handleSubmit iniciado');
    console.log('📊 [CrearPedido] Estado actual:', {
      nombreCliente,
      telefonoCliente,
      fecha,
      nota,
      metodoDePago,
      cantidadProductos: productos.length
    });
    
    if (productos.length === 0) {
      console.warn('⚠️ [CrearPedido] No hay productos, mostrando alerta');
      alert('Debe agregar al menos un producto al pedido');
      return;
    }

    console.log('📦 [CrearPedido] Productos a enviar:', JSON.stringify(productos, null, 2));

    const pedidoDTO: CrearPedidoDTO = {
      nombreCliente: nombreCliente,
      telefonoCliente: telefonoCliente,
      fecha: fecha,
      nota: nota,
      precioExtra: 0,
      metodoDePago: metodoDePago,
      detallePedidos: productos.map(p => ({
        idMedida: p.idMedida,
        cantidad: p.cantidad,
        extras: p.extras.map(e => ({
          idCostoExtra: e.idCostoExtra,
          cantidad: e.cantidad,
          nota: e.nota
        })),
        ingredientesExtras: p.ingredientesExtras.map(i => ({
          idIngrediente: i.idIngrediente,
          cantidad: i.cantidad,
          nota: i.nota
        }))
      }))
    };
    
    console.log('📝 [CrearPedido] DTO construido:', JSON.stringify(pedidoDTO, null, 2));
    console.log('🚀 [CrearPedido] Llamando a crearPedidoMutation.mutate()');
    
    crearPedidoMutation.mutate(pedidoDTO, {
      onSuccess: () => {
        console.log('✅ [CrearPedido] Pedido creado exitosamente, navegando a /pedidos');
        navigate('/pedidos');
      },
      onError: (error: any) => {
        console.error('❌ [CrearPedido] Error en onError callback:', error);
        console.error('❌ [CrearPedido] Error response:', error.response?.data);
      }
    });
    
    console.log('🔄 [CrearPedido] Mutation enviada, esperando respuesta...');
  };

  const handleAgregarProducto = (producto: ProductoPedido) => {
    setProductos([...productos, producto]);
    setPopupProductoOpen(false);
  };

  const handleEliminarProducto = (index: number) => {
    setProductos(productos.filter((_, i) => i !== index));
  };

  const handleAbrirExtras = (index: number) => {
    setProductoEditandoIndex(index);
    setPopupExtrasOpen(true);
  };

  const handleAbrirIngredientes = (index: number) => {
    setProductoEditandoIndex(index);
    setPopupIngredientesOpen(true);
  };

  const handleGuardarExtras = (extras: Extra[]) => {
    if (productoEditandoIndex !== null) {
      const nuevosProductos = [...productos];
      nuevosProductos[productoEditandoIndex].extras = extras;
      setProductos(nuevosProductos);
    }
    setProductoEditandoIndex(null);
  };

  const handleGuardarIngredientes = (ingredientes: IngredienteExtra[]) => {
    if (productoEditandoIndex !== null) {
      const nuevosProductos = [...productos];
      nuevosProductos[productoEditandoIndex].ingredientesExtras = ingredientes;
      setProductos(nuevosProductos);
    }
    setProductoEditandoIndex(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate('/pedidos')}
            className="p-2 hover:bg-primary-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-primary-700 dark:text-primary-400" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary-900 dark:text-white">
              Crear Nuevo Pedido
            </h1>
            <p className="text-xs sm:text-sm text-primary-600 dark:text-gray-400">
              Complete la información del pedido
            </p>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={crearPedidoMutation.isPending}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow hover:bg-primary-600 transition disabled:bg-primary-300 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          <Save className="w-4 h-4 sm:w-5 sm:h-5" />
          {crearPedidoMutation.isPending ? 'Guardando...' : 'Guardar Pedido'}
        </button>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 space-y-4"
        >
          {/* Información del Cliente y Detalles en dos columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Columna Izquierda: Información del Cliente */}
            <div>
              <h2 className="text-lg font-semibold text-primary-900 dark:text-white mb-3">
                Información del Cliente
              </h2>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-primary-700 dark:text-gray-300 mb-2">
                    Nombre del Cliente *
                  </label>
                  <input
                    type="text"
                    value={nombreCliente}
                    onChange={(e) => setNombreCliente(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-primary-50 dark:bg-gray-700 text-primary-900 dark:text-gray-100 border border-primary-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="Ej: María González"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-700 dark:text-gray-300 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={telefonoCliente}
                    onChange={(e) => setTelefonoCliente(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-primary-50 dark:bg-gray-700 text-primary-900 dark:text-gray-100 border border-primary-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="Ej: 3413456789"
                  />
                </div>
              </div>
            </div>

            {/* Columna Derecha: Detalles del Pedido */}
            <div>
              <h2 className="text-lg font-semibold text-primary-900 dark:text-white mb-3">
                Detalles del Pedido
              </h2>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-primary-700 dark:text-gray-300 mb-2">
                    Fecha de Entrega *
                  </label>
                  <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-primary-50 dark:bg-gray-700 text-primary-900 dark:text-gray-100 border border-primary-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-700 dark:text-gray-300 mb-2">
                    Método de Pago *
                  </label>
                  <select
                    value={metodoDePago}
                    onChange={(e) => setMetodoDePago(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-primary-50 dark:bg-gray-700 text-primary-900 dark:text-gray-100 border border-primary-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  >
                    <option value="Definir">Definir</option>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Brubank">Brubank</option>
                    <option value="Uala">Uala</option>
                    <option value="Mercado Pago">Mercado Pago</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Nota - Debajo de ambas columnas */}
          <div>
            <label className="block text-sm font-medium text-primary-700 dark:text-gray-300 mb-2">
              Nota (Opcional)
            </label>
            <textarea
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 bg-primary-50 dark:bg-gray-700 text-primary-900 dark:text-gray-100 border border-primary-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="Notas adicionales sobre el pedido..."
            />
          </div>

          {/* Productos del Pedido */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-primary-900 dark:text-white">
                Productos del Pedido
              </h2>
              <button
                type="button"
                onClick={() => setPopupProductoOpen(true)}
                className="flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Agregar Producto
              </button>
            </div>
            
            {productos.length === 0 ? (
              <div className="bg-primary-50 dark:bg-gray-700 rounded-lg p-6 text-center text-primary-600 dark:text-gray-400">
                <p>No hay productos agregados</p>
                <p className="text-sm mt-2">Haz clic en "Agregar Producto" para comenzar</p>
              </div>
            ) : (
              <div className="space-y-2">
                {productos.map((producto, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-primary-900 dark:text-white">
                          {producto.nombreTorta} - {producto.nombreMedida}
                        </h3>
                        <p className="text-sm text-primary-600 dark:text-gray-400">Cantidad: {producto.cantidad}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleEliminarProducto(index)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Extras agregados */}
                    {producto.extras.length > 0 && (
                      <div className="mb-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h4 className="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-1">
                          Extras ({producto.extras.length})
                        </h4>
                        <div className="space-y-0.5">
                          {producto.extras.map((extra, extraIndex) => (
                            <p key={extraIndex} className="text-xs text-blue-700 dark:text-blue-400">
                              • {extra.nombreCostoExtra} x{extra.cantidad}
                              {extra.nota && ` - ${extra.nota}`}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Ingredientes extras agregados */}
                    {producto.ingredientesExtras.length > 0 && (
                      <div className="mb-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <h4 className="text-xs font-semibold text-green-900 dark:text-green-300 mb-1">
                          Ingredientes Extras ({producto.ingredientesExtras.length})
                        </h4>
                        <div className="space-y-0.5">
                          {producto.ingredientesExtras.map((ing, ingIndex) => (
                            <p key={ingIndex} className="text-xs text-green-700 dark:text-green-400">
                              • {ing.nombreIngrediente} x{ing.cantidad}
                              {ing.nota && ` - ${ing.nota}`}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleAbrirExtras(index)}
                        className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
                      >
                        <Edit className="w-3 h-3" />
                        {producto.extras.length > 0 ? 'Editar' : 'Agregar'} Extras
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAbrirIngredientes(index)}
                        className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 px-2 py-1 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded transition-colors"
                      >
                        <Edit className="w-3 h-3" />
                        {producto.ingredientesExtras.length > 0 ? 'Editar' : 'Agregar'} Ingredientes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/pedidos')}
              className="px-6 py-2.5 bg-primary-100 dark:bg-gray-700 text-primary-700 dark:text-gray-300 rounded-lg hover:bg-primary-200 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={crearPedidoMutation.isPending}
              className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {crearPedidoMutation.isPending ? 'Creando...' : 'Crear Pedido'}
            </button>
          </div>
        </motion.div>
      </form>

      {/* Popup Seleccionar Producto */}
      {popupProductoOpen && (
        <Suspense fallback={<div className="fixed inset-0 bg-black bg-opacity-40 z-50" />}>
          <PopupSeleccionarProducto
            isOpen={popupProductoOpen}
            onClose={() => setPopupProductoOpen(false)}
            onSelect={handleAgregarProducto}
          />
        </Suspense>
      )}

      {/* Popup Agregar Extras */}
      {popupExtrasOpen && (
        <Suspense fallback={<div className="fixed inset-0 bg-black bg-opacity-40 z-50" />}>
          <PopupAgregarExtras
            isOpen={popupExtrasOpen}
            onClose={() => {
              setPopupExtrasOpen(false);
              setProductoEditandoIndex(null);
            }}
            onSave={handleGuardarExtras}
            extrasActuales={productoEditandoIndex !== null ? productos[productoEditandoIndex].extras : []}
          />
        </Suspense>
      )}

      {/* Popup Agregar Ingredientes Extras */}
      {popupIngredientesOpen && (
        <Suspense fallback={<div className="fixed inset-0 bg-black bg-opacity-40 z-50" />}>
          <PopupAgregarIngredientesExtras
            isOpen={popupIngredientesOpen}
            onClose={() => {
              setPopupIngredientesOpen(false);
              setProductoEditandoIndex(null);
            }}
            onSave={handleGuardarIngredientes}
            ingredientesActuales={productoEditandoIndex !== null ? productos[productoEditandoIndex].ingredientesExtras : []}
          />
        </Suspense>
      )}
    </div>
  );
};

export default CrearPedido;
