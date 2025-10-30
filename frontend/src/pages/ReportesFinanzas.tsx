import React, { useState } from 'react';
import TendenciaGanancias from '../components/reportes/TendenciaGanancias';
import TendenciaMensual from '../components/reportes/TendenciaMensual';
import { TrendingUp, Calendar } from 'lucide-react';

type TabReporte = 'tendencia' | 'mensual';

const ReportesFinanzas: React.FC = () => {
  const [tabActiva, setTabActiva] = useState<TabReporte>('tendencia');

  const tabs = [
    { id: 'tendencia' as TabReporte, label: 'Tendencia de Ganancias', icon: TrendingUp },
    { id: 'mensual' as TabReporte, label: 'Tendencia Mensual', icon: Calendar }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Reportes Financieros
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Análisis de ganancias y tendencias
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
                    ? 'bg-emerald-500 text-white shadow-md'
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
        {tabActiva === 'tendencia' && <TendenciaGanancias />}
        {tabActiva === 'mensual' && <TendenciaMensual />}
      </div>
    </div>
  );
};

export default ReportesFinanzas;
