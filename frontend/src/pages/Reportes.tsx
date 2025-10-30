import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Cake, Package, DollarSign, TrendingUp } from 'lucide-react';

const Reportes: React.FC = () => {
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
      titulo: 'Ingredientes',
      descripcion: 'Control de stock y consumo',
      icon: Package,
      color: 'green',
      path: '/reportes/ingredientes'
    },
    {
      titulo: 'Costos Extras',
      descripcion: 'Análisis de costos adicionales',
      icon: DollarSign,
      color: 'purple',
      path: '/reportes/costosExtras'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Reportes y Análisis
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Selecciona una categoría para ver los reportes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {secciones.map((seccion) => {
          const Icon = seccion.icon;
          const colorClasses = {
            blue: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
            emerald: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400',
            pink: 'bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-400',
            green: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400',
            purple: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
          };
          
          return (
            <button
              key={seccion.path}
              onClick={() => navigate(seccion.path)}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-all text-left group"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg group-hover:scale-110 transition-transform ${colorClasses[seccion.color as keyof typeof colorClasses]}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {seccion.titulo}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {seccion.descripcion}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Reportes;