import React, { useState } from "react";
import { useTortas } from "../hooks/useTortas";
import { TortaCard } from "@/components/tortas/TortaCard";
import { BotonesGestionTorta } from "@/components/tortas/BotonesGestionTorta";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Tortas: React.FC = () => {
  const { data, isLoading, error } = useTortas();
  const navigate = useNavigate();
  const [tortaSeleccionada, setTortaSeleccionada] = useState<number | null>(null);
  const [medidasSeleccionadas, setMedidasSeleccionadas] = useState<Record<number, number | null>>({});
  const [searchTerm, setSearchTerm] = useState('');

  if (isLoading)
    return <div className="text-center py-10 text-gray-600 dark:text-gray-400">Cargando tortas...</div>;

  if (error)
    return (
      <div className="text-center text-red-600 dark:text-red-400">
        Error al cargar las tortas: {error.message}
      </div>
    );

  if (!data?.length)
    return <div className="text-center text-gray-500 dark:text-gray-400">No hay tortas disponibles</div>;

  // Filtrar tortas por nombre
  const filteredData = data.filter((torta) =>
    torta.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );



  // Función para ir a gestión de medidas
  const handleGestionarMedidas = (tortaId: number) => {
    navigate(`/tortas/${tortaId}/medidas`);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-10 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Catálogo de Tortas</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Gestión de tortas y precios</p>
      </div>

      {/* Search Bar con botones integrados */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-8"
      >
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar torta por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 
             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
             placeholder-gray-500 dark:placeholder-gray-400
             border border-gray-300 dark:border-gray-600 
             rounded-lg 
             focus:ring-2 focus:ring-primary-400 focus:border-transparent 
             outline-none"/>
        </div>

        {/* Botones de gestión integrados */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Mostrando {filteredData.length} de {data?.length || 0} tortas
          </span>
          <BotonesGestionTorta
            tortaSeleccionada={data.find(t => t.IdTorta === tortaSeleccionada) || null}
          />
        </div>
      </motion.div>

      {/* Resultados */}
      {filteredData.length === 0 ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          No se encontraron tortas con "{searchTerm}"
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 items-start">
          {filteredData.map((torta) => (
            <TortaCard
              key={torta.IdTorta}
              torta={torta}
              isExpanded={tortaSeleccionada === torta.IdTorta}
              onToggle={() => {
                setTortaSeleccionada((prev) =>
                  prev === torta.IdTorta ? null : torta.IdTorta
                );
                setMedidasSeleccionadas((prev) => ({
                  ...prev,
                  [torta.IdTorta]: null
                }));
              }}
              medidaSeleccionada={medidasSeleccionadas[torta.IdTorta] || null}
              onMedidaSelect={(medidaId) => {
                setMedidasSeleccionadas((prev) => ({
                  ...prev,
                  [torta.IdTorta]: medidaId
                }));
              }}
              onGestionarMedidas={handleGestionarMedidas}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Tortas;