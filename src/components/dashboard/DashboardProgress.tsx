import { useEffect, useState } from 'react';
import { assignmentService } from '@/services/assignment.service';
import { quizService } from '@/services/quiz.service';
import { attendanceService } from '@/services/attendance.service';
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/Progress';

interface ProgressStats {
  assignments: {
    completed: number;
    total: number;
    percentage: number;
  };
  quizzes: {
    completed: number;
    total: number;
    percentage: number;
    averageScore: number;
  };
  attendance: {
    present: number;
    total: number;
    percentage: number;
  };
}

export function DashboardProgress() {
  const [stats, setStats] = useState<ProgressStats>({
    assignments: { completed: 0, total: 0, percentage: 0 },
    quizzes: { completed: 0, total: 0, percentage: 0, averageScore: 0 },
    attendance: { present: 0, total: 0, percentage: 0 },
  });
  const [loading, setLoading] = useState(true);
  const { userProfile } = useAuth();

  useEffect(() => {
    async function fetchStats() {
      try {
        if (!userProfile) return;

        // For students, fetch their specific progress
        if (userProfile.role === 'student') {
          const [assignments, quizResults, attendanceStats] = await Promise.all([
            assignmentService.getByStudent(userProfile.id),
            quizService.getStudentQuizResults(userProfile.id),
            attendanceService.getStudentAttendanceStats(userProfile.id),
          ]);

          const completedAssignments = assignments.filter(
            a => a.status === 'submitted' || a.status === 'graded'
          ).length;

          setStats({
            assignments: {
              completed: completedAssignments,
              total: assignments.length,
              percentage: assignments.length > 0 
                ? (completedAssignments / assignments.length) * 100 
                : 0,
            },
            quizzes: {
              completed: quizResults.length,
              total: quizResults.length, // This should ideally be total available quizzes
              percentage: 100, // This needs to be calculated based on total available quizzes
              averageScore: quizResults.reduce((sum, r) => sum + r.score, 0) / quizResults.length || 0,
            },
            attendance: {
              present: attendanceStats.present,
              total: attendanceStats.total,
              percentage: attendanceStats.total > 0 
                ? (attendanceStats.present / attendanceStats.total) * 100 
                : 0,
            },
          });
        }
        // For teachers, show class-wide progress
        else if (userProfile.role === 'teacher') {
          const assignments = await assignmentService.getAll();
          const completedAssignments = assignments.filter(
            a => a.status === 'submitted' || a.status === 'graded'
          ).length;

          setStats({
            assignments: {
              completed: completedAssignments,
              total: assignments.length,
              percentage: assignments.length > 0 
                ? (completedAssignments / assignments.length) * 100 
                : 0,
            },
            quizzes: {
              completed: 0, // Need to implement class-wide quiz stats
              total: 0,
              percentage: 0,
              averageScore: 0,
            },
            attendance: {
              present: 0, // Need to implement class-wide attendance stats
              total: 0,
              percentage: 0,
            },
          });
        }
      } catch (error) {
        console.error('Error fetching progress stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [userProfile]);

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-1/4 bg-gray-100 rounded animate-pulse" />
            <div className="h-2 bg-gray-100 rounded animate-pulse" />
            <div className="flex justify-between">
              <div className="h-3 w-12 bg-gray-100 rounded animate-pulse" />
              <div className="h-3 w-12 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between">
          <h3 className="text-sm font-medium">Assignments Progress</h3>
          <span className="text-sm text-muted-foreground">
            {stats.assignments.completed}/{stats.assignments.total}
          </span>
        </div>
        <Progress value={stats.assignments.percentage} className="h-2" />
        <p className="text-xs text-muted-foreground">
          {stats.assignments.percentage.toFixed(1)}% completed
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <h3 className="text-sm font-medium">Quiz Performance</h3>
          <span className="text-sm text-muted-foreground">
            Avg. {stats.quizzes.averageScore.toFixed(1)}%
          </span>
        </div>
        <Progress value={stats.quizzes.averageScore} className="h-2" />
        <p className="text-xs text-muted-foreground">
          {stats.quizzes.completed} quizzes completed
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <h3 className="text-sm font-medium">Attendance Rate</h3>
          <span className="text-sm text-muted-foreground">
            {stats.attendance.present}/{stats.attendance.total}
          </span>
        </div>
        <Progress value={stats.attendance.percentage} className="h-2" />
        <p className="text-xs text-muted-foreground">
          {stats.attendance.percentage.toFixed(1)}% attendance rate
        </p>
      </div>
    </div>
  );
}
