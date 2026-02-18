import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useTortasRentables } from '../../hooks/useReportes';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Cake, TrendingUp, DollarSign } from 'lucide-react';
const TortasRentables = () => {
    const [fechaInicio, setFechaInicio] = useState(() => {
        const date = new Date();
        date.setMonth(date.getMonth() - 3);
        return date.toISOString().split('T')[0];
    });
    const [fechaFin, setFechaFin] = useState(() => {
        return new Date().toISOString().split('T')[0];
    });
    const [top, setTop] = useState(10);
    const [filtrosAplicados, setFiltrosAplicados] = useState(null);
    const { data, isLoading, isError, error } = useTortasRentables(filtrosAplicados);
    const handleBuscar = () => {
        setFiltrosAplicados({ fechaInicio, fechaFin, top });
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
        return (_jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-md p-6", children: _jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", children: _jsxs("p", { className: "text-red-800", children: ["Error al cargar tortas rentables: ", error instanceof Error ? error.message : 'Error desconocido'] }) }) }));
    }
    const margenPromedio = data && data.length > 0
        ? data.reduce((sum, item) => sum + item.MargenGanancia, 0) / data.length
        : 0;
    const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];
    return (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(DollarSign, { className: "w-6 h-6 text-green-500" }), _jsx("h2", { className: "text-xl font-semibold text-gray-800 dark:text-gray-100", children: "Tortas M\u00E1s Rentables" })] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 items-end", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Fecha Inicio" }), _jsx("input", { type: "date", value: fechaInicio, onChange: (e) => setFechaInicio(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white", lang: "es-AR" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Fecha Fin" }), _jsx("input", { type: "date", value: fechaFin, onChange: (e) => setFechaFin(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white", lang: "es-AR" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Cantidad" }), _jsxs("select", { value: top, onChange: (e) => setTop(Number(e.target.value)), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white", children: [_jsx("option", { value: 5, children: "Top 5" }), _jsx("option", { value: 10, children: "Top 10" }), _jsx("option", { value: 15, children: "Top 15" }), _jsx("option", { value: 20, children: "Top 20" })] })] }), _jsx("button", { onClick: handleBuscar, className: "px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-md transition-colors focus:ring-2 focus:ring-pink-500 focus:ring-offset-2", children: "Buscar" })] }), _jsxs("div", { className: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg p-4", children: [_jsx("p", { className: "text-sm font-medium text-green-700 dark:text-green-300", children: "Margen Promedio" }), _jsxs("p", { className: "text-2xl font-bold text-green-900 dark:text-green-100 mt-1", children: [margenPromedio.toFixed(2), "%"] })] }), data && data.length > 0 ? (_jsxs("div", { className: "mt-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4", children: "Margen de Ganancia por Torta" }), _jsx(ResponsiveContainer, { width: "100%", height: 400, children: _jsxs(BarChart, { data: data, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", className: "dark:opacity-20" }), _jsx(XAxis, { dataKey: "NombreTorta", className: "text-sm", tick: { fill: 'currentColor' }, angle: -45, textAnchor: "end", height: 100 }), _jsx(YAxis, { className: "text-sm", tick: { fill: 'currentColor' }, label: { value: 'Margen %', angle: -90, position: 'insideLeft' } }), _jsx(Tooltip, { contentStyle: {
                                        backgroundColor: 'white',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }, formatter: (value) => `${value.toFixed(2)}%`, labelStyle: { fontWeight: 'bold', marginBottom: '4px' } }), _jsx(Bar, { dataKey: "MargenGanancia", name: "Margen", radius: [8, 8, 0, 0], children: data.map((entry, index) => (_jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))) })] }) }), _jsx("div", { className: "mt-8 overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-200 dark:border-gray-700", children: [_jsx("th", { className: "text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300", children: "#" }), _jsx("th", { className: "text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300", children: "Torta" }), _jsx("th", { className: "text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300", children: "Cantidad" }), _jsx("th", { className: "text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300", children: "Ingresos" }), _jsx("th", { className: "text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300", children: "Ganancias" }), _jsx("th", { className: "text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300", children: "Margen %" }), _jsx("th", { className: "text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300", children: "Ganancia/Unidad" })] }) }), _jsx("tbody", { children: data.map((torta, index) => (_jsxs("tr", { className: "border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors", children: [_jsx("td", { className: "py-3 px-4", children: _jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${index === 0 ? 'bg-yellow-500' :
                                                        index === 1 ? 'bg-gray-400' :
                                                            index === 2 ? 'bg-orange-600' :
                                                                'bg-green-500'}`, children: index + 1 }) }), _jsx("td", { className: "py-3 px-4", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Cake, { className: "w-4 h-4 text-pink-500" }), _jsx("span", { className: "font-medium text-gray-900 dark:text-white", children: torta.NombreTorta })] }) }), _jsx("td", { className: "py-3 px-4 text-center", children: _jsx("span", { className: "inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium", children: torta.CantidadVendida }) }), _jsx("td", { className: "py-3 px-4 text-right font-semibold text-gray-900 dark:text-white", children: formatCurrency(torta.TotalIngresos) }), _jsx("td", { className: "py-3 px-4 text-right font-bold text-green-600 dark:text-green-400", children: formatCurrency(torta.TotalGanancias) }), _jsx("td", { className: "py-3 px-4 text-center", children: _jsxs("div", { className: "flex items-center justify-center gap-2", children: [_jsx(TrendingUp, { className: "w-4 h-4 text-green-500" }), _jsxs("span", { className: "font-bold text-green-600 dark:text-green-400", children: [torta.MargenGanancia.toFixed(2), "%"] })] }) }), _jsx("td", { className: "py-3 px-4 text-right font-semibold text-purple-600 dark:text-purple-400", children: formatCurrency(torta.GananciaPorUnidad) })] }, torta.IdTorta))) })] }) })] })) : (_jsx("div", { className: "flex items-center justify-center h-64 text-gray-500 dark:text-gray-400", children: _jsxs("div", { className: "text-center", children: [_jsx(Cake, { className: "w-12 h-12 mx-auto mb-2 opacity-50" }), _jsx("p", { children: "No hay datos para el per\u00EDodo seleccionado" })] }) }))] }));
};
export default TortasRentables;
