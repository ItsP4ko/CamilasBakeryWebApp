import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIngredientes } from '@/hooks/useIngredientes';
import Select from 'react-select';
const PopupAgregarIngredienteMedida = ({ isOpen, onClose, onSave, }) => {
    const { data: pagedResult, isLoading } = useIngredientes(1, 1000);
    const ingredientes = pagedResult?.items || [];
    const [ingredienteSeleccionado, setIngredienteSeleccionado] = useState(null);
    const [cantidad, setCantidad] = useState('');
    const [unidad, setUnidad] = useState('');
    const handleAgregar = () => {
        if (!ingredienteSeleccionado || !cantidad || !unidad)
            return;
        const cantidadNum = Number.parseFloat(cantidad) || 0;
        const nuevoIngrediente = {
            idIngrediente: ingredienteSeleccionado.value,
            nombreIngrediente: ingredienteSeleccionado.label.split(' (')[0], // Obtener solo el nombre
            cantidad: cantidadNum,
            unidad: unidad,
        };
        onSave(nuevoIngrediente);
        handleClose();
    };
    const handleClose = () => {
        setIngredienteSeleccionado(null);
        setCantidad('');
        setUnidad('');
        onClose();
    };
    // Opciones para el selector de ingredientes
    const opciones = ingredientes?.map((i) => ({
        value: i.idIngrediente,
        label: `${i.nombre} (${i.unidadCompra}) - $${i.precioUnitario?.toLocaleString('es-AR')}`,
        unidadCompra: i.unidadCompra,
    })) || [];
    return (_jsx(AnimatePresence, { children: isOpen && (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: handleClose, className: "absolute inset-0 bg-black/50 backdrop-blur-sm" }), _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95, y: 20 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: 20 }, className: "relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden", children: [_jsxs("div", { className: "bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4 flex items-center justify-between", children: [_jsx("h3", { className: "text-xl font-bold text-white", children: "Agregar Ingrediente a Medida" }), _jsx("button", { onClick: handleClose, className: "text-white/80 hover:text-white transition-colors", children: _jsx(X, { className: "w-6 h-6" }) })] }), _jsxs("div", { className: "p-6 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Ingrediente" }), _jsx(Select, { isLoading: isLoading, options: opciones, value: ingredienteSeleccionado, onChange: (selected) => {
                                                setIngredienteSeleccionado(selected);
                                                // Auto-completar la unidad si está disponible
                                                if (selected?.unidadCompra) {
                                                    setUnidad(selected.unidadCompra);
                                                }
                                            }, placeholder: "Buscar ingrediente...", classNamePrefix: "react-select", styles: {
                                                control: (base, state) => ({
                                                    ...base,
                                                    borderRadius: '0.5rem',
                                                    borderColor: state.isFocused ? '#7c3aed' : '#d1d5db',
                                                    padding: '2px',
                                                    boxShadow: 'none',
                                                    backgroundColor: document.documentElement.classList.contains('dark') ? '#4b5563' : 'white',
                                                    '&:hover': { borderColor: '#7c3aed' }
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
                                            } })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Cantidad" }), _jsx("input", { type: "number", step: "0.001", min: "0.001", value: cantidad, onChange: (e) => setCantidad(e.target.value), placeholder: "Ej: 0.5, 1, 0.255...", className: "w-full px-4 py-2.5 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Unidad" }), _jsx("input", { type: "text", value: unidad, disabled: true, placeholder: "Se selecciona autom\u00E1ticamente", className: "w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg cursor-not-allowed" })] })] })] }), _jsxs("div", { className: "bg-gray-50 dark:bg-gray-900 px-6 py-4 flex justify-end gap-3", children: [_jsx("button", { onClick: handleClose, className: "px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium", children: "Cancelar" }), _jsxs("button", { onClick: handleAgregar, disabled: !ingredienteSeleccionado || !cantidad || !unidad, className: "px-6 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2", children: [_jsx(Plus, { className: "w-5 h-5" }), "Agregar Ingrediente"] })] })] })] })) }));
};
export default PopupAgregarIngredienteMedida;
