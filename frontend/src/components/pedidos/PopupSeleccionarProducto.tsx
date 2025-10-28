import React, { useState } from 'react';
import { X, Search, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTortasSimple, useMedidasPorTorta } from '@/hooks/usePedidoSeleccion';
import { TortaSimple } from '@/types/pedidoSeleccion';

interface PopupSeleccionarProductoProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (producto: any) => void;
}

const PopupSeleccionarProducto: React.FC<PopupSeleccionarProductoProps> = ({
  isOpen,
  onClose,
  onSelect
}) => {
  const { data: tortas, isLoading: loadingTortas } = useTortasSimple();
  const [tortaSeleccionada, setTortaSeleccionada] = useState<TortaSimple | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cantidad, setCantidad] = useState(1);

  const { data: medidas, isLoading: loadingMedidas } = useMedidasPorTorta(
    tortaSeleccionada?.idTorta ?? null
  );

  const tortasFiltradas = tortas?.filter(torta =>
    torta.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSeleccionarMedida = (medida: any) => {
    const producto = {
      idMedida: medida.idMedidaDetalle,
      nombreTorta: tortaSeleccionada!.nombre,
      nombreMedida: medida.tamano,
      cantidad: cantidad,
      extras: [],
      ingredientesExtras: []
    };
    
    onSelect(producto);
    handleClose();
  };

  const handleClose = () => {
    setTortaSeleccionada(null);
    setSearchTerm('');
    setCantidad(1);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                {tortaSeleccionada ? `Seleccionar Medida - ${tortaSeleccionada.nombre}` : 'Seleccionar Torta'}
              </h3>
              <button
                onClick={handleClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {!tortaSeleccionada ? (
                /* Lista de Tortas */
                <div className="space-y-4">
                  {/* Búsqueda */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Buscar torta..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>

                  {/* Lista de tortas */}
                  {loadingTortas ? (
                    <div className="text-center py-8 text-gray-600 dark:text-gray-400">Cargando tortas...</div>
                  ) : (
                    <div className="space-y-2">
                      {tortasFiltradas?.map((torta: any) => (
                        <button
                          key={torta.idTorta}
                          onClick={() => setTortaSeleccionada(torta)}
                          className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors text-left"
                        >
                          <span className="font-medium text-gray-900 dark:text-gray-100">{torta.nombre}</span>
                          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Lista de Medidas */
                <div className="space-y-4">
                  {/* Botón volver */}
                  <button
                    onClick={() => setTortaSeleccionada(null)}
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium"
                  >
                    ← Volver a tortas
                  </button>

                  {/* Cantidad */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cantidad
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={cantidad}
                      onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>

                  {/* Lista de medidas */}
                  {loadingMedidas ? (
                    <div className="text-center py-8 text-gray-600 dark:text-gray-400">Cargando medidas...</div>
                  ) : (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Seleccione una medida:</h4>
                      {medidas?.map((medida: any) => (
                        <button
                          key={medida.idMedidaDetalle}
                          onClick={() => handleSeleccionarMedida(medida)}
                          className="w-full p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors text-left"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-medium text-gray-900 dark:text-gray-100">{medida.tamano}</span>
                            </div>
                            <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                              ${medida.precio?.toLocaleString('es-AR')}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PopupSeleccionarProducto;
