import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Cake, ChefHat, Handshake, ShoppingCart } from "lucide-react";
import { useDashboardMetrics } from "../hooks/useDashboardMetrics";
import StatsCard from "@/components/general/StatsCard";
import { useIngredientes } from "@/hooks/useIngredientes";
import { formatCurrency } from "@/utils/formatters";
const Dashboard = () => {
    // Use different variable names to avoid redeclaration errors
    const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError, } = useDashboardMetrics();
    const { data: ingredientesData, isLoading: ingLoading, error: ingError, } = useIngredientes();
    const tortasCount = dashboardData?.tortasCount ?? "0";
    const pedidosPendientes = dashboardData?.pedidosPendientes ?? "0";
    const totalItems = ingredientesData?.totalCount || 0;
    const GananciaMensual = formatCurrency(dashboardData?.gananciaMensual);
    const isLoading = dashboardLoading || ingLoading;
    const error = dashboardError || ingError;
    return (_jsxs("div", { className: "max-w-7xl mx-auto py-6 sm:py-10 px-4", children: [_jsxs("div", { className: "mb-8 sm:mb-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-2", children: [_jsx("img", { src: "/assets/tortas/logo.png", alt: "Logo", className: "w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80" }), _jsxs("h1", { className: "text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-400 tracking-tight text-center sm:text-left", children: ["Bienvenido a", " ", _jsx("span", { className: "text-primary-600", children: "CamilasBakery" })] })] }), _jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8", children: [_jsx(StatsCard, { label: "Productos en el catalogo", value: isLoading ? "..." : tortasCount, icon: Cake, iconColor: "primary", delay: 0, href: "/tortas" }), _jsx(StatsCard, { label: "Ingredientes en stock", value: isLoading ? "..." : totalItems.toString(), icon: ChefHat, iconColor: "primary", delay: 0.1, href: "/ingredientes" }), _jsx(StatsCard, { label: "Pedidos esta semana", value: isLoading ? "..." : pedidosPendientes, icon: ShoppingCart, iconColor: "primary", delay: 0.2, href: "/pedidos" }), _jsx(StatsCard, { label: "Ganancia mensual", value: isLoading ? "..." : GananciaMensual, icon: Handshake, iconColor: "primary", delay: 0.3 })] }), _jsxs("div", { className: "mt-12 text-center", children: [_jsx("p", { className: "text-lg text-primary-900", children: "Selecciona una secci\u00F3n en la barra lateral para comenzar." }), error && (_jsx("p", { className: "text-red-500 text-sm mt-2", children: typeof error === "string" ? error : error.message }))] })] }));
};
export default Dashboard;
