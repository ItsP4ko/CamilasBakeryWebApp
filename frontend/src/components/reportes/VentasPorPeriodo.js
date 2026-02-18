import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useVentasPorPeriodo } from '../../hooks/useReportes';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp } from 'lucide-react';
const VentasPorPeriodo = () => {
    const [fechaInicio, setFechaInicio] = useState(() => {
        const date = new Date();
        date.setDate(1);
        return date.toISOString().split('T')[0];
    });
    const [fechaFin, setFechaFin] = useState(() => {
        return new Date().toISOString().split('T')[0];
    });
    const [agrupacion, setAgrupacion] = useState('dia');
    const [filtrosAplicados, setFiltrosAplicados] = useState({
        fechaInicio,
        fechaFin,
        agrupacion
    });
    const { data, isLoading, isError, error } = useVentasPorPeriodo(filtrosAplicados);
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
        return (_jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-md p-6", children: _jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", children: _jsxs("p", { className: "text-red-800", children: ["Error al cargar ventas: ", error instanceof Error ? error.message : 'Error desconocido'] }) }) }));
    }
    const totalVentas = data?.reduce((sum, item) => sum + item.TotalVentas, 0) || 0;
    const totalGanancias = data?.reduce((sum, item) => sum + item.TotalGanancias, 0) || 0;
    const totalPedidos = data?.reduce((sum, item) => sum + item.CantidadPedidos, 0) || 0;
    return (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(TrendingUp, { className: "w-6 h-6 text-blue-500" }), _jsx("h2", { className: "text-xl font-semibold text-gray-800 dark:text-gray-100", children: "Ventas por Per\u00EDodo" })] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 items-end", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Fecha Inicio" }), _jsx("input", { type: "date", value: fechaInicio, onChange: (e) => setFechaInicio(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white", lang: "es-AR" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Fecha Fin" }), _jsx("input", { type: "date", value: fechaFin, onChange: (e) => setFechaFin(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white", lang: "es-AR" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Agrupar por" }), _jsxs("select", { value: agrupacion, onChange: (e) => setAgrupacion(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white", children: [_jsx("option", { value: "dia", children: "D\u00EDa" }), _jsx("option", { value: "semana", children: "Semana" }), _jsx("option", { value: "mes", children: "Mes" })] })] }), _jsx("button", { onClick: handleBuscar, className: "px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-md transition-colors focus:ring-2 focus:ring-pink-500 focus:ring-offset-2", children: "Buscar" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-4", children: [_jsx("p", { className: "text-sm font-medium text-blue-700 dark:text-blue-300", children: "Total Ventas" }), _jsx("p", { className: "text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1", children: formatCurrency(totalVentas) })] }), _jsxs("div", { className: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg p-4", children: [_jsx("p", { className: "text-sm font-medium text-green-700 dark:text-green-300", children: "Total Ganancias" }), _jsx("p", { className: "text-2xl font-bold text-green-900 dark:text-green-100 mt-1", children: formatCurrency(totalGanancias) })] }), _jsxs("div", { className: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-lg p-4", children: [_jsx("p", { className: "text-sm font-medium text-purple-700 dark:text-purple-300", children: "Total Pedidos" }), _jsx("p", { className: "text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1", children: totalPedidos })] })] }), data && data.length > 0 ? (_jsx("div", { className: "mt-6", children: _jsx(ResponsiveContainer, { width: "100%", height: 400, children: _jsxs(BarChart, { data: data, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", className: "dark:opacity-20" }), _jsx(XAxis, { dataKey: "Periodo", className: "text-sm", tick: { fill: 'currentColor' } }), _jsx(YAxis, { className: "text-sm", tick: { fill: 'currentColor' }, tickFormatter: (value) => formatCurrency(value) }), _jsx(Tooltip, { contentStyle: {
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }, formatter: (value) => formatCurrency(value), labelStyle: { fontWeight: 'bold', marginBottom: '4px' } }), _jsx(Legend, {}), _jsx(Bar, { dataKey: "TotalVentas", fill: "#3b82f6", name: "Ventas", radius: [8, 8, 0, 0] }), _jsx(Bar, { dataKey: "TotalGanancias", fill: "#10b981", name: "Ganancias", radius: [8, 8, 0, 0] })] }) }) })) : (_jsx("div", { className: "flex items-center justify-center h-64 text-gray-500 dark:text-gray-400", children: _jsxs("div", { className: "text-center", children: [_jsx(Calendar, { className: "w-12 h-12 mx-auto mb-2 opacity-50" }), _jsx("p", { children: "No hay datos para el per\u00EDodo seleccionado" })] }) }))] }));
};
export default VentasPorPeriodo;
