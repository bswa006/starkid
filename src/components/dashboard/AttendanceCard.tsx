import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Clock } from 'lucide-react';

interface AttendanceCardProps {
  attendance: {
    date: string;
    checkIn?: string;
    checkOut?: string;
    status: 'present' | 'absent' | 'late';
  };
}

export function AttendanceCard({ attendance }: AttendanceCardProps) {
  const statusVariants = {
    present: 'success',
    absent: 'error',
    late: 'warning',
  } as const;

  const statusLabels = {
    present: 'Present',
    absent: 'Absent',
    late: 'Late',
  } as const;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{attendance.date}</CardTitle>
          <Badge variant={statusVariants[attendance.status]}>
            {statusLabels[attendance.status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {attendance.checkIn && (
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="h-4 w-4 text-text-tertiary" />
              <span className="text-text-secondary">Check-in:</span>
              <span className="font-medium text-text-primary">{attendance.checkIn}</span>
            </div>
          )}
          {attendance.checkOut && (
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="h-4 w-4 text-text-tertiary" />
              <span className="text-text-secondary">Check-out:</span>
              <span className="font-medium text-text-primary">{attendance.checkOut}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
