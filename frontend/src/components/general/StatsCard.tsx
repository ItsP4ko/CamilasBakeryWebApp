import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: 'primary' | 'green' | 'blue' | 'orange' | 'purple' | 'red';
  delay?: number;
  href?: string;  
  onClick?: () => void;  
}

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

const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  icon: Icon,
  iconColor = 'primary',
  delay = 0,
  href,
  onClick,
}) => {
  const colors = colorClasses[iconColor];
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      navigate(href);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={handleClick}
      className="bg-primary-200 dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl border border-primary-200 dark:border-gray-700 p-4 sm:p-6 transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <div className={`p-2 sm:p-3 ${colors.bg} dark:opacity-90 rounded-lg flex-shrink-0`}>
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${colors.text}`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm text-primary-600 dark:text-gray-400 truncate">{label}</p>
          <p className="text-lg sm:text-2xl font-bold text-primary-900 dark:text-white">{value}</p>
        </div>
      </div>
    </motion.div>
  );
};


export default memo(StatsCard);
