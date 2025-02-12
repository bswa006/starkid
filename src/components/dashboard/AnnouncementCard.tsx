import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { Calendar } from 'lucide-react';

interface AnnouncementCardProps {
  announcement: {
    id: string;
    title: string;
    content: string;
    date: string;
    category: 'general' | 'exam' | 'event' | 'holiday';
    author: {
      name: string;
      avatar?: string;
      role: string;
    };
  };
}

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  const categoryVariants = {
    general: 'default',
    exam: 'error',
    event: 'accent',
    holiday: 'secondary',
  } as const;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <Badge variant={categoryVariants[announcement.category]}>
              {announcement.category.charAt(0).toUpperCase() + announcement.category.slice(1)}
            </Badge>
            <CardTitle className="text-base">{announcement.title}</CardTitle>
          </div>
          <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <Calendar className="h-4 w-4" />
            <span>{announcement.date}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">{announcement.content}</p>
          <div className="flex items-center space-x-3">
            <Avatar
              src={announcement.author.avatar}
              alt={announcement.author.name}
              size="sm"
            />
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-text-primary">
                {announcement.author.name}
              </p>
              <p className="text-xs text-text-tertiary">{announcement.author.role}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
