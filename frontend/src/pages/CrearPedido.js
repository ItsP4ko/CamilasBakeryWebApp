import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Plus, Trash2, Edit } from 'lucide-react';
import { useCrearPedido } from '@/hooks/usePedidos';
// ✅ Lazy load de popups (solo se cargan cuando se abren)
const PopupSeleccionarProducto = lazy(() => import('@/components/pedidos/PopupSeleccionarProducto'));
const PopupAgregarExtras = lazy(() => import('@/components/pedidos/PopupAgregarExtras'));
const PopupAgregarIngredientesExtras = lazy(() => import('@/components/pedidos/PopupAgregarIngredientesExtras'));
const CrearPedido = () => {
    const navigate = useNavigate();
    const crearPedidoMutation = useCrearPedido();
    const [nombreCliente, setNombreCliente] = useState('');
    const [telefonoCliente, setTelefonoCliente] = useState('');
    const [fecha, setFecha] = useState('');
    const [nota, setNota] = useState('');
    const [metodoDePago, setMetodoDePago] = useState('Definir');
    const [productos, setProductos] = useState([]);
    // Estados para popups
    const [popupProductoOpen, setPopupProductoOpen] = useState(false);
    const [popupExtrasOpen, setPopupExtrasOpen] = useState(false);
    const [popupIngredientesOpen, setPopupIngredientesOpen] = useState(false);
    const [productoEditandoIndex, setProductoEditandoIndex] = useState(null);
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('🎯 [CrearPedido] handleSubmit iniciado');
        console.log('📊 [CrearPedido] Estado actual:', {
            nombreCliente,
            telefonoCliente,
            fecha,
            nota,
            metodoDePago,
            cantidadProductos: productos.length
        });
        if (productos.length === 0) {
            console.warn('⚠️ [CrearPedido] No hay productos, mostrando alerta');
            alert('Debe agregar al menos un producto al pedido');
            return;
        }
        console.log('📦 [CrearPedido] Productos a enviar:', JSON.stringify(productos, null, 2));
        const pedidoDTO = {
            nombreCliente: nombreCliente,
            telefonoCliente: telefonoCliente,
            fecha: fecha,
            nota: nota,
            precioExtra: 0,
            metodoDePago: metodoDePago,
            detallePedidos: productos.map(p => ({
                idMedida: p.idMedida,
                cantidad: p.cantidad,
                extras: p.extras.map(e => ({
                    idCostoExtra: e.idCostoExtra,
                    cantidad: e.cantidad,
                    nota: e.nota,
                    precioVentaManual: e.precioVentaManual
                })),
                ingredientesExtras: p.ingredientesExtras.map(i => ({
                    idIngrediente: i.idIngrediente,
                    cantidad: i.cantidad,
                    nota: i.nota,
                    precioVentaManual: i.precioVentaManual
                }))
            }))
        };
        console.log('📝 [CrearPedido] DTO construido:', JSON.stringify(pedidoDTO, null, 2));
        console.log('🚀 [CrearPedido] Llamando a crearPedidoMutation.mutate()');
        crearPedidoMutation.mutate(pedidoDTO, {
            onSuccess: () => {
                console.log('✅ [CrearPedido] Pedido creado exitosamente, navegando a /pedidos');
                navigate('/pedidos');
            },
            onError: (error) => {
                console.error('❌ [CrearPedido] Error en onError callback:', error);
                console.error('❌ [CrearPedido] Error response:', error.response?.data);
            }
        });
        console.log('🔄 [CrearPedido] Mutation enviada, esperando respuesta...');
    };
    const handleAgregarProducto = (producto) => {
        setProductos([...productos, producto]);
        setPopupProductoOpen(false);
    };
    const handleEliminarProducto = (index) => {
        setProductos(productos.filter((_, i) => i !== index));
    };
    const handleAbrirExtras = (index) => {
        setProductoEditandoIndex(index);
        setPopupExtrasOpen(true);
    };
    const handleAbrirIngredientes = (index) => {
        setProductoEditandoIndex(index);
        setPopupIngredientesOpen(true);
    };
    const handleGuardarExtras = (extras) => {
        if (productoEditandoIndex !== null) {
            const nuevosProductos = [...productos];
            nuevosProductos[productoEditandoIndex].extras = extras;
            setProductos(nuevosProductos);
        }
        setProductoEditandoIndex(null);
    };
    const handleGuardarIngredientes = (ingredientes) => {
        if (productoEditandoIndex !== null) {
            const nuevosProductos = [...productos];
            nuevosProductos[productoEditandoIndex].ingredientesExtras = ingredientes;
            setProductos(nuevosProductos);
        }
        setProductoEditandoIndex(null);
    };
    return (_jsxs("div", { className: "max-w-7xl mx-auto p-4 sm:p-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6", children: [_jsxs("div", { className: "flex items-center gap-3 sm:gap-4", children: [_jsx("button", { onClick: () => navigate('/pedidos'), className: "p-2 hover:bg-primary-100 dark:hover:bg-gray-700 rounded-lg transition-colors", children: _jsx(ArrowLeft, { className: "w-5 h-5 sm:w-6 sm:h-6 text-primary-700 dark:text-primary-400" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-xl sm:text-2xl font-bold text-primary-900 dark:text-white", children: "Crear Nuevo Pedido" }), _jsx("p", { className: "text-xs sm:text-sm text-primary-600 dark:text-gray-400", children: "Complete la informaci\u00F3n del pedido" })] })] }), _jsxs("button", { onClick: handleSubmit, disabled: crearPedidoMutation.isPending, className: "w-full sm:w-auto flex items-center justify-center gap-2 bg-primary-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow hover:bg-primary-600 transition disabled:bg-primary-300 disabled:cursor-not-allowed text-sm sm:text-base", children: [_jsx(Save, { className: "w-4 h-4 sm:w-5 sm:h-5" }), crearPedidoMutation.isPending ? 'Guardando...' : 'Guardar Pedido'] })] }), _jsx("form", { onSubmit: handleSubmit, children: _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-semibold text-primary-900 dark:text-white mb-3", children: "Informaci\u00F3n del Cliente" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "nombreCliente", className: "block text-sm font-medium text-primary-700 dark:text-gray-300 mb-2", children: "Nombre del Cliente *" }), _jsx("input", { id: "nombreCliente", type: "text", value: nombreCliente, onChange: (e) => setNombreCliente(e.target.value), required: true, className: "w-full px-4 py-2.5 bg-primary-50 dark:bg-gray-700 text-primary-900 dark:text-gray-100 border border-primary-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none", placeholder: "Ej: Mar\u00EDa Gonz\u00E1lez" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "telefono", className: "block text-sm font-medium text-primary-700 dark:text-gray-300 mb-2", children: "Tel\u00E9fono (Opcional)" }), _jsx("input", { id: "telefono", type: "tel", value: telefonoCliente, onChange: (e) => setTelefonoCliente(e.target.value), className: "w-full px-4 py-2.5 bg-primary-50 dark:bg-gray-700 text-primary-900 dark:text-gray-100 border border-primary-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none", placeholder: "Ej: 3413456789" })] })] })] }), _jsxs("div", { children: [_jsx("h2", { className: "text-lg font-semibold text-primary-900 dark:text-white mb-3", children: "Detalles del Pedido" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "fecha", className: "block text-sm font-medium text-primary-700 dark:text-gray-300 mb-2", children: "Fecha de Entrega *" }), _jsx("input", { id: "fecha", type: "date", value: fecha, onChange: (e) => setFecha(e.target.value), required: true, className: "w-full px-4 py-2.5 bg-primary-50 dark:bg-gray-700 text-primary-900 dark:text-gray-100 border border-primary-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "metodoDePago", className: "block text-sm font-medium text-primary-700 dark:text-gray-300 mb-2", children: "M\u00E9todo de Pago *" }), _jsxs("select", { id: "metodoDePago", value: metodoDePago, onChange: (e) => setMetodoDePago(e.target.value), required: true, className: "w-full px-4 py-2.5 bg-primary-50 dark:bg-gray-700 text-primary-900 dark:text-gray-100 border border-primary-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none", children: [_jsx("option", { value: "Definir", children: "Definir" }), _jsx("option", { value: "Efectivo", children: "Efectivo" }), _jsx("option", { value: "Brubank", children: "Brubank" }), _jsx("option", { value: "Uala", children: "Uala" }), _jsx("option", { value: "Mercado Pago", children: "Mercado Pago" })] })] })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-primary-700 dark:text-gray-300 mb-2", children: "Nota (Opcional)" }), _jsx("textarea", { value: nota, onChange: (e) => setNota(e.target.value), rows: 2, className: "w-full px-4 py-2.5 bg-primary-50 dark:bg-gray-700 text-primary-900 dark:text-gray-100 border border-primary-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none", placeholder: "Notas adicionales sobre el pedido..." })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h2", { className: "text-lg font-semibold text-primary-900 dark:text-white", children: "Productos del Pedido" }), _jsxs("button", { type: "button", onClick: () => setPopupProductoOpen(true), className: "flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors", children: [_jsx(Plus, { className: "w-5 h-5" }), "Agregar Producto"] })] }), productos.length === 0 ? (_jsxs("div", { className: "bg-primary-50 dark:bg-gray-700 rounded-lg p-6 text-center text-primary-600 dark:text-gray-400", children: [_jsx("p", { children: "No hay productos agregados" }), _jsx("p", { className: "text-sm mt-2", children: "Haz clic en \"Agregar Producto\" para comenzar" })] })) : (_jsx("div", { className: "space-y-2", children: productos.map((producto, index) => (_jsxs("div", { className: "bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3", children: [_jsxs("div", { className: "flex items-start justify-between mb-2", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("h3", { className: "font-semibold text-primary-900 dark:text-white", children: [producto.nombreTorta, " - ", producto.nombreMedida] }), _jsxs("p", { className: "text-sm text-primary-600 dark:text-gray-400", children: ["Cantidad: ", producto.cantidad] })] }), _jsx("button", { type: "button", onClick: () => handleEliminarProducto(index), className: "text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1", title: "Eliminar producto", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }), producto.extras.length > 0 && (_jsxs("div", { className: "mb-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg", children: [_jsxs("h4", { className: "text-xs font-semibold text-blue-900 dark:text-blue-300 mb-1", children: ["Extras (", producto.extras.length, ")"] }), _jsx("div", { className: "space-y-0.5", children: producto.extras.map((extra, extraIndex) => (_jsxs("p", { className: "text-xs text-blue-700 dark:text-blue-400", children: ["\u2022 ", extra.nombreCostoExtra, " x", extra.cantidad, extra.nota && ` - ${extra.nota}`] }, extraIndex))) })] })), producto.ingredientesExtras.length > 0 && (_jsxs("div", { className: "mb-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg", children: [_jsxs("h4", { className: "text-xs font-semibold text-green-900 dark:text-green-300 mb-1", children: ["Ingredientes Extras (", producto.ingredientesExtras.length, ")"] }), _jsx("div", { className: "space-y-0.5", children: producto.ingredientesExtras.map((ing, ingIndex) => (_jsxs("p", { className: "text-xs text-green-700 dark:text-green-400", children: ["\u2022 ", ing.nombreIngrediente, " x", ing.cantidad, ing.nota && ` - ${ing.nota}`] }, ingIndex))) })] })), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { type: "button", onClick: () => handleAbrirExtras(index), className: "flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors", children: [_jsx(Edit, { className: "w-3 h-3" }), producto.extras.length > 0 ? 'Editar' : 'Agregar', " Extras"] }), _jsxs("button", { type: "button", onClick: () => handleAbrirIngredientes(index), className: "flex items-center gap-1 text-xs text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 px-2 py-1 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded transition-colors", children: [_jsx(Edit, { className: "w-3 h-3" }), producto.ingredientesExtras.length > 0 ? 'Editar' : 'Agregar', " Ingredientes"] })] })] }, index))) }))] }), _jsxs("div", { className: "flex justify-end gap-3 pt-4", children: [_jsx("button", { type: "button", onClick: () => navigate('/pedidos'), className: "px-6 py-2.5 bg-primary-100 dark:bg-gray-700 text-primary-700 dark:text-gray-300 rounded-lg hover:bg-primary-200 dark:hover:bg-gray-600 transition-colors font-medium", children: "Cancelar" }), _jsx("button", { type: "submit", disabled: crearPedidoMutation.isPending, className: "px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed", children: crearPedidoMutation.isPending ? 'Creando...' : 'Crear Pedido' })] })] }) }), popupProductoOpen && (_jsx(Suspense, { fallback: _jsx("div", { className: "fixed inset-0 bg-black bg-opacity-40 z-50" }), children: _jsx(PopupSeleccionarProducto, { isOpen: popupProductoOpen, onClose: () => setPopupProductoOpen(false), onSelect: handleAgregarProducto }) })), popupExtrasOpen && (_jsx(Suspense, { fallback: _jsx("div", { className: "fixed inset-0 bg-black bg-opacity-40 z-50" }), children: _jsx(PopupAgregarExtras, { isOpen: popupExtrasOpen, onClose: () => {
                        setPopupExtrasOpen(false);
                        setProductoEditandoIndex(null);
                    }, onSave: handleGuardarExtras, extrasActuales: productoEditandoIndex !== null ? productos[productoEditandoIndex].extras : [], multiplicadorGanancia: productoEditandoIndex !== null ? productos[productoEditandoIndex].multiplicadorGanancia : undefined }) })), popupIngredientesOpen && (_jsx(Suspense, { fallback: _jsx("div", { className: "fixed inset-0 bg-black bg-opacity-40 z-50" }), children: _jsx(PopupAgregarIngredientesExtras, { isOpen: popupIngredientesOpen, onClose: () => {
                        setPopupIngredientesOpen(false);
                        setProductoEditandoIndex(null);
                    }, onSave: handleGuardarIngredientes, ingredientesActuales: productoEditandoIndex !== null ? productos[productoEditandoIndex].ingredientesExtras : [], multiplicadorGanancia: productoEditandoIndex !== null ? productos[productoEditandoIndex].multiplicadorGanancia : undefined }) }))] }));
};
export default CrearPedido;
