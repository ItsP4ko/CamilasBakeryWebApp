import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import PopupConfirm from '@/components/general/PopupConfirm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTorta, deleteTorta, updateTorta } from '@/api/tortas';
import { toast } from 'react-toastify';
export const BotonesGestionTorta = ({ tortaSeleccionada, }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const queryClient = useQueryClient();
    // Mutation para crear torta
    const createMutation = useMutation({
        mutationFn: (values) => createTorta(values.nombre, values.multiplicador),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tortas'] });
            toast.success('Torta creada exitosamente');
            setShowCreateModal(false);
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || 'Error al crear la torta');
        },
    });
    // Mutation para editar torta
    const updateMutation = useMutation({
        mutationFn: (values) => updateTorta(values.id, values.nombre, values.multiplicador),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tortas'] });
            toast.success('Torta actualizada exitosamente');
            setShowEditModal(false);
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || 'Error al actualizar la torta');
        },
    });
    // Mutation para eliminar torta
    const deleteMutation = useMutation({
        mutationFn: deleteTorta,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tortas'] });
            toast.success('Torta eliminada exitosamente');
            setShowDeleteModal(false);
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || 'Error al eliminar la torta');
        },
    });
    const handleCreate = (values) => {
        createMutation.mutate({ nombre: values.nombre, multiplicador: values.multiplicador });
    };
    const handleUpdate = (values) => {
        if (tortaSeleccionada) {
            updateMutation.mutate({
                id: tortaSeleccionada.IdTorta,
                nombre: values.nombre,
                multiplicador: values.multiplicador
            });
        }
    };
    const handleDelete = () => {
        if (tortaSeleccionada) {
            deleteMutation.mutate(tortaSeleccionada.IdTorta);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("button", { onClick: () => setShowCreateModal(true), className: "flex items-center gap-1 px-3 py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm", children: [_jsx(Plus, { className: "w-4 h-4" }), "Agregar"] }), _jsxs("button", { onClick: () => setShowEditModal(true), disabled: !tortaSeleccionada, className: `flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors text-sm ${tortaSeleccionada
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`, children: [_jsx(Pencil, { className: "w-4 h-4" }), "Editar"] }), _jsxs("button", { onClick: () => setShowDeleteModal(true), disabled: !tortaSeleccionada, className: `flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors text-sm ${tortaSeleccionada
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`, children: [_jsx(Trash2, { className: "w-4 h-4" }), "Eliminar"] })] }), showCreateModal && (_jsx(TortaModal, { title: "Nueva Torta", submitLabel: "Crear", onSubmit: handleCreate, onCancel: () => setShowCreateModal(false), isLoading: createMutation.isPending })), showEditModal && tortaSeleccionada && (_jsx(TortaModal, { title: "Editar Torta", submitLabel: "Guardar", initialValues: {
                    nombre: tortaSeleccionada.Nombre,
                    multiplicador: tortaSeleccionada.MultiplicadorGanancia
                }, onSubmit: handleUpdate, onCancel: () => setShowEditModal(false), isLoading: updateMutation.isPending })), tortaSeleccionada && (_jsx(PopupConfirm, { isOpen: showDeleteModal, onCancel: () => setShowDeleteModal(false), onConfirm: handleDelete, title: "Eliminar Torta", message: "\u00BFEst\u00E1s seguro de que deseas eliminar esta torta? Esta acci\u00F3n marcar\u00E1 la torta como inactiva.", itemName: tortaSeleccionada.Nombre }))] }));
};
const TortaModal = ({ title, submitLabel, initialValues, onCancel, onSubmit, isLoading }) => {
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [_jsx("div", { className: "absolute inset-0 bg-black/50 backdrop-blur-sm", onClick: onCancel }), _jsxs("div", { className: "relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900 dark:text-gray-100 mb-4", children: title }), _jsxs("form", { onSubmit: (e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const multiplicador = formData.get('multiplicador');
                            onSubmit({
                                nombre: formData.get('nombre'),
                                multiplicador: multiplicador ? Number.parseFloat(multiplicador) : undefined
                            });
                        }, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "nombre", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Nombre de la Torta" }), _jsx("input", { id: "nombre", name: "nombre", type: "text", required: true, defaultValue: initialValues?.nombre, className: "w-full px-4 py-2 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none", placeholder: "Ej: Torta de Chocolate" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "multiplicador", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Multiplicador de Ganancia" }), _jsx("input", { id: "multiplicador", name: "multiplicador", type: "number", step: "0.1", min: "0.1", max: "10", defaultValue: initialValues?.multiplicador ?? 2.7, className: "w-full px-4 py-2 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none", placeholder: "2.7" }), _jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: "Factor de multiplicaci\u00F3n para calcular precio de venta (ej: 2.7x, 2.0x)" })] }), _jsxs("div", { className: "flex justify-end gap-3 mt-6", children: [_jsx("button", { type: "button", onClick: onCancel, className: "px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg", children: "Cancelar" }), _jsx("button", { type: "submit", disabled: isLoading, className: "px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-gray-300 dark:disabled:bg-gray-600", children: isLoading ? 'Guardando...' : submitLabel })] })] })] })] }));
};
