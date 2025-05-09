
import React from 'react';
import { cn } from '@/lib/utils';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: {
    value: number;
    isPositive: boolean;
  };
  chartData?: { value: number }[];
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  change,
  chartData = [],
  className,
}) => {
  const chartColor = change?.isPositive ? '#22C55E' : '#EF4444';

  return (
    <div className={cn('metric-card', className)}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
        {change && (
          <div 
            className={cn(
              'text-sm font-medium px-2 py-1 rounded',
              change.isPositive ? 'text-green-600' : 'text-red-600'
            )}
          >
            {change.isPositive ? '+' : '-'} {Math.abs(change.value)}%
          </div>
        )}
      </div>
      {chartData.length > 0 && (
        <div className="h-12 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={chartColor} 
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#gradient-${title})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
