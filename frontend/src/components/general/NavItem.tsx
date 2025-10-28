// src/components/NavItem.tsx
import React, { useState, memo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

interface NavItemProps {
  name: string;
  href: string;
  icon: React.ElementType;
  children?: { name: string; href: string }[];
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ name, href, icon: Icon, children, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === href || children?.some(child => location.pathname === child.href);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMouseEnter = useCallback(() => setIsExpanded(true), []);
  const handleMouseLeave = useCallback(() => setIsExpanded(false), []);

  // Si tiene hijos, mostrar con expansión
  if (children && children.length > 0) {
    return (
      <div className="relative">
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="w-full"
        >
          {/* Botón principal */}
          <Link
            to={href}
            onClick={onClick}
            className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200
              ${
                isActive
                  ? 'bg-primary-500 text-white'
                  : 'text-primary-700 hover:bg-primary-300 hover:text-primary-900'
              }
            `}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5" />
              {name}
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          </Link>

          {/* Submenú expandible con transición suave */}
          <div 
            className={`overflow-hidden transition-all duration-700   ease-in-out ${
              isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="mt-1 ml-4 space-y-1 border-l-2 border-primary-300 pl-2">
              {children.map((child) => {
                const isChildActive = location.pathname === child.href;
                return (
                  <Link
                    key={child.href}
                    to={child.href}
                    onClick={onClick}
                    className={`block px-4 py-2 text-sm rounded-lg font-medium transition-colors duration-700  
                      ${
                        isChildActive
                          ? 'bg-primary-400 text-white'
                          : 'text-primary-600 hover:bg-primary-200 hover:text-primary-900'
                      }
                    `}
                  >
                    {child.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si no tiene hijos, renderizar normal
  return (
    <Link
      to={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200
        ${
          isActive
            ? 'bg-primary-500 text-white'
            : 'text-primary-700 hover:bg-primary-300 hover:text-primary-900'
        }
      `}
    >
      <Icon className="w-5 h-5" />
      {name}
    </Link>
  );
};

export default memo(NavItem);