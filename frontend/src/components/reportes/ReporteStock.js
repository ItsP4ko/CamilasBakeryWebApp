import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useReporteStock } from '../../hooks/useReporteStock';
import { NivelStockEnum } from '../../types/reportes';
import { AlertCircle, Package, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';
/**
 * Componente de Reporte de Stock
 * Muestra el estado del inventario de ingredientes y costos extra
 */
export default function ReporteStock() {
    const [nivelFiltro, setNivelFiltro] = useState(undefined);
    const [tipoFiltro, setTipoFiltro] = useState(undefined);
    const { data, isLoading, error } = useReporteStock({
        nivel: nivelFiltro,
        tipo: tipoFiltro,
    });
    // Configuración de colores y estilos por nivel
    const getNivelConfig = (nivel) => {
        switch (nivel) {
            case NivelStockEnum.Critico:
                return {
                    color: 'text-red-600 dark:text-red-400',
                    bg: 'bg-red-50 dark:bg-red-900/20',
                    border: 'border-red-200 dark:border-red-800',
                    icon: AlertCircle,
                    badge: 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300',
                };
            case NivelStockEnum.Bajo:
                return {
                    color: 'text-orange-600 dark:text-orange-400',
                    bg: 'bg-orange-50 dark:bg-orange-900/20',
                    border: 'border-orange-200 dark:border-orange-800',
                    icon: AlertTriangle,
                    badge: 'bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300',
                };
            case NivelStockEnum.Medio:
                return {
                    color: 'text-yellow-600 dark:text-yellow-400',
                    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
                    border: 'border-yellow-200 dark:border-yellow-800',
                    icon: TrendingDown,
                    badge: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300',
                };
            case NivelStockEnum.Alto:
                return {
                    color: 'text-green-600 dark:text-green-400',
                    bg: 'bg-green-50 dark:bg-green-900/20',
                    border: 'border-green-200 dark:border-green-800',
                    icon: TrendingUp,
                    badge: 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300',
                };
        }
    };
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("div", { className: "text-gray-500 dark:text-gray-400", children: "Cargando reporte de stock..." }) }));
    }
    if (error) {
        console.error('Error en reporte de stock:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        const axiosError = error;
        const statusCode = axiosError?.response?.status;
        const serverMessage = axiosError?.response?.data?.message || axiosError?.response?.data?.error;
        return (_jsx("div", { className: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(AlertCircle, { className: "w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-red-800 dark:text-red-300 font-semibold mb-2", children: "Error al cargar el reporte de stock" }), _jsx("p", { className: "text-red-700 dark:text-red-400 text-sm mb-2", children: errorMessage }), statusCode && (_jsxs("div", { className: "bg-red-100 dark:bg-red-900/40 rounded p-3 mb-3", children: [_jsxs("p", { className: "text-sm text-red-800 dark:text-red-300", children: [_jsx("strong", { children: "C\u00F3digo de error:" }), " ", statusCode] }), serverMessage && (_jsxs("p", { className: "text-sm text-red-700 dark:text-red-400 mt-1", children: [_jsx("strong", { children: "Mensaje del servidor:" }), " ", serverMessage] }))] })), _jsxs("div", { className: "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-3 mt-3", children: [_jsx("p", { className: "text-sm text-yellow-800 dark:text-yellow-300", children: _jsx("strong", { children: "\uD83D\uDCA1 Posibles causas:" }) }), _jsxs("ul", { className: "list-disc list-inside text-sm text-yellow-700 dark:text-yellow-400 mt-2 space-y-1", children: [_jsxs("li", { children: ["Las tablas de la base de datos no tienen las columnas ", _jsx("code", { children: "Stock" }), " y ", _jsx("code", { children: "MaxStock" })] }), _jsx("li", { children: "Hay un error en el c\u00F3digo del backend (revisa los logs del servidor)" }), _jsx("li", { children: "Error de conexi\u00F3n con la base de datos" }), _jsx("li", { children: "El servicio de reportes no est\u00E1 registrado en el backend" })] })] }), _jsxs("details", { className: "mt-3", children: [_jsx("summary", { className: "text-red-600 dark:text-red-400 text-sm cursor-pointer hover:underline", children: "Ver detalles t\u00E9cnicos completos" }), _jsx("pre", { className: "mt-2 text-xs bg-red-100 dark:bg-red-900/40 p-2 rounded overflow-auto max-h-60", children: JSON.stringify(error, null, 2) })] })] })] }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { children: [_jsxs("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2", children: [_jsx(Package, { className: "w-7 h-7" }), "Reporte de Stock"] }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mt-1", children: "Estado del inventario de ingredientes y costos extra" })] }) }), data?.resumen && (_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4", children: [_jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Total Items" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 dark:text-white mt-1", children: data.resumen.totalItems })] }), _jsx(Package, { className: "w-8 h-8 text-gray-400" })] }) }), _jsx("div", { className: "bg-red-50 dark:bg-red-900/20 rounded-lg shadow p-4 border border-red-200 dark:border-red-800", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-red-600 dark:text-red-400", children: "Cr\u00EDticos" }), _jsx("p", { className: "text-2xl font-bold text-red-700 dark:text-red-300 mt-1", children: data.resumen.itemsCriticos })] }), _jsx(AlertCircle, { className: "w-8 h-8 text-red-400" })] }) }), _jsx("div", { className: "bg-orange-50 dark:bg-orange-900/20 rounded-lg shadow p-4 border border-orange-200 dark:border-orange-800", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-orange-600 dark:text-orange-400", children: "Bajos" }), _jsx("p", { className: "text-2xl font-bold text-orange-700 dark:text-orange-300 mt-1", children: data.resumen.itemsBajos })] }), _jsx(AlertTriangle, { className: "w-8 h-8 text-orange-400" })] }) }), _jsx("div", { className: "bg-yellow-50 dark:bg-yellow-900/20 rounded-lg shadow p-4 border border-yellow-200 dark:border-yellow-800", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-yellow-600 dark:text-yellow-400", children: "Medios" }), _jsx("p", { className: "text-2xl font-bold text-yellow-700 dark:text-yellow-300 mt-1", children: data.resumen.itemsMedios })] }), _jsx(TrendingDown, { className: "w-8 h-8 text-yellow-400" })] }) }), _jsx("div", { className: "bg-green-50 dark:bg-green-900/20 rounded-lg shadow p-4 border border-green-200 dark:border-green-800", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-green-600 dark:text-green-400", children: "Altos" }), _jsx("p", { className: "text-2xl font-bold text-green-700 dark:text-green-300 mt-1", children: data.resumen.itemsAltos })] }), _jsx(TrendingUp, { className: "w-8 h-8 text-green-400" })] }) })] })), _jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "flex flex-wrap gap-4", children: [_jsxs("div", { className: "flex-1 min-w-[200px]", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Filtrar por Nivel" }), _jsxs("select", { value: nivelFiltro ?? '', onChange: (e) => setNivelFiltro(e.target.value === '' ? undefined : Number(e.target.value)), className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent", children: [_jsx("option", { value: "", children: "Todos los niveles" }), _jsx("option", { value: NivelStockEnum.Critico, children: "Cr\u00EDtico (< 20%)" }), _jsx("option", { value: NivelStockEnum.Bajo, children: "Bajo (20% - 40%)" }), _jsx("option", { value: NivelStockEnum.Medio, children: "Medio (40% - 70%)" }), _jsx("option", { value: NivelStockEnum.Alto, children: "Alto (> 70%)" })] })] }), _jsxs("div", { className: "flex-1 min-w-[200px]", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Filtrar por Tipo" }), _jsxs("select", { value: tipoFiltro ?? '', onChange: (e) => setTipoFiltro(e.target.value === '' ? undefined : e.target.value), className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent", children: [_jsx("option", { value: "", children: "Todos los tipos" }), _jsx("option", { value: "ingrediente", children: "Ingredientes" }), _jsx("option", { value: "costoextra", children: "Costos Extra" })] })] }), (nivelFiltro !== undefined || tipoFiltro !== undefined) && (_jsx("div", { className: "flex items-end", children: _jsx("button", { onClick: () => {
                                    setNivelFiltro(undefined);
                                    setTipoFiltro(undefined);
                                }, className: "px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors", children: "Limpiar Filtros" }) }))] }) }), _jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: "Nombre" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: "Tipo" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: "Stock Actual" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: "Stock M\u00E1ximo" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: "Porcentaje" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: "Nivel" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200 dark:divide-gray-700", children: data?.items && data.items.length > 0 ? (data.items.map((item) => {
                                    const config = getNivelConfig(item.nivelStock);
                                    if (!config) {
                                        console.error('Config no encontrado para item:', item);
                                        return null;
                                    }
                                    const Icon = config.icon;
                                    return (_jsxs("tr", { className: "hover:bg-gray-50 dark:hover:bg-gray-700/50", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("div", { className: "text-sm font-medium text-gray-900 dark:text-white", children: item.nombre }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: item.tipoItem }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "text-sm font-medium text-gray-900 dark:text-white", children: item.stock.toFixed(2) }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: item.maxStock.toFixed(2) }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden", children: _jsx("div", { className: `h-full rounded-full transition-all ${item.nivelStock === NivelStockEnum.Critico
                                                                    ? 'bg-red-500'
                                                                    : item.nivelStock === NivelStockEnum.Bajo
                                                                        ? 'bg-orange-500'
                                                                        : item.nivelStock === NivelStockEnum.Medio
                                                                            ? 'bg-yellow-500'
                                                                            : 'bg-green-500'}`, style: { width: `${Math.min(item.porcentajeStock, 100)}%` } }) }), _jsxs("span", { className: `text-sm font-medium ${config.color}`, children: [item.porcentajeStock.toFixed(1), "%"] })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("span", { className: `inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.badge}`, children: [_jsx(Icon, { className: "w-3.5 h-3.5" }), item.nivelStockTexto] }) })] }, `${item.tipoItem}-${item.id}`));
                                })) : (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "px-6 py-8 text-center", children: _jsxs("div", { className: "flex flex-col items-center justify-center text-gray-500 dark:text-gray-400", children: [_jsx(Package, { className: "w-12 h-12 mb-2 opacity-50" }), _jsx("p", { children: "No hay items que cumplan con los filtros seleccionados" })] }) }) })) })] }) }) })] }));
}
