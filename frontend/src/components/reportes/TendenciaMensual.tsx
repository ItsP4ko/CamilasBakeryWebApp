import React, { useState } from 'react';
import { useTendenciaMensual } from '../../hooks/useReportes';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Calendar, TrendingUp } from 'lucide-react';

const TendenciaMensual: React.FC = () => {
  const [año, setAño] = useState(new Date().getFullYear());

  const { data, isLoading, isError, error } = useTendenciaMensual({ año });

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
          <p className="text-red-800">Error al cargar tendencia mensual: {error instanceof Error ? error.message : 'Error desconocido'}</p>
        </div>
      </div>
    );
  }

  const totalVentasAnual = data?.reduce((sum, item) => sum + item.TotalVentas, 0) || 0;
  const totalGananciasAnual = data?.reduce((sum, item) => sum + item.TotalGanancias, 0) || 0;
  const totalPedidosAnual = data?.reduce((sum, item) => sum + item.CantidadPedidos, 0) || 0;
  const promedioMensual = data && data.length > 0 ? totalVentasAnual / data.length : 0;

  // Generar opciones de años (5 años hacia atrás)
  const añosDisponibles = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Tendencia Mensual {año}
          </h2>
        </div>
      </div>

      {/* Filtro de Año */}
      <div className="max-w-xs">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Año
        </label>
        <select
          value={año}
          onChange={(e) => setAño(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          {añosDisponibles.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Resumen Anual */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Ventas</p>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
            {formatCurrency(totalVentasAnual)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg p-4">
          <p className="text-sm font-medium text-green-700 dark:text-green-300">Total Ganancias</p>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
            {formatCurrency(totalGananciasAnual)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-lg p-4">
          <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Total Pedidos</p>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">
            {totalPedidosAnual}
          </p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 rounded-lg p-4">
          <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Promedio Mensual</p>
          <p className="text-2xl font-bold text-orange-900 dark:text-orange-100 mt-1">
            {formatCurrency(promedioMensual)}
          </p>
        </div>
      </div>

      {/* Gráfico de Barras */}
      {data && data.length > 0 ? (
        <div className="mt-6">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="dark:opacity-20" />
              <XAxis 
                dataKey="NombreMes" 
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

          {/* Gráfico de Línea de Pedidos */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              Cantidad de Pedidos por Mes
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="dark:opacity-20" />
                <XAxis 
                  dataKey="NombreMes" 
                  className="text-sm"
                  tick={{ fill: 'currentColor' }}
                />
                <YAxis 
                  className="text-sm"
                  tick={{ fill: 'currentColor' }}
                  domain={[0, (dataMax: number) => Math.ceil(dataMax) + 1]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="CantidadPedidos" 
                  stroke="#a855f7" 
                  strokeWidth={3}
                  dot={{ fill: '#a855f7', r: 5 }}
                  name="Pedidos"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No hay datos para el año {año}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TendenciaMensual;
