import { X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

interface DetailViewProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function DetailView({ title, onClose, children }: DetailViewProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border/10 bg-background/40">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-text-primary">
            {title}
          </CardTitle>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-background/80 text-text-secondary hover:text-text-primary transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-6">{children}</CardContent>
    </Card>
  );
}
