import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Edit2, Trash2, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { getTortas, createMedida, updateMedida, deleteMedida } from '@/api/tortas';
import PopupConfirm from '@/components/general/PopupConfirm';
const GestionMedidas = () => {
    const { tortaId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [medidaSeleccionada, setMedidaSeleccionada] = useState(null);
    // Query para obtener la torta
    const { data: tortas, isLoading } = useQuery({
        queryKey: ['tortas'],
        queryFn: getTortas,
    });
    const torta = tortas?.find(t => t.IdTorta === parseInt(tortaId || '0'));
    // Mutations
    const createMutation = useMutation({
        mutationFn: (tamano) => createMedida(parseInt(tortaId || '0'), tamano),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tortas'] });
            toast.success('Medida creada exitosamente');
            setShowCreateModal(false);
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || 'Error al crear la medida');
        },
    });
    const updateMutation = useMutation({
        mutationFn: ({ id, tamano }) => updateMedida(id, tamano),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tortas'] });
            toast.success('Medida actualizada exitosamente');
            setShowEditModal(false);
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || 'Error al actualizar la medida');
        },
    });
    const deleteMutation = useMutation({
        mutationFn: (id) => deleteMedida(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tortas'] });
            toast.success('Medida eliminada exitosamente');
            setShowDeleteModal(false);
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || 'Error al eliminar la medida');
        },
    });
    const handleCreate = (values) => {
        createMutation.mutate(values.tamano);
    };
    const handleEdit = (values) => {
        if (medidaSeleccionada) {
            updateMutation.mutate({ id: medidaSeleccionada.IdMedida, tamano: values.tamano });
        }
    };
    const handleDelete = () => {
        if (medidaSeleccionada) {
            deleteMutation.mutate(medidaSeleccionada.IdMedida);
            setMedidaSeleccionada(null);
        }
    };
    const handleModificarContenido = (medidaId) => {
        navigate(`/tortas/${tortaId}/medidas/${medidaId}`);
    };
    if (isLoading) {
        return _jsx("div", { className: "text-center py-10 text-gray-600 dark:text-gray-400", children: "Cargando..." });
    }
    if (!torta) {
        return _jsx("div", { className: "text-center py-10 text-gray-600 dark:text-gray-400", children: "Torta no encontrada" });
    }
    return (_jsxs("div", { className: "max-w-6xl mx-auto py-6 sm:py-10 px-4 sm:px-6", children: [_jsxs("div", { className: "mb-6 sm:mb-8", children: [_jsxs("button", { onClick: () => navigate('/tortas'), className: "flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 mb-3 sm:mb-4 text-sm sm:text-base", children: [_jsx(ArrowLeft, { className: "w-4 h-4 sm:w-5 sm:h-5" }), "Volver a Tortas"] }), _jsxs("h1", { className: "text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100", children: ["Gesti\u00F3n de Medidas - ", torta.Nombre] })] }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "bg-gray-100 dark:bg-gray-800 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6", children: _jsxs("button", { onClick: () => setShowCreateModal(true), className: "w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 sm:py-2 text-sm sm:text-base bg-primary-500 text-white rounded-lg hover:bg-primary-600", children: [_jsx(Plus, { className: "w-4 h-4 sm:w-5 sm:h-5" }), "Nueva Medida"] }) }), torta.Medidas.length === 0 ? (_jsx("div", { className: "text-center py-10 text-sm sm:text-base text-gray-500 dark:text-gray-400", children: "No hay medidas disponibles para esta torta" })) : (_jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4", children: torta.Medidas.map((medida) => (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, className: "bg-white dark:bg-gray-700 rounded-xl border-2 border-gray-200 dark:border-gray-600 p-4 sm:p-5 hover:shadow-lg transition-all", children: [_jsxs("div", { className: "mb-3 sm:mb-4", children: [_jsxs("h3", { className: "text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-1", children: ["Medida: ", medida.Tamano] }), _jsxs("div", { className: "border-t border-gray-200 dark:border-gray-600 pt-2 sm:pt-3 mt-2 sm:mt-3 space-y-1", children: [_jsxs("p", { className: "text-xs sm:text-sm text-gray-600 dark:text-gray-400", children: [_jsx("span", { className: "font-medium", children: "Costo Total:" }), " $", medida.CostoTotal.toFixed(2)] }), _jsxs("p", { className: "text-xs sm:text-sm text-gray-600 dark:text-gray-400", children: [_jsx("span", { className: "font-medium", children: "Precio Venta:" }), " $", medida.PrecioVenta.toFixed(2), medida.PrecioVentaManual != null && (_jsx("span", { className: "ml-1 text-xs px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded", children: "manual" }))] }), _jsxs("p", { className: "text-xs sm:text-sm text-gray-600 dark:text-gray-400", children: [_jsx("span", { className: "font-medium", children: "Multiplicador Real:" }), " x", medida.MultiplicadorReal] }), _jsxs("p", { className: "text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium", children: [_jsx("span", { children: "Ganancia:" }), " $", medida.Ganancia.toFixed(2)] })] })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-2", children: [_jsxs("button", { onClick: () => {
                                        setMedidaSeleccionada(medida);
                                        setShowEditModal(true);
                                    }, className: "flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500 text-xs sm:text-sm", children: [_jsx(Edit2, { className: "w-3 h-3 sm:w-4 sm:h-4" }), "Editar"] }), _jsxs("button", { onClick: () => {
                                        setMedidaSeleccionada(medida);
                                        setShowDeleteModal(true);
                                    }, className: "flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50 text-xs sm:text-sm", children: [_jsx(Trash2, { className: "w-3 h-3 sm:w-4 sm:h-4" }), "Eliminar"] }), _jsxs("button", { onClick: () => handleModificarContenido(medida.IdMedida), className: "flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded hover:bg-green-200 dark:hover:bg-green-900/50 text-xs sm:text-sm", children: [_jsx(FileText, { className: "w-3 h-3 sm:w-4 sm:h-4" }), "Contenido"] })] })] }, medida.IdMedida))) })), showCreateModal && (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-black/50 backdrop-blur-sm", onClick: () => setShowCreateModal(false) }), _jsxs("div", { className: "relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-4 sm:p-6", children: [_jsx("h3", { className: "text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4", children: "Nueva Medida" }), _jsxs("form", { onSubmit: (e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    handleCreate({ tamano: formData.get('tamano') });
                                }, className: "space-y-3 sm:space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Tama\u00F1o de la Medida" }), _jsx("input", { name: "tamano", type: "text", required: true, className: "w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none", placeholder: "Ej: Peque\u00F1a, Mediana, Grande" })] }), _jsxs("div", { className: "flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 sm:mt-6", children: [_jsx("button", { type: "button", onClick: () => setShowCreateModal(false), className: "w-full sm:w-auto px-4 py-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg", children: "Cancelar" }), _jsx("button", { type: "submit", disabled: createMutation.isPending, className: "w-full sm:w-auto px-4 py-2 text-sm sm:text-base bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-gray-300 dark:disabled:bg-gray-600", children: createMutation.isPending ? 'Creando...' : 'Crear' })] })] })] })] })), medidaSeleccionada && (_jsxs(_Fragment, { children: [showEditModal && (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-black/50 backdrop-blur-sm", onClick: () => setShowEditModal(false) }), _jsxs("div", { className: "relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-4 sm:p-6", children: [_jsx("h3", { className: "text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4", children: "Editar Medida" }), _jsxs("form", { onSubmit: (e) => {
                                            e.preventDefault();
                                            const formData = new FormData(e.currentTarget);
                                            handleEdit({ tamano: formData.get('tamano') });
                                        }, className: "space-y-3 sm:space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Tama\u00F1o de la Medida" }), _jsx("input", { name: "tamano", type: "text", defaultValue: medidaSeleccionada.Tamano, required: true, className: "w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" })] }), _jsxs("div", { className: "flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 sm:mt-6", children: [_jsx("button", { type: "button", onClick: () => setShowEditModal(false), className: "w-full sm:w-auto px-4 py-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg", children: "Cancelar" }), _jsx("button", { type: "submit", disabled: updateMutation.isPending, className: "w-full sm:w-auto px-4 py-2 text-sm sm:text-base bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-gray-300 dark:disabled:bg-gray-600", children: updateMutation.isPending ? 'Guardando...' : 'Guardar' })] })] })] })] })), _jsx(PopupConfirm, { isOpen: showDeleteModal, onCancel: () => setShowDeleteModal(false), onConfirm: handleDelete, title: "Eliminar Medida", message: "\u00BFEst\u00E1s seguro de que deseas eliminar esta medida?", itemName: medidaSeleccionada.Tamano })] }))] }));
};
export default GestionMedidas;
