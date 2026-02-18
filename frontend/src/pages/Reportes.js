import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Cake, TrendingUp, AlertTriangle } from 'lucide-react';
const Reportes = () => {
    const navigate = useNavigate();
    const secciones = [
        {
            titulo: 'Pedidos',
            descripcion: 'Dashboard, ventas por período y clientes',
            icon: ShoppingCart,
            color: 'blue',
            path: '/reportes/pedidos'
        },
        {
            titulo: 'Finanzas',
            descripcion: 'Tendencias de ganancias y análisis mensual',
            icon: TrendingUp,
            color: 'emerald',
            path: '/reportes/finanzas'
        },
        {
            titulo: 'Tortas',
            descripcion: 'Top ventas, rentabilidad y medidas populares',
            icon: Cake,
            color: 'pink',
            path: '/reportes/tortas'
        },
        {
            titulo: 'Control de Stock',
            descripcion: 'Niveles de inventario de ingredientes y costos extra',
            icon: AlertTriangle,
            color: 'orange',
            path: '/reportes/stock'
        }
    ];
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white", children: "Reportes y An\u00E1lisis" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mt-2", children: "Selecciona una categor\u00EDa para ver los reportes" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: secciones.map((seccion) => {
                    const Icon = seccion.icon;
                    const colorClasses = {
                        blue: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
                        emerald: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400',
                        pink: 'bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-400',
                        orange: 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400'
                    };
                    return (_jsx("button", { onClick: () => navigate(seccion.path), className: "bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-all text-left group", children: _jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: `p-3 rounded-lg group-hover:scale-110 transition-transform ${colorClasses[seccion.color]}`, children: _jsx(Icon, { className: "w-8 h-8" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 dark:text-white mb-2", children: seccion.titulo }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: seccion.descripcion })] })] }) }, seccion.path));
                }) })] }));
};
export default Reportes;
