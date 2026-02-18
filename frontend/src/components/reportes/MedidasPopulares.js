import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useMedidasPopulares } from '../../hooks/useReportes';
import { useTortas } from '../../hooks/useTortas';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Ruler, Calendar } from 'lucide-react';
import Select from 'react-select';
const MedidasPopulares = () => {
    const [tortaSeleccionada, setTortaSeleccionada] = useState(null);
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [filtrosAplicados, setFiltrosAplicados] = useState(null);
    const { data, isLoading, isError, error } = useMedidasPopulares(filtrosAplicados);
    const { data: tortas, isLoading: isLoadingTortas } = useTortas();
    const handleBuscar = () => {
        setFiltrosAplicados({
            idTorta: tortaSeleccionada?.value || null,
            fechaInicio: fechaInicio || null,
            fechaFin: fechaFin || null
        });
    };
    // Opciones para el selector de tortas
    const opcionesTortas = tortas?.map((torta) => ({
        value: torta.IdTorta,
        label: torta.Nombre,
    })) || [];
    const COLORS = ['#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'];
    if (isLoading) {
        return (_jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-md p-6", children: _jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500" }) }) }));
    }
    if (isError) {
        return (_jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-md p-6", children: _jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", children: _jsxs("p", { className: "text-red-800", children: ["Error al cargar medidas populares: ", error instanceof Error ? error.message : 'Error desconocido'] }) }) }));
    }
    // Agrupar datos por torta
    const dataByTorta = data?.reduce((acc, item) => {
        const key = item.IdTorta;
        if (!acc[key]) {
            acc[key] = {
                nombreTorta: item.NombreTorta,
                medidas: []
            };
        }
        acc[key].medidas.push(item);
        return acc;
    }, {});
    return (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Ruler, { className: "w-6 h-6 text-blue-500" }), _jsx("h2", { className: "text-xl font-semibold text-gray-800 dark:text-gray-100", children: "Medidas M\u00E1s Populares" })] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 items-end", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Torta (Opcional)" }), _jsx(Select, { isLoading: isLoadingTortas, options: opcionesTortas, value: tortaSeleccionada, onChange: (selected) => setTortaSeleccionada(selected), placeholder: "Todas las tortas", isClearable: true, isSearchable: true, noOptionsMessage: () => 'No hay tortas disponibles', className: "react-select-container", classNamePrefix: "react-select", styles: {
                                    control: (base, state) => ({
                                        ...base,
                                        backgroundColor: 'var(--select-bg, white)',
                                        borderColor: state.isFocused ? '#ec4899' : '#4b5563',
                                        boxShadow: state.isFocused ? '0 0 0 1px #ec4899' : 'none',
                                        '&:hover': {
                                            borderColor: '#ec4899',
                                        },
                                    }),
                                    menu: (base) => ({
                                        ...base,
                                        backgroundColor: 'var(--select-bg, white)',
                                        zIndex: 9999,
                                    }),
                                    option: (base, state) => ({
                                        ...base,
                                        backgroundColor: state.isSelected
                                            ? '#ec4899'
                                            : state.isFocused
                                                ? 'var(--select-hover, #fce7f3)'
                                                : 'transparent',
                                        color: state.isSelected
                                            ? 'white'
                                            : state.isFocused
                                                ? 'var(--select-hover-text, #831843)'
                                                : 'var(--text-color, black)',
                                        cursor: 'pointer',
                                        '&:active': {
                                            backgroundColor: '#ec4899',
                                        },
                                    }),
                                    singleValue: (base) => ({
                                        ...base,
                                        color: 'var(--text-color, black)',
                                    }),
                                    input: (base) => ({
                                        ...base,
                                        color: 'var(--text-color, black)',
                                    }),
                                    placeholder: (base) => ({
                                        ...base,
                                        color: 'var(--placeholder-color, #9ca3af)',
                                    }),
                                } })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Fecha Inicio (Opcional)" }), _jsx("input", { type: "date", value: fechaInicio, onChange: (e) => setFechaInicio(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white", lang: "es-AR" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Fecha Fin (Opcional)" }), _jsx("input", { type: "date", value: fechaFin, onChange: (e) => setFechaFin(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white", lang: "es-AR" })] }), _jsx("button", { onClick: handleBuscar, className: "px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-md transition-colors focus:ring-2 focus:ring-pink-500 focus:ring-offset-2", children: "Buscar" })] }), dataByTorta && Object.keys(dataByTorta).length > 0 ? (_jsx("div", { className: "space-y-8", children: Object.entries(dataByTorta).map(([idTorta, { nombreTorta, medidas }]) => {
                    const chartData = medidas.map(m => ({
                        name: m.TamanoMedida,
                        value: m.CantidadVendida,
                        percentage: m.PorcentajeDelTotal
                    }));
                    const totalVendidas = medidas.reduce((sum, m) => sum + m.CantidadVendida, 0);
                    return (_jsxs("div", { className: "bg-gray-50 dark:bg-gray-700 rounded-lg p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4", children: nombreTorta }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsx("div", { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: chartData, cx: "50%", cy: "50%", labelLine: false, label: (entry) => `${entry.name} (${entry.percentage.toFixed(1)}%)`, outerRadius: 100, fill: "#8884d8", dataKey: "value", children: chartData.map((entry, index) => (_jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))) }), _jsx(Tooltip, { formatter: (value) => [`${value} unidades`, 'Cantidad'] })] }) }) }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-600 dark:text-gray-400", children: "Total Vendidas" }), _jsx("p", { className: "text-3xl font-bold text-gray-900 dark:text-white mt-1", children: totalVendidas })] }), _jsx("div", { className: "space-y-2", children: medidas.map((medida, index) => (_jsxs("div", { className: "flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-4 h-4 rounded-full", style: { backgroundColor: COLORS[index % COLORS.length] } }), _jsx("span", { className: "font-medium text-gray-900 dark:text-white", children: medida.TamanoMedida })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "font-bold text-gray-900 dark:text-white", children: medida.CantidadVendida }), _jsxs("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: [medida.PorcentajeDelTotal.toFixed(2), "%"] })] })] }, medida.IdMedida))) })] })] })] }, idTorta));
                }) })) : (_jsx("div", { className: "flex items-center justify-center h-64 text-gray-500 dark:text-gray-400", children: _jsxs("div", { className: "text-center", children: [_jsx(Calendar, { className: "w-12 h-12 mx-auto mb-2 opacity-50" }), _jsx("p", { children: "No hay datos con los filtros seleccionados" }), _jsx("p", { className: "text-sm mt-2", children: "Presiona \"Buscar\" sin filtros para ver todas las medidas" })] }) }))] }));
};
export default MedidasPopulares;
