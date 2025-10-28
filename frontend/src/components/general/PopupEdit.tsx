import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PopupEditProps {
  isOpen: boolean;
  tipo: 'ingrediente' | 'costoextra';
  itemData: {
    id: number;
    nombre: string;
    precioUnitario: number;
    stock?: number | null;
    maxStock?: number | null;
  };
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const PopupEdit: React.FC<PopupEditProps> = ({ 
  isOpen, 
  tipo, 
  itemData,
  onClose, 
  onSubmit 
}) => {
  const [precioUnitario, setPrecioUnitario] = useState<string>('');
  const [stock, setStock] = useState<string>('');
  const [maxStock, setMaxStock] = useState<string>('');

  useEffect(() => {
    if (isOpen && itemData) {
      setPrecioUnitario(itemData.precioUnitario.toString());
      setStock(itemData.stock !== null && itemData.stock !== undefined ? itemData.stock.toString() : '');
    }
  }, [isOpen, itemData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data: any = {};
    
    if (precioUnitario && precioUnitario !== itemData.precioUnitario.toString()) {
      data.PrecioUnitario = parseFloat(precioUnitario);
    }
    
    if (stock !== '' && stock !== (itemData.stock?.toString() ?? '')) {
      data.Stock = stock === '' ? null : parseFloat(stock);
    }

    if (maxStock !== '' && maxStock !== (itemData.maxStock?.toString() ?? '')) {
      data.maxStock = maxStock === '' ? null : parseFloat(maxStock);
    }

    if (Object.keys(data).length > 0) {
      onSubmit(data);
    }
  };

  const handleClose = () => {
    setPrecioUnitario('');
    setStock('');
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
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-gray-800 dark:to-gray-900 px-6 py-4 flex items-center justify-between border-b dark:border-gray-700">
              <h3 className="text-xl font-bold text-white">
                Editar {tipo === 'ingrediente' ? 'Ingrediente' : 'Costo Extra'}
              </h3>
              <button
                onClick={handleClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Nombre (read-only) */}
              <div>
                <label className="block text-sm font-medium text-primary-900 dark:text-gray-200 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={itemData.nombre}
                  disabled
                  className="w-full px-4 py-2.5 bg-primary-100 dark:bg-gray-900 text-primary-500 dark:text-gray-500 border border-primary-300 dark:border-gray-700 rounded-lg cursor-not-allowed"
                />
              </div>

              {/* Precio Unitario */}
              <div>
                <label className="block text-sm font-medium text-primary-900 dark:text-gray-200 mb-2">
                  Precio Unitario *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={precioUnitario}
                  onChange={(e) => setPrecioUnitario(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-primary-50 dark:bg-gray-900 text-primary-900 dark:text-white border border-primary-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="Ingrese el precio"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-primary-900 dark:text-gray-200 mb-2">
                  Stock
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full px-4 py-2.5 bg-primary-50 dark:bg-gray-900 text-primary-900 dark:text-white border border-primary-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="Ingrese el stock (opcional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-900 dark:text-gray-200 mb-2">
                  100%
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={maxStock}
                  onChange={(e) => setMaxStock(e.target.value)}
                  className="w-full px-4 py-2.5 bg-primary-50 dark:bg-gray-900 text-primary-900 dark:text-white border border-primary-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="modifique stock considerado 100% (opcional)"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2.5 bg-primary-100 dark:bg-gray-900 text-primary-700 dark:text-gray-300 rounded-lg hover:bg-primary-200 dark:hover:bg-gray-800 transition-colors font-medium border border-transparent dark:border-gray-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 dark:from-gray-700 dark:to-gray-800 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 dark:hover:from-gray-800 dark:hover:to-gray-900 transition-all font-medium shadow-lg"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PopupEdit;
