import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';

interface StudentCardProps {
  student: {
    id: string;
    name: string;
    grade: string;
    section: string;
    avatar?: string;
    attendance: number;
    performance: number;
  };
}

export function StudentCard({ student }: StudentCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <Avatar src={student.avatar} alt={student.name} size="xl" />
            <div>
              <CardTitle className="text-lg">{student.name}</CardTitle>
              <div className="mt-1 flex items-center space-x-2">
                <Badge variant="secondary">Grade {student.grade}</Badge>
                <Badge variant="outline">Section {student.section}</Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-text-secondary">Attendance</span>
              <span className="font-medium text-text-primary">{student.attendance}%</span>
            </div>
            <Progress value={student.attendance} variant={student.attendance >= 75 ? 'success' : 'warning'} />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-text-secondary">Performance</span>
              <span className="font-medium text-text-primary">{student.performance}%</span>
            </div>
            <Progress value={student.performance} variant="primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
