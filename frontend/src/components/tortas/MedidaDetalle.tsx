import React from "react";
import { Medida } from "@/types/tortas";

interface MedidaDetalleProps {
  medida: Medida;
  tortaId: number;
}

const MedidaDetalle: React.FC<MedidaDetalleProps> = ({ medida }) => {
  return (
    <div className="text-left border-t border-gray-300 dark:border-gray-600 pt-3 space-y-2">
      <div className="flex justify-between text-xs">
        <span className="text-gray-600 dark:text-gray-400">Costo Ingredientes:</span>
        <span className="font-semibold text-gray-900 dark:text-gray-100">${medida.CostoIngredientes.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-gray-600 dark:text-gray-400">Costos Extra:</span>
        <span className="font-semibold text-gray-900 dark:text-gray-100">${medida.CostoExtras.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm font-bold border-t border-gray-300 dark:border-gray-600 pt-2">
        <span className="text-gray-700 dark:text-gray-300">Costo Total:</span>
        <span className="text-red-600 dark:text-red-400">${medida.CostoTotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm font-bold">
        <span className="text-gray-700 dark:text-gray-300">Precio Venta:</span>
        <span className="text-green-600 dark:text-green-400">${medida.PrecioVenta.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm font-bold bg-gray-100 dark:bg-gray-700 p-2 rounded">
        <span className="text-gray-800 dark:text-gray-200">Ganancia:</span>
        <span className="text-gray-800 dark:text-gray-200">${medida.Ganancia.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default MedidaDetalle;
