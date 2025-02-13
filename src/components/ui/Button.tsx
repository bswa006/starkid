import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none uppercase tracking-wide',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary-hover focus:ring-primary/20 shadow-md hover:shadow-lg transform hover:-translate-y-0.5',
        secondary: 'bg-secondary text-white hover:bg-secondary-hover focus:ring-secondary/20 shadow-md hover:shadow-lg transform hover:-translate-y-0.5',
        accent: 'bg-accent text-white hover:bg-accent-hover focus:ring-accent/20 shadow-md hover:shadow-lg transform hover:-translate-y-0.5',
        highlight: 'bg-highlight text-white hover:bg-highlight-hover focus:ring-highlight/20 shadow-md hover:shadow-lg transform hover:-translate-y-0.5',
        outline: 'border-2 border-primary text-primary hover:bg-primary-light focus:ring-primary/20',
        ghost: 'text-primary hover:bg-primary-light focus:ring-primary/20',
        danger: 'bg-error text-white hover:bg-error/90 focus:ring-error/20 shadow-md hover:shadow-lg transform hover:-translate-y-0.5',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        default: 'h-10 px-4 py-2 text-sm',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10 p-2',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {props.children}
          </>
        ) : (
          props.children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
