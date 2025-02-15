import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none uppercase tracking-wide',
  {
    variants: {
      variant: {
        primary: 'bg-[rgb(var(--primary))] text-white hover:bg-[rgb(var(--primary-hover))] focus:ring-[rgb(var(--primary)/0.2)] shadow-md hover:shadow-lg transform hover:-translate-y-0.5',
        secondary: 'bg-[rgb(var(--secondary))] text-white hover:bg-[rgb(var(--secondary-hover))] focus:ring-[rgb(var(--secondary)/0.2)] shadow-md hover:shadow-lg transform hover:-translate-y-0.5',
        accent: 'bg-[rgb(var(--accent))] text-white hover:bg-[rgb(var(--accent-hover))] focus:ring-[rgb(var(--accent)/0.2)] shadow-md hover:shadow-lg transform hover:-translate-y-0.5',
        highlight: 'bg-[rgb(var(--highlight))] text-white hover:bg-[rgb(var(--highlight-hover))] focus:ring-[rgb(var(--highlight)/0.2)] shadow-md hover:shadow-lg transform hover:-translate-y-0.5',
        outline: 'border-2 border-[rgb(var(--primary))] text-[rgb(var(--primary))] hover:bg-[rgb(var(--primary-light))] focus:ring-[rgb(var(--primary)/0.2)]',
        ghost: 'text-[rgb(var(--primary))] hover:bg-[rgb(var(--primary-light))] focus:ring-[rgb(var(--primary)/0.2)]',
        danger: 'bg-[rgb(var(--error))] text-white hover:bg-[rgb(var(--error-hover))] focus:ring-[rgb(var(--error)/0.2)] shadow-md hover:shadow-lg transform hover:-translate-y-0.5',
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
