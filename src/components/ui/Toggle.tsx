import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const toggleVariants = cva(
  'inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-primary data-[state=on]:text-white',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline: 'border border-border bg-transparent hover:bg-surface-hover',
      },
      size: {
        default: 'h-10 px-3',
        sm: 'h-8 px-2',
        lg: 'h-12 px-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ToggleProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof toggleVariants> {
  pressed?: boolean;
}

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, variant, size, pressed, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      data-state={pressed ? 'on' : 'off'}
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
);

Toggle.displayName = 'Toggle';

export { Toggle, toggleVariants };
