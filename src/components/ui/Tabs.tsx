import { HTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const tabsListVariants = cva(
  'inline-flex items-center justify-center rounded-xl p-1',
  {
    variants: {
      variant: {
        default: 'bg-surface-hover',
        ghost: 'bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const tabsTriggerVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'data-[state=active]:bg-surface data-[state=active]:text-text-primary data-[state=active]:shadow-sm',
        ghost: 'hover:bg-surface-hover hover:text-text-primary data-[state=active]:bg-surface-hover data-[state=active]:text-text-primary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface TabsListProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tabsListVariants> {}

export interface TabsTriggerProps
  extends HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof tabsTriggerVariants> {
  value: string;
  disabled?: boolean;
}

const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(tabsListVariants({ variant, className }))}
      {...props}
    />
  )
);
TabsList.displayName = 'TabsList';

const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, variant, value, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(tabsTriggerVariants({ variant, className }))}
      {...props}
      role="tab"
      data-value={value}
      data-disabled={disabled ? '' : undefined}
      disabled={disabled}
      tabIndex={disabled ? -1 : 0}
    />
  )
);
TabsTrigger.displayName = 'TabsTrigger';

const TabsContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
      {...props}
    />
  )
);
TabsContent.displayName = 'TabsContent';

export { TabsList, TabsTrigger, TabsContent };
