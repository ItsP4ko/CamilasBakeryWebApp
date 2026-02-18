import { jsx as _jsx } from "react/jsx-runtime";
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/config/ThemeContext';
import { motion } from 'framer-motion';
export const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    return (_jsx(motion.button, { onClick: toggleTheme, whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, className: "p-2 rounded-lg border-2 border-primary-300 dark:border-primary-600 bg-white dark:bg-primary-800 hover:bg-primary-50 dark:hover:bg-primary-700 transition-colors", "aria-label": "Toggle theme", children: theme === 'light' ? (_jsx(Sun, { className: "w-5 h-5 text-primary-700 dark:text-primary-300" })) : (_jsx(Moon, { className: "w-5 h-5 text-primary-700 dark:text-primary-300" })) }));
};
