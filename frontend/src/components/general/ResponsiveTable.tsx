import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface ResponsiveTableProps {
  columns: Column[];
  data: any[];
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  keyExtractor: (row: any) => string | number;
  mobileCardTitle?: (row: any) => string;
  mobileCardSubtitle?: (row: any) => string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  columns,
  data,
  onEdit,
  onDelete,
  isLoading,
  emptyMessage = 'No hay datos disponibles',
  keyExtractor,
  mobileCardTitle,
  mobileCardSubtitle,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (isLoading) {
    return <div className="p-6 text-center dark:text-gray-400">Cargando...</div>;
  }

  if (!data?.length) {
    return <div className="p-6 text-center text-gray-500 dark:text-gray-400">{emptyMessage}</div>;
  }

  return (
    <>
      {/* 📱 VISTA MÓVIL - Cards */}
      <div className="block lg:hidden space-y-4">
        {data.map((row) => (
          <div
            key={keyExtractor(row)}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 space-y-3"
          >
            {/* Header con título y acciones */}
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                {mobileCardTitle && (
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {mobileCardTitle(row)}
                  </h3>
                )}
                {mobileCardSubtitle && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {mobileCardSubtitle(row)}
                  </p>
                )}
              </div>

              {/* Acciones */}
              <div className="flex gap-2 ml-2 flex-shrink-0">
                {onEdit && (
                  <button
                    onClick={() => onEdit(row)}
                    className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                    title="Editar"
                  >
                    <Edit size={18} />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(row)}
                    className="p-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Campos */}
            <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              {columns.map((col) => {
                // Skip si es la columna de acciones o si no tiene valor
                if (col.key === 'actions' || !row[col.key]) return null;

                return (
                  <div key={col.key} className="flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {col.label}:
                    </span>
                    <span className="text-sm text-gray-900 dark:text-white font-medium">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 💻 VISTA DESKTOP - Tabla */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-primary-200 dark:bg-gray-700">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-3 dark:text-gray-200 font-semibold">
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-6 py-3 dark:text-gray-200 font-semibold">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={keyExtractor(row)}
                className="bg-primary-50 dark:bg-gray-800 border-t dark:border-gray-700 hover:bg-primary-100 dark:hover:bg-gray-750 transition"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-3 dark:text-gray-200">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-4">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {currentPage && totalPages && onPageChange && totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 px-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${currentPage === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                : 'bg-primary-500 text-white hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700'
              }`}
          >
            Anterior
          </button>
          <span className="text-gray-700 dark:text-gray-300">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${currentPage === totalPages
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                : 'bg-primary-500 text-white hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700'
              }`}
          >
            Siguiente
          </button>
        </div>
      )}
    </>
  );
};

export default ResponsiveTable;
