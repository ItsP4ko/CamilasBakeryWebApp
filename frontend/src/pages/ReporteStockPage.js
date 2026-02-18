import { jsx as _jsx } from "react/jsx-runtime";
import ReporteStock from '../components/reportes/ReporteStock';
/**
 * Página de Reporte de Stock
 * Muestra el estado del inventario de ingredientes y costos extra
 */
const ReporteStockPage = () => {
    return (_jsx("div", { className: "space-y-6", children: _jsx(ReporteStock, {}) }));
};
export default ReporteStockPage;
