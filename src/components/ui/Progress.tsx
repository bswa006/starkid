import { HTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const progressVariants = cva(
  'relative w-full overflow-hidden rounded-full transition-all duration-300',
  {
    variants: {
      size: {
        xs: 'h-1',
        sm: 'h-1.5',
        default: 'h-2',
        lg: 'h-3',
        xl: 'h-4',
      },
      variant: {
        primary: '[&>div]:bg-[#6B7FE3] bg-[#6B7FE3]/20',
        secondary: '[&>div]:bg-[#A78BFA] bg-[#A78BFA]/20',
        accent: '[&>div]:bg-[#FFB86C] bg-[#FFB86C]/20',
        highlight: '[&>div]:bg-[#FF7EB6] bg-[#FF7EB6]/20',
        success: '[&>div]:bg-emerald-500 bg-emerald-100',
        warning: '[&>div]:bg-amber-500 bg-amber-100',
        error: '[&>div]:bg-rose-500 bg-rose-100',
      },
      animation: {
        true: '[&>div]:animate-progress',
      }
    },
    defaultVariants: {
      size: 'default',
      variant: 'primary',
      animation: false,
    },
  }
);

export interface ProgressProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {
  value?: number;
  max?: number;
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ 
    className, 
    value = 0, 
    max = 100, 
    size, 
    variant,
    animation = false,
    ...props 
  }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        className={cn(progressVariants({ size, variant, animation, className }))}
        {...props}
      >
        <div
          className={cn(
            'h-full flex-1 transition-all duration-300 ease-in-out',
            animation && 'origin-left'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export { Progress, progressVariants };
