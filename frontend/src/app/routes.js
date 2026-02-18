import { jsx as _jsx } from "react/jsx-runtime";
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
const ReportesPedidos = lazy(() => import('@/pages/ReportesPedidos'));
const ReportesFinanzas = lazy(() => import('@/pages/ReportesFinanzas'));
const ReportesTortas = lazy(() => import('@/pages/ReportesTortas'));
const ReporteStockPage = lazy(() => import('@/pages/ReporteStockPage'));
const Pedidos = lazy(() => import('@/pages/Pedidos'));
const CrearPedido = lazy(() => import('@/pages/CrearPedido'));
const ModificarPedido = lazy(() => import('@/pages/ModificarPedido'));
const GestionMedidas = lazy(() => import('@/pages/GestionMedidas'));
const ModificarMedida = lazy(() => import('@/pages/ModificarMedida'));
// Componente de loading para Suspense
const PageLoader = () => (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("div", { className: "text-primary-600 text-lg", children: "Cargando..." }) }));
// Wrapper para páginas con Suspense
const SuspenseWrapper = ({ children }) => (_jsx(Suspense, { fallback: _jsx(PageLoader, {}), children: children }));
export const router = createBrowserRouter([
    {
        path: ROUTES.LOGIN,
        element: _jsx(Login, {})
    },
    {
        path: '/',
        element: (_jsx(ProtectedRoute, { children: _jsx(DashboardLayout, {}) })),
        children: [
            {
                index: true,
                element: (_jsx(SuspenseWrapper, { children: _jsx(Dashboard, {}) }))
            },
            {
                path: 'dashboard',
                element: (_jsx(SuspenseWrapper, { children: _jsx(Dashboard, {}) }))
            },
            {
                path: 'tortas',
                element: (_jsx(SuspenseWrapper, { children: _jsx(Tortas, {}) }))
            },
            {
                path: 'ingredientes',
                element: (_jsx(SuspenseWrapper, { children: _jsx(Ingredientes, {}) }))
            },
            {
                path: 'costos-extra',
                element: (_jsx(SuspenseWrapper, { children: _jsx(CostoExtra, {}) }))
            },
            {
                path: 'reportes',
                element: (_jsx(SuspenseWrapper, { children: _jsx(Reportes, {}) }))
            },
            {
                path: 'reportes/pedidos',
                element: (_jsx(SuspenseWrapper, { children: _jsx(ReportesPedidos, {}) }))
            },
            {
                path: 'reportes/finanzas',
                element: (_jsx(SuspenseWrapper, { children: _jsx(ReportesFinanzas, {}) }))
            },
            {
                path: 'reportes/tortas',
                element: (_jsx(SuspenseWrapper, { children: _jsx(ReportesTortas, {}) }))
            },
            {
                path: 'reportes/stock',
                element: (_jsx(SuspenseWrapper, { children: _jsx(ReporteStockPage, {}) }))
            },
            {
                path: 'Pedidos',
                element: (_jsx(SuspenseWrapper, { children: _jsx(Pedidos, {}) }))
            },
            {
                path: 'pedidos/crear',
                element: (_jsx(SuspenseWrapper, { children: _jsx(CrearPedido, {}) }))
            },
            {
                path: 'pedidos/modificar/:id',
                element: (_jsx(SuspenseWrapper, { children: _jsx(ModificarPedido, {}) }))
            },
            {
                path: 'tortas/:tortaId/medidas',
                element: (_jsx(SuspenseWrapper, { children: _jsx(GestionMedidas, {}) }))
            },
            {
                path: 'tortas/:tortaId/medidas/:medidaId',
                element: (_jsx(SuspenseWrapper, { children: _jsx(ModificarMedida, {}) }))
            }
        ]
    }
]);
