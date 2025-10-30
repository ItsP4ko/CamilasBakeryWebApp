import React from 'react';

const ReportesCostosExtras: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Reportes de Costos Extras
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Análisis de costos adicionales
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <p className="text-gray-600 dark:text-gray-400">
          Reportes de costos extras próximamente...
        </p>
      </div>
    </div>
  );
};

export default ReportesCostosExtras;
