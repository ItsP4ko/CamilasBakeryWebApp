import React from "react";
import { usePedidoCompleto } from "@/hooks/usePedidos";
import { generarPDFPedido } from "@/utils/pdfGenerator";

interface PedidoDetallePopupProps {
  id: number;
  onClose: () => void;
}

const PedidoDetallePopup: React.FC<PedidoDetallePopupProps> = ({ id, onClose }) => {
  const { data: pedido, isLoading, error } = usePedidoCompleto(id);
  
  const handleGenerarPDF = () => {
    if (pedido) {
      generarPDFPedido(pedido);
    }
  };

  if (isLoading)
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 shadow-lg">Cargando pedido...</div>
      </div>
    );

  if (error || !pedido)
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 shadow-lg text-red-500">
          Error al cargar el pedido.
          <button onClick={onClose} className="mt-4 bg-primary-500 text-white px-4 py-2 rounded-lg">
            Cerrar
          </button>
        </div>
      </div>
    );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-primary-100 dark:bg-gray-800 rounded-xl p-4 sm:p-6 w-full max-w-lg shadow-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 dark:text-white">Detalle del Pedido ID: #{pedido.idPedido}</h2>
        <p className="text-sm sm:text-base dark:text-gray-300"><strong>Cliente:</strong> {pedido.nombreCliente}</p>
        <p className="text-sm sm:text-base dark:text-gray-300"><strong>Telefono:</strong> +{pedido.telefonoCliente}</p>
        <p className="text-sm sm:text-base dark:text-gray-300">
          <strong>Fecha:</strong>{" "}
          {pedido.fecha.split("T")[0].split("-").reverse().join("/")}
        </p>
        <p className="text-sm sm:text-base dark:text-gray-300"><strong>Estado:</strong> {pedido.estado}</p>
        <p className="text-sm sm:text-base dark:text-gray-300"><strong>Estado de pago:</strong> {pedido.metodoDePago}</p>
        <p className="text-sm sm:text-base dark:text-gray-300"><strong>Total:</strong> $ {pedido.total?.toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
        </p> 
        {pedido.detallePedidos?.map((detalle: any, idx: number) => (
          <div key={idx} className="mt-4 border rounded-lg p-3 bg-primary-50 dark:bg-gray-700">
            <h3 className="font-semibold text-sm sm:text-base dark:text-white">{detalle.nombreTorta}, {detalle.tamanoMedida} </h3>
            <div className="flex justify-between items-center">
              <p className="text-sm dark:text-gray-300">
                Cantidad: {detalle.cantidad}
              </p>
              <p className="font-semibold text-right text-sm sm:text-base dark:text-white">
               $ {detalle.totalProducto?.toLocaleString("es-AR", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      })}
              </p>
            </div>
            {detalle.extras?.length > 0 && (
              <ul className="list-disc list-inside text-xs sm:text-sm text-primary-600 dark:text-primary-400">
                <p className="font-medium">Extras: </p>
                {detalle.extras.map((e: any, i: number) => (
                  <li key={i}>
                  {e.nombreCostoExtra} × {e.cantidad}
                  {e.nota ? `  "${e.nota}"` : ""}
                </li>
                ))}
              </ul>
            )}
            {detalle.ingredientesExtras?.length > 0 && (
              <ul className="list-disc list-inside text-xs sm:text-sm text-primary-600 dark:text-primary-400">
                <p className="font-medium">Ingredientes extras: </p>
                {detalle.ingredientesExtras.map((e: any, i: number) => (
                  <li key={i}>
                  {e.nombreIngrediente} × {e.cantidad}
                  {e.nota ? `  "${e.nota}"` : ""}
                </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
          >
            Cancelar
          </button>

          <button
            onClick={handleGenerarPDF}
            className="w-full sm:w-auto bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600"
          >
            Enviar
          </button>
        </div>

      </div>
    </div>
  );
};

export default PedidoDetallePopup;


