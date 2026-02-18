import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { Clock, CheckCircle, DollarSign, Plus, ChevronLeft, ChevronRight, Search, Filter, ArrowUpLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import StatsCard from "@/components/general/StatsCard";
import PedidosTable from "@/components/pedidos/PedidosTable";
import PedidosFiltros from "@/components/pedidos/PedidosFiltros";
import { useEliminarPedido } from "@/hooks/usePedidos";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { useUpdatePedido } from "@/hooks/useUpdatePedido";
import * as api from "@/api/pedidos";
import { formatCurrency } from "@/utils/formatters";
// ✅ Lazy load del popup (solo se carga cuando se abre)
const PedidoDetallePopup = lazy(() => import("@/components/pedidos/PedidoDetallePopup"));
const PedidosDashboard = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(50); // Tamaño de página fijo
    const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics();
    const { mutate: updatePedido } = useUpdatePedido();
    const { mutate: deletePedido } = useEliminarPedido();
    const [selectedPedidoId, setSelectedPedidoId] = useState(null);
    // Estados para búsqueda y filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [filtrosOpen, setFiltrosOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState({});
    // ✅ Verificar si hay filtros activos (sin contar el searchTerm)
    const hasActiveFilters = Object.keys(activeFilters).length > 0;
    // ✅ Hook optimizado: usa endpoints específicos según lo que esté activo
    const { data: pedidosData, isLoading } = useQuery({
        queryKey: ['pedidos-filtrados', pageNumber, pageSize, searchTerm, activeFilters],
        queryFn: async () => {
            // Si hay filtros avanzados, usa el endpoint de filtros
            if (hasActiveFilters) {
                return api.getPedidosConFiltros({
                    nombreCliente: searchTerm || undefined,
                    estado: activeFilters.estado,
                    fechaInicio: activeFilters.fechaInicio,
                    fechaFin: activeFilters.fechaFin,
                    metodoPago: activeFilters.metodoPago,
                    montoMinimo: activeFilters.montoMinimo,
                    montoMaximo: activeFilters.montoMaximo,
                    pageNumber,
                    pageSize,
                });
            }
            // Si solo hay búsqueda por nombre (sin filtros), usa el endpoint existente
            // pero hay que adaptarlo porque no retorna PagedResult
            if (searchTerm && !hasActiveFilters) {
                const pedidos = await api.getPedidosByNombre(searchTerm);
                // Convertir a formato PagedResult manualmente
                return {
                    items: pedidos.map((p) => ({
                        idPedido: p.idPedido,
                        nombreCliente: p.nombreCliente,
                        fecha: p.fecha,
                        total: p.total,
                        ganancia: p.ganancia,
                        metodoDePago: p.metodoDePago,
                        estado: p.estado,
                    })),
                    totalCount: pedidos.length,
                    pageNumber: 1,
                    pageSize: pedidos.length,
                    totalPages: 1,
                };
            }
            // Si no hay filtros ni búsqueda, usa el endpoint normal
            return api.getPedidos(pageNumber, pageSize);
        },
        staleTime: 30000, // 30 segundos
    });
    const list = pedidosData?.items ?? [];
    const totalPedidos = pedidosData?.totalCount ?? 0;
    const totalPages = pedidosData?.totalPages ?? 1;
    // ✅ Prefetch: Precarga la página siguiente (solo si no hay búsqueda activa)
    useEffect(() => {
        if (pageNumber < totalPages && !searchTerm && hasActiveFilters) {
            queryClient.prefetchQuery({
                queryKey: ['pedidos-filtrados', pageNumber + 1, pageSize, searchTerm, activeFilters],
                queryFn: () => api.getPedidosConFiltros({
                    nombreCliente: searchTerm || undefined,
                    estado: activeFilters.estado,
                    fechaInicio: activeFilters.fechaInicio,
                    fechaFin: activeFilters.fechaFin,
                    metodoPago: activeFilters.metodoPago,
                    montoMinimo: activeFilters.montoMinimo,
                    montoMaximo: activeFilters.montoMaximo,
                    pageNumber: pageNumber + 1,
                    pageSize,
                }),
            });
        }
    }, [pageNumber, totalPages, pageSize, searchTerm, activeFilters, queryClient, hasActiveFilters]);
    const handleApplyFilters = (filters) => {
        setActiveFilters(filters);
        setPageNumber(1); // Reset a la página 1 cuando se aplican filtros
    };
    // Contar filtros activos
    const activeFiltersCount = Object.keys(activeFilters).length;
    // Reset página cuando cambia el searchTerm
    useEffect(() => {
        setPageNumber(1);
    }, [searchTerm]);
    const handleUpdatePedido = (pedidoActualizado) => {
        updatePedido(pedidoActualizado);
    };
    const handleDeletePedido = (idPedido) => {
        deletePedido(idPedido);
    };
    const handlePreviousPage = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    };
    const handleNextPage = () => {
        if (pageNumber < totalPages) {
            setPageNumber(pageNumber + 1);
        }
    };
    // ✅ Calcular Ganancia Dinámica
    // Si hay filtros o búsqueda, sumamos la ganancia de los pedidos listados
    // Si no, mostramos la ganancia mensual (del mes calendario actual)
    const gananciaMostrada = useMemo(() => {
        if (searchTerm || hasActiveFilters) {
            if (!list || list.length === 0)
                return 0;
            // Sumar ganancia de los pedidos filtrados que estén "Entregado"
            return list
                .filter(p => p.estado?.toLowerCase() === 'entregado')
                .reduce((sum, p) => sum + (p.ganancia || 0), 0);
        }
        return metrics?.gananciaMensual ?? 0;
    }, [searchTerm, hasActiveFilters, list, metrics?.gananciaMensual]);
    const tituloGanancia = (searchTerm || hasActiveFilters) ? "Ganancia (Filtrada)" : "Ganancia mensual";
    return (_jsxs("div", { className: "p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8", children: [_jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4", children: [_jsx(StatsCard, { label: "Pendientes estas dos semanas", value: metrics?.pedidosPendientes ?? "0", icon: Clock }), _jsx(StatsCard, { label: "Pedidos entregados", value: metrics?.pedidosEntregados ?? "0", icon: CheckCircle }), _jsx(StatsCard, { label: tituloGanancia, value: formatCurrency(gananciaMostrada), icon: DollarSign }), _jsx(StatsCard, { label: "Reportes y estadisticas", value: "Vistar", icon: ArrowUpLeft, iconColor: "primary", delay: 0, href: "/reportes/pedidos" })] }), _jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0", children: [_jsx("h2", { className: "text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100", children: "Pedidos" }), _jsxs("button", { onClick: () => navigate('/pedidos/crear'), className: "w-full sm:w-auto flex items-center justify-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg shadow hover:bg-primary-600 transition", children: [_jsx(Plus, { size: 18 }), " Nuevo Pedido"] })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: 0.1 }, className: "bg-primary-200 dark:bg-gray-800 rounded-xl shadow-sm border border-primary-200 dark:border-gray-700 p-4", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 dark:text-gray-500 w-5 h-5" }), _jsx("input", { type: "text", placeholder: "Buscar por nombre de cliente...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-10 pr-4 py-2 \r\n             bg-primary-100 dark:bg-gray-700 text-primary-900 dark:text-white\r\n             placeholder-primary-500 dark:placeholder-gray-400\r\n             border border-primary-300 dark:border-gray-600\r\n             rounded-lg \r\n             focus:ring-2 focus:ring-primary-400 focus:border-transparent \r\n             outline-none" })] }), _jsxs("div", { className: "flex items-center justify-between mt-2 text-xs sm:text-sm text-primary-600 dark:text-gray-400", children: [list.length > 0 ? (_jsxs("p", { children: ["Mostrando ", list.length, " pedidos", totalPedidos > 0 && ` de ${totalPedidos} totales`, activeFiltersCount > 0 && (_jsxs("span", { className: "ml-2 text-primary-500 dark:text-primary-400 font-medium", children: ["(", activeFiltersCount, " filtro", activeFiltersCount > 1 ? 's' : '', " activo", activeFiltersCount > 1 ? 's' : '', ")"] }))] })) : (_jsx("p", { children: "\u00A0" })), _jsxs("button", { onClick: () => setFiltrosOpen(true), className: "flex items-center gap-1 text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors text-xs font-medium", children: [_jsx(Filter, { className: "w-4 h-4" }), "Filtros", activeFiltersCount > 0 && (_jsx("span", { className: "ml-1 px-1.5 py-0.5 bg-primary-500 text-white rounded-full text-[10px] font-bold", children: activeFiltersCount }))] })] })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 }, className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden", children: [_jsx(PedidosTable, { data: list, isLoading: isLoading || metricsLoading, onView: (pedido) => setSelectedPedidoId(pedido.idPedido), onUpdate: handleUpdatePedido, onDelete: handleDeletePedido }), totalPages > 1 && (_jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700", children: [_jsxs("div", { className: "text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left", children: ["P\u00E1gina ", pageNumber, " de ", totalPages, " (", totalPedidos, " pedidos)"] }), _jsxs("div", { className: "flex gap-2 w-full sm:w-auto", children: [_jsxs("button", { onClick: handlePreviousPage, disabled: pageNumber === 1, className: "flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm", children: [_jsx(ChevronLeft, { size: 16 }), _jsx("span", { className: "hidden sm:inline", children: "Anterior" })] }), _jsxs("button", { onClick: handleNextPage, disabled: pageNumber >= totalPages, className: "flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm", children: [_jsx("span", { className: "hidden sm:inline", children: "Siguiente" }), _jsx(ChevronRight, { size: 16 })] })] })] }))] }), selectedPedidoId && (_jsx(Suspense, { fallback: _jsx("div", { className: "fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50", children: _jsx("div", { className: "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg", children: "Cargando detalle..." }) }), children: _jsx(PedidoDetallePopup, { id: selectedPedidoId, onClose: () => setSelectedPedidoId(null) }) })), _jsx(PedidosFiltros, { isOpen: filtrosOpen, onClose: () => setFiltrosOpen(false), onApplyFilters: handleApplyFilters })] }));
};
export default PedidosDashboard;
