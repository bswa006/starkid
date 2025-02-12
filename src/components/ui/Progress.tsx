import { HTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const progressVariants = cva(
  'relative w-full overflow-hidden rounded-full bg-surface-hover',
  {
    variants: {
      size: {
        default: 'h-2',
        sm: 'h-1',
        lg: 'h-3',
      },
      variant: {
        default: '[&>div]:bg-primary',
        secondary: '[&>div]:bg-secondary',
        accent: '[&>div]:bg-accent',
        success: '[&>div]:bg-success',
        warning: '[&>div]:bg-warning',
        error: '[&>div]:bg-error',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
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
  ({ className, value = 0, max = 100, size, variant, ...props }, ref) => {
    const percentage = (value / max) * 100;

    return (
      <div
        ref={ref}
        className={cn(progressVariants({ size, variant, className }))}
        {...props}
      >
        <div
          className="h-full w-full flex-1 transition-all"
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export { Progress, progressVariants };
