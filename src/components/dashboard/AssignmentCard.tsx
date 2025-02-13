import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { Button } from '../ui/Button';
import { Calendar, Clock, FileText, Upload } from 'lucide-react';

interface AssignmentCardProps {
  assignment: {
    id: string;
    title: string;
    subject: string;
    dueDate: string;
    timeLeft: string;
    progress: number;
    status: 'pending' | 'submitted' | 'late' | 'graded';
  };
  onUpload?: (id: string) => void;
}

export function AssignmentCard({ assignment, onUpload }: AssignmentCardProps) {
  const statusVariants = {
    pending: 'warning',
    submitted: 'success',
    late: 'error',
    graded: 'accent',
  } as const;

  const statusLabels = {
    pending: 'Pending',
    submitted: 'Submitted',
    late: 'Late',
    graded: 'Graded',
  } as const;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{assignment.title}</CardTitle>
            <div className="mt-1">
              <Badge variant="outline">{assignment.subject}</Badge>
            </div>
          </div>
          <Badge variant={statusVariants[assignment.status]}>
            {statusLabels[assignment.status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-text-secondary">
              <Calendar className="h-4 w-4" />
              <span>Due: {assignment.dueDate}</span>
            </div>
            <div className="flex items-center space-x-2 text-text-secondary">
              <Clock className="h-4 w-4" />
              <span>{assignment.timeLeft} left</span>
            </div>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-text-secondary">Progress</span>
              <span className="font-medium text-text-primary">{assignment.progress}%</span>
            </div>
            <Progress value={assignment.progress} variant="primary" />
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {}}
            >
              <FileText className="mr-2 h-4 w-4" />
              View Details
            </Button>
            {assignment.status === 'pending' && (
              <Button
                size="sm"
                className="flex-1"
                onClick={() => onUpload?.(assignment.id)}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
