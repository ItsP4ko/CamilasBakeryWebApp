import React, { useState } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PopupConfirm from "@/components/general/PopupConfirm";

const estados = ["Pendiente", "Falta decorar", "Completado", "Entregado", "Cancelado"];
const metodos = ["Efectivo", "Brubank", "Uala", "Mercado Pago", "Definir"];

interface PedidosTableProps {
  data: any[];
  isLoading: boolean;
  onView: (pedido: any) => void;
  onUpdate: (pedido: any) => void;
  onDelete: (idPedido: number) => void;
}

const PedidosTable: React.FC<PedidosTableProps> = ({ data, isLoading, onView, onUpdate, onDelete }) => {
  const navigate = useNavigate();
  const [popupConfirmOpen, setPopupConfirmOpen] = useState(false);
  const [pedidoToDelete, setPedidoToDelete] = useState<{ id: number; nombre: string } | null>(null);
  
  const handleUpdate = (pedidoActualizado: any) => {
    onUpdate(pedidoActualizado);
  };

  const handleDeleteClick = (id: number, nombreCliente: string) => {
    setPedidoToDelete({ id, nombre: nombreCliente });
    setPopupConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (pedidoToDelete) {
      onDelete(pedidoToDelete.id);
      setPopupConfirmOpen(false);
      setPedidoToDelete(null);
    }
  };

  const cancelDelete = () => {
    setPopupConfirmOpen(false);
    setPedidoToDelete(null);
  };

  if (isLoading) return <div className="p-6 text-center">Cargando pedidos...</div>;
  if (!data?.length) return <div className="p-6 text-center text-primary-500 dark:text-primary-400">No hay pedidos.</div>;

  return (
    <>
      {/* VISTA MÓVIL - Cards */}
      <div className="block lg:hidden space-y-4">
        {data.map((pedido: any) => (
          <div 
            key={pedido.idPedido} 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 space-y-3"
          >
            {/* Header con nombre y total */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {pedido.nombreCliente}
                </h3>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                  ${pedido.total?.toLocaleString("es-AR", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
              
              {/* Acciones */}
              <div className="flex gap-2">
                <button
                  onClick={() => onView(pedido)}
                  className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                  title="Ver detalle"
                >
                  <Eye size={20} />
                </button>
                <button
                  onClick={() => navigate(`/pedidos/modificar/${pedido.idPedido}`)}
                  className="p-2 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition"
                  title="Modificar"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => handleDeleteClick(pedido.idPedido, pedido.nombreCliente)}
                  className="p-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition"
                  title="Eliminar"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            {/* Fecha */}
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400 font-medium">Fecha</label>
              <input
                type="date"
                value={
                  /^\d{2}\/\d{2}\/\d{4}$/.test(pedido.fecha)
                    ? pedido.fecha.split("/").reverse().join("-")
                    : pedido.fecha ?? ""
                }
                onChange={(e) => {
                  const [yyyy, mm, dd] = e.target.value.split("-");
                  const fechaFormateada = `${dd}/${mm}/${yyyy}`;
                  handleUpdate({
                    ...pedido,
                    fecha: fechaFormateada,
                    _cambioFecha: true,
                  });
                }}
                className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1"
              />
            </div>

            {/* Estado */}
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400 font-medium">Estado</label>
              <select
                value={pedido.estado}
                onChange={(e) =>
                  handleUpdate({
                    ...pedido,
                    estado: e.target.value,
                    _soloEstado: true,
                  })
                }
                className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1"
              >
                {estados.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
            </div>

            {/* Método de pago */}
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400 font-medium">Método de Pago</label>
              <select
                value={pedido.metodoDePago}
                onChange={(e) =>
                  handleUpdate({
                    ...pedido,
                    metodoDePago: e.target.value,
                    _cambioMetodo: true,
                  })
                }
                className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1"
              >
                {metodos.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* 💻 VISTA DESKTOP - Tabla */}
      <div className="hidden lg:block w-full overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-primary-200 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 dark:text-gray-200">Cliente</th>
              <th className="px-6 py-3 dark:text-gray-200">Fecha</th>
              <th className="px-6 py-3 dark:text-gray-200">Estado</th>
              <th className="px-6 py-3 dark:text-gray-200">Método de Pago</th>
              <th className="px-6 py-3 dark:text-gray-200">Total</th>
              <th className="px-6 py-3 dark:text-gray-200">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((pedido: any) => (
              <tr key={pedido.idPedido} className="bg-primary-50 dark:bg-gray-800 border-t dark:border-gray-700 hover:bg-primary-100 dark:hover:bg-gray-750 transition">
                <td className="px-6 py-2 dark:text-gray-200">{pedido.nombreCliente}</td>

                {/* Fecha editable */}
                <td className="px-6 py-2">
                  <input
                    type="date"
                    value={
                      /^\d{2}\/\d{2}\/\d{4}$/.test(pedido.fecha)
                        ? pedido.fecha.split("/").reverse().join("-")
                        : pedido.fecha ?? ""
                    }
                    onChange={(e) => {
                      const [yyyy, mm, dd] = e.target.value.split("-");
                      const fechaFormateada = `${dd}/${mm}/${yyyy}`;

                      handleUpdate({
                        ...pedido,
                        fecha: fechaFormateada,
                        _cambioFecha: true,
                      });
                    }}
                    className="border rounded px-2 py-1 text-sm w-36 bg-primary-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </td>

                {/* Estado combobox */}
                <td className="px-6 py-2">
                  <select
                    value={pedido.estado}
                    onChange={(e) =>
                      handleUpdate({
                        ...pedido,
                        estado: e.target.value,
                        _soloEstado: true,
                      })
                    }
                    className="border rounded px-2 py-1 text-sm bg-primary-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    {estados.map((estado) => (
                      <option key={estado} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Método de pago combobox */}
                <td className="px-6 py-2">
                  <select
                    value={pedido.metodoDePago}
                    onChange={(e) =>
                      handleUpdate({
                        ...pedido,
                        metodoDePago: e.target.value,
                        _cambioMetodo: true,
                      })
                    }
                    className="border rounded px-2 py-1 text-sm bg-primary-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    {metodos.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Total */}
                <td className="px-6 py-4 text-sm font-semibold text-green-600 dark:text-green-400">
                  $
                  {pedido.total?.toLocaleString("es-AR", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </td>

                {/* Acciones */}
                <td className="px-6 py-2">
                  <div className="flex items-center gap-8">
                    <button
                      onClick={() => onView(pedido)}
                      className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                      title="Ver detalle"
                    >
                      <Eye size={16} /> 
                    </button>

                    
                    <button
                      onClick={() => navigate(`/pedidos/modificar/${pedido.idPedido}`)}
                      className="flex items-center gap-1 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors"
                      title="Modificar"
                    >
                      <Edit size={16} />
                    </button>

                    <button
                      onClick={() => handleDeleteClick(pedido.idPedido, pedido.nombreCliente)}
                      className="flex items-center gap-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup de confirmación de eliminación */}
      <PopupConfirm
        isOpen={popupConfirmOpen}
        title="Eliminar Pedido"
        message="¿Está seguro de que desea eliminar este pedido? Esta acción no se puede deshacer."
        itemName={pedidoToDelete?.nombre}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  );
};

export default PedidosTable;
