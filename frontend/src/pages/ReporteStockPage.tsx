import React from 'react';
import ReporteStock from '../components/reportes/ReporteStock';

/**
 * Página de Reporte de Stock
 * Muestra el estado del inventario de ingredientes y costos extra
 */
const ReporteStockPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <ReporteStock />
    </div>
  );
};

export default ReporteStockPage;
