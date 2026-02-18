import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCostoExtra } from '@/hooks/useCostoExtra';
import Select from 'react-select';
const PopupAgregarExtras = ({ isOpen, onClose, onSave, extrasActuales = [], multiplicadorGanancia = 1 }) => {
    const { data: costosExtraResult, isLoading } = useCostoExtra(1, 1000);
    const costosExtra = costosExtraResult?.items || [];
    const [extras, setExtras] = useState(extrasActuales);
    const [costoExtraSeleccionado, setCostoExtraSeleccionado] = useState(null);
    const [cantidad, setCantidad] = useState('');
    const [nota, setNota] = useState('');
    const [precioManual, setPrecioManual] = useState('');
    const handleAgregarExtra = () => {
        if (!costoExtraSeleccionado)
            return;
        const cantidadNum = Number.parseFloat(cantidad) || 0;
        const nuevoExtra = {
            idCostoExtra: costoExtraSeleccionado.value,
            nombreCostoExtra: costoExtraSeleccionado.label,
            cantidad: cantidadNum,
            nota: nota,
            precioVentaManual: precioManual ? Number.parseFloat(precioManual) : null
        };
        setExtras([...extras, nuevoExtra]);
        setCostoExtraSeleccionado(null);
        setCantidad('');
        setNota('');
        setPrecioManual('');
    };
    const handleEliminarExtra = (index) => {
        setExtras(extras.filter((_, i) => i !== index));
    };
    const handleGuardar = () => {
        onSave(extras);
        onClose();
    };
    const handleClose = () => {
        setExtras(extrasActuales);
        setCostoExtraSeleccionado(null);
        setCantidad('');
        setNota('');
        setPrecioManual('');
        onClose();
    };
    // 🔍 Opciones para react-select
    const opciones = costosExtra?.map((c) => ({
        value: c.idCostoExtra,
        label: `${c.nombre} - $${c.precioUnitario?.toLocaleString('es-AR')}`,
        precioBase: c.precioUnitario
    })) || [];
    const cantidadNum = parseFloat(cantidad) || 0;
    const precioSugerido = costoExtraSeleccionado?.precioBase
        ? costoExtraSeleccionado.precioBase * cantidadNum * multiplicadorGanancia
        : 0;
    return (_jsx(AnimatePresence, { children: isOpen && (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: handleClose, className: "absolute inset-0 bg-black/50 backdrop-blur-sm" }), _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95, y: 20 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: 20 }, className: "relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl mx-4 max-h-[80vh] overflow-hidden flex flex-col", children: [_jsxs("div", { className: "bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4 flex items-center justify-between", children: [_jsx("h3", { className: "text-xl font-bold text-white", children: "Agregar Extras" }), _jsx("button", { onClick: handleClose, className: "text-white/80 hover:text-white transition-colors", children: _jsx(X, { className: "w-6 h-6" }) })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-6 space-y-6", children: [_jsxs("div", { className: "bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-4", children: [_jsx("h4", { className: "font-semibold text-gray-900 dark:text-gray-100", children: "Agregar nuevo extra" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Costo Extra" }), _jsx(Select, { isLoading: isLoading, options: opciones, value: costoExtraSeleccionado, onChange: setCostoExtraSeleccionado, placeholder: "Buscar extra...", classNamePrefix: "react-select", styles: {
                                                                control: (base, state) => ({
                                                                    ...base,
                                                                    borderRadius: '0.5rem',
                                                                    borderColor: state.isFocused ? '#1c1e1dff' : '#d1d5db',
                                                                    padding: '2px',
                                                                    boxShadow: 'none',
                                                                    backgroundColor: document.documentElement.classList.contains('dark') ? '#4b5563' : 'white',
                                                                    '&:hover': { borderColor: '#1c1e1dff' }
                                                                }),
                                                                menu: (base) => ({
                                                                    ...base,
                                                                    backgroundColor: document.documentElement.classList.contains('dark') ? '#374151' : 'white',
                                                                    borderRadius: '0.5rem',
                                                                }),
                                                                option: (base, state) => ({
                                                                    ...base,
                                                                    backgroundColor: state.isFocused
                                                                        ? (document.documentElement.classList.contains('dark') ? '#4b5563' : '#f3f4f6')
                                                                        : (document.documentElement.classList.contains('dark') ? '#374151' : 'white'),
                                                                    color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
                                                                    '&:active': {
                                                                        backgroundColor: document.documentElement.classList.contains('dark') ? '#4b5563' : '#e5e7eb'
                                                                    }
                                                                }),
                                                                singleValue: (base) => ({
                                                                    ...base,
                                                                    color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
                                                                }),
                                                                input: (base) => ({
                                                                    ...base,
                                                                    color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
                                                                }),
                                                                placeholder: (base) => ({
                                                                    ...base,
                                                                    color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280',
                                                                }),
                                                            } })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Cantidad" }), _jsx("input", { type: "number", step: "0.01", value: cantidad, onChange: (e) => setCantidad(e.target.value), placeholder: "Ej: 0.5, 1, 5, ...", className: "w-full px-4 py-2.5 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Nota (Opcional)" }), _jsx("input", { type: "text", value: nota, onChange: (e) => setNota(e.target.value), placeholder: "Ej: Sin az\u00FAcar, extra dulce, etc...", className: "w-full px-4 py-2.5 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: ["Precio Manual (Sugerido: $", precioSugerido.toLocaleString('es-AR'), ")"] }), _jsx("input", { type: "number", value: precioManual, onChange: (e) => setPrecioManual(e.target.value), placeholder: `$${precioSugerido.toFixed(2)}`, className: "w-full px-4 py-2.5 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Dejar vac\u00EDo para usar precio calculado autom\u00E1ticamente." })] }), _jsxs("button", { onClick: handleAgregarExtra, disabled: !costoExtraSeleccionado, className: "w-full flex items-center justify-center gap-2 bg-primary-500 text-white px-4 py-2.5 rounded-lg hover:bg-primary-600 disabled:bg-primary-300 disabled:cursor-not-allowed transition-colors", children: [_jsx(Plus, { className: "w-5 h-5" }), "Agregar Extra"] })] }), extras.length > 0 && (_jsxs("div", { children: [_jsxs("h4", { className: "font-semibold text-gray-900 dark:text-gray-100 mb-3", children: ["Extras agregados (", extras.length, ")"] }), _jsx("div", { className: "space-y-2", children: extras.map((extra, index) => (_jsxs("div", { className: "flex items-center justify-between bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg p-3", children: [_jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "font-medium text-gray-900 dark:text-gray-100", children: extra.nombreCostoExtra }), _jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: ["Cantidad: ", extra.cantidad, extra.nota && ` • Nota: ${extra.nota}`, extra.precioVentaManual != null && ` • Precio Override: $${extra.precioVentaManual}`] })] }), _jsx("button", { onClick: () => handleEliminarExtra(index), className: "text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-2", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }, index))) })] }))] }), _jsxs("div", { className: "bg-gray-100 dark:bg-gray-900 px-6 py-4 flex justify-end gap-3", children: [_jsx("button", { onClick: handleClose, className: "px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium", children: "Cancelar" }), _jsx("button", { onClick: handleGuardar, className: "px-6 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium", children: "Guardar Extras" })] })] })] })) }));
};
export default PopupAgregarExtras;
