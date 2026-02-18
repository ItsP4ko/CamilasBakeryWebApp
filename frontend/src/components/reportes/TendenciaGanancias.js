import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useTendenciaGanancias } from '../../hooks/useReportes';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
const TendenciaGanancias = () => {
    const [fechaInicio, setFechaInicio] = useState(() => {
        const date = new Date();
        date.setMonth(date.getMonth() - 3); // Últimos 3 meses
        return date.toISOString().split('T')[0];
    });
    const [fechaFin, setFechaFin] = useState(() => {
        return new Date().toISOString().split('T')[0];
    });
    const [agrupacion, setAgrupacion] = useState('semana');
    const [filtrosAplicados, setFiltrosAplicados] = useState({
        fechaInicio,
        fechaFin,
        agrupacion
    });
    const { data, isLoading, isError, error } = useTendenciaGanancias(filtrosAplicados);
    const handleBuscar = () => {
        setFiltrosAplicados({ fechaInicio, fechaFin, agrupacion });
    };
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };
    if (isLoading) {
        return (_jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-md p-6", children: _jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500" }) }) }));
    }
    if (isError) {
        return (_jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-md p-6", children: _jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", children: _jsxs("p", { className: "text-red-800", children: ["Error al cargar tendencia: ", error instanceof Error ? error.message : 'Error desconocido'] }) }) }));
    }
    const gananciaTotal = data?.reduce((sum, item) => sum + item.Ganancia, 0) || 0;
    const crecimientoPromedio = data && data.length > 0
        ? data.reduce((sum, item) => sum + item.PorcentajeCrecimiento, 0) / data.length
        : 0;
    const tendenciaPositiva = crecimientoPromedio >= 0;
    return (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { className: "flex items-center gap-3", children: [tendenciaPositiva ? (_jsx(TrendingUp, { className: "w-6 h-6 text-green-500" })) : (_jsx(TrendingDown, { className: "w-6 h-6 text-red-500" })), _jsx("h2", { className: "text-xl font-semibold text-gray-800 dark:text-gray-100", children: "Tendencia de Ganancias" })] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 items-end", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Fecha Inicio" }), _jsx("input", { type: "date", value: fechaInicio, onChange: (e) => setFechaInicio(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white", lang: "es-AR" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Fecha Fin" }), _jsx("input", { type: "date", value: fechaFin, onChange: (e) => setFechaFin(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white", lang: "es-AR" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Agrupar por" }), _jsxs("select", { value: agrupacion, onChange: (e) => setAgrupacion(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white", children: [_jsx("option", { value: "dia", children: "D\u00EDa" }), _jsx("option", { value: "semana", children: "Semana" }), _jsx("option", { value: "mes", children: "Mes" })] })] }), _jsx("button", { onClick: handleBuscar, className: "px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-md transition-colors focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2", children: "Buscar" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900 dark:to-emerald-800 rounded-lg p-4", children: [_jsx("p", { className: "text-sm font-medium text-emerald-700 dark:text-emerald-300", children: "Ganancia Total" }), _jsx("p", { className: "text-2xl font-bold text-emerald-900 dark:text-emerald-100 mt-1", children: formatCurrency(gananciaTotal) })] }), _jsxs("div", { className: `bg-gradient-to-br rounded-lg p-4 ${tendenciaPositiva
                            ? 'from-green-50 to-green-100 dark:from-green-900 dark:to-green-800'
                            : 'from-red-50 to-red-100 dark:from-red-900 dark:to-red-800'}`, children: [_jsx("p", { className: `text-sm font-medium ${tendenciaPositiva ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`, children: "Crecimiento Promedio" }), _jsxs("p", { className: `text-2xl font-bold mt-1 ${tendenciaPositiva ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'}`, children: [crecimientoPromedio >= 0 ? '+' : '', crecimientoPromedio.toFixed(2), "%"] })] })] }), data && data.length > 0 ? (_jsx("div", { className: "mt-6", children: _jsx(ResponsiveContainer, { width: "100%", height: 400, children: _jsxs(AreaChart, { data: data, children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "colorGanancia", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#10b981", stopOpacity: 0.8 }), _jsx("stop", { offset: "95%", stopColor: "#10b981", stopOpacity: 0.1 })] }) }), _jsx(CartesianGrid, { strokeDasharray: "3 3", className: "dark:opacity-20" }), _jsx(XAxis, { dataKey: "Periodo", className: "text-sm", tick: { fill: 'currentColor' } }), _jsx(YAxis, { className: "text-sm", tick: { fill: 'currentColor' }, tickFormatter: (value) => formatCurrency(value) }), _jsx(Tooltip, { contentStyle: {
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }, formatter: (value, name) => {
                                    if (name === 'Ganancia')
                                        return formatCurrency(value);
                                    return `${value.toFixed(2)}%`;
                                }, labelStyle: { fontWeight: 'bold', marginBottom: '4px' } }), _jsx(Legend, {}), _jsx(Area, { type: "monotone", dataKey: "Ganancia", stroke: "#10b981", fillOpacity: 1, fill: "url(#colorGanancia)", name: "Ganancia" }), _jsx(Line, { type: "monotone", dataKey: "PorcentajeCrecimiento", stroke: "#f59e0b", strokeWidth: 2, dot: { fill: '#f59e0b', r: 4 }, name: "% Crecimiento" })] }) }) })) : (_jsx("div", { className: "flex items-center justify-center h-64 text-gray-500 dark:text-gray-400", children: _jsxs("div", { className: "text-center", children: [_jsx(Calendar, { className: "w-12 h-12 mx-auto mb-2 opacity-50" }), _jsx("p", { children: "No hay datos para el per\u00EDodo seleccionado" })] }) }))] }));
};
export default TendenciaGanancias;
