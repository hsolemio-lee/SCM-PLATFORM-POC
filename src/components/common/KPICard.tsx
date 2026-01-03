import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: number | string;
  suffix?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export default function KPICard({ label, value, suffix = '', trend, trendValue }: KPICardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      case 'neutral':
        return <Minus className="w-4 h-4 text-white/40" />;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-white/40';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-nexprime-dark border border-nexprime-blue/30 rounded-lg p-4"
    >
      <div className="text-white/60 text-sm mb-1">{label}</div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-white">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {suffix && <span className="text-nexprime-cyan text-lg">{suffix}</span>}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 mt-2 text-sm ${getTrendColor()}`}>
          {getTrendIcon()}
          {trendValue && <span>{trendValue}</span>}
        </div>
      )}
    </motion.div>
  );
}
