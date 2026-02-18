import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIngredientes } from '@/hooks/useIngredientes';
import Select from 'react-select';
const PopupAgregarIngredientesExtras = ({ isOpen, onClose, onSave, ingredientesActuales = [], multiplicadorGanancia = 1 }) => {
    const { data: pagedResult, isLoading } = useIngredientes(1, 1000);
    const ingredientes = pagedResult?.items || [];
    const [ingredientesExtras, setIngredientesExtras] = useState(ingredientesActuales);
    const [ingredienteSeleccionado, setIngredienteSeleccionado] = useState(null);
    const [cantidad, setCantidad] = useState('');
    const [nota, setNota] = useState('');
    const [precioManual, setPrecioManual] = useState('');
    const handleAgregarIngrediente = () => {
        if (!ingredienteSeleccionado)
            return;
        const cantidadNum = Number.parseFloat(cantidad) || 0;
        const nuevoIngredienteExtra = {
            idIngrediente: ingredienteSeleccionado.value,
            nombreIngrediente: ingredienteSeleccionado.label,
            cantidad: cantidadNum,
            nota: nota,
            precioVentaManual: precioManual ? Number.parseFloat(precioManual) : null
        };
        setIngredientesExtras([...ingredientesExtras, nuevoIngredienteExtra]);
        setIngredienteSeleccionado(null);
        setCantidad('');
        setNota('');
        setPrecioManual('');
    };
    const handleEliminarIngrediente = (index) => {
        setIngredientesExtras(ingredientesExtras.filter((_, i) => i !== index));
    };
    const handleGuardar = () => {
        onSave(ingredientesExtras);
        onClose();
    };
    const handleClose = () => {
        setIngredientesExtras(ingredientesActuales);
        setIngredienteSeleccionado(null);
        setCantidad('');
        setNota('');
        setPrecioManual('');
        onClose();
    };
    // Opciones para el selector de ingredientes
    const opciones = ingredientes?.map((i) => ({
        value: i.idIngrediente,
        label: `${i.nombre} (${i.unidadCompra}) - $${i.precioUnitario?.toLocaleString('es-AR')}`,
        precioBase: i.precioUnitario
    })) || [];
    const cantidadNum = Number.parseFloat(cantidad) || 0;
    const precioSugerido = ingredienteSeleccionado?.precioBase
        ? ingredienteSeleccionado.precioBase * cantidadNum * multiplicadorGanancia
        : 0;
    return (_jsx(AnimatePresence, { children: isOpen && (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: handleClose, className: "absolute inset-0 bg-black/50 backdrop-blur-sm" }), _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95, y: 20 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: 20 }, className: "relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl mx-4 max-h-[80vh] overflow-hidden flex flex-col", children: [_jsxs("div", { className: "bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 flex items-center justify-between", children: [_jsx("h3", { className: "text-xl font-bold text-white", children: "Agregar Ingredientes Extras" }), _jsx("button", { onClick: handleClose, className: "text-white/80 hover:text-white transition-colors", children: _jsx(X, { className: "w-6 h-6" }) })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-6 space-y-6", children: [_jsxs("div", { className: "bg-green-50 dark:bg-gray-700 rounded-lg p-4 space-y-4", children: [_jsx("h4", { className: "font-semibold text-gray-900 dark:text-gray-100", children: "Agregar nuevo ingrediente extra" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Ingrediente" }), _jsx(Select, { isLoading: isLoading, options: opciones, value: ingredienteSeleccionado, onChange: setIngredienteSeleccionado, placeholder: "Buscar ingrediente...", classNamePrefix: "react-select", styles: {
                                                                control: (base, state) => ({
                                                                    ...base,
                                                                    borderRadius: '0.5rem',
                                                                    borderColor: state.isFocused ? '#10b981' : '#d1d5db',
                                                                    padding: '2px',
                                                                    boxShadow: 'none',
                                                                    backgroundColor: document.documentElement.classList.contains('dark') ? '#4b5563' : 'white',
                                                                    '&:hover': { borderColor: '#10b981' }
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
                                                            } })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Cantidad" }), _jsx("input", { type: "number", step: "0.01", value: cantidad, onChange: (e) => setCantidad(e.target.value), placeholder: "Ej: 0.5, 1, 5, ...", className: "w-full px-4 py-2.5 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Nota (Opcional)" }), _jsx("input", { type: "text", value: nota, onChange: (e) => setNota(e.target.value), placeholder: "Ej: Extra chocolate, doble porci\u00F3n, etc...", className: "w-full px-4 py-2.5 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" })] }), _jsxs("button", { onClick: handleAgregarIngrediente, disabled: !ingredienteSeleccionado, className: "w-full flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2.5 rounded-lg hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors", children: [_jsx(Plus, { className: "w-5 h-5" }), "Agregar Ingrediente"] })] }), ingredientesExtras.length > 0 && (_jsxs("div", { children: [_jsxs("h4", { className: "font-semibold text-gray-900 dark:text-gray-100 mb-3", children: ["Ingredientes extras agregados (", ingredientesExtras.length, ")"] }), _jsx("div", { className: "space-y-2", children: ingredientesExtras.map((ingrediente, index) => (_jsxs("div", { className: "flex items-center justify-between bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg p-3", children: [_jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "font-medium text-gray-900 dark:text-gray-100", children: ingrediente.nombreIngrediente }), _jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: ["Cantidad: ", ingrediente.cantidad, ingrediente.nota && ` • Nota: ${ingrediente.nota}`, ingrediente.precioVentaManual != null && ` • Precio Override: $${ingrediente.precioVentaManual}`] })] }), _jsx("button", { onClick: () => handleEliminarIngrediente(index), className: "text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-2", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }, index))) })] }))] }), _jsxs("div", { className: "bg-green-50 dark:bg-gray-900 px-6 py-4 flex justify-end gap-3", children: [_jsx("button", { onClick: handleClose, className: "px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium", children: "Cancelar" }), _jsx("button", { onClick: handleGuardar, className: "px-6 py-2.5 bg-green-500 dark:bg-green-600 text-white rounded-lg hover:bg-green-600 dark:hover:bg-green-700 transition-colors font-medium", children: "Guardar Ingredientes" })] })] })] })) }));
};
export default PopupAgregarIngredientesExtras;
