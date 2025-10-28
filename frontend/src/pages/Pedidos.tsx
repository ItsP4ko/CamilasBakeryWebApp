import React, { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { ShoppingBag, Clock, CheckCircle, DollarSign, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import StatsCard from "@/components/general/StatsCard";
import PedidosTable from "@/components/pedidos/PedidosTable";
import { usePedidos } from "@/hooks/usePedidos";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { useUpdatePedido } from "@/hooks/useUpdatePedido";
import * as api from "@/api/pedidos";

// ✅ Lazy load del popup (solo se carga cuando se abre)
const PedidoDetallePopup = lazy(() => import("@/components/pedidos/PedidoDetallePopup")); 

const PedidosDashboard: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(50); // Tamaño de página fijo
  
  const { data: pedidosData, isLoading, error } = usePedidos(pageNumber, pageSize);
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics();
  const { mutate: updatePedido } = useUpdatePedido();

  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedPedidoId, setSelectedPedidoId] = useState<number | null>(null);

  const list = pedidosData?.items ?? [];
  const totalPedidos = pedidosData?.totalCount ?? 0;
  const totalPages = pedidosData?.totalPages ?? 1;

  // ✅ Prefetch: Precarga la página siguiente
  useEffect(() => {
    if (pageNumber < totalPages) {
      queryClient.prefetchQuery({
        queryKey: ['pedidos', pageNumber + 1, pageSize],
        queryFn: () => api.getPedidos(pageNumber + 1, pageSize),
      });
    }
  }, [pageNumber, totalPages, pageSize, queryClient]);

  // ✅ Memoización: Evita recalcular en cada render
  const pedidosEntregados = useMemo(
    () => list.filter((p) => ["entregado"].includes((p.estado ?? "").toLowerCase())).length,
    [list]
  );

  const loading = isLoading || metricsLoading;

  const handleUpdatePedido = (pedidoActualizado: any) => {
    updatePedido(pedidoActualizado);
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

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
      {/* --- Métricas --- */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatsCard label="Total de pedidos" value={totalPedidos} icon={ShoppingBag} />
        <StatsCard
          label="Pendientes estas dos semanas"
          value={metrics?.pedidosPendientes ?? "0"}
          icon={Clock}
        />
        <StatsCard
          label="Pedidos entregados"
          value={pedidosEntregados}
          icon={CheckCircle}
        />
        <StatsCard
          label="Ganancia mensual"
          value={`$ ${Number(metrics?.gananciaMensual ?? 0).toLocaleString("es-AR", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}`}
          icon={DollarSign}
        />
      </div>

      {/* --- Encabezado + botón --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">Pedidos</h2>
        <button
          onClick={() => navigate('/pedidos/crear')}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg shadow hover:bg-primary-600 transition"
        >
          <Plus size={18} /> Nuevo Pedido
        </button>
      </div>

      {/* --- Tabla --- */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <PedidosTable
          data={list}
          isLoading={loading}
          onView={(pedido) => setSelectedPedidoId(pedido.idPedido)}
          onUpdate={handleUpdatePedido}
        />
        
        {/* --- Controles de paginación --- */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
              Página {pageNumber} de {totalPages} ({totalPedidos} pedidos)
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={handlePreviousPage}
                disabled={pageNumber === 1}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
              >
                <ChevronLeft size={16} />
                <span className="hidden sm:inline">Anterior</span>
              </button>
              
              <button
                onClick={handleNextPage}
                disabled={pageNumber >= totalPages}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
              >
                <span className="hidden sm:inline">Siguiente</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* --- Popup de detalle --- */}
      {selectedPedidoId && (
        <Suspense fallback={
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              Cargando detalle...
            </div>
          </div>
        }>
          <PedidoDetallePopup
            id={selectedPedidoId}
            onClose={() => setSelectedPedidoId(null)}
          />
        </Suspense>
      )}
    </div>
  );
};

export default PedidosDashboard;
