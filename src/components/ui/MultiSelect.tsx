import * as React from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from './Command';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';
import { Badge } from './Badge';
import { X, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

export interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Select items...',
  className,
  disabled = false,
  error,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const selectedOptions = options.filter((option) => selected.includes(option.value));
  const filteredOptions = options.filter((option) => 
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = React.useCallback((value: string) => {
    const isSelected = selected.includes(value);
    onChange(
      isSelected
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    );
  }, [onChange, selected]);

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            className={cn(
              'relative flex min-h-[3rem] w-full cursor-pointer items-center rounded-xl border border-border bg-surface px-4 py-2 text-text-primary transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-error focus-within:border-error focus-within:ring-error/20',
              className
            )}
            onClick={() => setOpen(!open)}
          >
            <div className="flex flex-wrap gap-1.5 py-1">
              {selectedOptions.length > 0 ? (
                selectedOptions.map((option) => (
                  <Badge
                    key={option.value}
                    variant="secondary"
                    className="bg-[#6B7FE3]/10 text-[#6B7FE3] hover:bg-[#6B7FE3]/20 transition-colors px-2 py-0.5 rounded-md flex items-center gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(option.value);
                    }}
                  >
                    {option.label}
                    <button
                      type="button"
                      className="ml-1 focus:outline-none"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSelect(option.value);
                      }}
                    >
                      <X className="h-3.5 w-3.5 hover:text-[#5A6ED0]" />
                    </button>
                  </Badge>
                ))
              ) : (
                <span className="text-slate-500 px-1">{placeholder}</span>
              )}
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 shadow-lg" align="start" side="bottom">
          <Command shouldFilter={false} className="border rounded-lg overflow-hidden">
            <CommandInput 
              placeholder="Search..." 
              className="h-11 px-3 border-b" 
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandEmpty className="py-3 text-sm text-slate-500 text-center">
              No options found.
            </CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto p-1">
              {filteredOptions.map((option) => {
                const isSelected = selected.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    className={cn(
                      'w-full text-left text-sm rounded-md cursor-pointer px-2 py-1.5 transition-colors',
                      isSelected ? 'bg-slate-100' : 'hover:bg-slate-50'
                    )}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSelect(option.value);
                    }}
                  >
                    <div className="flex items-center gap-2 w-full select-none">
                      <div 
                        className={cn(
                          'flex h-4 w-4 items-center justify-center rounded border transition-colors',
                          isSelected
                            ? 'border-[#6B7FE3] bg-[#6B7FE3] text-white'
                            : 'border-slate-300 hover:border-[#6B7FE3]'
                        )}
                      >
                        <Check className={cn('h-3 w-3', isSelected ? 'opacity-100' : 'opacity-0')} />
                      </div>
                      <span className="flex-1">{option.label}</span>
                    </div>
                  </button>
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
