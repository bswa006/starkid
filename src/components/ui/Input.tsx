import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string | boolean;
  icon?: LucideIcon;
  label?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, type, icon: Icon, label, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-secondary mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
          )}
          <input
            type={type}
            className={cn(
              'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary',
              Icon && 'pl-10',
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {typeof error === 'string' && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
        {!error && helperText && (
          <p className="mt-1 text-sm text-text-secondary">{helperText}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
