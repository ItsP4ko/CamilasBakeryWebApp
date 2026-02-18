import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from '../../hooks/useAuth';
import { LogOut, X, Moon, Sun } from 'lucide-react';
import { navigationItems } from '../../config/navigation';
import NavItem from './NavItem';
import { useTheme } from '../../config/ThemeContext';
const Sidebar = ({ isOpen, onClose }) => {
    const { logout, user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    return (_jsx("aside", { className: `fixed inset-y-0 left-0 z-50 w-64 bg-primary-100 text-priamry-800 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `, children: _jsxs("div", { className: "flex flex-col h-full", children: [_jsxs("div", { className: "flex items-center justify-between h-16 px-6 bg-primary-200 border-b border-primary-300", children: [_jsx("h1", { className: "text-xl font-bold tracking-wide text-primary-700", children: "CamilasBakery" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: toggleTheme, className: "p-2 rounded-lg hover:bg-primary-300 transition-colors", "aria-label": "Cambiar tema", children: theme === 'light' ? (_jsx(Moon, { className: "w-5 h-5 text-primary-600" })) : (_jsx(Sun, { className: "w-5 h-5 text-primary-600" })) }), _jsx("button", { onClick: onClose, className: "lg:hidden text-primary-600 hover:bg-primary-300 p-2 rounded", children: _jsx(X, { className: "w-5 h-5" }) })] })] }), _jsx("nav", { className: "flex-1 px-4 py-6 space-y-2 overflow-y-auto", children: navigationItems.map((item) => (_jsx(NavItem, { name: item.name, href: item.href, icon: item.icon, children: item.children, onClick: onClose }, item.name))) }), _jsx("div", { className: "p-4 border-t border-primary-200", children: _jsxs("button", { onClick: logout, className: "w-full flex items-center justify-center gap-3 px-4 py-3 bg-primary-300 hover:bg-primary-500 text-primary-800 hover:text-white rounded-lg font-semibold transition-colors duration-200", children: [_jsx(LogOut, { className: "w-5 h-5" }), "Cerrar Sesi\u00F3n"] }) })] }) }));
};
export default Sidebar;
