import React, { useState } from 'react';
import DashboardGeneral from '../components/reportes/DashboardGeneral';
import VentasPorPeriodo from '../components/reportes/VentasPorPeriodo';
import TopClientes from '../components/reportes/TopClientes';
import { BarChart3, TrendingUp, Users } from 'lucide-react';

type TabReporte = 'dashboard' | 'ventas' | 'clientes';

const ReportesPedidos: React.FC = () => {
  const [tabActiva, setTabActiva] = useState<TabReporte>('dashboard');

  const tabs = [
    { id: 'dashboard' as TabReporte, label: 'Dashboard General', icon: BarChart3 },
    { id: 'ventas' as TabReporte, label: 'Ventas por Período', icon: TrendingUp },
    { id: 'clientes' as TabReporte, label: 'Top Clientes', icon: Users }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Reportes de Pedidos
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Análisis de ventas y clientes
        </p>
      </div>

      {/* Navbar con Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-2">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setTabActiva(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all font-medium ${
                  tabActiva === tab.id
                    ? 'bg-pink-500 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenido según tab activa */}
      <div className="space-y-6">
        {tabActiva === 'dashboard' && <DashboardGeneral />}
        {tabActiva === 'ventas' && <VentasPorPeriodo />}
        {tabActiva === 'clientes' && <TopClientes />}
      </div>
    </div>
  );
};

export default ReportesPedidos;
