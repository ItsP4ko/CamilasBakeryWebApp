import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Edit2, Trash2, Package } from 'lucide-react';
import { usePedidoCompleto } from '@/hooks/usePedidos';
import PopupConfirm from '@/components/general/PopupConfirm';
import PopupSeleccionarProducto from '@/components/pedidos/PopupSeleccionarProducto';
import PopupAgregarExtras from '@/components/pedidos/PopupAgregarExtras';
import PopupAgregarIngredientesExtras from '@/components/pedidos/PopupAgregarIngredientesExtras';
import { useModificarDetallePedido, useEliminarDetallePedido, useAgregarDetallePedido, useEliminarExtra, useModificarExtra, useAgregarExtra, useEliminarIngredienteExtra, useModificarIngredienteExtra, useAgregarIngredienteExtra } from '@/hooks/usePedidosControl';
const ModificarPedido = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const pedidoId = Number(id);
    const { data: pedido, isLoading, error } = usePedidoCompleto(pedidoId);
    const modificarDetalle = useModificarDetallePedido();
    const eliminarDetalle = useEliminarDetallePedido();
    const agregarDetalle = useAgregarDetallePedido();
    const eliminarExtra = useEliminarExtra();
    const modificarExtra = useModificarExtra();
    const agregarExtra = useAgregarExtra();
    const eliminarIngExtra = useEliminarIngredienteExtra();
    const modificarIngExtra = useModificarIngredienteExtra();
    const agregarIngExtra = useAgregarIngredienteExtra();
    const [editingDetalle, setEditingDetalle] = useState(null);
    const [editingCantidad, setEditingCantidad] = useState(1);
    // Estados para modales
    const [showAgregarProducto, setShowAgregarProducto] = useState(false);
    const [showAgregarExtras, setShowAgregarExtras] = useState(null);
    const [showAgregarIngredientes, setShowAgregarIngredientes] = useState(null);
    // Estados para confirmación
    const [confirmDelete, setConfirmDelete] = useState({
        isOpen: false,
        type: null,
        id: null
    });
    // Loading state
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center py-20", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" }) }));
    }
    // Error state
    if (error || !pedido) {
        return (_jsxs("div", { className: "max-w-7xl mx-auto p-8", children: [_jsx("div", { className: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400", children: "Error al cargar el pedido" }), _jsxs("button", { onClick: () => navigate('/pedidos'), className: "mt-4 flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300", children: [_jsx(ArrowLeft, { className: "w-4 h-4" }), " Volver a pedidos"] })] }));
    }
    const handleModificarCantidad = (detalleId) => {
        if (editingCantidad > 0) {
            modificarDetalle.mutate({
                detallePedidoId: detalleId,
                cantidad: editingCantidad,
                pedidoId
            }, {
                onSuccess: () => {
                    setEditingDetalle(null);
                }
            });
        }
    };
    const handleEliminarDetalle = (detalleId, nombreTorta) => {
        setConfirmDelete({
            isOpen: true,
            type: 'detalle',
            id: detalleId,
            title: nombreTorta
        });
    };
    const handleEliminarExtra = (extraId, nombreExtra) => {
        setConfirmDelete({
            isOpen: true,
            type: 'extra',
            id: extraId,
            title: nombreExtra
        });
    };
    const handleEliminarIngredienteExtra = (ingExtraId, nombreIng) => {
        setConfirmDelete({
            isOpen: true,
            type: 'ingrediente',
            id: ingExtraId,
            title: nombreIng
        });
    };
    const confirmarEliminacion = () => {
        if (confirmDelete.id === null)
            return;
        const closeConfirm = () => setConfirmDelete({ isOpen: false, type: null, id: null });
        switch (confirmDelete.type) {
            case 'detalle':
                eliminarDetalle.mutate({ detallePedidoId: confirmDelete.id, pedidoId }, { onSettled: closeConfirm });
                break;
            case 'extra':
                eliminarExtra.mutate({ extraId: confirmDelete.id, pedidoId }, { onSettled: closeConfirm });
                break;
            case 'ingrediente':
                eliminarIngExtra.mutate({ ingredienteExtraId: confirmDelete.id, pedidoId }, { onSettled: closeConfirm });
                break;
        }
    };
    const handleAgregarProducto = (producto) => {
        agregarDetalle.mutate({
            pedidoId,
            idMedida: producto.idMedida,
            cantidad: producto.cantidad
        });
        setShowAgregarProducto(false);
    };
    const handleAgregarExtras = (extras) => {
        if (!showAgregarExtras)
            return;
        extras.forEach(extra => {
            agregarExtra.mutate({
                detallePedidoId: showAgregarExtras,
                idCostoExtra: extra.idCostoExtra,
                cantidad: extra.cantidad,
                nota: extra.nota,
                pedidoId
            });
        });
        setShowAgregarExtras(null);
    };
    const handleAgregarIngredientes = (ingredientes) => {
        if (!showAgregarIngredientes)
            return;
        ingredientes.forEach(ing => {
            agregarIngExtra.mutate({
                detallePedidoId: showAgregarIngredientes,
                idIngrediente: ing.idIngrediente,
                cantidad: ing.cantidad,
                nota: ing.nota,
                pedidoId
            });
        });
        setShowAgregarIngredientes(null);
    };
    return (_jsxs("div", { className: "max-w-7xl mx-auto p-8 relative", children: [_jsxs("div", { className: "flex items-center justify-between mb-8", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("button", { onClick: () => navigate('/pedidos'), className: "p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors", children: _jsx(ArrowLeft, { className: "w-6 h-6" }) }), _jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-900 dark:text-gray-100", children: ["Modificar Pedido #", pedido.idPedido] }), _jsxs("p", { className: "text-gray-600 dark:text-gray-400", children: ["Cliente: ", pedido.nombreCliente] })] })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Total del pedido" }), _jsxs("p", { className: "text-2xl font-bold text-green-600 dark:text-green-400", children: ["$", pedido.total?.toLocaleString('es-AR')] })] })] }), _jsx("div", { className: "mb-4", children: _jsxs("button", { onClick: () => setShowAgregarProducto(true), className: "flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors", children: [_jsx(Plus, { className: "w-5 h-5" }), "Agregar Producto al Pedido"] }) }), _jsx("div", { className: "space-y-4", children: pedido.detallePedidos && pedido.detallePedidos.length > 0 ? (pedido.detallePedidos.map((detalle) => (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "bg-primary-100 dark:bg-primary-900 p-2 rounded-lg", children: _jsx(Package, { className: "w-5 h-5 text-primary-600 dark:text-primary-400" }) }), _jsxs("div", { children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100", children: [detalle.nombreTorta, " - ", detalle.tamanoMedida] }), _jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: ["Subtotal unitario: $", (detalle.totalProducto / detalle.cantidad)?.toLocaleString('es-AR'), " x ", detalle.cantidad] })] })] }), _jsx("button", { onClick: () => handleEliminarDetalle(detalle.idDetallePedido, `${detalle.nombreTorta} - ${detalle.tamanoMedida}`), disabled: eliminarDetalle.isPending, className: "p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed", title: "Eliminar detalle", children: _jsx(Trash2, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "flex items-center gap-4 mb-4", children: [_jsx("label", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Cantidad:" }), editingDetalle === detalle.idDetallePedido ? (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "number", min: "1", value: editingCantidad, onChange: (e) => setEditingCantidad(Number(e.target.value)), className: "w-20 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" }), _jsx("button", { onClick: () => handleModificarCantidad(detalle.idDetallePedido), disabled: modificarDetalle.isPending, className: "px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed", children: modificarDetalle.isPending ? 'Guardando...' : 'Guardar' }), _jsx("button", { onClick: () => setEditingDetalle(null), className: "px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500", children: "Cancelar" })] })) : (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100", children: detalle.cantidad }), _jsx("button", { onClick: () => {
                                                setEditingDetalle(detalle.idDetallePedido);
                                                setEditingCantidad(detalle.cantidad);
                                            }, className: "p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded", title: "Editar cantidad", children: _jsx(Edit2, { className: "w-4 h-4" }) })] }))] }), detalle.extras && detalle.extras.length > 0 && (_jsxs("div", { className: "mt-4 pt-4 border-t border-gray-200 dark:border-gray-700", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h4", { className: "text-sm font-semibold text-gray-700 dark:text-gray-300", children: "Extras:" }), _jsxs("button", { onClick: () => setShowAgregarExtras(detalle.idDetallePedido), className: "text-xs flex items-center gap-1 px-2 py-1 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded", children: [_jsx(Plus, { className: "w-3 h-3" }), "Agregar Extra"] })] }), _jsx("div", { className: "space-y-2", children: detalle.extras.map((extra) => (_jsxs("div", { className: "flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("span", { className: "text-sm text-gray-900 dark:text-gray-100", children: [extra.nombreCostoExtra, " x", extra.cantidad] }), extra.nota && (_jsxs("p", { className: "text-xs text-gray-600 dark:text-gray-400 mt-1", children: ["Nota: ", extra.nota] }))] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: ["$", extra.precioMomento?.toLocaleString('es-AR')] }), _jsx("button", { onClick: () => handleEliminarExtra(extra.idExtras, extra.nombreCostoExtra), disabled: eliminarExtra.isPending, className: "p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded disabled:opacity-50", children: _jsx(Trash2, { className: "w-4 h-4" }) })] })] }, extra.idExtras))) })] })), !detalle.extras || detalle.extras.length === 0 && (_jsx("div", { className: "mt-4 pt-4 border-t border-gray-200 dark:border-gray-700", children: _jsxs("button", { onClick: () => setShowAgregarExtras(detalle.idDetallePedido), className: "text-sm flex items-center gap-1 px-3 py-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg", children: [_jsx(Plus, { className: "w-4 h-4" }), "Agregar Extra"] }) })), detalle.ingredientesExtras && detalle.ingredientesExtras.length > 0 && (_jsxs("div", { className: "mt-4 pt-4 border-t border-gray-200 dark:border-gray-700", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h4", { className: "text-sm font-semibold text-gray-700 dark:text-gray-300", children: "Ingredientes Extras:" }), _jsxs("button", { onClick: () => setShowAgregarIngredientes(detalle.idDetallePedido), className: "text-xs flex items-center gap-1 px-2 py-1 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded", children: [_jsx(Plus, { className: "w-3 h-3" }), "Agregar Ingrediente"] })] }), _jsx("div", { className: "space-y-2", children: detalle.ingredientesExtras.map((ing) => (_jsxs("div", { className: "flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("span", { className: "text-sm text-gray-900 dark:text-gray-100", children: [ing.nombreIngrediente, " - ", ing.cantidad, " ", ing.unidadCompra] }), ing.nota && (_jsxs("p", { className: "text-xs text-gray-600 dark:text-gray-400 mt-1", children: ["Nota: ", ing.nota] }))] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: ["$", ing.precioMomento?.toLocaleString('es-AR')] }), _jsx("button", { onClick: () => handleEliminarIngredienteExtra(ing.idIngredienteExtra, ing.nombreIngrediente), disabled: eliminarIngExtra.isPending, className: "p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded disabled:opacity-50", children: _jsx(Trash2, { className: "w-4 h-4" }) })] })] }, ing.idIngredienteExtra))) })] })), !detalle.ingredientesExtras || detalle.ingredientesExtras.length === 0 && (_jsx("div", { className: "mt-4 pt-4 border-t border-gray-200 dark:border-gray-700", children: _jsxs("button", { onClick: () => setShowAgregarIngredientes(detalle.idDetallePedido), className: "text-sm flex items-center gap-1 px-3 py-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg", children: [_jsx(Plus, { className: "w-4 h-4" }), "Agregar Ingrediente Extra"] }) })), _jsxs("div", { className: "mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Subtotal:" }), _jsxs("span", { className: "text-lg font-bold text-gray-900 dark:text-gray-100", children: ["$", detalle.totalProducto?.toLocaleString('es-AR')] })] })] }, detalle.idDetallePedido)))) : (_jsx("div", { className: "bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center", children: _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "No hay detalles en este pedido" }) })) }), _jsx(PopupConfirm, { isOpen: confirmDelete.isOpen, onCancel: () => setConfirmDelete({ isOpen: false, type: null, id: null }), onConfirm: confirmarEliminacion, title: "Confirmar Eliminaci\u00F3n", message: `¿Estás seguro de eliminar "${confirmDelete.title}"?` }), _jsx(PopupSeleccionarProducto, { isOpen: showAgregarProducto, onClose: () => setShowAgregarProducto(false), onSelect: handleAgregarProducto }), _jsx(PopupAgregarExtras, { isOpen: showAgregarExtras !== null, onClose: () => setShowAgregarExtras(null), onSave: handleAgregarExtras }), _jsx(PopupAgregarIngredientesExtras, { isOpen: showAgregarIngredientes !== null, onClose: () => setShowAgregarIngredientes(null), onSave: handleAgregarIngredientes })] }));
};
export default ModificarPedido;
