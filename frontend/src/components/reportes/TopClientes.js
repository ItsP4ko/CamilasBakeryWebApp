import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useTopClientes } from '../../hooks/useReportes';
import { Users, Phone, ShoppingBag, DollarSign, Calendar } from 'lucide-react';
const TopClientes = () => {
    const [fechaInicio, setFechaInicio] = useState(() => {
        const date = new Date();
        date.setMonth(date.getMonth() - 6); // Últimos 6 meses por defecto
        return date.toISOString().split('T')[0];
    });
    const [fechaFin, setFechaFin] = useState(() => {
        return new Date().toISOString().split('T')[0];
    });
    const [top, setTop] = useState(10);
    const [filtrosAplicados, setFiltrosAplicados] = useState({
        fechaInicio,
        fechaFin,
        top
    });
    const { data, isLoading, isError, error } = useTopClientes(filtrosAplicados);
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
    const formatDate = (dateString) => {
        return new Date(dateString + 'T00:00:00').toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };
    if (isLoading) {
        return (_jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-md p-6", children: _jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500" }) }) }));
    }
    if (isError) {
        return (_jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-md p-6", children: _jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", children: _jsxs("p", { className: "text-red-800", children: ["Error al cargar clientes: ", error instanceof Error ? error.message : 'Error desconocido'] }) }) }));
    }
    const totalGastadoGeneral = data?.reduce((sum, cliente) => sum + cliente.TotalGastado, 0) || 0;
    const totalPedidosGeneral = data?.reduce((sum, cliente) => sum + cliente.TotalPedidos, 0) || 0;
    return (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Users, { className: "w-6 h-6 text-purple-500" }), _jsx("h2", { className: "text-xl font-semibold text-gray-800 dark:text-gray-100", children: "Top Clientes" })] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 items-end", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Fecha Inicio" }), _jsx("input", { type: "date", value: fechaInicio, onChange: (e) => setFechaInicio(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white", lang: "es-AR" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Fecha Fin" }), _jsx("input", { type: "date", value: fechaFin, onChange: (e) => setFechaFin(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white", lang: "es-AR" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Cantidad" }), _jsxs("select", { value: top, onChange: (e) => setTop(Number(e.target.value)), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white", children: [_jsx("option", { value: 5, children: "Top 5" }), _jsx("option", { value: 10, children: "Top 10" }), _jsx("option", { value: 20, children: "Top 20" }), _jsx("option", { value: 50, children: "Top 50" })] })] }), _jsx("button", { onClick: handleBuscar, className: "px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-md transition-colors focus:ring-2 focus:ring-pink-500 focus:ring-offset-2", children: "Buscar" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-lg p-4", children: [_jsx("p", { className: "text-sm font-medium text-purple-700 dark:text-purple-300", children: "Total Gastado" }), _jsx("p", { className: "text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1", children: formatCurrency(totalGastadoGeneral) })] }), _jsxs("div", { className: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-4", children: [_jsx("p", { className: "text-sm font-medium text-blue-700 dark:text-blue-300", children: "Total Pedidos" }), _jsx("p", { className: "text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1", children: totalPedidosGeneral })] })] }), data && data.length > 0 ? (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-200 dark:border-gray-700", children: [_jsx("th", { className: "text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300", children: "#" }), _jsx("th", { className: "text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300", children: "Cliente" }), _jsx("th", { className: "text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300", children: "Tel\u00E9fono" }), _jsx("th", { className: "text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300", children: "Pedidos" }), _jsx("th", { className: "text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300", children: "Total Gastado" }), _jsx("th", { className: "text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300", children: "\u00DAltima Compra" })] }) }), _jsx("tbody", { children: data.map((cliente, index) => (_jsxs("tr", { className: "border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors", children: [_jsx("td", { className: "py-3 px-4", children: _jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${index === 0 ? 'bg-yellow-500' :
                                                index === 1 ? 'bg-gray-400' :
                                                    index === 2 ? 'bg-orange-600' :
                                                        'bg-blue-500'}`, children: index + 1 }) }), _jsx("td", { className: "py-3 px-4", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Users, { className: "w-4 h-4 text-gray-500" }), _jsx("span", { className: "font-medium text-gray-900 dark:text-white", children: cliente.NombreCliente })] }) }), _jsx("td", { className: "py-3 px-4", children: _jsxs("div", { className: "flex items-center gap-2 text-gray-600 dark:text-gray-400", children: [_jsx(Phone, { className: "w-4 h-4" }), _jsx("span", { children: cliente.TelefonoCliente })] }) }), _jsx("td", { className: "py-3 px-4 text-center", children: _jsxs("div", { className: "inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium", children: [_jsx(ShoppingBag, { className: "w-3 h-3" }), cliente.TotalPedidos] }) }), _jsx("td", { className: "py-3 px-4 text-right", children: _jsxs("div", { className: "flex items-center justify-end gap-2", children: [_jsx(DollarSign, { className: "w-4 h-4 text-green-600" }), _jsx("span", { className: "font-bold text-green-600 dark:text-green-400", children: formatCurrency(cliente.TotalGastado) })] }) }), _jsx("td", { className: "py-3 px-4 text-center", children: _jsxs("div", { className: "flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400 text-sm", children: [_jsx(Calendar, { className: "w-4 h-4" }), formatDate(cliente.UltimaCompra)] }) })] }, cliente.IdCliente))) })] }) })) : (_jsx("div", { className: "flex items-center justify-center h-64 text-gray-500 dark:text-gray-400", children: _jsxs("div", { className: "text-center", children: [_jsx(Users, { className: "w-12 h-12 mx-auto mb-2 opacity-50" }), _jsx("p", { children: "No hay clientes para el per\u00EDodo seleccionado" })] }) }))] }));
};
export default TopClientes;
