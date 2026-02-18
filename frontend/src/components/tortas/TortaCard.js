import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MedidaButton from "./MedidaButton";
import { Settings } from "lucide-react";
export const TortaCard = memo(({ torta, isExpanded, onToggle, medidaSeleccionada, onMedidaSelect, onGestionarMedidas, }) => {
    const disponible = torta.CantidadMedidas > 0;
    const handleMedidaClick = useCallback((e, medidaId) => {
        e.stopPropagation();
        onMedidaSelect(medidaSeleccionada === medidaId ? null : medidaId);
    }, [medidaSeleccionada, onMedidaSelect]);
    const handleGestionarClick = useCallback((e) => {
        e.stopPropagation();
        onGestionarMedidas(torta.IdTorta);
    }, [torta.IdTorta, onGestionarMedidas]);
    return (_jsxs(motion.div, { onClick: onToggle, whileHover: {
            scale: 1.02,
            transition: { duration: 0.2 },
        }, className: `rounded-xl border-2 transition-all ${disponible
            ? "cursor-pointer border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 hover:border-primary-400 dark:hover:border-primary-500"
            : "cursor-pointer border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500"} ${isExpanded ? "shadow-lg" : "shadow-sm"}`, children: [_jsxs("div", { className: "p-6 text-center", children: [_jsx("h2", { className: `text-2xl font-bold mb-2 ${disponible ? "text-gray-900 dark:text-gray-100" : "text-gray-400 dark:text-gray-500"}`, children: torta.Nombre }), _jsxs("div", { className: `text-sm ${disponible ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"}`, children: [_jsx("p", { className: "mb-1", children: disponible
                                    ? `${torta.CantidadMedidas} ${torta.CantidadMedidas === 1 ? "tamaño disponible" : "tamaños disponibles"}`
                                    : "No disponible" }), _jsxs("p", { className: "text-xs font-semibold text-primary-600 dark:text-primary-400", children: ["Multiplicador: ", (() => {
                                        if (torta.Medidas.length === 0)
                                            return `${torta.MultiplicadorGanancia}x`;
                                        const reales = torta.Medidas.map(m => m.MultiplicadorReal);
                                        const min = Math.min(...reales);
                                        const max = Math.max(...reales);
                                        return min === max ? `${min}x` : `${min}x - ${max}x`;
                                    })()] })] })] }), _jsx(AnimatePresence, { initial: false, children: isExpanded && (_jsx(motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: "auto", opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: {
                        duration: 0.3,
                        ease: "easeInOut"
                    }, className: "overflow-hidden border-t border-gray-200 dark:border-gray-600", children: _jsx("div", { className: "p-5 space-y-3 bg-gray-50 dark:bg-gray-800 rounded-b-xl", children: disponible ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "space-y-2", children: torta.Medidas.map((medida) => (_jsx(MedidaButton, { medida: medida, tortaId: torta.IdTorta, isSelected: medidaSeleccionada === medida.IdMedida, onClick: (e) => handleMedidaClick(e, medida.IdMedida) }, medida.IdMedida))) }), _jsxs("button", { onClick: handleGestionarClick, className: "w-full flex items-center justify-center gap-2 px-4 py-2.5 \r\n                      bg-primary-500 text-white rounded-lg hover:bg-primary-600 \r\n                      transition-colors font-medium", children: [_jsx(Settings, { className: "w-5 h-5" }), "Gestionar Medidas"] })] })) : (
                        /* Contenido para tortas no disponibles */
                        _jsxs("div", { className: "text-center py-4", children: [_jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-4", children: "Esta torta no tiene medidas configuradas" }), _jsxs("button", { onClick: handleGestionarClick, className: "w-full flex items-center justify-center gap-2 px-4 py-2.5 \r\n                      bg-primary-500 text-white rounded-lg hover:bg-primary-600 \r\n                      transition-colors font-medium", children: [_jsx(Settings, { className: "w-5 h-5" }), "Configurar Medidas"] })] })) }) }, "expanded")) })] }));
});
