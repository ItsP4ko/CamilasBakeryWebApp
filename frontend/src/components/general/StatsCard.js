import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
const colorClasses = {
    primary: {
        bg: 'bg-primary-100',
        text: 'text-primary-600',
    },
    green: {
        bg: 'bg-green-100',
        text: 'text-green-600',
    },
    blue: {
        bg: 'bg-blue-100',
        text: 'text-blue-600',
    },
    orange: {
        bg: 'bg-orange-100',
        text: 'text-orange-600',
    },
    purple: {
        bg: 'bg-purple-100',
        text: 'text-purple-600',
    },
    red: {
        bg: 'bg-red-100',
        text: 'text-red-600',
    },
};
const StatsCard = ({ label, value, icon: Icon, iconColor = 'primary', delay = 0, href, onClick, }) => {
    const colors = colorClasses[iconColor];
    const navigate = useNavigate();
    const handleClick = () => {
        if (onClick) {
            onClick();
        }
        else if (href) {
            navigate(href);
        }
    };
    return (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay }, whileHover: { y: -4, transition: { duration: 0.2 } }, onClick: handleClick, className: "bg-primary-200 dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl border border-primary-200 dark:border-gray-700 p-4 sm:p-6 transition-all duration-300 cursor-pointer", children: _jsxs("div", { className: "flex items-center gap-3 sm:gap-4", children: [_jsx("div", { className: `p-2 sm:p-3 ${colors.bg} dark:opacity-90 rounded-lg flex-shrink-0`, children: _jsx(Icon, { className: `w-5 h-5 sm:w-6 sm:h-6 ${colors.text}` }) }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("p", { className: "text-xs sm:text-sm text-primary-600 dark:text-gray-400 truncate", children: label }), _jsx("p", { className: "text-lg sm:text-2xl font-bold text-primary-900 dark:text-white", children: value })] })] }) }));
};
export default memo(StatsCard);
