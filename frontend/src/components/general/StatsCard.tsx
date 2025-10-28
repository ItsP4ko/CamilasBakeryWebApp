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
      className="bg-primary-200 rounded-xl shadow-md hover:shadow-xl border border-primary-200 p-6 transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 ${colors.bg} rounded-lg`}>
          <Icon className={`w-6 h-6 ${colors.text}`} />
        </div>
        <div>
          <p className="text-sm text-primary-600">{label}</p>
          <p className="text-2xl font-bold text-primary-900">{value}</p>
        </div>
      </div>
    </motion.div>
  );
};


export default memo(StatsCard);
