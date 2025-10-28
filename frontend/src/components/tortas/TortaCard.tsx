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
      className={`rounded-xl border-2 transition-all ${
        disponible 
          ? "cursor-pointer border-primary-200 bg-primary-200 hover:border-primary-400" 
          : "cursor-pointer border-primary-200 bg-primary-50 hover:border-primary-300"
      } ${isExpanded ? "shadow-lg" : "shadow-sm"}`}
    >
      {/* Header simple */}
      <div className="p-6 text-center">
        <h2 className={`text-2xl font-bold mb-2 ${
          disponible ? "text-primary-900" : "text-primary-400"
        }`}>
          {torta.Nombre}
        </h2>
        
        <p className={`text-sm ${disponible ? "text-primary-600" : "text-primary-400"}`}>
          {disponible 
            ? `${torta.CantidadMedidas} ${torta.CantidadMedidas === 1 ? "tamaño disponible" : "tamaños disponibles"}`
            : "No disponible"
          }
        </p>
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
            className="overflow-hidden border-t border-primary-100"
          >
            <div className="p-5 space-y-3 bg-primary-50 rounded-b-xl">
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
                  <p className="text-primary-600 mb-4">
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