import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Package, Search, Plus, ArrowUpLeft, Trash2, Edit, TrendingUp } from 'lucide-react';
import { useIngredientes, useCreateIngrediente, useUpdateIngrediente, useDeleteIngrediente } from '../hooks/useIngredientes';
import StatsCard from '@/components/general/StatsCard';
import PopupForm from '@/components/general/PopUpCreate';
import PopupEdit from '@/components/general/PopupEdit';
import PopupConfirm from '@/components/general/PopupConfirm';
const Ingredientes = () => {
    // Estados locales para paginación
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 20;
    // Estados locales
    const [searchTerm, setSearchTerm] = useState('');
    // Cuando hay búsqueda activa, traemos TODOS los ingredientes para filtrar en cliente
    const isSearching = searchTerm.trim().length > 0;
    const fetchPageSize = isSearching ? 1000 : pageSize;
    const fetchPage = isSearching ? 1 : currentPage;
    // Hooks para obtener y crear ingredientes
    const { data: pagedResult, isLoading, error: errorIngredientes } = useIngredientes(fetchPage, fetchPageSize);
    const allItems = pagedResult?.items || [];
    const serverTotalCount = pagedResult?.totalCount || 0;
    // Filtrado por búsqueda  
    const filteredData = useMemo(() => {
        if (!isSearching)
            return allItems;
        return allItems.filter((ingrediente) => ingrediente.nombre?.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [allItems, searchTerm, isSearching]);
    // Paginación sobre los datos filtrados
    const totalPages = isSearching
        ? Math.max(1, Math.ceil(filteredData.length / pageSize))
        : (pagedResult?.totalPages || 1);
    // Datos a mostrar en la página actual
    const displayData = isSearching
        ? filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        : allItems;
    const { mutate, error: errorCreate } = useCreateIngrediente();
    const { mutate: updateMutate } = useUpdateIngrediente();
    const { mutate: deleteMutate } = useDeleteIngrediente();
    const [popupCreateOpen, setPopupCreateOpen] = useState(false);
    const [popupEditOpen, setPopupEditOpen] = useState(false);
    const [popupConfirmOpen, setPopupConfirmOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);
    // Crear nuevo ingrediente
    const handleCreate = (formData) => {
        // ✅ Cerrar el popup INMEDIATAMENTE (optimistic UI)
        setPopupCreateOpen(false);
        // ⏳ La mutación ocurre en segundo plano con optimistic update
        mutate(formData, {
            onError: (err) => {
                console.error("Error al crear ingrediente:");
                // El rollback automático ya está manejado en el hook
            },
        });
    };
    // Actualizar ingrediente
    const handleUpdate = (formData) => {
        if (!selectedItem)
            return;
        // ✅ Cerrar el popup INMEDIATAMENTE (optimistic UI)
        setPopupEditOpen(false);
        setSelectedItem(null);
        // ⏳ La mutación ocurre en segundo plano con optimistic update
        updateMutate({ id: selectedItem.idIngrediente, data: formData }, {
            onError: (err) => {
                console.error("Error al actualizar ingrediente:");
                // El rollback automático ya está manejado en el hook
            },
        });
    };
    // Eliminar ingrediente
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
                console.error("Error al eliminar ingrediente:");
                // El rollback automático ya está manejado en el hook
            },
        });
    };
    const cancelDelete = () => {
        setPopupConfirmOpen(false);
        setItemToDelete(null);
    };
    // Abrir popup de edición
    const handleEdit = (ingrediente) => {
        setSelectedItem(ingrediente);
        setPopupEditOpen(true);
    };
    // Loading state
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center py-20", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" }) }));
    }
    // Error state
    if (errorIngredientes) {
        return (_jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4 text-red-700", children: "Error al cargar ingredientes" }));
    }
    // Estadísticas
    const totalIngredientes = serverTotalCount;
    const ingredienteMasCostoso = allItems.length > 0
        ? allItems.reduce((max, ing) => ing.precioUnitario > max.precioUnitario ? ing : max)
        : null;
    return (_jsxs("div", { className: "max-w-7xl mx-auto p-4 sm:p-6", children: [_jsxs("div", { className: "mb-6 sm:mb-8", children: [_jsx("h1", { className: "text-2xl sm:text-3xl font-bold text-primary-900 dark:text-white mb-2", children: "Ingredientes" }), _jsx("p", { className: "text-sm sm:text-base text-primary-600 dark:text-gray-400", children: "Gesti\u00F3n de inventario y precios de ingredientes" })] }), _jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8", children: [_jsx(StatsCard, { label: "Total Ingredientes", value: totalIngredientes, icon: Package, iconColor: "primary", delay: 0, onClick: () => setSearchTerm("") }), _jsx(StatsCard, { label: "M\u00E1s Costoso", value: ingredienteMasCostoso ? `${ingredienteMasCostoso.nombre}` : "N/A", icon: TrendingUp, iconColor: "orange", delay: 0.2 }), "        ", _jsx(StatsCard, { label: "Reportes y estadisticas", value: "Visitar", icon: ArrowUpLeft, iconColor: "primary", delay: 0, href: "/reportes/stock" })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: 0.1 }, className: "bg-primary-200 dark:bg-gray-800 rounded-xl shadow-sm border border-primary-200 dark:border-gray-700 p-4 mb-6 sm:mb-8", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 dark:text-gray-500 w-5 h-5" }), _jsx("input", { type: "text", placeholder: "Buscar ingrediente...", value: searchTerm, onChange: (e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1); // Reset a página 1 al buscar
                                }, className: "w-full pl-10 pr-4 py-2 \n             bg-primary-100 dark:bg-gray-700 text-primary-900 dark:text-white\n             placeholder-primary-500 dark:placeholder-gray-400\n             border border-primary-300 dark:border-gray-600\n             rounded-lg \n             focus:ring-2 focus:ring-primary-400 focus:border-transparent \n             outline-none" })] }), _jsxs("div", { className: "flex items-center justify-between mt-2 text-xs sm:text-sm text-primary-600 dark:text-gray-400", children: [displayData && displayData.length > 0 ? (_jsx("p", { children: isSearching
                                    ? `Mostrando ${displayData.length} de ${filteredData.length} resultados (${totalIngredientes} total)`
                                    : `Mostrando ${displayData.length} de ${totalIngredientes} ingredientes` })) : (_jsx("p", { children: "\u00A0" })), _jsxs("button", { onClick: () => setPopupCreateOpen(true), className: "flex items-center gap-1 text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors text-xs font-medium", children: [_jsx(Plus, { className: "w-4 h-4" }), "Agregar"] })] })] }), (!displayData || displayData.length === 0) && (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: 0.4 }, className: "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-8 text-center", children: [_jsx(Package, { className: "w-16 h-16 mx-auto text-yellow-600 dark:text-yellow-400 mb-4" }), _jsx("h3", { className: "text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2", children: "No hay ingredientes disponibles" }), _jsx("p", { className: "text-yellow-600 dark:text-yellow-400 mb-4", children: searchTerm
                            ? `No se encontraron ingredientes que coincidan con "${searchTerm}"`
                            : "Aún no has agregado ingredientes al inventario" }), _jsxs("button", { onClick: () => setPopupCreateOpen(true), className: "inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors", children: [_jsx(Plus, { className: "w-4 h-4" }), "Agregar primer ingrediente"] })] })), displayData && displayData.length > 0 && (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: 0.4 }, className: "bg-primary-50 dark:bg-gray-800 rounded-xl shadow-sm border border-primary-200 dark:border-gray-700 overflow-hidden", children: [_jsx("div", { className: "block lg:hidden p-4 space-y-4", children: (displayData || []).map((ing, index) => (_jsxs(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.3, delay: index * 0.02 }, className: "bg-white dark:bg-gray-700 rounded-lg p-4 shadow-md space-y-3", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("div", { className: "w-2 h-2 bg-primary-500 rounded-full" }), _jsx("span", { className: "font-semibold text-gray-900 dark:text-white", children: ing.nombre })] }), _jsxs("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: ["ID: ", ing.idIngrediente] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => handleEdit(ing), className: "p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition", title: "Editar", children: _jsx(Edit, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleDelete(ing.idIngrediente, ing.nombre), className: "p-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition", title: "Eliminar", children: _jsx(Trash2, { className: "w-4 h-4" }) })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs text-gray-600 dark:text-gray-400 font-medium", children: "Unidad" }), _jsx("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children: _jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-200 dark:bg-primary-900 text-primary-800 dark:text-primary-300", children: ing.unidadCompra }) })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs text-gray-600 dark:text-gray-400 font-medium", children: "Stock" }), _jsx("p", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: ing.stock !== undefined && ing.stock !== null ? ing.stock : '-' })] })] }), _jsxs("div", { className: "pt-2 border-t border-gray-200 dark:border-gray-600", children: [_jsx("label", { className: "text-xs text-gray-600 dark:text-gray-400 font-medium", children: "Precio Unitario" }), _jsx("p", { className: "text-lg font-bold text-green-600 dark:text-green-400", children: ing.precioUnitario.toLocaleString('es-AR', {
                                                style: 'currency',
                                                currency: 'ARS',
                                                minimumFractionDigits: 2,
                                            }) })] })] }, ing.idIngrediente ?? index))) }), _jsx("div", { className: "hidden lg:block overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-primary-50 dark:bg-gray-700 border-b border-primary-200 dark:border-gray-600", children: [_jsx("th", { className: "bg-primary-200 dark:bg-gray-700 px-6 py-4 text-left text-xs font-semibold text-primary-700 dark:text-gray-300 uppercase tracking-wider", children: "#" }), _jsx("th", { className: "bg-primary-200 dark:bg-gray-700 px-6 py-4 text-left text-xs font-semibold text-primary-700 dark:text-gray-300 uppercase tracking-wider", children: "Nombre" }), _jsx("th", { className: "bg-primary-200 dark:bg-gray-700 px-6 py-4 text-left text-xs font-semibold text-primary-700 dark:text-gray-300 uppercase tracking-wider", children: "Unidad" }), _jsx("th", { className: "bg-primary-200 dark:bg-gray-700 px-6 py-4 text-left text-xs font-semibold text-primary-700 dark:text-gray-300 uppercase tracking-wider", children: "Stock" }), _jsx("th", { className: "bg-primary-200 dark:bg-gray-700 px-6 py-4 text-left text-xs font-semibold text-primary-700 dark:text-gray-300 uppercase tracking-wider", children: "Precio Unitario" }), _jsx("th", { className: "bg-primary-200 dark:bg-gray-700 px-6 py-4 text-center text-xs font-semibold text-primary-700 dark:text-gray-300 uppercase tracking-wider", children: "Acciones" })] }) }), _jsx("tbody", { className: "divide-y divide-primary-200 dark:divide-gray-600", children: (displayData || []).map((ing, index) => (_jsxs(motion.tr, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.3, delay: index * 0.02 }, className: "hover:bg-primary-100 dark:hover:bg-gray-700 transition-colors", children: [_jsx("td", { className: "px-6 py-4 text-sm text-primary-900 dark:text-white font-medium", children: ing.idIngrediente }), _jsx("td", { className: "px-6 py-4 text-sm text-primary-900 dark:text-white", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-2 h-2 bg-primary-500 rounded-full" }), _jsx("span", { className: "font-medium", children: ing.nombre })] }) }), _jsx("td", { className: "px-6 py-4 text-sm text-primary-600 dark:text-gray-400", children: _jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-200 dark:bg-primary-900 text-primary-800 dark:text-primary-300", children: ing.unidadCompra }) }), _jsx("td", { className: "px-6 py-4 text-sm text-primary-900 dark:text-white", children: _jsx("span", { className: "font-semibold", children: ing.stock !== undefined && ing.stock !== null ? ing.stock : '-' }) }), _jsx("td", { className: "px-6 py-4 text-sm font-semibold text-green-600 dark:text-green-400", children: ing.precioUnitario.toLocaleString('es-AR', {
                                                    style: 'currency',
                                                    currency: 'ARS',
                                                    minimumFractionDigits: 2,
                                                }) }), _jsx("td", { className: "px-6 py-4 text-sm", children: _jsxs("div", { className: "flex items-center justify-center gap-2", children: [_jsx("button", { onClick: () => handleEdit(ing), className: "p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors", title: "Editar", children: _jsx(Edit, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleDelete(ing.idIngrediente, ing.nombre), className: "p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors", title: "Eliminar", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }) })] }, ing.idIngrediente ?? index))) })] }) }), totalPages > 1 && (_jsxs("div", { className: "flex justify-between items-center p-4 border-t border-primary-200 dark:border-gray-700 bg-primary-50 dark:bg-gray-800", children: [_jsx("button", { onClick: () => setCurrentPage(p => Math.max(1, p - 1)), disabled: currentPage === 1, className: `px-4 py-2 rounded-md ${currentPage === 1
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                                    : 'bg-primary-500 text-white hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700'}`, children: "Anterior" }), _jsxs("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: ["P\u00E1gina ", currentPage, " de ", totalPages] }), _jsx("button", { onClick: () => setCurrentPage(p => Math.min(totalPages, p + 1)), disabled: currentPage === totalPages, className: `px-4 py-2 rounded-md ${currentPage === totalPages
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                                    : 'bg-primary-500 text-white hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700'}`, children: "Siguiente" })] }))] })), _jsx(PopupForm, { isOpen: popupCreateOpen, tipo: "ingrediente", unidadesCompra: ["kg", "g", "unidad", "litro", "ml"], onClose: () => setPopupCreateOpen(false), onSubmit: handleCreate }), selectedItem && (_jsx(PopupEdit, { isOpen: popupEditOpen, tipo: "ingrediente", itemData: {
                    id: selectedItem.idIngrediente,
                    nombre: selectedItem.nombre,
                    precioUnitario: selectedItem.precioUnitario,
                    stock: selectedItem.stock
                }, onClose: () => {
                    setPopupEditOpen(false);
                    setSelectedItem(null);
                }, onSubmit: handleUpdate })), _jsx(PopupConfirm, { isOpen: popupConfirmOpen, title: "Eliminar Ingrediente", message: "\u00BFEst\u00E1 seguro de que desea eliminar este ingrediente?", itemName: itemToDelete?.nombre, onConfirm: confirmDelete, onCancel: cancelDelete }), errorCreate && (_jsx("p", { className: "text-red-500 mt-4 text-sm", children: "Error al crear ingrediente. Intenta nuevamente." }))] }));
};
export default Ingredientes;
