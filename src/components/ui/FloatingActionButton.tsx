import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const fabVariants = cva(
  'fixed z-50 inline-flex items-center justify-center rounded-full shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transform hover:-translate-y-1 hover:shadow-xl active:translate-y-0',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary-hover focus:ring-primary/20',
        secondary: 'bg-secondary text-white hover:bg-secondary-hover focus:ring-secondary/20',
        accent: 'bg-accent text-white hover:bg-accent-hover focus:ring-accent/20',
        highlight: 'bg-highlight text-white hover:bg-highlight-hover focus:ring-highlight/20',
      },
      size: {
        default: 'h-14 w-14',
        lg: 'h-16 w-16',
      },
      position: {
        'bottom-right': 'bottom-6 right-6',
        'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
        'bottom-left': 'bottom-6 left-6',
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
      position: 'bottom-right',
    },
  }
);

export interface FloatingActionButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof fabVariants> {
  asChild?: boolean;
}

const FloatingActionButton = forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
  ({ className, variant, size, position, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(fabVariants({ variant, size, position, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

FloatingActionButton.displayName = 'FloatingActionButton';

export { FloatingActionButton, fabVariants };
