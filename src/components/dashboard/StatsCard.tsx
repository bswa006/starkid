import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface StatsCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    timeframe: string;
  };
  icon?: React.ReactNode;
}

const StatsCard = forwardRef<HTMLDivElement, StatsCardProps>(
  ({ className, title, value, trend, icon, ...props }, ref) => {
    const isPositiveTrend = trend ? trend.value > 0 : null;

    return (
      <div
        ref={ref}
        className={cn(
          'group relative overflow-hidden rounded-2xl bg-white p-6 transition-all duration-200',
          'hover:shadow-lg hover:-translate-y-1',
          'border border-gray-100/40',
          className
        )}
        {...props}
      >
        {/* Background decoration */}
        <div className="absolute right-0 top-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-gray-50 transition-transform duration-300 group-hover:scale-110" />

        {/* Icon */}
        {icon && (
          <div className="relative mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary">
            {icon}
          </div>
        )}

        {/* Content */}
        <div className="relative space-y-2">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-semibold text-gray-900">{value}</span>
            {trend && (
              <div
                className={cn(
                  'flex items-center space-x-1 text-sm font-medium',
                  isPositiveTrend ? 'text-emerald-600' : 'text-rose-600'
                )}
              >
                {isPositiveTrend ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>
                  {isPositiveTrend ? '+' : ''}
                  {trend.value}% {trend.timeframe}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

StatsCard.displayName = 'StatsCard';

export { StatsCard };
