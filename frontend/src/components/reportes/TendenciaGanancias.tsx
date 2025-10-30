import React, { useState } from 'react';
import { useTendenciaGanancias } from '../../hooks/useReportes';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';

const TendenciaGanancias: React.FC = () => {
  const [fechaInicio, setFechaInicio] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 3); // Últimos 3 meses
    return date.toISOString().split('T')[0];
  });
  
  const [fechaFin, setFechaFin] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const [agrupacion, setAgrupacion] = useState<'dia' | 'semana' | 'mes'>('semana');

  const [filtrosAplicados, setFiltrosAplicados] = useState({
    fechaInicio,
    fechaFin,
    agrupacion
  });

  const { data, isLoading, isError, error } = useTendenciaGanancias(filtrosAplicados);

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
          <p className="text-red-800">Error al cargar tendencia: {error instanceof Error ? error.message : 'Error desconocido'}</p>
        </div>
      </div>
    );
  }

  const gananciaTotal = data?.reduce((sum, item) => sum + item.Ganancia, 0) || 0;
  const crecimientoPromedio = data && data.length > 0 
    ? data.reduce((sum, item) => sum + item.PorcentajeCrecimiento, 0) / data.length 
    : 0;
  
  const tendenciaPositiva = crecimientoPromedio >= 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {tendenciaPositiva ? (
            <TrendingUp className="w-6 h-6 text-green-500" />
          ) : (
            <TrendingDown className="w-6 h-6 text-red-500" />
          )}
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Tendencia de Ganancias
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
          className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-md transition-colors focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          Buscar
        </button>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900 dark:to-emerald-800 rounded-lg p-4">
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Ganancia Total</p>
          <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mt-1">
            {formatCurrency(gananciaTotal)}
          </p>
        </div>
        <div className={`bg-gradient-to-br rounded-lg p-4 ${
          tendenciaPositiva 
            ? 'from-green-50 to-green-100 dark:from-green-900 dark:to-green-800' 
            : 'from-red-50 to-red-100 dark:from-red-900 dark:to-red-800'
        }`}>
          <p className={`text-sm font-medium ${
            tendenciaPositiva ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
          }`}>
            Crecimiento Promedio
          </p>
          <p className={`text-2xl font-bold mt-1 ${
            tendenciaPositiva ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'
          }`}>
            {crecimientoPromedio >= 0 ? '+' : ''}{crecimientoPromedio.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Gráfico de Área */}
      {data && data.length > 0 ? (
        <div className="mt-6">
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorGanancia" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
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
                formatter={(value: number, name: string) => {
                  if (name === 'Ganancia') return formatCurrency(value);
                  return `${value.toFixed(2)}%`;
                }}
                labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="Ganancia" 
                stroke="#10b981" 
                fillOpacity={1} 
                fill="url(#colorGanancia)"
                name="Ganancia"
              />
              <Line 
                type="monotone" 
                dataKey="PorcentajeCrecimiento" 
                stroke="#f59e0b" 
                strokeWidth={2}
                dot={{ fill: '#f59e0b', r: 4 }}
                name="% Crecimiento"
              />
            </AreaChart>
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

export default TendenciaGanancias;
