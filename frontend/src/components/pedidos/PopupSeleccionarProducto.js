import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { X, Search, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTortasSimple, useMedidasPorTorta } from '@/hooks/usePedidoSeleccion';
const PopupSeleccionarProducto = ({ isOpen, onClose, onSelect }) => {
    const { data: tortas, isLoading: loadingTortas } = useTortasSimple();
    const [tortaSeleccionada, setTortaSeleccionada] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [cantidad, setCantidad] = useState(1);
    const { data: medidas, isLoading: loadingMedidas } = useMedidasPorTorta(tortaSeleccionada?.idTorta ?? null);
    const tortasFiltradas = tortas?.filter(torta => torta.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
    const handleSeleccionarMedida = (medida) => {
        const producto = {
            idMedida: medida.idMedidaDetalle,
            nombreTorta: tortaSeleccionada.nombre,
            nombreMedida: medida.tamano,
            cantidad: typeof cantidad === 'string' ? Number.parseInt(cantidad) || 1 : cantidad,
            extras: [],
            ingredientesExtras: [],
            multiplicadorGanancia: tortaSeleccionada.multiplicadorGanancia
        };
        onSelect(producto);
        handleClose();
    };
    const handleClose = () => {
        setTortaSeleccionada(null);
        setSearchTerm('');
        setCantidad(1);
        onClose();
    };
    return (_jsx(AnimatePresence, { children: isOpen && (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: handleClose, className: "absolute inset-0 bg-black/50 backdrop-blur-sm" }), _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95, y: 20 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: 20 }, className: "relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden flex flex-col", children: [_jsxs("div", { className: "bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4 flex items-center justify-between", children: [_jsx("h3", { className: "text-xl font-bold text-white", children: tortaSeleccionada ? `Seleccionar Medida - ${tortaSeleccionada.nombre}` : 'Seleccionar Torta' }), _jsx("button", { onClick: handleClose, className: "text-white/80 hover:text-white transition-colors", children: _jsx(X, { className: "w-6 h-6" }) })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-6", children: tortaSeleccionada ? (
                            /* Lista de Medidas */
                            _jsxs("div", { className: "space-y-4", children: [_jsx("button", { onClick: () => setTortaSeleccionada(null), className: "text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium", children: "\u2190 Volver a tortas" }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Cantidad" }), _jsx("input", { type: "text", inputMode: "numeric", value: cantidad, onChange: (e) => {
                                                    const val = e.target.value;
                                                    // Permitir string vacío o solo números
                                                    if (val === '' || /^\d+$/.test(val)) {
                                                        setCantidad(val === '' ? '' : Number.parseInt(val));
                                                    }
                                                }, onBlur: () => {
                                                    // Si está vacío o es 0, volver a 1
                                                    if (cantidad === '' || cantidad === 0) {
                                                        setCantidad(1);
                                                    }
                                                }, className: "w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none", placeholder: "1" })] }), loadingMedidas ? (_jsx("div", { className: "text-center py-8 text-gray-600 dark:text-gray-400", children: "Cargando medidas..." })) : (_jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "font-semibold text-gray-900 dark:text-gray-100 mb-3", children: "Seleccione una medida:" }), medidas?.map((medida) => (_jsx("button", { onClick: () => handleSeleccionarMedida(medida), className: "w-full p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors text-left", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("div", { children: _jsx("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: medida.tamano }) }), _jsxs("span", { className: "text-lg font-semibold text-green-600 dark:text-green-400", children: ["$", medida.precio?.toLocaleString('es-AR')] })] }) }, medida.idMedidaDetalle)))] }))] })) : (
                            /* Lista de Tortas */
                            _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-5 h-5" }), _jsx("input", { type: "text", placeholder: "Buscar torta...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" })] }), loadingTortas ? (_jsx("div", { className: "text-center py-8 text-gray-600 dark:text-gray-400", children: "Cargando tortas..." })) : (_jsx("div", { className: "space-y-2", children: tortasFiltradas?.map((torta) => (_jsxs("button", { onClick: () => setTortaSeleccionada(torta), className: "w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors text-left", children: [_jsx("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: torta.nombre }), _jsx(ChevronRight, { className: "w-5 h-5 text-gray-600 dark:text-gray-400" })] }, torta.idTorta))) }))] })) })] })] })) }));
};
export default PopupSeleccionarProducto;
