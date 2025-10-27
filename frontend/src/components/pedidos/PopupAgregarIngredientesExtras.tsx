import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIngredientes } from '@/hooks/useIngredientes';
import Select from 'react-select'; 

interface IngredienteExtra {
  idIngrediente: number;
  nombreIngrediente: string;
  cantidad: number;
  nota: string;
}

interface PopupAgregarIngredientesExtrasProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ingredientesExtras: IngredienteExtra[]) => void;
  ingredientesActuales?: IngredienteExtra[];
}

const PopupAgregarIngredientesExtras: React.FC<PopupAgregarIngredientesExtrasProps> = ({
  isOpen,
  onClose,
  onSave,
  ingredientesActuales = []
}) => {
  const { data: ingredientes, isLoading } = useIngredientes();
  const [ingredientesExtras, setIngredientesExtras] = useState<IngredienteExtra[]>(ingredientesActuales);
  const [ingredienteSeleccionado, setIngredienteSeleccionado] = useState<any>(null);
  const [cantidad, setCantidad] = useState<string>(''); 
  const [nota, setNota] = useState<string>('');

  const handleAgregarIngrediente = () => {
    if (!ingredienteSeleccionado) return;

    const cantidadNum = parseFloat(cantidad) || 0; 

    const nuevoIngredienteExtra: IngredienteExtra = {
      idIngrediente: ingredienteSeleccionado.value,
      nombreIngrediente: ingredienteSeleccionado.label,
      cantidad: cantidadNum,
      nota: nota
    };

    setIngredientesExtras([...ingredientesExtras, nuevoIngredienteExtra]);
    setIngredienteSeleccionado(null);
    setCantidad('');
    setNota('');
  };

  const handleEliminarIngrediente = (index: number) => {
    setIngredientesExtras(ingredientesExtras.filter((_, i) => i !== index));
  };

  const handleGuardar = () => {
    onSave(ingredientesExtras);
    onClose();
  };

  const handleClose = () => {
    setIngredientesExtras(ingredientesActuales);
    setIngredienteSeleccionado(null);
    setCantidad('');
    setNota('');
    onClose();
  };

  // Opciones para el selector de ingredientes
  const opciones = ingredientes?.map((i: any) => ({
    value: i.idIngrediente,
    label: `${i.nombre} (${i.unidadCompra}) - $${i.precioUnitario?.toLocaleString('es-AR')}`
  })) || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Fondo oscurecido */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Contenedor del popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 max-h-[80vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Agregar Ingredientes Extras</h3>
              <button onClick={handleClose} className="text-white/80 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cuerpo */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Formulario para agregar nuevo ingrediente */}
              <div className="bg-green-50 rounded-lg p-4 space-y-4">
                <h4 className="font-semibold text-primary-900">Agregar nuevo ingrediente extra</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Selector de ingrediente */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Ingrediente
                    </label>
                    <Select
                      isLoading={isLoading}
                      options={opciones}
                      value={ingredienteSeleccionado}
                      onChange={setIngredienteSeleccionado}
                      placeholder="Buscar ingrediente..."
                      classNamePrefix="react-select"
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderRadius: '0.5rem',
                          borderColor: '#d1d5db',
                          padding: '2px',
                          boxShadow: 'none',
                          '&:hover': { borderColor: '#10b981' }
                        }),
                      }}
                    />
                  </div>

                  {/* Input cantidad */}
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Cantidad
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={cantidad}
                      onChange={(e) => setCantidad(e.target.value)} 
                      placeholder="Ej: 0.5, 1, 5, ..."
                      className="w-full px-4 py-2.5 bg-white text-primary-900 border border-primary-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                </div>

                {/* Input nota */}
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Nota (Opcional)
                  </label>
                  <input
                    type="text"
                    value={nota}
                    onChange={(e) => setNota(e.target.value)}
                    placeholder="Ej: Extra chocolate, doble porción, etc..."
                    className="w-full px-4 py-2.5 bg-white text-primary-900 border border-primary-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>

                {/* Botón agregar */}
                <button
                  onClick={handleAgregarIngrediente}
                  disabled={!ingredienteSeleccionado}
                  className="w-full flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2.5 rounded-lg hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Agregar Ingrediente
                </button>
              </div>

              {/* Lista de ingredientes agregados */}
              {ingredientesExtras.length > 0 && (
                <div>
                  <h4 className="font-semibold text-primary-900 mb-3">
                    Ingredientes extras agregados ({ingredientesExtras.length})
                  </h4>
                  <div className="space-y-2">
                    {ingredientesExtras.map((ingrediente, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white border border-green-200 rounded-lg p-3"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-primary-900">{ingrediente.nombreIngrediente}</p>
                          <p className="text-sm text-primary-600">
                            Cantidad: {ingrediente.cantidad}
                            {ingrediente.nota && ` • Nota: ${ingrediente.nota}`}
                          </p>
                        </div>
                        <button
                          onClick={() => handleEliminarIngrediente(index)}
                          className="text-red-600 hover:text-red-800 p-2"
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
            <div className="bg-green-50 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="px-6 py-2.5 bg-white text-primary-700 border border-primary-300 rounded-lg hover:bg-primary-100 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardar}
                className="px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                Guardar Ingredientes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PopupAgregarIngredientesExtras;
