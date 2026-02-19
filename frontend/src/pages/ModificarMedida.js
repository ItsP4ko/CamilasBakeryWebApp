import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Plus, Edit2, Trash2, Package, DollarSign, Save, RotateCcw } from 'lucide-react';
import { toast } from 'react-toastify';
import { getMedida, addIngredienteToMedida, updateIngredienteMedida, removeIngredienteFromMedida, addCostoExtraToMedida, removeCostoExtraFromMedida, updatePrecioVentaMedida, } from '@/api/tortas';
import { useCostoExtra } from '@/hooks/useCostoExtra';
import PopupAgregarIngredienteMedida from '@/components/tortas/PopupAgregarIngredienteMedida';
import PopupConfirm from '@/components/general/PopupConfirm';
import Select from 'react-select';
const ModificarMedida = () => {
    const { tortaId, medidaId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [showAddIngrediente, setShowAddIngrediente] = useState(false);
    const [showAddCosto, setShowAddCosto] = useState(false);
    const [showEditIngrediente, setShowEditIngrediente] = useState(false);
    const [showDeleteIngrediente, setShowDeleteIngrediente] = useState(false);
    const [showDeleteCosto, setShowDeleteCosto] = useState(false);
    const [ingredienteSeleccionado, setIngredienteSeleccionado] = useState(null);
    const [costoSeleccionado, setCostoSeleccionado] = useState(null);
    const [costoExtraSeleccionado, setCostoExtraSeleccionado] = useState(null);
    const [cantidadCosto, setCantidadCosto] = useState('');
    const [precioInput, setPrecioInput] = useState('');
    // Queries
    const { data: medida, isLoading } = useQuery({
        queryKey: ['medida', medidaId],
        queryFn: () => getMedida(Number.parseInt(medidaId || '0')),
        enabled: !!medidaId,
    });
    const { data: costosExtraResult } = useCostoExtra(1, 1000);
    const costosExtra = costosExtraResult?.items || [];
    // Mutations
    const addIngredienteMutation = useMutation({
        mutationFn: (data) => addIngredienteToMedida(Number.parseInt(medidaId || '0'), data.ingredienteId, data.cantidad, data.unidad),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['medida', medidaId] });
            queryClient.invalidateQueries({ queryKey: ['tortas'] });
            toast.success('Ingrediente agregado exitosamente');
        },
        onError: () => {
            toast.error('Error al agregar el ingrediente');
        },
    });
    const updateIngredienteMutation = useMutation({
        mutationFn: (data) => updateIngredienteMedida(data.id, data.cantidad, data.unidad),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['medida', medidaId] });
            queryClient.invalidateQueries({ queryKey: ['tortas'] });
            toast.success('Ingrediente actualizado exitosamente');
            setShowEditIngrediente(false);
        },
        onError: () => {
            toast.error('Error al actualizar el ingrediente');
        },
    });
    const removeIngredienteMutation = useMutation({
        mutationFn: (id) => removeIngredienteFromMedida(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['medida', medidaId] });
            queryClient.invalidateQueries({ queryKey: ['tortas'] });
            toast.success('Ingrediente eliminado exitosamente');
            setShowDeleteIngrediente(false);
        },
        onError: () => {
            toast.error('Error al eliminar el ingrediente');
        },
    });
    const addCostoMutation = useMutation({
        mutationFn: (data) => addCostoExtraToMedida(Number.parseInt(medidaId || '0'), data.costoExtraId, data.cantidad),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['medida', medidaId] });
            queryClient.invalidateQueries({ queryKey: ['tortas'] });
            toast.success('Costo extra agregado exitosamente');
            setShowAddCosto(false);
            setCostoExtraSeleccionado(null);
            setCantidadCosto('');
        },
        onError: () => {
            toast.error('Error al agregar el costo extra');
        },
    });
    const removeCostoMutation = useMutation({
        mutationFn: (id) => removeCostoExtraFromMedida(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['medida', medidaId] });
            queryClient.invalidateQueries({ queryKey: ['tortas'] });
            toast.success('Costo extra eliminado exitosamente');
            setShowDeleteCosto(false);
        },
        onError: () => {
            toast.error('Error al eliminar el costo extra');
        },
    });
    // Handlers
    const handleAddIngrediente = (ingrediente) => {
        addIngredienteMutation.mutate({
            ingredienteId: ingrediente.idIngrediente,
            cantidad: ingrediente.cantidad,
            unidad: ingrediente.unidad,
        });
    };
    const handleUpdateIngrediente = (values) => {
        if (ingredienteSeleccionado) {
            updateIngredienteMutation.mutate({
                id: ingredienteSeleccionado.IdMedidaIngrediente,
                cantidad: Number.parseFloat(values.cantidad),
                unidad: values.unidad,
            });
        }
    };
    const handleDeleteIngrediente = () => {
        if (ingredienteSeleccionado) {
            removeIngredienteMutation.mutate(ingredienteSeleccionado.IdMedidaIngrediente);
            setIngredienteSeleccionado(null);
        }
    };
    const handleAddCosto = () => {
        if (costoExtraSeleccionado && cantidadCosto) {
            addCostoMutation.mutate({
                costoExtraId: costoExtraSeleccionado.value,
                cantidad: Number.parseFloat(cantidadCosto),
            });
        }
    };
    const handleDeleteCosto = () => {
        if (costoSeleccionado) {
            removeCostoMutation.mutate(costoSeleccionado.IdMedidaCostoExtra);
            setCostoSeleccionado(null);
        }
    };
    // Precio manual mutation
    const updatePrecioMutation = useMutation({
        mutationFn: (precio) => updatePrecioVentaMedida(Number.parseInt(medidaId || '0'), precio),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['medida', medidaId] });
            queryClient.invalidateQueries({ queryKey: ['tortas'] });
            toast.success('Precio actualizado exitosamente');
        },
        onError: () => {
            toast.error('Error al actualizar el precio');
        },
    });
    // Inicializar el input de precio cuando carga la medida
    useEffect(() => {
        if (medida) {
            setPrecioInput(medida.PrecioVentaManual != null
                ? medida.PrecioVentaManual.toString()
                : '');
        }
    }, [medida]);
    const handleGuardarPrecio = () => {
        const precio = precioInput.trim() === '' ? null : Number.parseFloat(precioInput);
        if (precio !== null && (Number.isNaN(precio) || precio < 0)) {
            toast.error('Ingrese un precio válido');
            return;
        }
        updatePrecioMutation.mutate(precio);
    };
    const handleResetPrecio = () => {
        setPrecioInput('');
        updatePrecioMutation.mutate(null);
    };
    // Calcular multiplicador real en frontend para preview
    const precioActual = precioInput.trim() === ''
        ? (medida?.PrecioSugerido ?? 0)
        : (Number.parseFloat(precioInput) || 0);
    const multiplicadorPreview = medida && medida.CostoTotal > 0
        ? (precioActual / medida.CostoTotal).toFixed(2)
        : (medida?.MultiplicadorGanancia ?? 2.7).toFixed(2);
    const gananciaPreview = medida ? precioActual - medida.CostoTotal : 0;
    // Opciones para el selector de costos extra
    const opcionesCostos = costosExtra?.map((c) => ({
        value: c.idCostoExtra,
        label: `${c.nombre} - $${c.precioUnitario?.toLocaleString('es-AR')}`,
    })) || [];
    if (isLoading) {
        return _jsx("div", { className: "text-center py-10 text-gray-600 dark:text-gray-400", children: "Cargando..." });
    }
    if (!medida) {
        return _jsx("div", { className: "text-center py-10 text-gray-600 dark:text-gray-400", children: "Medida no encontrada" });
    }
    return (_jsxs("div", { className: "max-w-6xl mx-auto py-10 px-6", children: [_jsxs("div", { className: "mb-8", children: [_jsxs("button", { onClick: () => navigate(`/tortas/${tortaId}/medidas`), className: "flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 mb-4", children: [_jsx(ArrowLeft, { className: "w-5 h-5" }), "Volver a Medidas"] }), _jsxs("h1", { className: "text-3xl font-bold text-gray-900 dark:text-gray-100", children: ["Contenido de Medida - ", medida.Tamano] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-5", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Package, { className: "w-6 h-6 text-primary-600 dark:text-primary-400" }), _jsx("h2", { className: "text-xl font-bold text-gray-900 dark:text-gray-100", children: "Ingredientes" })] }), _jsxs("button", { onClick: () => setShowAddIngrediente(true), className: "flex items-center gap-2 px-3 py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm", children: [_jsx(Plus, { className: "w-4 h-4" }), "Agregar"] })] }), _jsx("div", { className: "space-y-2", children: medida.Ingredientes?.length === 0 ? (_jsx("p", { className: "text-gray-500 dark:text-gray-400 text-center py-4", children: "No hay ingredientes agregados" })) : (medida.Ingredientes?.map((ing) => (_jsxs("div", { className: "flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg", children: [_jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "font-medium text-gray-900 dark:text-gray-100", children: ing.NombreIngrediente }), _jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: [ing.CantidadUsada, " ", ing.UnidadUsada, " \u2022 $", ing.CostoTotal.toFixed(2)] })] }), _jsxs("div", { className: "flex gap-1", children: [_jsx("button", { onClick: () => {
                                                                setIngredienteSeleccionado(ing);
                                                                setShowEditIngrediente(true);
                                                            }, className: "p-1.5 text-primary-600 dark:text-primary-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded", children: _jsx(Edit2, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => {
                                                                setIngredienteSeleccionado(ing);
                                                                setShowDeleteIngrediente(true);
                                                            }, className: "p-1.5 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded", children: _jsx(Trash2, { className: "w-4 h-4" }) })] })] }, ing.IdMedidaIngrediente)))) }), _jsx("div", { className: "mt-4 pt-4 border-t border-gray-200 dark:border-gray-700", children: _jsxs("p", { className: "text-right text-gray-700 dark:text-gray-300 font-medium", children: ["Subtotal Ingredientes: $", medida.CostoIngredientes.toFixed(2)] }) })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 }, className: "bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-5", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(DollarSign, { className: "w-6 h-6 text-green-600 dark:text-green-400" }), _jsx("h2", { className: "text-xl font-bold text-gray-900 dark:text-gray-100", children: "Costos Extra" })] }), _jsxs("button", { onClick: () => setShowAddCosto(true), className: "flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm", children: [_jsx(Plus, { className: "w-4 h-4" }), "Agregar"] })] }), _jsx("div", { className: "space-y-2", children: medida.CostosExtra?.length === 0 ? (_jsx("p", { className: "text-gray-500 dark:text-gray-400 text-center py-4", children: "No hay costos extra agregados" })) : (medida.CostosExtra?.map((costo) => (_jsxs("div", { className: "flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg", children: [_jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "font-medium text-gray-900 dark:text-gray-100", children: costo.NombreCostoExtra }), _jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: [costo.CantidadUsada, " unidad \u2022 $", costo.CostoTotal.toFixed(2)] })] }), _jsx("button", { onClick: () => {
                                                        setCostoSeleccionado(costo);
                                                        setShowDeleteCosto(true);
                                                    }, className: "p-1.5 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }, costo.IdMedidaCostoExtra)))) }), _jsx("div", { className: "mt-4 pt-4 border-t border-green-200 dark:border-gray-700", children: _jsxs("p", { className: "text-right text-gray-700 dark:text-gray-300 font-medium", children: ["Subtotal Extras: $", medida.CostoExtras.toFixed(2)] }) })] })] }), _jsx("div", { className: "lg:col-span-1", children: _jsxs(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, className: "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl p-5 border border-gray-300 dark:border-gray-600 sticky top-6", children: [_jsx("h2", { className: "text-xl font-bold mb-4 text-gray-900 dark:text-gray-100", children: _jsx("strong", { children: "Resumen" }) }), _jsxs("div", { className: "space-y-3 text-gray-800 dark:text-gray-200", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Costo Ingredientes:" }), _jsxs("span", { className: "font-medium", children: ["$", medida.CostoIngredientes.toFixed(2)] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Costo Extras:" }), _jsxs("span", { className: "font-medium", children: ["$", medida.CostoExtras.toFixed(2)] })] }), _jsx("div", { className: "border-t border-gray-400 dark:border-gray-600 pt-3", children: _jsxs("div", { className: "flex justify-between text-lg font-bold", children: [_jsx("span", { children: "Costo Total:" }), _jsxs("span", { children: ["$", medida.CostoTotal.toFixed(2)] })] }) }), _jsx("div", { className: "border-t border-gray-400 dark:border-gray-600 pt-3", children: _jsxs("div", { className: "flex justify-between text-sm text-gray-500 dark:text-gray-400", children: [_jsxs("span", { children: ["Precio Sugerido (x", medida.MultiplicadorGanancia, "):"] }), _jsxs("span", { children: ["$", medida.PrecioSugerido.toFixed(2)] })] }) }), _jsxs("div", { className: "border-t border-gray-400 dark:border-gray-600 pt-3 space-y-2", children: [_jsx("label", { htmlFor: "precioManual", className: "block text-sm font-medium text-gray-700 dark:text-gray-300", children: "Precio Real:" }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", children: "$" }), _jsx("input", { id: "precioManual", type: "number", step: "0.01", min: "0", value: precioInput, onChange: (e) => setPrecioInput(e.target.value), placeholder: medida.PrecioSugerido.toFixed(2), className: "w-full pl-7 pr-3 py-2 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-right" })] }), _jsx("button", { onClick: handleGuardarPrecio, disabled: updatePrecioMutation.isPending, className: "p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-gray-300 dark:disabled:bg-gray-600", title: "Guardar precio", children: _jsx(Save, { className: "w-4 h-4" }) }), medida.PrecioVentaManual != null && (_jsx("button", { onClick: handleResetPrecio, disabled: updatePrecioMutation.isPending, className: "p-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 disabled:bg-gray-300 dark:disabled:bg-gray-600", title: "Usar precio autom\u00E1tico", children: _jsx(RotateCcw, { className: "w-4 h-4" }) }))] }), medida.PrecioVentaManual != null && (_jsx("p", { className: "text-xs text-amber-600 dark:text-amber-400", children: "\u26A1 Precio manual activo" }))] }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { children: "Multiplicador Real:" }), _jsxs("span", { className: `font-bold ${Number(multiplicadorPreview) >= medida.MultiplicadorGanancia ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`, children: ["x", multiplicadorPreview] })] }), _jsxs("div", { className: `flex justify-between font-bold mt-2 ${gananciaPreview >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`, children: [_jsx("span", { children: "Ganancia:" }), _jsxs("span", { children: ["$", gananciaPreview.toFixed(2)] })] })] })] }) })] }), _jsx(PopupAgregarIngredienteMedida, { isOpen: showAddIngrediente, onClose: () => setShowAddIngrediente(false), onSave: handleAddIngrediente }), _jsx(AnimatePresence, { children: showAddCosto && (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: () => setShowAddCosto(false), className: "absolute inset-0 bg-black/50 backdrop-blur-sm" }), _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: "relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900 dark:text-gray-100 mb-4", children: "Agregar Costo Extra" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Costo Extra" }), _jsx(Select, { options: opcionesCostos, value: costoExtraSeleccionado, onChange: setCostoExtraSeleccionado, placeholder: "Seleccionar costo extra...", styles: {
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
                                                    } })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Cantidad" }), _jsx("input", { type: "number", step: "0.001", min: "0.001", value: cantidadCosto, onChange: (e) => setCantidadCosto(e.target.value), className: "w-full px-4 py-2 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-green-500 outline-none", placeholder: "Ej: 1, 0.5, 0.255..." })] })] }), _jsxs("div", { className: "flex justify-end gap-3 mt-6", children: [_jsx("button", { onClick: () => setShowAddCosto(false), className: "px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg", children: "Cancelar" }), _jsx("button", { onClick: handleAddCosto, disabled: !costoExtraSeleccionado || !cantidadCosto, className: "px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 dark:disabled:bg-gray-600", children: "Agregar" })] })] })] })) }), _jsx(AnimatePresence, { children: showEditIngrediente && ingredienteSeleccionado && (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: () => setShowEditIngrediente(false), className: "absolute inset-0 bg-black/50 backdrop-blur-sm" }), _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: "relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900 dark:text-gray-100 mb-4", children: "Editar Ingrediente" }), _jsxs("form", { onSubmit: (e) => {
                                        e.preventDefault();
                                        const formData = new FormData(e.currentTarget);
                                        handleUpdateIngrediente({
                                            cantidad: formData.get('cantidad'),
                                            unidad: ingredienteSeleccionado.UnidadUsada,
                                        });
                                    }, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Ingrediente" }), _jsx("input", { type: "text", value: ingredienteSeleccionado.NombreIngrediente, disabled: true, className: "w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Cantidad" }), _jsx("input", { name: "cantidad", type: "number", step: "0.001", min: "0.001", defaultValue: ingredienteSeleccionado.CantidadUsada, required: true, className: "w-full px-4 py-2 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Unidad" }), _jsx("input", { type: "text", value: ingredienteSeleccionado.UnidadUsada, disabled: true, className: "w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg" })] }), _jsxs("div", { className: "flex justify-end gap-3 mt-6", children: [_jsx("button", { type: "button", onClick: () => setShowEditIngrediente(false), className: "px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg", children: "Cancelar" }), _jsx("button", { type: "submit", disabled: updateIngredienteMutation.isPending, className: "px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-gray-300 dark:disabled:bg-gray-600", children: updateIngredienteMutation.isPending ? 'Guardando...' : 'Guardar' })] })] })] })] })) }), ingredienteSeleccionado && (_jsx(PopupConfirm, { isOpen: showDeleteIngrediente, onCancel: () => setShowDeleteIngrediente(false), onConfirm: handleDeleteIngrediente, title: "Eliminar Ingrediente", message: `¿Estás seguro de eliminar este ingrediente?`, itemName: ingredienteSeleccionado.NombreIngrediente })), costoSeleccionado && (_jsx(PopupConfirm, { isOpen: showDeleteCosto, onCancel: () => setShowDeleteCosto(false), onConfirm: handleDeleteCosto, title: "Eliminar Costo Extra", message: `¿Estás seguro de eliminar este costo extra?`, itemName: costoSeleccionado.NombreCostoExtra }))] }));
};
export default ModificarMedida;
