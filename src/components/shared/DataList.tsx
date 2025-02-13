import { useState } from 'react';
import { Search, Plus, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface DataListProps<T> {
  title: string;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  onAddNew: () => void;
  onItemClick: (item: T) => void;
  searchPlaceholder?: string;
  searchFields: (keyof T)[];
}

export function DataList<T>({
  title,
  items,
  renderItem,
  onAddNew,
  onItemClick,
  searchPlaceholder = 'Search...',
  searchFields,
}: DataListProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = items.filter((item) => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return searchFields.some((field) => {
      const value = item[field];
      return String(value).toLowerCase().includes(searchLower);
    });
  });

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border/10 bg-background/40">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-text-primary">
            {title}
          </CardTitle>
          <Button
            onClick={onAddNew}
            className="bg-primary text-white hover:bg-primary/90"
          >
            <Plus size={20} className="mr-2" />
            Add New
          </Button>
        </div>
        <div className="mt-4">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
            />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/10">
          {filteredItems.map((item, index) => (
            <button
              key={index}
              onClick={() => onItemClick(item)}
              className="w-full group p-4 flex items-center justify-between hover:bg-background/50 transition-colors"
            >
              <div className="flex-1">{renderItem(item)}</div>
              <ChevronRight
                size={20}
                className="text-text-tertiary group-hover:text-primary transition-colors"
              />
            </button>
          ))}
          {filteredItems.length === 0 && (
            <div className="py-8 text-center text-text-secondary">
              No items found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
