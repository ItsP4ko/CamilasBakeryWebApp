import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Package, Search, Plus, ArrowUpLeft, DollarSignIcon, Trash2, Edit } from 'lucide-react';
import { useCostoExtra, useCreateCostoExtra, useUpdateCostoExtra, useDeleteCostoExtra } from '../hooks/useCostoExtra';
import StatsCard from '@/components/general/StatsCard';
import PopupForm from '@/components/general/PopUpCreate';
import PopupEdit from '@/components/general/PopupEdit';
import PopupConfirm from '@/components/general/PopupConfirm';

const CostoExtra: React.FC = () => {
  const { data, isLoading, error } = useCostoExtra();
  const [searchTerm, setSearchTerm] = useState('');

  const [popupCreateOpen, setPopupCreateOpen] = useState(false);
  const [popupEditOpen, setPopupEditOpen] = useState(false);
  const [popupConfirmOpen, setPopupConfirmOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [itemToDelete, setItemToDelete] = useState<{ id: number; nombre: string } | null>(null);
  
  const { mutate } = useCreateCostoExtra(); 
  const { mutate: updateMutate } = useUpdateCostoExtra();
  const { mutate: deleteMutate } = useDeleteCostoExtra(); 

  // Crear nuevo Costo Extra
  const handleCreate = (formData: any) => {
    console.log("Datos enviados al backend:", formData);
    
    // ✅ Cerrar el popup INMEDIATAMENTE (optimistic UI)
    setPopupCreateOpen(false);
  
    // ⏳ La mutación ocurre en segundo plano con optimistic update
    mutate(formData, {
      onError: (err: any) => {
        console.error("Error al crear costo extra:");
        // El rollback automático ya está manejado en el hook
      }, 
    });
  };

  // Actualizar costo extra
  const handleUpdate = (formData: any) => {
    if (!selectedItem) return;
    
    // ✅ Cerrar el popup INMEDIATAMENTE (optimistic UI)
    setPopupEditOpen(false);
    setSelectedItem(null);
    
    // ⏳ La mutación ocurre en segundo plano con optimistic update
    updateMutate(
      { id: selectedItem.idCostoExtra, data: formData },
      {
        onError: (err: any) => {
          console.error("Error al actualizar costo extra:");
          // El rollback automático ya está manejado en el hook
        },
      }
    );
  };

  // Eliminar costo extra
  const handleDelete = (id: number, nombre: string) => {
    setItemToDelete({ id, nombre });
    setPopupConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;
    
    // ✅ Cerrar el popup INMEDIATAMENTE (optimistic UI)
    setPopupConfirmOpen(false);
    const itemId = itemToDelete.id;
    setItemToDelete(null);
    
    // ⏳ La mutación ocurre en segundo plano con optimistic update
    deleteMutate(itemId, {
      onError: (err: any) => {
        console.error("Error al eliminar costo extra:", err.response?.data || err);
        // El rollback automático ya está manejado en el hook
      },
    });
  };

  const cancelDelete = () => {
    setPopupConfirmOpen(false);
    setItemToDelete(null);
  };

  // Abrir popup de edición
  const handleEdit = (costo: any) => {
    setSelectedItem(costo);
    setPopupEditOpen(true);
  };

  // Filtrar costos extra por búsqueda
  const filteredData = data?.filter((costo) =>
    costo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    costo.nota?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        Error al cargar los costos extra: {error.message}
      </div>
    );
  }

  // Calcular estadísticas
  const totalItems = data?.length || 0;
  const costoExtraMasCostoso = data?.reduce((max, costo) => 
    costo.precioUnitario > max.precioUnitario ? costo : max
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-900 dark:text-primary-100 mb-2">
          Costos Extra
        </h1>
        <p className="text-sm sm:text-base text-primary-600 dark:text-primary-400">
          Gestión de costos adicionales para productos
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        <StatsCard
          label="Total Items"
          value={totalItems}
          icon={Package}
          iconColor="primary"
          delay={0}
          onClick={() => setSearchTerm("")}
        />
        <StatsCard
          label="Costo extra mas costoso"
          value={costoExtraMasCostoso?.nombre ?? "N/A"}
          icon={DollarSignIcon}
          iconColor="primary"
          delay={0}
          onClick={() => setSearchTerm(costoExtraMasCostoso?.nombre ?? "")}
        />
        <StatsCard
          label="Reportes y estadisticas"
          value={"Vistar"}
          icon={ArrowUpLeft}
          iconColor="primary"
          delay={0}
          href="/reportes/costosExtras"
        />
      </div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-primary-200 dark:bg-gray-800 rounded-xl shadow-sm border border-primary-200 dark:border-gray-700 p-4 mb-6 sm:mb-8"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 dark:text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre o nota..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 
             bg-primary-100 dark:bg-gray-700 text-primary-900 dark:text-white
             placeholder-primary-500 dark:placeholder-gray-400
             border border-primary-300 dark:border-gray-600
             rounded-lg 
             focus:ring-2 focus:ring-primary-400 focus:border-transparent 
             outline-none"/>
        </div>

        {/* Línea inferior: Mostrar / Agregar */}
        <div className="flex items-center justify-between mt-2 text-xs sm:text-sm text-primary-600 dark:text-gray-400">
          {filteredData && filteredData.length > 0 ? (
            <p>
              {filteredData.length} de {totalItems} costos extra
            </p>
          ) : (
            <p>&nbsp;</p>
          )}

          <button
            onClick={() => setPopupCreateOpen(true)}
            className="flex items-center gap-1 text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors text-xs font-medium"
          >
            <Plus className="w-4 h-4" />
            Agregar
          </button>
        </div>
      </motion.div>

      {/* Tabla / Cards Responsive */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="bg-primary-50 dark:bg-gray-800 rounded-xl shadow-sm border border-primary-200 dark:border-gray-700 overflow-hidden"
      >
        {/* 📱 VISTA MÓVIL - Cards */}
        <div className="block lg:hidden p-4 space-y-4">
          {(filteredData || []).map((costo, index) => (
            <motion.div
              key={costo.idCostoExtra}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
              className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-md space-y-3"
            >
              {/* Header con nombre y acciones */}
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span className="font-semibold text-gray-900 dark:text-white">{costo.nombre}</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">ID: {costo.idCostoExtra}</span>
                </div>
                
                {/* Acciones */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(costo)}
                    className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(costo.idCostoExtra, costo.nombre)}
                    className="p-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Detalles */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-400 font-medium">Stock</label>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {costo.stock !== null && costo.stock !== undefined ? costo.stock : '-'}
                  </p>
                </div>
                
                {costo.nota && costo.nota.trim() !== '' && (
                  <div className="col-span-2">
                    <label className="text-xs text-gray-600 dark:text-gray-400 font-medium">Nota</label>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-200 dark:bg-primary-900 text-primary-800 dark:text-primary-300">
                        {costo.nota}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Precio */}
              <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                <label className="text-xs text-gray-600 dark:text-gray-400 font-medium">Precio Unitario</label>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                  {costo.precioUnitario?.toLocaleString('es-AR', {
                    style: 'currency',
                    currency: 'ARS',
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 💻 VISTA DESKTOP - Tabla */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-primary-50 dark:bg-gray-700 border-b border-primary-200 dark:border-gray-600">
                <th className="bg-primary-200 dark:bg-gray-700 px-6 py-4 text-left text-xs font-semibold text-primary-700 dark:text-gray-300 uppercase tracking-wider">
                  ID
                </th>
                <th className="bg-primary-200 dark:bg-gray-700 px-6 py-4 text-left text-xs font-semibold text-primary-700 dark:text-gray-300 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="bg-primary-200 dark:bg-gray-700 px-6 py-4 text-left text-xs font-semibold text-primary-700 dark:text-gray-300 uppercase tracking-wider">
                  Stock
                </th>
                <th className="bg-primary-200 dark:bg-gray-700 px-6 py-4 text-left text-xs font-semibold text-primary-700 dark:text-gray-300 uppercase tracking-wider">
                  Precio Unitario
                </th>
                <th className="bg-primary-200 dark:bg-gray-700 px-6 py-4 text-left text-xs font-semibold text-primary-700 dark:text-gray-300 uppercase tracking-wider">
                  Nota
                </th>
                <th className="bg-primary-200 dark:bg-gray-700 px-6 py-4 text-center text-xs font-semibold text-primary-700 dark:text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-200 dark:divide-gray-600">
              {(filteredData || []).map((costo, index) => (
                <motion.tr
                  key={costo.idCostoExtra}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  className="hover:bg-primary-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-primary-900 dark:text-white font-medium">
                    {costo.idCostoExtra}
                  </td>
                  <td className="px-6 py-4 text-sm text-primary-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      <span className="font-medium">{costo.nombre}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-primary-900 dark:text-white">
                    <span className="font-semibold">
                      {costo.stock !== null && costo.stock !== undefined ? costo.stock : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-600 dark:text-green-400">
                    {costo.precioUnitario?.toLocaleString('es-AR', {
                      style: 'currency',
                      currency: 'ARS',
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-6 py-4 text-sm text-primary-600 dark:text-gray-400">
                    {costo.nota && costo.nota.trim() !== '' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-200 dark:bg-primary-900 text-primary-800 dark:text-primary-300">
                        {costo.nota}
                      </span>
                    ) : (
                      <span className="text-primary-400 dark:text-gray-500 italic">Sin nota</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(costo)}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(costo.idCostoExtra, costo.nombre)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredData && filteredData.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 font-medium">No se encontraron costos extra</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              Intenta con otro término de búsqueda
            </p>
          </div>
        )}
      </motion.div>

      {/* Popup de creación */}
      <PopupForm
        isOpen={popupCreateOpen}
        tipo="costoextra"
        onClose={() => setPopupCreateOpen(false)}
        onSubmit={handleCreate}
      />

      {/* Popup de edición */}
      {selectedItem && (
        <PopupEdit
          isOpen={popupEditOpen}
          tipo="costoextra"
          itemData={{
            id: selectedItem.idCostoExtra,
            nombre: selectedItem.nombre,
            precioUnitario: selectedItem.precioUnitario,
            stock: selectedItem.stock
          }}
          onClose={() => {
            setPopupEditOpen(false);
            setSelectedItem(null);
          }}
          onSubmit={handleUpdate}
        />
      )}

      {/* Popup de confirmación de eliminación */}
      <PopupConfirm
        isOpen={popupConfirmOpen}
        title="Eliminar Costo Extra"
        message="¿Está seguro de que desea eliminar este costo extra?"
        itemName={itemToDelete?.nombre}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default CostoExtra;

