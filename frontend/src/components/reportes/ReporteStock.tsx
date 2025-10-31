import { useState } from 'react';
import { useReporteStock } from '../../hooks/useReporteStock';
import { NivelStockEnum } from '../../types/reportes';
import { AlertCircle, Package, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';

/**
 * Componente de Reporte de Stock
 * Muestra el estado del inventario de ingredientes y costos extra
 */
export default function ReporteStock() {
  const [nivelFiltro, setNivelFiltro] = useState<NivelStockEnum | undefined>(undefined);
  const [tipoFiltro, setTipoFiltro] = useState<"ingrediente" | "costoextra" | undefined>(undefined);

  const { data, isLoading, error } = useReporteStock({
    nivel: nivelFiltro,
    tipo: tipoFiltro,
  });

  // Configuración de colores y estilos por nivel
  const getNivelConfig = (nivel: NivelStockEnum) => {
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
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Cargando reporte de stock...</div>
      </div>
    );
  }

  if (error) {
    console.error('Error en reporte de stock:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    const axiosError = error as any;
    const statusCode = axiosError?.response?.status;
    const serverMessage = axiosError?.response?.data?.message || axiosError?.response?.data?.error;
    
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-800 dark:text-red-300 font-semibold mb-2">
              Error al cargar el reporte de stock
            </p>
            <p className="text-red-700 dark:text-red-400 text-sm mb-2">
              {errorMessage}
            </p>
            {statusCode && (
              <div className="bg-red-100 dark:bg-red-900/40 rounded p-3 mb-3">
                <p className="text-sm text-red-800 dark:text-red-300">
                  <strong>Código de error:</strong> {statusCode}
                </p>
                {serverMessage && (
                  <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                    <strong>Mensaje del servidor:</strong> {serverMessage}
                  </p>
                )}
              </div>
            )}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-3 mt-3">
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                <strong>💡 Posibles causas:</strong>
              </p>
              <ul className="list-disc list-inside text-sm text-yellow-700 dark:text-yellow-400 mt-2 space-y-1">
                <li>Las tablas de la base de datos no tienen las columnas <code>Stock</code> y <code>MaxStock</code></li>
                <li>Hay un error en el código del backend (revisa los logs del servidor)</li>
                <li>Error de conexión con la base de datos</li>
                <li>El servicio de reportes no está registrado en el backend</li>
              </ul>
            </div>
            <details className="mt-3">
              <summary className="text-red-600 dark:text-red-400 text-sm cursor-pointer hover:underline">
                Ver detalles técnicos completos
              </summary>
              <pre className="mt-2 text-xs bg-red-100 dark:bg-red-900/40 p-2 rounded overflow-auto max-h-60">
                {JSON.stringify(error, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con título */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Package className="w-7 h-7" />
            Reporte de Stock
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Estado del inventario de ingredientes y costos extra
          </p>
        </div>
      </div>

      {/* Resumen en cards */}
      {data?.resumen && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Items</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {data.resumen.totalItems}
                </p>
              </div>
              <Package className="w-8 h-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg shadow p-4 border border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 dark:text-red-400">Críticos</p>
                <p className="text-2xl font-bold text-red-700 dark:text-red-300 mt-1">
                  {data.resumen.itemsCriticos}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg shadow p-4 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 dark:text-orange-400">Bajos</p>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300 mt-1">
                  {data.resumen.itemsBajos}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-400" />
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg shadow p-4 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 dark:text-yellow-400">Medios</p>
                <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300 mt-1">
                  {data.resumen.itemsMedios}
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-yellow-400" />
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg shadow p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400">Altos</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300 mt-1">
                  {data.resumen.itemsAltos}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-4">
          {/* Filtro por Nivel */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filtrar por Nivel
            </label>
            <select
              value={nivelFiltro ?? ''}
              onChange={(e) => setNivelFiltro(e.target.value === '' ? undefined : Number(e.target.value) as NivelStockEnum)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="">Todos los niveles</option>
              <option value={NivelStockEnum.Critico}>Crítico (&lt; 20%)</option>
              <option value={NivelStockEnum.Bajo}>Bajo (20% - 40%)</option>
              <option value={NivelStockEnum.Medio}>Medio (40% - 70%)</option>
              <option value={NivelStockEnum.Alto}>Alto (&gt; 70%)</option>
            </select>
          </div>

          {/* Filtro por Tipo */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filtrar por Tipo
            </label>
            <select
              value={tipoFiltro ?? ''}
              onChange={(e) => setTipoFiltro(e.target.value === '' ? undefined : e.target.value as "ingrediente" | "costoextra")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="">Todos los tipos</option>
              <option value="ingrediente">Ingredientes</option>
              <option value="costoextra">Costos Extra</option>
            </select>
          </div>

          {/* Botón Limpiar */}
          {(nivelFiltro !== undefined || tipoFiltro !== undefined) && (
            <div className="flex items-end">
              <button
                onClick={() => {
                  setNivelFiltro(undefined);
                  setTipoFiltro(undefined);
                }}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Limpiar Filtros
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabla de Items */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Stock Actual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Stock Máximo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Porcentaje
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Nivel
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data?.items && data.items.length > 0 ? (
                data.items.map((item) => {
                  const config = getNivelConfig(item.nivelStock);
                  if (!config) {
                    console.error('Config no encontrado para item:', item);
                    return null;
                  }
                  const Icon = config.icon;

                  return (
                    <tr key={`${item.tipoItem}-${item.id}`} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.nombre}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {item.tipoItem}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.stock.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {item.maxStock.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                item.nivelStock === NivelStockEnum.Critico
                                  ? 'bg-red-500'
                                  : item.nivelStock === NivelStockEnum.Bajo
                                  ? 'bg-orange-500'
                                  : item.nivelStock === NivelStockEnum.Medio
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(item.porcentajeStock, 100)}%` }}
                            />
                          </div>
                          <span className={`text-sm font-medium ${config.color}`}>
                            {item.porcentajeStock.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.badge}`}>
                          <Icon className="w-3.5 h-3.5" />
                          {item.nivelStockTexto}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <Package className="w-12 h-12 mb-2 opacity-50" />
                      <p>No hay items que cumplan con los filtros seleccionados</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
