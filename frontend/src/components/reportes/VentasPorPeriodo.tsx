import React, { useState } from 'react';
import { useVentasPorPeriodo } from '../../hooks/useReportes';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp } from 'lucide-react';

const VentasPorPeriodo: React.FC = () => {
  const [fechaInicio, setFechaInicio] = useState(() => {
    const date = new Date();
    date.setDate(1);
    return date.toISOString().split('T')[0];
  });
  
  const [fechaFin, setFechaFin] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const [agrupacion, setAgrupacion] = useState<'dia' | 'semana' | 'mes'>('dia');

  const [filtrosAplicados, setFiltrosAplicados] = useState({
    fechaInicio,
    fechaFin,
    agrupacion
  });

  const { data, isLoading, isError, error } = useVentasPorPeriodo(filtrosAplicados);

  const handleBuscar = () => {
    setFiltrosAplicados({ fechaInicio, fechaFin, agrupacion });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error al cargar ventas: {error instanceof Error ? error.message : 'Error desconocido'}</p>
        </div>
      </div>
    );
  }

  const totalVentas = data?.reduce((sum, item) => sum + item.TotalVentas, 0) || 0;
  const totalGanancias = data?.reduce((sum, item) => sum + item.TotalGanancias, 0) || 0;
  const totalPedidos = data?.reduce((sum, item) => sum + item.CantidadPedidos, 0) || 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Ventas por Período
          </h2>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fecha Inicio
          </label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            lang="es-AR"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Agrupar por
          </label>
          <select
            value={agrupacion}
            onChange={(e) => setAgrupacion(e.target.value as 'dia' | 'semana' | 'mes')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="dia">Día</option>
            <option value="semana">Semana</option>
            <option value="mes">Mes</option>
          </select>
        </div>
        <button
          onClick={handleBuscar}
          className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-md transition-colors focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
        >
          Buscar
        </button>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Ventas</p>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
            {formatCurrency(totalVentas)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg p-4">
          <p className="text-sm font-medium text-green-700 dark:text-green-300">Total Ganancias</p>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
            {formatCurrency(totalGanancias)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-lg p-4">
          <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Total Pedidos</p>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">
            {totalPedidos}
          </p>
        </div>
      </div>

      {/* Gráfico */}
      {data && data.length > 0 ? (
        <div className="mt-6">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="dark:opacity-20" />
              <XAxis 
                dataKey="Periodo" 
                className="text-sm"
                tick={{ fill: 'currentColor' }}
              />
              <YAxis 
                className="text-sm"
                tick={{ fill: 'currentColor' }}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number) => formatCurrency(value)}
                labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
              />
              <Legend />
              <Bar 
                dataKey="TotalVentas" 
                fill="#3b82f6" 
                name="Ventas"
                radius={[8, 8, 0, 0]}
              />
              <Bar 
                dataKey="TotalGanancias" 
                fill="#10b981" 
                name="Ganancias"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No hay datos para el período seleccionado</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VentasPorPeriodo;
