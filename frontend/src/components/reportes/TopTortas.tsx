import React, { useState } from 'react';
import { useTopTortas } from '../../hooks/useReportes';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Cake, TrendingUp } from 'lucide-react';

const TopTortas: React.FC = () => {
  const [fechaInicio, setFechaInicio] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 3);
    return date.toISOString().split('T')[0];
  });
  
  const [fechaFin, setFechaFin] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const [top, setTop] = useState(10);
  const [ordenarPor, setOrdenarPor] = useState<'cantidad' | 'ganancia'>('cantidad');

  const [filtrosAplicados, setFiltrosAplicados] = useState<{
    fechaInicio: string;
    fechaFin: string;
    top: number;
    ordenarPor: 'cantidad' | 'ganancia';
  } | null>(null);

  const { data, isLoading, isError, error } = useTopTortas(filtrosAplicados!);

  const handleBuscar = () => {
    setFiltrosAplicados({ fechaInicio, fechaFin, top, ordenarPor });
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
          <p className="text-red-800">Error al cargar top tortas: {error instanceof Error ? error.message : 'Error desconocido'}</p>
        </div>
      </div>
    );
  }

  const totalIngresos = data?.reduce((sum, item) => sum + item.TotalIngresos, 0) || 0;
  const totalGanancias = data?.reduce((sum, item) => sum + item.TotalGanancias, 0) || 0;
  const totalCantidad = data?.reduce((sum, item) => sum + item.CantidadVendida, 0) || 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Cake className="w-6 h-6 text-pink-500" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Top Tortas Más Vendidas
          </h2>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
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
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Ordenar por
          </label>
          <select
            value={ordenarPor}
            onChange={(e) => setOrdenarPor(e.target.value as 'cantidad' | 'ganancia')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="cantidad">Cantidad Vendida</option>
            <option value="ganancia">Ganancia</option>
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
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900 dark:to-pink-800 rounded-lg p-4">
          <p className="text-sm font-medium text-pink-700 dark:text-pink-300">Total Vendidas</p>
          <p className="text-2xl font-bold text-pink-900 dark:text-pink-100 mt-1">
            {totalCantidad}
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Ingresos</p>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
            {formatCurrency(totalIngresos)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg p-4">
          <p className="text-sm font-medium text-green-700 dark:text-green-300">Total Ganancias</p>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
            {formatCurrency(totalGanancias)}
          </p>
        </div>
      </div>

      {/* Gráfico de Barras Horizontal */}
      {data && data.length > 0 ? (
        <div className="mt-6">
          <ResponsiveContainer width="100%" height={Math.max(400, data.length * 50)}>
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="dark:opacity-20" />
              <XAxis 
                type="number"
                className="text-sm"
                tick={{ fill: 'currentColor' }}
              />
              <YAxis 
                dataKey="NombreTorta" 
                type="category"
                width={150}
                className="text-sm"
                tick={{ fill: 'currentColor' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number) => value}
                labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
              />
              <Legend />
              <Bar 
                dataKey="CantidadVendida" 
                fill="#ec4899" 
                name="Cantidad"
                radius={[0, 8, 8, 0]}
              />
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
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">% del Total</th>
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
                        'bg-pink-500'
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
                      <span className="inline-flex items-center gap-1 bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 px-3 py-1 rounded-full text-sm font-medium">
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
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                        <span className="font-medium text-blue-600 dark:text-blue-400">
                          {torta.PorcentajeDelTotal.toFixed(2)}%
                        </span>
                      </div>
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

export default TopTortas;
