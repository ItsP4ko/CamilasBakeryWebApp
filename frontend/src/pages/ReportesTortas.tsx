import React, { useState } from 'react';
import TopTortas from '../components/reportes/TopTortas';
import TortasRentables from '../components/reportes/TortasRentables';
import MedidasPopulares from '../components/reportes/MedidasPopulares';
import { TrendingUp, DollarSign, Ruler } from 'lucide-react';

type TabReporte = 'top' | 'rentables' | 'medidas';

const ReportesTortas: React.FC = () => {
  const [tabActiva, setTabActiva] = useState<TabReporte>('top');

  const tabs = [
    { id: 'top' as TabReporte, label: 'Top Más Vendidas', icon: TrendingUp },
    { id: 'rentables' as TabReporte, label: 'Más Rentables', icon: DollarSign },
    { id: 'medidas' as TabReporte, label: 'Medidas Populares', icon: Ruler }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Reportes de Tortas
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Análisis de productos y rentabilidad
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
        {tabActiva === 'top' && <TopTortas />}
        {tabActiva === 'rentables' && <TortasRentables />}
        {tabActiva === 'medidas' && <MedidasPopulares />}
      </div>
    </div>
  );
};

export default ReportesTortas;
