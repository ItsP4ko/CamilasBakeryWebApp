import React, { useState } from 'react';
import { useDashboard } from '../../hooks/useReportes';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, CheckCircle, XCircle } from 'lucide-react';

const DashboardGeneral: React.FC = () => {
  // Estado para el rango de fechas (formulario)
  const [fechaInicio, setFechaInicio] = useState(() => {
    const date = new Date();
    date.setDate(1); // Primer día del mes
    return date.toISOString().split('T')[0];
  });
  
  const [fechaFin, setFechaFin] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  // Estado para los filtros aplicados (consulta)
  const [filtrosAplicados, setFiltrosAplicados] = useState({
    fechaInicio,
    fechaFin
  });

  const { data, isLoading, isError, error } = useDashboard(filtrosAplicados);

  const handleBuscar = () => {
    setFiltrosAplicados({ fechaInicio, fechaFin });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error al cargar el dashboard: {error instanceof Error ? error.message : 'Error desconocido'}</p>
      </div>
    );
  }

  if (!data) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Filtros de Fecha */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Dashboard General
        </h2>
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fecha Inicio
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              lang="es-AR"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fecha Fin
            </label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              lang="es-AR"
            />
          </div>
          <button
            onClick={handleBuscar}
            className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-md transition-colors focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Pedidos */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Pedidos</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{data.TotalPedidos}</p>
            </div>
            <ShoppingCart className="w-12 h-12 text-blue-500 opacity-80" />
          </div>
          <div className="mt-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {data.PedidosCompletados} completados
            </span>
          </div>
        </div>

        {/* Ingresos Totales */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ingresos Totales</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {formatCurrency(data.IngresosTotales)}
              </p>
            </div>
            <DollarSign className="w-12 h-12 text-green-500 opacity-80" />
          </div>
          <div className="mt-4 flex items-center gap-2">
            {data.ComparativaMesAnterior.CrecimientoIngresos >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${
              data.ComparativaMesAnterior.CrecimientoIngresos >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatPercent(data.ComparativaMesAnterior.CrecimientoIngresos)} vs anterior
            </span>
          </div>
        </div>

        {/* Ganancias Totales */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ganancias Totales</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {formatCurrency(data.GananciaTotales)}
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-purple-500 opacity-80" />
          </div>
          <div className="mt-4 flex items-center gap-2">
            {data.ComparativaMesAnterior.CrecimientoGanancias >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${
              data.ComparativaMesAnterior.CrecimientoGanancias >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatPercent(data.ComparativaMesAnterior.CrecimientoGanancias)} vs anterior
            </span>
          </div>
        </div>

        {/* Tasa de Conversión */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tasa de Conversión</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {data.TasaConversion.toFixed(2)}%
              </p>
            </div>
            <CheckCircle className="w-12 h-12 text-orange-500 opacity-80" />
          </div>
          <div className="mt-4 flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {data.PedidosCancelados} cancelados
            </span>
          </div>
        </div>
      </div>

      {/* Comparativa Mes Anterior */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
          📈 Comparativa con Período Anterior
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Ingresos Anteriores:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(data.ComparativaMesAnterior.IngresosMesAnterior)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Ingresos Actuales:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(data.IngresosTotales)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Crecimiento:</span>
              <span className={`font-bold ${
                data.ComparativaMesAnterior.CrecimientoIngresos >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatPercent(data.ComparativaMesAnterior.CrecimientoIngresos)}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Ganancias Anteriores:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(data.ComparativaMesAnterior.GananciasMesAnterior)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Ganancias Actuales:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(data.GananciaTotales)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Crecimiento:</span>
              <span className={`font-bold ${
                data.ComparativaMesAnterior.CrecimientoGanancias >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatPercent(data.ComparativaMesAnterior.CrecimientoGanancias)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardGeneral;
