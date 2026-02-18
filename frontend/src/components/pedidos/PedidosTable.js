import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PopupConfirm from "@/components/general/PopupConfirm";
const estados = ["Pendiente", "Falta decorar", "Completado", "Entregado", "Cancelado"];
const metodos = ["Efectivo", "Brubank", "Uala", "Mercado Pago", "Definir"];
const PedidosTable = ({ data, isLoading, onView, onUpdate, onDelete }) => {
    const navigate = useNavigate();
    const [popupConfirmOpen, setPopupConfirmOpen] = useState(false);
    const [pedidoToDelete, setPedidoToDelete] = useState(null);
    // Estado local para actualizaciones optimistas
    const [pedidosLocales, setPedidosLocales] = useState(data);
    // Sincroniza con los datos del servidor cuando cambian
    React.useEffect(() => {
        setPedidosLocales(data);
    }, [data]);
    const handleUpdate = (pedidoActualizado) => {
        // Actualiza inmediatamente el estado local (solo los campos visibles)
        setPedidosLocales((prevPedidos) => prevPedidos.map((p) => {
            if (p.idPedido === pedidoActualizado.idPedido) {
                // Solo actualiza los campos que son visibles en la UI
                const updated = { ...p };
                if (pedidoActualizado.fecha !== undefined)
                    updated.fecha = pedidoActualizado.fecha;
                if (pedidoActualizado.estado !== undefined)
                    updated.estado = pedidoActualizado.estado;
                if (pedidoActualizado.metodoDePago !== undefined)
                    updated.metodoDePago = pedidoActualizado.metodoDePago;
                return updated;
            }
            return p;
        }));
        // Envía al servidor en background CON los flags intactos
        onUpdate(pedidoActualizado);
    };
    const handleDeleteClick = (id, nombreCliente) => {
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
    if (isLoading)
        return _jsx("div", { className: "p-6 text-center", children: "Cargando pedidos..." });
    if (!pedidosLocales?.length)
        return _jsx("div", { className: "p-6 text-center text-primary-500 dark:text-primary-400", children: "No hay pedidos." });
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "block lg:hidden space-y-4", children: pedidosLocales.map((pedido) => (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 space-y-3", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900 dark:text-white", children: pedido.nombreCliente }), _jsxs("p", { className: "text-2xl font-bold text-green-600 dark:text-green-400 mt-1", children: ["$", pedido.total?.toLocaleString("es-AR", {
                                                    minimumFractionDigits: 0,
                                                    maximumFractionDigits: 0,
                                                })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => onView(pedido), className: "p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition", title: "Ver detalle", children: _jsx(Eye, { size: 20 }) }), _jsx("button", { onClick: () => navigate(`/pedidos/modificar/${pedido.idPedido}`), className: "p-2 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition", title: "Modificar", children: _jsx(Edit, { size: 20 }) }), _jsx("button", { onClick: () => handleDeleteClick(pedido.idPedido, pedido.nombreCliente), className: "p-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition", title: "Eliminar", children: _jsx(Trash2, { size: 20 }) })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs text-gray-600 dark:text-gray-400 font-medium", children: "Fecha" }), _jsx("input", { type: "date", value: /^\d{2}\/\d{2}\/\d{4}$/.test(pedido.fecha)
                                        ? pedido.fecha.split("/").reverse().join("-")
                                        : pedido.fecha ?? "", onChange: (e) => {
                                        const [yyyy, mm, dd] = e.target.value.split("-");
                                        const fechaFormateada = `${dd}/${mm}/${yyyy}`;
                                        handleUpdate({
                                            ...pedido,
                                            fecha: fechaFormateada,
                                            _cambioFecha: true,
                                        });
                                    }, className: "w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs text-gray-600 dark:text-gray-400 font-medium", children: "Estado" }), _jsx("select", { value: pedido.estado, onChange: (e) => handleUpdate({
                                        ...pedido,
                                        estado: e.target.value,
                                        _soloEstado: true,
                                    }), className: "w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1", children: estados.map((estado) => (_jsx("option", { value: estado, children: estado }, estado))) })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs text-gray-600 dark:text-gray-400 font-medium", children: "M\u00E9todo de Pago" }), _jsx("select", { value: pedido.metodoDePago, onChange: (e) => handleUpdate({
                                        ...pedido,
                                        metodoDePago: e.target.value,
                                        _cambioMetodo: true,
                                    }), className: "w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1", children: metodos.map((m) => (_jsx("option", { value: m, children: m }, m))) })] })] }, pedido.idPedido))) }), _jsx("div", { className: "hidden lg:block w-full overflow-x-auto", children: _jsxs("table", { className: "min-w-full text-left text-sm", children: [_jsx("thead", { className: "bg-primary-200 dark:bg-gray-700", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 dark:text-gray-200", children: "Cliente" }), _jsx("th", { className: "px-6 py-3 dark:text-gray-200", children: "Fecha" }), _jsx("th", { className: "px-6 py-3 dark:text-gray-200", children: "Estado" }), _jsx("th", { className: "px-6 py-3 dark:text-gray-200", children: "M\u00E9todo de Pago" }), _jsx("th", { className: "px-6 py-3 dark:text-gray-200", children: "Total" }), _jsx("th", { className: "px-6 py-3 dark:text-gray-200", children: "Acciones" })] }) }), _jsx("tbody", { children: pedidosLocales.map((pedido) => (_jsxs("tr", { className: "bg-primary-50 dark:bg-gray-800 border-t dark:border-gray-700 hover:bg-primary-100 dark:hover:bg-gray-750 transition", children: [_jsx("td", { className: "px-6 py-2 dark:text-gray-200", children: pedido.nombreCliente }), _jsx("td", { className: "px-6 py-2", children: _jsx("input", { type: "date", value: /^\d{2}\/\d{2}\/\d{4}$/.test(pedido.fecha)
                                                ? pedido.fecha.split("/").reverse().join("-")
                                                : pedido.fecha ?? "", onChange: (e) => {
                                                const [yyyy, mm, dd] = e.target.value.split("-");
                                                const fechaFormateada = `${dd}/${mm}/${yyyy}`;
                                                handleUpdate({
                                                    ...pedido,
                                                    fecha: fechaFormateada,
                                                    _cambioFecha: true,
                                                });
                                            }, className: "border rounded px-2 py-1 text-sm w-36 bg-primary-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white" }) }), _jsx("td", { className: "px-6 py-2", children: _jsx("select", { value: pedido.estado, onChange: (e) => handleUpdate({
                                                ...pedido,
                                                estado: e.target.value,
                                                _soloEstado: true,
                                            }), className: "border rounded px-2 py-1 text-sm bg-primary-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white", children: estados.map((estado) => (_jsx("option", { value: estado, children: estado }, estado))) }) }), _jsx("td", { className: "px-6 py-2", children: _jsx("select", { value: pedido.metodoDePago, onChange: (e) => handleUpdate({
                                                ...pedido,
                                                metodoDePago: e.target.value,
                                                _cambioMetodo: true,
                                            }), className: "border rounded px-2 py-1 text-sm bg-primary-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white", children: metodos.map((m) => (_jsx("option", { value: m, children: m }, m))) }) }), _jsxs("td", { className: "px-6 py-4 text-sm font-semibold text-green-600 dark:text-green-400", children: ["$", pedido.total?.toLocaleString("es-AR", {
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0,
                                            })] }), _jsx("td", { className: "px-6 py-2", children: _jsxs("div", { className: "flex items-center gap-8", children: [_jsx("button", { onClick: () => onView(pedido), className: "flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors", title: "Ver detalle", children: _jsx(Eye, { size: 16 }) }), _jsx("button", { onClick: () => navigate(`/pedidos/modificar/${pedido.idPedido}`), className: "flex items-center gap-1 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors", title: "Modificar", children: _jsx(Edit, { size: 16 }) }), _jsx("button", { onClick: () => handleDeleteClick(pedido.idPedido, pedido.nombreCliente), className: "flex items-center gap-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors", title: "Eliminar", children: _jsx(Trash2, { size: 16 }) })] }) })] }, pedido.idPedido))) })] }) }), _jsx(PopupConfirm, { isOpen: popupConfirmOpen, title: "Eliminar Pedido", message: "\u00BFEst\u00E1 seguro de que desea eliminar este pedido? Esta acci\u00F3n no se puede deshacer.", itemName: pedidoToDelete?.nombre, onConfirm: confirmDelete, onCancel: cancelDelete })] }));
};
export default PedidosTable;
