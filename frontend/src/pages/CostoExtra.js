import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Search, Plus, ArrowUpLeft, DollarSignIcon, Trash2, Edit } from 'lucide-react';
import { useCostoExtra, useCreateCostoExtra, useUpdateCostoExtra, useDeleteCostoExtra } from '../hooks/useCostoExtra';
import StatsCard from '@/components/general/StatsCard';
import PopupForm from '@/components/general/PopUpCreate';
import PopupEdit from '@/components/general/PopupEdit';
import PopupConfirm from '@/components/general/PopupConfirm';
const CostoExtra = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 20;
    const { data: pagedResult, isLoading, error } = useCostoExtra(currentPage, pageSize);
    const costosData = pagedResult?.items || [];
    const totalPages = pagedResult?.totalPages || 1;
    const totalCount = pagedResult?.totalCount || 0;
    const [searchTerm, setSearchTerm] = useState('');
    const [popupCreateOpen, setPopupCreateOpen] = useState(false);
    const [popupEditOpen, setPopupEditOpen] = useState(false);
    const [popupConfirmOpen, setPopupConfirmOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);
    const { mutate } = useCreateCostoExtra();
    const { mutate: updateMutate } = useUpdateCostoExtra();
    const { mutate: deleteMutate } = useDeleteCostoExtra();
    // Crear nuevo Costo Extra
    const handleCreate = (formData) => {
        console.log("Datos enviados al backend:", formData);
        // ✅ Cerrar el popup INMEDIATAMENTE (optimistic UI)
        setPopupCreateOpen(false);
        // ⏳ La mutación ocurre en segundo plano con optimistic update
        mutate(formData, {
            onError: (err) => {
                console.error("Error al crear costo extra:");
                // El rollback automático ya está manejado en el hook
            },
        });
    };
    // Actualizar costo extra
    const handleUpdate = (formData) => {
        if (!selectedItem)
            return;
        // ✅ Cerrar el popup INMEDIATAMENTE (optimistic UI)
        setPopupEditOpen(false);
        setSelectedItem(null);
        // ⏳ La mutación ocurre en segundo plano con optimistic update
        updateMutate({ id: selectedItem.idCostoExtra, data: formData }, {
            onError: (err) => {
                console.error("Error al actualizar costo extra:");
                // El rollback automático ya está manejado en el hook
            },
        });
    };
    // Eliminar costo extra
    const handleDelete = (id, nombre) => {
        setItemToDelete({ id, nombre });
        setPopupConfirmOpen(true);
    };
    const confirmDelete = () => {
        if (!itemToDelete)
            return;
        // ✅ Cerrar el popup INMEDIATAMENTE (optimistic UI)
        setPopupConfirmOpen(false);
        const itemId = itemToDelete.id;
        setItemToDelete(null);
        // ⏳ La mutación ocurre en segundo plano con optimistic update
        deleteMutate(itemId, {
            onError: (err) => {
                console.error("Error al eliminar costo extra:", err.response?.data || err);
                // El rollback automático ya está manejado en el hook
            },
        });
    };
    const cancelDelete = () => {
        setPopupConfirmOpen(false);
        setItemToDelete(null);
    };
    // Abrir popup de edición
    const handleEdit = (costo) => {
        setSelectedItem(costo);
        setPopupEditOpen(true);
    };
    // Filtrar costos extra por búsqueda
    const filteredData = costosData.filter((costo) => costo.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        costo.nota?.toLowerCase().includes(searchTerm.toLowerCase()));
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center py-20", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" }) }));
    }
    if (error) {
        return (_jsxs("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4 text-red-700", children: ["Error al cargar los costos extra: ", error.message] }));
    }
    // Calcular estadísticas
    const totalItems = totalCount;
    const costoExtraMasCostoso = costosData.length > 0
        ? costosData.reduce((max, costo) => costo.precioUnitario > max.precioUnitario ? costo : max)
        : null;
    return (_jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8", children: [_jsxs("div", { className: "mb-6 sm:mb-8", children: [_jsx("h1", { className: "text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-900 dark:text-primary-100 mb-2", children: "Costos Extra" }), _jsx("p", { className: "text-sm sm:text-base text-primary-600 dark:text-primary-400", children: "Gesti\u00F3n de costos adicionales para productos" })] }), _jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8", children: [_jsx(StatsCard, { label: "Total Items", value: totalItems, icon: Package, iconColor: "primary", delay: 0, onClick: () => setSearchTerm("") }), _jsx(StatsCard, { label: "Costo extra mas costoso", value: costoExtraMasCostoso?.nombre ?? "N/A", icon: DollarSignIcon, iconColor: "primary", delay: 0, onClick: () => setSearchTerm(costoExtraMasCostoso?.nombre ?? "") }), _jsx(StatsCard, { label: "Reportes y estadisticas", value: "Vistar", icon: ArrowUpLeft, iconColor: "primary", delay: 0, href: "/reportes/stock" })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: 0.1 }, className: "bg-primary-200 dark:bg-gray-800 rounded-xl shadow-sm border border-primary-200 dark:border-gray-700 p-4 mb-6 sm:mb-8", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 dark:text-gray-500 w-5 h-5" }), _jsx("input", { type: "text", placeholder: "Buscar por nombre o nota en esta p\u00E1gina...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-10 pr-4 py-2 \n             bg-primary-100 dark:bg-gray-700 text-primary-900 dark:text-white\n             placeholder-primary-500 dark:placeholder-gray-400\n             border border-primary-300 dark:border-gray-600\n             rounded-lg \n             focus:ring-2 focus:ring-primary-400 focus:border-transparent \n             outline-none" })] }), _jsxs("div", { className: "flex items-center justify-between mt-2 text-xs sm:text-sm text-primary-600 dark:text-gray-400", children: [filteredData && filteredData.length > 0 ? (_jsxs("p", { children: ["Mostrando ", filteredData.length, " de ", totalItems, " costos extra"] })) : (_jsx("p", { children: "\u00A0" })), _jsxs("button", { onClick: () => setPopupCreateOpen(true), className: "flex items-center gap-1 text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors text-xs font-medium", children: [_jsx(Plus, { className: "w-4 h-4" }), "Agregar"] })] })] }), (!filteredData || filteredData.length === 0) && (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: 0.4 }, className: "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-8 text-center", children: [_jsx(Package, { className: "w-16 h-16 mx-auto text-yellow-600 dark:text-yellow-400 mb-4" }), _jsx("h3", { className: "text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2", children: "No hay costos extra disponibles" }), _jsx("p", { className: "text-yellow-600 dark:text-yellow-400 mb-4", children: searchTerm
                            ? `No se encontraron costos extra que coincidan con "${searchTerm}"`
                            : "Aún no has agregado costos extra al sistema" }), _jsxs("button", { onClick: () => setPopupCreateOpen(true), className: "inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors", children: [_jsx(Plus, { className: "w-4 h-4" }), "Agregar primer costo extra"] })] })), filteredData && filteredData.length > 0 && (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: 0.4 }, className: "bg-primary-50 dark:bg-gray-800 rounded-xl shadow-sm border border-primary-200 dark:border-gray-700 overflow-hidden", children: [_jsx("div", { className: "block lg:hidden p-4 space-y-4", children: (filteredData || []).map((costo, index) => (_jsxs(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.3, delay: index * 0.02 }, className: "bg-white dark:bg-gray-700 rounded-lg p-4 shadow-md space-y-3", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("div", { className: "w-2 h-2 bg-primary-500 rounded-full" }), _jsx("span", { className: "font-semibold text-gray-900 dark:text-white", children: costo.nombre })] }), _jsxs("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: ["ID: ", costo.idCostoExtra] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => handleEdit(costo), className: "p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition", title: "Editar", children: _jsx(Edit, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleDelete(costo.idCostoExtra, costo.nombre), className: "p-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition", title: "Eliminar", children: _jsx(Trash2, { className: "w-4 h-4" }) })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs text-gray-600 dark:text-gray-400 font-medium", children: "Stock" }), _jsx("p", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: costo.stock !== null && costo.stock !== undefined ? costo.stock : '-' })] }), costo.nota && costo.nota.trim() !== '' && (_jsxs("div", { className: "col-span-2", children: [_jsx("label", { className: "text-xs text-gray-600 dark:text-gray-400 font-medium", children: "Nota" }), _jsx("p", { className: "text-sm font-medium text-gray-900 dark:text-white mt-1", children: _jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-200 dark:bg-primary-900 text-primary-800 dark:text-primary-300", children: costo.nota }) })] }))] }), _jsxs("div", { className: "pt-2 border-t border-gray-200 dark:border-gray-600", children: [_jsx("label", { className: "text-xs text-gray-600 dark:text-gray-400 font-medium", children: "Precio Unitario" }), _jsx("p", { className: "text-lg font-bold text-green-600 dark:text-green-400", children: costo.precioUnitario?.toLocaleString('es-AR', {
                                                style: 'currency',
                                                currency: 'ARS',
                                                minimumFractionDigits: 2,
                                            }) })] })] }, costo.idCostoExtra))) }), _jsx("div", { className: "hidden lg:block overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-primary-50 dark:bg-gray-700 border-b border-primary-200 dark:border-gray-600", children: [_jsx("th", { className: "bg-primary-200 dark:bg-gray-700 px-6 py-4 text-left text-xs font-semibold text-primary-700 dark:text-gray-300 uppercase tracking-wider", children: "ID" }), _jsx("th", { className: "bg-primary-200 dark:bg-gray-700 px-6 py-4 text-left text-xs font-semibold text-primary-700 dark:text-gray-300 uppercase tracking-wider", children: "Nombre" }), _jsx("th", { className: "bg-primary-200 dark:bg-gray-700 px-6 py-4 text-left text-xs font-semibold text-primary-700 dark:text-gray-300 uppercase tracking-wider", children: "Stock" }), _jsx("th", { className: "bg-primary-200 dark:bg-gray-700 px-6 py-4 text-left text-xs font-semibold text-primary-700 dark:text-gray-300 uppercase tracking-wider", children: "Precio Unitario" }), _jsx("th", { className: "bg-primary-200 dark:bg-gray-700 px-6 py-4 text-left text-xs font-semibold text-primary-700 dark:text-gray-300 uppercase tracking-wider", children: "Nota" }), _jsx("th", { className: "bg-primary-200 dark:bg-gray-700 px-6 py-4 text-center text-xs font-semibold text-primary-700 dark:text-gray-300 uppercase tracking-wider", children: "Acciones" })] }) }), _jsx("tbody", { className: "divide-y divide-primary-200 dark:divide-gray-600", children: (filteredData || []).map((costo, index) => (_jsxs(motion.tr, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.3, delay: index * 0.02 }, className: "hover:bg-primary-100 dark:hover:bg-gray-700 transition-colors", children: [_jsx("td", { className: "px-6 py-4 text-sm text-primary-900 dark:text-white font-medium", children: costo.idCostoExtra }), _jsx("td", { className: "px-6 py-4 text-sm text-primary-900 dark:text-white", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-2 h-2 bg-primary-500 rounded-full" }), _jsx("span", { className: "font-medium", children: costo.nombre })] }) }), _jsx("td", { className: "px-6 py-4 text-sm text-primary-900 dark:text-white", children: _jsx("span", { className: "font-semibold", children: costo.stock !== null && costo.stock !== undefined ? costo.stock : '-' }) }), _jsx("td", { className: "px-6 py-4 text-sm font-semibold text-green-600 dark:text-green-400", children: costo.precioUnitario?.toLocaleString('es-AR', {
                                                    style: 'currency',
                                                    currency: 'ARS',
                                                    minimumFractionDigits: 2,
                                                }) }), _jsx("td", { className: "px-6 py-4 text-sm text-primary-600 dark:text-gray-400", children: costo.nota && costo.nota.trim() !== '' ? (_jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-200 dark:bg-primary-900 text-primary-800 dark:text-primary-300", children: costo.nota })) : (_jsx("span", { className: "text-primary-400 dark:text-gray-500 italic", children: "Sin nota" })) }), _jsx("td", { className: "px-6 py-4 text-sm", children: _jsxs("div", { className: "flex items-center justify-center gap-2", children: [_jsx("button", { onClick: () => handleEdit(costo), className: "p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors", title: "Editar", children: _jsx(Edit, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleDelete(costo.idCostoExtra, costo.nombre), className: "p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors", title: "Eliminar", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }) })] }, costo.idCostoExtra))) })] }) }), totalPages > 1 && (_jsxs("div", { className: "flex justify-between items-center p-4 border-t border-primary-200 dark:border-gray-700 bg-primary-50 dark:bg-gray-800", children: [_jsx("button", { onClick: () => setCurrentPage(p => Math.max(1, p - 1)), disabled: currentPage === 1, className: `px-4 py-2 rounded-md ${currentPage === 1
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                                    : 'bg-primary-500 text-white hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700'}`, children: "Anterior" }), _jsxs("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: ["P\u00E1gina ", currentPage, " de ", totalPages] }), _jsx("button", { onClick: () => setCurrentPage(p => Math.min(totalPages, p + 1)), disabled: currentPage === totalPages, className: `px-4 py-2 rounded-md ${currentPage === totalPages
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                                    : 'bg-primary-500 text-white hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700'}`, children: "Siguiente" })] }))] })), _jsx(PopupForm, { isOpen: popupCreateOpen, tipo: "costoextra", onClose: () => setPopupCreateOpen(false), onSubmit: handleCreate }), selectedItem && (_jsx(PopupEdit, { isOpen: popupEditOpen, tipo: "costoextra", itemData: {
                    id: selectedItem.idCostoExtra,
                    nombre: selectedItem.nombre,
                    precioUnitario: selectedItem.precioUnitario,
                    stock: selectedItem.stock
                }, onClose: () => {
                    setPopupEditOpen(false);
                    setSelectedItem(null);
                }, onSubmit: handleUpdate })), _jsx(PopupConfirm, { isOpen: popupConfirmOpen, title: "Eliminar Costo Extra", message: "\u00BFEst\u00E1 seguro de que desea eliminar este costo extra?", itemName: itemToDelete?.nombre, onConfirm: confirmDelete, onCancel: cancelDelete })] }));
};
export default CostoExtra;
