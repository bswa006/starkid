import { useEffect, useState } from "react";
import { Users, BookOpen, CheckCircle, TrendingUp } from "lucide-react";
import { studentService } from "@/services/student.service";
import { assignmentService } from "@/services/assignment.service";
import { attendanceService } from "@/services/attendance.service";
import { quizService } from "@/services/quiz.service";

interface StatsData {
  totalStudents: number;
  activeAssignments: number;
  attendanceRate: number;
  averageScore: number;
  loading: boolean;
}

export function DashboardStats() {
  const [stats, setStats] = useState<StatsData>({
    totalStudents: 0,
    activeAssignments: 0,
    attendanceRate: 0,
    averageScore: 0,
    loading: true,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch total students
        const students = await studentService.getAll();

        // Fetch active assignments
        const assignments = await assignmentService.getAll();
        const activeAssignments = assignments.filter(
          (a) => a.status === "published" || a.status === "submitted"
        ).length;

        // Calculate attendance rate
        let attendanceRate = 0;
        if (students.length > 0) {
          const attendancePromises = students.map((s) =>
            attendanceService.getStudentAttendanceStats(s.id)
          );
          const attendanceStats = await Promise.all(attendancePromises);
          const totalPresent = attendanceStats.reduce(
            (sum, stat) => sum + stat.present,
            0
          );
          const totalDays = attendanceStats.reduce(
            (sum, stat) => sum + stat.total,
            0
          );
          attendanceRate = totalDays > 0 ? (totalPresent / totalDays) * 100 : 0;
        }

        // Calculate average quiz score
        let averageScore = 0;
        if (students.length > 0) {
          const quizPromises = students.map((s) =>
            quizService.getStudentQuizStats(s.id)
          );
          const quizStats = await Promise.all(quizPromises);
          const validScores = quizStats.filter((s) => s.totalQuizzes > 0);
          if (validScores.length > 0) {
            averageScore =
              validScores.reduce((sum, stat) => sum + stat.averageScore, 0) /
              validScores.length;
          }
        }

        setStats({
          totalStudents: students.length,
          activeAssignments,
          attendanceRate,
          averageScore,
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Students",
      value: stats.totalStudents.toString(),
      change: "",
      icon: <Users className="h-5 w-5" />,
      loading: stats.loading,
    },
    {
      title: "Active Assignments",
      value: stats.activeAssignments.toString(),
      change: "",
      icon: <BookOpen className="h-5 w-5" />,
      loading: stats.loading,
    },
    {
      title: "Attendance Rate",
      value: `${stats.attendanceRate.toFixed(1)}%`,
      change: "",
      icon: <CheckCircle className="h-5 w-5" />,
      loading: stats.loading,
    },
    {
      title: "Average Score",
      value: `${stats.averageScore.toFixed(1)}%`,
      change: "",
      icon: <TrendingUp className="h-5 w-5" />,
      loading: stats.loading,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="rounded-xl border bg-card text-card-foreground shadow"
        >
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">{stat.title}</h3>
            <div className="h-8 w-8 rounded-full bg-primary/10 p-2 text-primary">
              {stat.icon}
            </div>
          </div>
          <div className="p-6 pt-0">
            {stat.loading ? (
              <div className="h-7 w-16 animate-pulse rounded bg-gray-200" />
            ) : (
              <div className="text-2xl font-bold">{stat.value}</div>
            )}
            {stat.change && (
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
