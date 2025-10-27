import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Plus, Trash2, Edit } from 'lucide-react';
import PopupSeleccionarProducto from '@/components/pedidos/PopupSeleccionarProducto';
import PopupAgregarExtras from '@/components/pedidos/PopupAgregarExtras';
import PopupAgregarIngredientesExtras from '@/components/pedidos/PopupAgregarIngredientesExtras';
import { useCrearPedido } from '@/hooks/usePedidos';
import { CrearPedidoDTO } from '@/types/pedidos';

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
    
    if (productos.length === 0) {
      alert('Debe agregar al menos un producto al pedido');
      return;
    }

    const pedidoDTO: CrearPedidoDTO = {
      idCliente: 0,
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
    
    crearPedidoMutation.mutate(pedidoDTO, {
      onSuccess: () => {
        navigate('/pedidos');
      }
    });
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
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/pedidos')}
            className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-primary-700" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-primary-900">
              Crear Nuevo Pedido
            </h1>
            <p className="text-sm text-primary-600">
              Complete la información del pedido
            </p>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={crearPedidoMutation.isPending}
          className="flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-lg shadow hover:bg-primary-600 transition disabled:bg-primary-300 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          {crearPedidoMutation.isPending ? 'Guardando...' : 'Guardar Pedido'}
        </button>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-primary-200 p-6 space-y-4"
        >
          {/* Información del Cliente y Detalles en dos columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Columna Izquierda: Información del Cliente */}
            <div>
              <h2 className="text-lg font-semibold text-primary-900 mb-3">
                Información del Cliente
              </h2>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Nombre del Cliente *
                  </label>
                  <input
                    type="text"
                    value={nombreCliente}
                    onChange={(e) => setNombreCliente(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-primary-50 text-primary-900 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="Ej: María González"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={telefonoCliente}
                    onChange={(e) => setTelefonoCliente(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-primary-50 text-primary-900 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="Ej: 3413456789"
                  />
                </div>
              </div>
            </div>

            {/* Columna Derecha: Detalles del Pedido */}
            <div>
              <h2 className="text-lg font-semibold text-primary-900 mb-3">
                Detalles del Pedido
              </h2>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Fecha de Entrega *
                  </label>
                  <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-primary-50 text-primary-900 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Método de Pago *
                  </label>
                  <select
                    value={metodoDePago}
                    onChange={(e) => setMetodoDePago(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-primary-50 text-primary-900 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
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
            <label className="block text-sm font-medium text-primary-700 mb-2">
              Nota (Opcional)
            </label>
            <textarea
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 bg-primary-50 text-primary-900 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="Notas adicionales sobre el pedido..."
            />
          </div>

          {/* Productos del Pedido */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-primary-900">
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
              <div className="bg-primary-50 rounded-lg p-6 text-center text-primary-600">
                <p>No hay productos agregados</p>
                <p className="text-sm mt-2">Haz clic en "Agregar Producto" para comenzar</p>
              </div>
            ) : (
              <div className="space-y-2">
                {productos.map((producto, index) => (
                  <div key={index} className="bg-white border border-primary-200 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-primary-900">
                          {producto.nombreTorta} - {producto.nombreMedida}
                        </h3>
                        <p className="text-sm text-primary-600">Cantidad: {producto.cantidad}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleEliminarProducto(index)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Extras agregados */}
                    {producto.extras.length > 0 && (
                      <div className="mb-2 p-2 bg-blue-50 rounded-lg">
                        <h4 className="text-xs font-semibold text-blue-900 mb-1">
                          Extras ({producto.extras.length})
                        </h4>
                        <div className="space-y-0.5">
                          {producto.extras.map((extra, extraIndex) => (
                            <p key={extraIndex} className="text-xs text-blue-700">
                              • {extra.nombreCostoExtra} x{extra.cantidad}
                              {extra.nota && ` - ${extra.nota}`}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Ingredientes extras agregados */}
                    {producto.ingredientesExtras.length > 0 && (
                      <div className="mb-2 p-2 bg-green-50 rounded-lg">
                        <h4 className="text-xs font-semibold text-green-900 mb-1">
                          Ingredientes Extras ({producto.ingredientesExtras.length})
                        </h4>
                        <div className="space-y-0.5">
                          {producto.ingredientesExtras.map((ing, ingIndex) => (
                            <p key={ingIndex} className="text-xs text-green-700">
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
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 px-2 py-1 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                      >
                        <Edit className="w-3 h-3" />
                        {producto.extras.length > 0 ? 'Editar' : 'Agregar'} Extras
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAbrirIngredientes(index)}
                        className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800 px-2 py-1 bg-green-50 hover:bg-green-100 rounded transition-colors"
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
              className="px-6 py-2.5 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all font-medium shadow-lg"
            >
              Crear Pedido
            </button>
          </div>
        </motion.div>
      </form>

      {/* Popup Seleccionar Producto */}
      <PopupSeleccionarProducto
        isOpen={popupProductoOpen}
        onClose={() => setPopupProductoOpen(false)}
        onSelect={handleAgregarProducto}
      />

      {/* Popup Agregar Extras */}
      <PopupAgregarExtras
        isOpen={popupExtrasOpen}
        onClose={() => {
          setPopupExtrasOpen(false);
          setProductoEditandoIndex(null);
        }}
        onSave={handleGuardarExtras}
        extrasActuales={productoEditandoIndex !== null ? productos[productoEditandoIndex].extras : []}
      />

      {/* Popup Agregar Ingredientes Extras */}
      <PopupAgregarIngredientesExtras
        isOpen={popupIngredientesOpen}
        onClose={() => {
          setPopupIngredientesOpen(false);
          setProductoEditandoIndex(null);
        }}
        onSave={handleGuardarIngredientes}
        ingredientesActuales={productoEditandoIndex !== null ? productos[productoEditandoIndex].ingredientesExtras : []}
      />
    </div>
  );
};

export default CrearPedido;
