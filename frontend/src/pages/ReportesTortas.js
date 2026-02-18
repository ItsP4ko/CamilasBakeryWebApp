import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import TopTortas from '../components/reportes/TopTortas';
import TortasRentables from '../components/reportes/TortasRentables';
import MedidasPopulares from '../components/reportes/MedidasPopulares';
import { TrendingUp, DollarSign, Ruler } from 'lucide-react';
const ReportesTortas = () => {
    const [tabActiva, setTabActiva] = useState('top');
    const tabs = [
        { id: 'top', label: 'Top Más Vendidas', icon: TrendingUp },
        { id: 'rentables', label: 'Más Rentables', icon: DollarSign },
        { id: 'medidas', label: 'Medidas Populares', icon: Ruler }
    ];
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white", children: "Reportes de Tortas" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mt-2", children: "An\u00E1lisis de productos y rentabilidad" })] }), _jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-md p-2", children: _jsx("div", { className: "flex flex-wrap gap-2", children: tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (_jsxs("button", { onClick: () => setTabActiva(tab.id), className: `flex items-center gap-2 px-4 py-2 rounded-md transition-all font-medium ${tabActiva === tab.id
                                ? 'bg-pink-500 text-white shadow-md'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`, children: [_jsx(Icon, { className: "w-4 h-4" }), _jsx("span", { className: "hidden sm:inline", children: tab.label })] }, tab.id));
                    }) }) }), _jsxs("div", { className: "space-y-6", children: [tabActiva === 'top' && _jsx(TopTortas, {}), tabActiva === 'rentables' && _jsx(TortasRentables, {}), tabActiva === 'medidas' && _jsx(MedidasPopulares, {})] })] }));
};
export default ReportesTortas;
