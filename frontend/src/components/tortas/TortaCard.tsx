import React, { memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Torta } from "@/types/tortas";
import MedidaButton from "./MedidaButton";
import { Settings } from "lucide-react";

interface TortaCardProps {
  torta: Torta;
  isExpanded: boolean;
  onToggle: () => void;
  medidaSeleccionada: number | null;
  onMedidaSelect: (id: number | null) => void;
  onGestionarMedidas: (tortaId: number) => void;
}

export const TortaCard: React.FC<TortaCardProps> = memo(({
  torta,
  isExpanded,
  onToggle,
  medidaSeleccionada,
  onMedidaSelect,
  onGestionarMedidas,
}) => {
  const disponible = torta.CantidadMedidas > 0;

  const handleMedidaClick = useCallback((e: React.MouseEvent, medidaId: number) => {
    e.stopPropagation();
    onMedidaSelect(medidaSeleccionada === medidaId ? null : medidaId);
  }, [medidaSeleccionada, onMedidaSelect]);

  const handleGestionarClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onGestionarMedidas(torta.IdTorta);
  }, [torta.IdTorta, onGestionarMedidas]);

  return (
    <motion.div
      onClick={onToggle}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      className={`rounded-xl border-2 transition-all ${disponible
          ? "cursor-pointer border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 hover:border-primary-400 dark:hover:border-primary-500"
          : "cursor-pointer border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500"
        } ${isExpanded ? "shadow-lg" : "shadow-sm"}`}
    >
      {/* Header simple */}
      <div className="p-6 text-center">
        <h2 className={`text-2xl font-bold mb-2 ${disponible ? "text-gray-900 dark:text-gray-100" : "text-gray-400 dark:text-gray-500"
          }`}>
          {torta.Nombre}
        </h2>

        <div className={`text-sm ${disponible ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"}`}>
          <p className="mb-1">
            {disponible
              ? `${torta.CantidadMedidas} ${torta.CantidadMedidas === 1 ? "tamaño disponible" : "tamaños disponibles"}`
              : "No disponible"
            }
          </p>
          <p className="text-xs font-semibold text-primary-600 dark:text-primary-400">
            Multiplicador: {(() => {
              if (torta.Medidas.length === 0) return `${torta.MultiplicadorGanancia}x`;
              const reales = torta.Medidas.map(m => m.MultiplicadorReal);
              const min = Math.min(...reales);
              const max = Math.max(...reales);
              return min === max ? `${min}x` : `${min}x - ${max}x`;
            })()}
          </p>
        </div>
      </div>

      {/* Contenido expandible */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut"
            }}
            className="overflow-hidden border-t border-gray-200 dark:border-gray-600"
          >
            <div className="p-5 space-y-3 bg-gray-50 dark:bg-gray-800 rounded-b-xl">
              {disponible ? (
                <>
                  {/* Lista de medidas para tortas disponibles */}
                  <div className="space-y-2">
                    {torta.Medidas.map((medida) => (
                      <MedidaButton
                        key={medida.IdMedida}
                        medida={medida}
                        tortaId={torta.IdTorta}
                        isSelected={medidaSeleccionada === medida.IdMedida}
                        onClick={(e) => handleMedidaClick(e, medida.IdMedida)}
                      />
                    ))}
                  </div>

                  {/* Botón de gestionar medidas */}
                  <button
                    onClick={handleGestionarClick}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 
                      bg-primary-500 text-white rounded-lg hover:bg-primary-600 
                      transition-colors font-medium"
                  >
                    <Settings className="w-5 h-5" />
                    Gestionar Medidas
                  </button>
                </>
              ) : (
                /* Contenido para tortas no disponibles */
                <div className="text-center py-4">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Esta torta no tiene medidas configuradas
                  </p>
                  <button
                    onClick={handleGestionarClick}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 
                      bg-primary-500 text-white rounded-lg hover:bg-primary-600 
                      transition-colors font-medium"
                  >
                    <Settings className="w-5 h-5" />
                    Configurar Medidas
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});