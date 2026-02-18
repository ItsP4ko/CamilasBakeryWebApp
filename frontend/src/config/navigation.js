import { LayoutDashboard, CakeSlice, Package, DollarSign, BarChart3, ShoppingCart, Wallet } from 'lucide-react';
export const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Tortas', href: '/tortas', icon: CakeSlice },
    { name: 'Ingredientes', href: '/ingredientes', icon: Package },
    { name: 'Costos Extra', href: '/costos-extra', icon: DollarSign },
    { name: 'Pedidos', href: '/pedidos', icon: ShoppingCart },
    { name: 'Cuentas', href: '/cuentas', icon: Wallet },
    {
        name: 'Reportes',
        href: '/reportes',
        icon: BarChart3,
        children: [
            { name: 'Pedidos', href: '/reportes/pedidos' },
            { name: 'Finanzas', href: '/reportes/finanzas' },
            { name: 'Tortas', href: '/reportes/tortas' },
            { name: 'Stock', href: '/reportes/stock' }
        ]
    }
];
