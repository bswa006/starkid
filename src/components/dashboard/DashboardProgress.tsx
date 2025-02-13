import { useEffect, useState } from "react";
import { assignmentService } from "@/services/assignment.service";
import { quizService } from "@/services/quiz.service";
import { attendanceService } from "@/services/attendance.service";
import { useAuth } from "@/contexts/AuthContext";
import { Progress } from "@/components/ui/Progress";
import { Quiz } from "@/types/school";

interface ProgressStats {
  assignments: {
    completed: number;
    total: number;
    percentage: number;
    pending: number;
    overdue: number;
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
    late: number;
    excused: number;
  };
}

export function DashboardProgress() {
  const [stats, setStats] = useState<ProgressStats>({
    assignments: {
      completed: 0,
      total: 0,
      percentage: 0,
      pending: 0,
      overdue: 0,
    },
    quizzes: { completed: 0, total: 0, percentage: 0, averageScore: 0 },
    attendance: { present: 0, total: 0, percentage: 0, late: 0, excused: 0 },
  });

  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        if (!userProfile) return;

        // For teachers and admins, show class-wide progress
        if (userProfile.role === "teacher" || userProfile.role === "admin") {
          const [assignments, quizzes, attendanceRecords] = await Promise.all([
            assignmentService.getAll(),
            quizService.getAllQuizzes(),
            attendanceService.getByTeacher(userProfile.id),
          ]);

          const completedAssignments = assignments.filter(
            (a) => a.status === "submitted" || a.status === "graded"
          ).length;

          const overdueAssignments = assignments.filter(
            (a) => new Date(a.dueDate) < new Date() && a.status === "draft"
          ).length;

          const pendingAssignments = assignments.filter(
            (a) => a.status === "draft"
          ).length;

          // Calculate quiz statistics
          const completedQuizzes = quizzes.filter(
            (q: Quiz) => q.status === "closed"
          ).length;

          let averageQuizScore = 0;
          let scores: number[] = [];

          // Only fetch quiz results if classId is available
          if (userProfile.classId) {
            const quizResults = await quizService.getQuizResults(
              userProfile.classId
            );
            scores = quizResults
              .flatMap((r) => r.results.map((result) => result.score))
              .filter((score) => typeof score === "number");
            averageQuizScore =
              scores.length > 0
                ? scores.reduce((a, b) => a + b, 0) / scores.length
                : 0;
          }

          // Calculate attendance statistics from attendance records
          const allAttendanceRecords = attendanceRecords.flatMap(
            (record) => record.records || []
          );
          const totalRecords = allAttendanceRecords.length;
          const presentRecords = allAttendanceRecords.filter(
            (record) => record.status === "present"
          ).length;
          const lateRecords = allAttendanceRecords.filter(
            (record) => record.status === "late"
          ).length;
          const absentRecords = totalRecords - presentRecords - lateRecords;

          setStats({
            assignments: {
              completed: completedAssignments,
              total: assignments.length,
              percentage:
                assignments.length > 0
                  ? (completedAssignments / assignments.length) * 100
                  : 0,
              pending: pendingAssignments,
              overdue: overdueAssignments,
            },
            quizzes: {
              completed: completedQuizzes,
              total: quizzes.length,
              percentage:
                quizzes.length > 0
                  ? (completedQuizzes / quizzes.length) * 100
                  : 0,
              averageScore: averageQuizScore,
            },
            attendance: {
              present: presentRecords,
              total: totalRecords,
              percentage:
                totalRecords > 0 ? (presentRecords / totalRecords) * 100 : 0,
              late: lateRecords,
              excused: absentRecords, // Using absent records as excused since we don't track excused separately
            },
          });
        }
      } catch (error) {
        console.error("Error fetching progress stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [userProfile]);

  if (loading) {
    return (
      <div className="space-y-6 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-4 w-1/3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded animate-pulse" />
            <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded animate-pulse" />
            <div className="flex justify-between">
              <div className="h-3 w-16 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded animate-pulse" />
              <div className="h-3 w-16 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
      <div className="space-y-3 transform transition-all duration-200 hover:translate-x-1">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Assignments Progress</h3>
          </div>
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {stats.assignments.completed}/{stats.assignments.total}
          </span>
        </div>
        <Progress value={stats.assignments.percentage} className="h-2.5 bg-blue-100 dark:bg-blue-900">
          <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-in-out" style={{ width: `${stats.assignments.percentage}%` }} />
        </Progress>
        <div className="flex justify-between text-xs">
          <span className="text-gray-600 dark:text-gray-400">{stats.assignments.percentage.toFixed(1)}% completed</span>
          <span className="text-gray-500 dark:text-gray-500">{stats.assignments.pending} pending</span>
        </div>
      </div>

      <div className="space-y-3 transform transition-all duration-200 hover:translate-x-1">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Quiz Performance</h3>
          </div>
          <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
            Avg. {stats.quizzes.averageScore.toFixed(1)}%
          </span>
        </div>
        <Progress value={stats.quizzes.averageScore} className="h-2.5 bg-purple-100 dark:bg-purple-900">
          <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500 ease-in-out" style={{ width: `${stats.quizzes.averageScore}%` }} />
        </Progress>
        <div className="flex justify-between text-xs">
          <span className="text-gray-600 dark:text-gray-400">{stats.quizzes.completed} quizzes completed</span>
          <span className="text-gray-500 dark:text-gray-500">{stats.quizzes.total - stats.quizzes.completed} remaining</span>
        </div>
      </div>

      <div className="space-y-3 transform transition-all duration-200 hover:translate-x-1">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-green-600">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Attendance Rate</h3>
          </div>
          <span className="text-sm font-medium text-green-600 dark:text-green-400">
            {stats.attendance.present}/{stats.attendance.total}
          </span>
        </div>
        <Progress value={stats.attendance.percentage} className="h-2.5 bg-green-100 dark:bg-green-900">
          <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500 ease-in-out" style={{ width: `${stats.attendance.percentage}%` }} />
        </Progress>
        <div className="flex justify-between text-xs">
          <span className="text-gray-600 dark:text-gray-400">{stats.attendance.percentage.toFixed(1)}% attendance rate</span>
          <span className="text-gray-500 dark:text-gray-500">{stats.attendance.late} late arrivals</span>
        </div>
      </div>
    </div>
  );
}
