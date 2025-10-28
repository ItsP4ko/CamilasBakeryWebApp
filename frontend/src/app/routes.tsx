import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ROUTES } from '@/constants';

// Eager loading para componentes críticos
import DashboardLayout from './DashboardLayout';
import Login from '@/pages/Login';

// Lazy loading para el resto de páginas
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Tortas = lazy(() => import('@/pages/Tortas'));
const Ingredientes = lazy(() => import('@/pages/Ingredientes'));
const CostoExtra = lazy(() => import('@/pages/CostoExtra'));
const Reportes = lazy(() => import('@/pages/Reportes'));
const Pedidos = lazy(() => import('@/pages/Pedidos'));
const CrearPedido = lazy(() => import('@/pages/CrearPedido'));
const ModificarPedido = lazy(() => import('@/pages/ModificarPedido'));
const GestionMedidas = lazy(() => import('@/pages/GestionMedidas'));
const ModificarMedida = lazy(() => import('@/pages/ModificarMedida'));

// Componente de loading para Suspense
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-primary-600 text-lg">Cargando...</div>
  </div>
);

// Wrapper para páginas con Suspense
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <Login />
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { 
        index: true, 
        element: (
          <SuspenseWrapper>
            <Dashboard />
          </SuspenseWrapper>
        )
      },
      { 
        path: 'dashboard', 
        element: (
          <SuspenseWrapper>
            <Dashboard />
          </SuspenseWrapper>
        )
      },
      { 
        path: 'tortas', 
        element: (
          <SuspenseWrapper>
            <Tortas />
          </SuspenseWrapper>
        )
      },
      { 
        path: 'ingredientes', 
        element: (
          <SuspenseWrapper>
            <Ingredientes />
          </SuspenseWrapper>
        )
      },
      { 
        path: 'costos-extra', 
        element: (
          <SuspenseWrapper>
            <CostoExtra />
          </SuspenseWrapper>
        )
      },
      { 
        path: 'reportes', 
        element: (
          <SuspenseWrapper>
            <Reportes />
          </SuspenseWrapper>
        )
      },
      { 
        path: 'Pedidos', 
        element: (
          <SuspenseWrapper>
            <Pedidos />
          </SuspenseWrapper>
        )
      },
      { 
        path: 'pedidos/crear', 
        element: (
          <SuspenseWrapper>
            <CrearPedido />
          </SuspenseWrapper>
        )
      },
      { 
        path: 'pedidos/modificar/:id', 
        element: (
          <SuspenseWrapper>
            <ModificarPedido />
          </SuspenseWrapper>
        )
      },
      { 
        path: 'tortas/:tortaId/medidas', 
        element: (
          <SuspenseWrapper>
            <GestionMedidas />
          </SuspenseWrapper>
        )
      },
      { 
        path: 'tortas/:tortaId/medidas/:medidaId', 
        element: (
          <SuspenseWrapper>
            <ModificarMedida />
          </SuspenseWrapper>
        )
      }
    ]
  }
]);
