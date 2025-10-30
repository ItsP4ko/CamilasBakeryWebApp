import React, { useState } from 'react';
import { useMedidasPopulares } from '../../hooks/useReportes';
import { useTortas } from '../../hooks/useTortas';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Ruler, Calendar } from 'lucide-react';
import Select from 'react-select';

const MedidasPopulares: React.FC = () => {
  const [tortaSeleccionada, setTortaSeleccionada] = useState<{ value: number; label: string } | null>(null);
  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [fechaFin, setFechaFin] = useState<string>('');

  const [filtrosAplicados, setFiltrosAplicados] = useState<{
    idTorta: number | null;
    fechaInicio: string | null;
    fechaFin: string | null;
  } | null>(null);

  const { data, isLoading, isError, error } = useMedidasPopulares(filtrosAplicados);
  const { data: tortas, isLoading: isLoadingTortas } = useTortas();

  const handleBuscar = () => {
    setFiltrosAplicados({
      idTorta: tortaSeleccionada?.value || null,
      fechaInicio: fechaInicio || null,
      fechaFin: fechaFin || null
    });
  };

  // Opciones para el selector de tortas
  const opcionesTortas = tortas?.map((torta) => ({
    value: torta.IdTorta,
    label: torta.Nombre,
  })) || [];

  const COLORS = ['#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'];

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
          <p className="text-red-800">Error al cargar medidas populares: {error instanceof Error ? error.message : 'Error desconocido'}</p>
        </div>
      </div>
    );
  }

  // Agrupar datos por torta
  const dataByTorta = data?.reduce((acc, item) => {
    const key = item.IdTorta;
    if (!acc[key]) {
      acc[key] = {
        nombreTorta: item.NombreTorta,
        medidas: []
      };
    }
    acc[key].medidas.push(item);
    return acc;
  }, {} as Record<number, { nombreTorta: string; medidas: typeof data }>);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Ruler className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Medidas Más Populares
          </h2>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Torta (Opcional)
          </label>
          <Select
            isLoading={isLoadingTortas}
            options={opcionesTortas}
            value={tortaSeleccionada}
            onChange={(selected) => setTortaSeleccionada(selected)}
            placeholder="Todas las tortas"
            isClearable
            isSearchable
            noOptionsMessage={() => 'No hay tortas disponibles'}
            className="react-select-container"
            classNamePrefix="react-select"
            styles={{
              control: (base, state) => ({
                ...base,
                backgroundColor: 'var(--select-bg, white)',
                borderColor: state.isFocused ? '#ec4899' : '#4b5563',
                boxShadow: state.isFocused ? '0 0 0 1px #ec4899' : 'none',
                '&:hover': {
                  borderColor: '#ec4899',
                },
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: 'var(--select-bg, white)',
                zIndex: 9999,
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected
                  ? '#ec4899'
                  : state.isFocused
                  ? 'var(--select-hover, #fce7f3)'
                  : 'transparent',
                color: state.isSelected 
                  ? 'white' 
                  : state.isFocused 
                  ? 'var(--select-hover-text, #831843)' 
                  : 'var(--text-color, black)',
                cursor: 'pointer',
                '&:active': {
                  backgroundColor: '#ec4899',
                },
              }),
              singleValue: (base) => ({
                ...base,
                color: 'var(--text-color, black)',
              }),
              input: (base) => ({
                ...base,
                color: 'var(--text-color, black)',
              }),
              placeholder: (base) => ({
                ...base,
                color: 'var(--placeholder-color, #9ca3af)',
              }),
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Fecha Inicio (Opcional)
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Fecha Fin (Opcional)
          </label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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

      {/* Gráficos por Torta */}
      {dataByTorta && Object.keys(dataByTorta).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(dataByTorta).map(([idTorta, { nombreTorta, medidas }]) => {
            const chartData = medidas.map(m => ({
              name: m.TamanoMedida,
              value: m.CantidadVendida,
              percentage: m.PorcentajeDelTotal
            }));

            const totalVendidas = medidas.reduce((sum, m) => sum + m.CantidadVendida, 0);

            return (
              <div key={idTorta} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  {nombreTorta}
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Gráfico de Pastel */}
                  <div>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry: any) => `${entry.name} (${entry.percentage.toFixed(1)}%)`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => [`${value} unidades`, 'Cantidad']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Tabla de Medidas */}
                  <div className="space-y-3">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Vendidas</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                        {totalVendidas}
                      </p>
                    </div>
                    <div className="space-y-2">
                      {medidas.map((medida, index) => (
                        <div 
                          key={medida.IdMedida}
                          className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            ></div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {medida.TamanoMedida}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900 dark:text-white">
                              {medida.CantidadVendida}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {medida.PorcentajeDelTotal.toFixed(2)}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No hay datos con los filtros seleccionados</p>
            <p className="text-sm mt-2">Presiona "Buscar" sin filtros para ver todas las medidas</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedidasPopulares;
