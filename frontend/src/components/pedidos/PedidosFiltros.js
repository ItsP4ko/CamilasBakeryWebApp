import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CalendarDays, DollarSign, CreditCard } from 'lucide-react';
const PedidosFiltros = ({ isOpen, onClose, onApplyFilters }) => {
    const [estado, setEstado] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [montoMinimo, setMontoMinimo] = useState('');
    const [montoMaximo, setMontoMaximo] = useState('');
    const [metodoPago, setMetodoPago] = useState('');
    const handleApply = () => {
        const filters = {};
        if (estado)
            filters.estado = estado;
        if (fechaInicio)
            filters.fechaInicio = fechaInicio;
        if (fechaFin)
            filters.fechaFin = fechaFin;
        if (montoMinimo)
            filters.montoMinimo = parseFloat(montoMinimo);
        if (montoMaximo)
            filters.montoMaximo = parseFloat(montoMaximo);
        if (metodoPago)
            filters.metodoPago = metodoPago;
        onApplyFilters(filters);
        onClose();
    };
    const handleClear = () => {
        setEstado('');
        setFechaInicio('');
        setFechaFin('');
        setMontoMinimo('');
        setMontoMaximo('');
        setMetodoPago('');
        onApplyFilters({});
    };
    if (!isOpen)
        return null;
    return (_jsx(AnimatePresence, { children: _jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", onClick: onClose, children: _jsxs(motion.div, { initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.9, opacity: 0 }, transition: { duration: 0.2 }, className: "bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "sticky top-0 bg-primary-500 dark:bg-primary-600 px-6 py-4 flex items-center justify-between rounded-t-xl", children: [_jsx("h2", { className: "text-xl font-semibold text-white flex items-center gap-2", children: "Filtros de Pedidos" }), _jsx("button", { onClick: onClose, className: "text-white hover:bg-primary-600 dark:hover:bg-primary-700 p-2 rounded-lg transition", children: _jsx(X, { size: 20 }) })] }), _jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Estado del Pedido" }), _jsxs("select", { value: estado, onChange: (e) => setEstado(e.target.value), className: "w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none", children: [_jsx("option", { value: "", children: "Todos los estados" }), _jsx("option", { value: "Pendiente", children: "Pendiente" }), _jsx("option", { value: "Falta decorar", children: "Falta decorar" }), _jsx("option", { value: "Completado", children: "Completado" }), _jsx("option", { value: "Entregado", children: "Entregado" }), _jsx("option", { value: "Cancelado", children: "Cancelado" })] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2", children: [_jsx(CalendarDays, { size: 16 }), "Rango de Fechas"] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs text-gray-600 dark:text-gray-400 mb-1 block", children: "Desde" }), _jsx("input", { type: "date", value: fechaInicio, onChange: (e) => setFechaInicio(e.target.value), className: "w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs text-gray-600 dark:text-gray-400 mb-1 block", children: "Hasta" }), _jsx("input", { type: "date", value: fechaFin, onChange: (e) => setFechaFin(e.target.value), className: "w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" })] })] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2", children: [_jsx(DollarSign, { size: 16 }), "Rango de Monto"] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs text-gray-600 dark:text-gray-400 mb-1 block", children: "M\u00EDnimo" }), _jsx("input", { type: "number", placeholder: "$ 0", value: montoMinimo, onChange: (e) => setMontoMinimo(e.target.value), className: "w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs text-gray-600 dark:text-gray-400 mb-1 block", children: "M\u00E1ximo" }), _jsx("input", { type: "number", placeholder: "$ 999,999", value: montoMaximo, onChange: (e) => setMontoMaximo(e.target.value), className: "w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" })] })] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2", children: [_jsx(CreditCard, { size: 16 }), "M\u00E9todo de Pago"] }), _jsxs("select", { value: metodoPago, onChange: (e) => setMetodoPago(e.target.value), className: "w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none", children: [_jsx("option", { value: "", children: "Todos los m\u00E9todos" }), _jsx("option", { value: "Efectivo", children: "Efectivo" }), _jsx("option", { value: "Brubank", children: "Brubank" }), _jsx("option", { value: "Uala", children: "Uala" }), _jsx("option", { value: "Mercado Pago", children: "Mercado Pago" }), _jsx("option", { value: "Definir", children: "Definir" })] })] })] }), _jsxs("div", { className: "sticky bottom-0 bg-gray-50 dark:bg-gray-900 px-6 py-4 flex flex-col sm:flex-row gap-3 rounded-b-xl border-t border-gray-200 dark:border-gray-700", children: [_jsx("button", { onClick: handleClear, className: "flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium", children: "Limpiar Filtros" }), _jsx("button", { onClick: handleApply, className: "flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition font-medium shadow-sm", children: "Aplicar Filtros" })] })] }) }) }));
};
export default PedidosFiltros;
