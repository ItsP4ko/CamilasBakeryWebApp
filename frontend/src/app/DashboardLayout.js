import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/app/DashboardLayout.tsx
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from '../components/general/Sidebar';
const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (_jsxs("div", { className: "flex h-screen bg-primary-50 text-primary-900 font-sans", children: [sidebarOpen && (_jsx("div", { className: "fixed inset-0 z-40 bg-black bg-opacity-40 lg:hidden", onClick: () => setSidebarOpen(false) })), _jsx(Sidebar, { isOpen: sidebarOpen, onClose: () => setSidebarOpen(false) }), _jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [_jsx("header", { className: "bg-primary-100 shadow-sm border-b border-primary-200 sticky top-0 z-10", children: _jsxs("div", { className: "flex items-center justify-between h-16 px-6", children: [_jsx("button", { onClick: () => setSidebarOpen(true), className: "text-primary-600 hover:text-primary-700 lg:hidden", children: _jsx(Menu, { className: "w-6 h-6" }) }), _jsx("h2", { className: "text-lg font-bold text-primary-800 tracking-wide", children: "Panel de Control" }), _jsx("div", { className: "w-6" })] }) }), _jsx("main", { className: "flex-1 overflow-y-auto bg-primary-100", children: _jsx("div", { className: "p-6 space-y-6", children: _jsx(Outlet, {}) }) })] })] }));
};
export default DashboardLayout;
