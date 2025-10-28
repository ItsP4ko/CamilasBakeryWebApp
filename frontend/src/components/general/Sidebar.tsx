// src/components/Sidebar.tsx
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, X, Moon, Sun } from 'lucide-react';
import { navigationItems } from '../../config/navigation';
import NavItem from './NavItem';
import { useTheme } from '../../config/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-primary-100 text-priamry-800 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 bg-primary-200 border-b border-primary-300">
          <h1 className="text-xl font-bold tracking-wide text-primary-700">
            CamilasBakery
          </h1>
          <div className="flex items-center gap-2">
            {/* Botón de tema */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-primary-300 transition-colors"
              aria-label="Cambiar tema"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-primary-600" />
              ) : (
                <Sun className="w-5 h-5 text-primary-600" />
              )}
            </button>
            
            {/* Botón cerrar (móvil) */}
            <button
              onClick={onClose}
              className="lg:hidden text-primary-600 hover:bg-primary-300 p-2 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Usuario */}
        <div className="p-6 bg-primary-100 border-b border-primary-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-400 rounded-full flex items-center justify-center font-bold text-white text-sm">
              CB
            </div>
            <div>
              <p className="text-sm font-semibold">
                {user || 'Administrador'}
              </p>
              <p className="text-xs text-primary-500">CamilasBakery</p>
            </div>
          </div>
        </div>

        {/* Menú */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => (
            <NavItem
              key={item.name}
              name={item.name}
              href={item.href}
              icon={item.icon}
              children={item.children}
              onClick={onClose}
            />
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-primary-200">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-primary-300 hover:bg-primary-500 text-primary-800 hover:text-white rounded-lg font-semibold transition-colors duration-200"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;