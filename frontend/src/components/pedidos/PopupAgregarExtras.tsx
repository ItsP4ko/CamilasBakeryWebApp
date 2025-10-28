import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCostoExtra } from '@/hooks/useCostoExtra';
import Select from 'react-select'; 

interface Extra {
  idCostoExtra: number;
  nombreCostoExtra: string;
  cantidad: number;
  nota: string;
}

interface PopupAgregarExtrasProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (extras: Extra[]) => void;
  extrasActuales?: Extra[];
}

const PopupAgregarExtras: React.FC<PopupAgregarExtrasProps> = ({
  isOpen,
  onClose,
  onSave,
  extrasActuales = []
}) => {
  const { data: costosExtra, isLoading } = useCostoExtra();
  const [extras, setExtras] = useState<Extra[]>(extrasActuales);
  const [costoExtraSeleccionado, setCostoExtraSeleccionado] = useState<any>(null);
  const [cantidad, setCantidad] = useState<string>(''); 
  const [nota, setNota] = useState<string>('');

  const handleAgregarExtra = () => {
    if (!costoExtraSeleccionado) return;

    const cantidadNum = parseFloat(cantidad) || 0;

    const nuevoExtra: Extra = {
      idCostoExtra: costoExtraSeleccionado.value,
      nombreCostoExtra: costoExtraSeleccionado.label,
      cantidad: cantidadNum,
      nota: nota
    };

    setExtras([...extras, nuevoExtra]);
    setCostoExtraSeleccionado(null);
    setCantidad('');
    setNota('');
  };

  const handleEliminarExtra = (index: number) => {
    setExtras(extras.filter((_, i) => i !== index));
  };

  const handleGuardar = () => {
    onSave(extras);
    onClose();
  };

  const handleClose = () => {
    setExtras(extrasActuales);
    setCostoExtraSeleccionado(null);
    setCantidad('');
    setNota('');
    onClose();
  };

  // 🔍 Opciones para react-select
  const opciones = costosExtra?.map((c: any) => ({
    value: c.idCostoExtra,
    label: `${c.nombre} - $${c.precioUnitario?.toLocaleString('es-AR')}`
  })) || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Fondo oscuro */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Contenedor */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl mx-4 max-h-[80vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Agregar Extras</h3>
              <button onClick={handleClose} className="text-white/80 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cuerpo */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Formulario para agregar extra */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">Agregar nuevo extra</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Buscador React Select */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Costo Extra
                    </label>
                    <Select
                      isLoading={isLoading}
                      options={opciones}
                      value={costoExtraSeleccionado}
                      onChange={setCostoExtraSeleccionado}
                      placeholder="Buscar extra..."
                      classNamePrefix="react-select"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          borderRadius: '0.5rem',
                          borderColor: state.isFocused ? '#1c1e1dff' : '#d1d5db',
                          padding: '2px',
                          boxShadow: 'none',
                          backgroundColor: document.documentElement.classList.contains('dark') ? '#4b5563' : 'white',
                          '&:hover': { borderColor: '#1c1e1dff' }
                        }),
                        menu: (base) => ({
                          ...base,
                          backgroundColor: document.documentElement.classList.contains('dark') ? '#374151' : 'white',
                          borderRadius: '0.5rem',
                        }),
                        option: (base, state) => ({
                          ...base,
                          backgroundColor: state.isFocused 
                            ? (document.documentElement.classList.contains('dark') ? '#4b5563' : '#f3f4f6')
                            : (document.documentElement.classList.contains('dark') ? '#374151' : 'white'),
                          color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
                          '&:active': {
                            backgroundColor: document.documentElement.classList.contains('dark') ? '#4b5563' : '#e5e7eb'
                          }
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
                        }),
                        input: (base) => ({
                          ...base,
                          color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280',
                        }),
                      }}
                    />
                  </div>

                  {/* Input cantidad */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cantidad
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={cantidad}
                      onChange={(e) => setCantidad(e.target.value)}
                      placeholder="Ej: 0.5, 1, 5, ..."
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                </div>

                {/* Nota */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nota (Opcional)
                  </label>
                  <input
                    type="text"
                    value={nota}
                    onChange={(e) => setNota(e.target.value)}
                    placeholder="Ej: Sin azúcar, extra dulce, etc..."
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>

                {/* Botón agregar */}
                <button
                  onClick={handleAgregarExtra}
                  disabled={!costoExtraSeleccionado}
                  className="w-full flex items-center justify-center gap-2 bg-primary-500 text-white px-4 py-2.5 rounded-lg hover:bg-primary-600 disabled:bg-primary-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Agregar Extra
                </button>
              </div>

              {/* Lista de extras agregados */}
              {extras.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Extras agregados ({extras.length})
                  </h4>
                  <div className="space-y-2">
                    {extras.map((extra, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg p-3"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-gray-100">{extra.nombreCostoExtra}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Cantidad: {extra.cantidad}
                            {extra.nota && ` • Nota: ${extra.nota}`}
                          </p>
                        </div>
                        <button
                          onClick={() => handleEliminarExtra(index)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-100 dark:bg-gray-900 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardar}
                className="px-6 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
              >
                Guardar Extras
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PopupAgregarExtras;
