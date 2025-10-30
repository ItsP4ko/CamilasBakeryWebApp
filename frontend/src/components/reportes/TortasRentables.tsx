import React, { useState } from 'react';
import { useTortasRentables } from '../../hooks/useReportes';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Cake, TrendingUp, DollarSign } from 'lucide-react';

const TortasRentables: React.FC = () => {
  const [fechaInicio, setFechaInicio] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 3);
    return date.toISOString().split('T')[0];
  });
  
  const [fechaFin, setFechaFin] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const [top, setTop] = useState(10);

  const [filtrosAplicados, setFiltrosAplicados] = useState<{
    fechaInicio: string;
    fechaFin: string;
    top: number;
  } | null>(null);

  const { data, isLoading, isError, error } = useTortasRentables(filtrosAplicados);

  const handleBuscar = () => {
    setFiltrosAplicados({ fechaInicio, fechaFin, top });
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
          <p className="text-red-800">Error al cargar tortas rentables: {error instanceof Error ? error.message : 'Error desconocido'}</p>
        </div>
      </div>
    );
  }

  const margenPromedio = data && data.length > 0 
    ? data.reduce((sum, item) => sum + item.MargenGanancia, 0) / data.length 
    : 0;

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DollarSign className="w-6 h-6 text-green-500" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Tortas Más Rentables
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
            Cantidad
          </label>
          <select
            value={top}
            onChange={(e) => setTop(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value={5}>Top 5</option>
            <option value={10}>Top 10</option>
            <option value={15}>Top 15</option>
            <option value={20}>Top 20</option>
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
      <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg p-4">
        <p className="text-sm font-medium text-green-700 dark:text-green-300">Margen Promedio</p>
        <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
          {margenPromedio.toFixed(2)}%
        </p>
      </div>

      {/* Gráfico de Margen de Ganancia */}
      {data && data.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Margen de Ganancia por Torta
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="dark:opacity-20" />
              <XAxis 
                dataKey="NombreTorta" 
                className="text-sm"
                tick={{ fill: 'currentColor' }}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis 
                className="text-sm"
                tick={{ fill: 'currentColor' }}
                label={{ value: 'Margen %', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number) => `${value.toFixed(2)}%`}
                labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
              />
              <Bar 
                dataKey="MargenGanancia" 
                name="Margen"
                radius={[8, 8, 0, 0]}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Tabla detallada */}
          <div className="mt-8 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">#</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Torta</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Cantidad</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Ingresos</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Ganancias</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Margen %</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Ganancia/Unidad</th>
                </tr>
              </thead>
              <tbody>
                {data.map((torta, index) => (
                  <tr 
                    key={torta.IdTorta}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-orange-600' :
                        'bg-green-500'
                      }`}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Cake className="w-4 h-4 text-pink-500" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {torta.NombreTorta}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                        {torta.CantidadVendida}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(torta.TotalIngresos)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(torta.TotalGanancias)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="font-bold text-green-600 dark:text-green-400">
                          {torta.MargenGanancia.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-purple-600 dark:text-purple-400">
                      {formatCurrency(torta.GananciaPorUnidad)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <Cake className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No hay datos para el período seleccionado</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TortasRentables;
