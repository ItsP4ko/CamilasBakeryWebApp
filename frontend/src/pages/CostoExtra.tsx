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
  
   mutate(formData, {
      onSuccess: () => {
        setPopupCreateOpen(false);
      },
      onError: (err: any) => {
        console.error("Error al crear costo extra:");
        alert("Error al crear costo extra. Verifica los datos.");
      }, 
    });
  };

  // Actualizar costo extra
  const handleUpdate = (formData: any) => {
    if (!selectedItem) return;
    
    updateMutate(
      { id: selectedItem.idCostoExtra, data: formData },
      {
        onSuccess: () => {
          setPopupEditOpen(false);
          setSelectedItem(null);
        },
        onError: (err: any) => {
          console.error("Error al actualizar costo extra:");
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
    
    deleteMutate(itemToDelete.id, {
      onSuccess: () => {
        setPopupConfirmOpen(false);
        setItemToDelete(null);
      },
      onError: (err: any) => {
        console.error("Error al eliminar costo extra:", err.response?.data || err);
        alert("Error al eliminar el costo extra");
        setPopupConfirmOpen(false);
        setItemToDelete(null);
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
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-900 mb-2">
          Costos Extra
        </h1>
        <p className="text-primary-600">
          Gestión de costos adicionales para productos
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
        className="bg-primary-200 rounded-xl shadow-sm border border-primary-200 p-4 mb-8"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre o nota..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 
             bg-primary-100 text-primary-900 
             placeholder-primary-500
             border border-primary-300 
             rounded-lg 
             focus:ring-2 focus:ring-primary-400 focus:border-transparent 
             outline-none"/>
        </div>
         {/* Línea inferior: Mostrar / Agregar */}
         <div className="flex items-center justify-between mt-2 text-sm text-primary-600">
          {filteredData && filteredData.length > 0 ? (
            <p>
              Mostrando {filteredData.length} de {totalItems} ingredientes
            </p>
          ) : (
            <p>&nbsp;</p>
          )}

          <button
            onClick={() => setPopupCreateOpen(true)}
            className="flex items-center gap-1 text-primary-500 hover:text-primary-700 transition-colors text-xs font-medium"
          >
            <Plus className="w-4 h-4" />
            Agregar
          </button>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="bg-primary-50 rounded-xl shadow-sm border border-primary-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-primary-50 border-b border-primary-200">
                <th className="bg-primary-200 px-6 py-4 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider">
                  ID
                </th>
                <th className="bg-primary-200 px-6 py-4 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="bg-primary-200 px-6 py-4 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider">
                  Stock
                </th>
                <th className="bg-primary-200 px-6 py-4 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider">
                  Precio Unitario
                </th>
                <th className="bg-primary-200 px-6 py-4 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider">
                  Nota
                </th>
                <th className="bg-primary-200 px-6 py-4 text-center text-xs font-semibold text-primary-700 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-200">
              {(filteredData || []).map((costo, index) => (
                <motion.tr
                  key={costo.idCostoExtra}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  className="hover:bg-primary-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-primary-900 font-medium">
                    {costo.idCostoExtra}
                  </td>
                  <td className="px-6 py-4 text-sm text-primary-900">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      <span className="font-medium">{costo.nombre}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-primary-900 text-center">
                    <span className="font-semibold">
                      {costo.stock !== null && costo.stock !== undefined ? costo.stock : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-600">
                    {costo.precioUnitario?.toLocaleString('es-AR', {
                      style: 'currency',
                      currency: 'ARS',
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-6 py-4 text-sm text-primary-600">
                    {costo.nota && costo.nota.trim() !== '' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium  bg-primary-200 text-primary-800">
                        {costo.nota}
                      </span>
                    ) : (
                      <span className="text-primary-400 italic">Sin nota</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(costo)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(costo.idCostoExtra, costo.nombre)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

        {/* Empty State */}
        {filteredData && filteredData.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No se encontraron costos extra</p>
            <p className="text-gray-400 text-sm mt-1">
              Intenta con otro término de búsqueda
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CostoExtra;

