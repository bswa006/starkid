import { useEffect, useState } from "react";
import { Users, BookOpen, CheckCircle, TrendingUp } from "lucide-react";
import { studentService } from "@/services/student.service";
import { assignmentService } from "@/services/assignment.service";
import { attendanceService } from "@/services/attendance.service";
import { quizService } from "@/services/quiz.service";
import { useAuth } from "@/contexts/AuthContext";

interface StatsData {
  totalStudents: number;
  activeAssignments: number;
  attendanceRate: number;
  averageScore: number;
  pendingGrading: number;
  upcomingAssignments: number;
  loading: boolean;
  error?: string;
}

export function DashboardStats() {
  const [stats, setStats] = useState<StatsData>({
    totalStudents: 0,
    activeAssignments: 0,
    attendanceRate: 0,
    averageScore: 0,
    pendingGrading: 0,
    upcomingAssignments: 0,
    loading: true,
  });

  const { userProfile } = useAuth();

  useEffect(() => {
    async function fetchStats() {
      try {
        let students: any[] = [];
        let assignments: any[] = [];

        if (userProfile?.role === "admin") {
          // Admin sees all stats
          students = await studentService.getAll();
          assignments = await assignmentService.getAll();
        } else if (userProfile?.role === "teacher") {
          // Teacher sees their class stats
          students = await studentService.getByTeacher(userProfile.id);
          assignments = await assignmentService.getByTeacher(userProfile.id);
        }

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
          pendingGrading: assignments.filter((a) => a.status === "submitted")
            .length,
          upcomingAssignments: assignments.filter((a) => a.status === "draft")
            .length,
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setStats((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "An error occurred while fetching stats",
        }));
      }
    }

    fetchStats();
  }, [userProfile]);

  const statCards = [
    {
      title: "Total Students",
      value: stats.totalStudents.toString(),
      change: "",
      icon: <Users className="h-6 w-6" />,
      loading: stats.loading,
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-400/20",
    },
    {
      title: "Active Assignments",
      value: stats.activeAssignments.toString(),
      change: "",
      icon: <BookOpen className="h-6 w-6" />,
      loading: stats.loading,
      gradient: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-400/20",
    },
    {
      title: "Attendance Rate",
      value: `${stats.attendanceRate.toFixed(1)}%`,
      change: "",
      icon: <CheckCircle className="h-6 w-6" />,
      loading: stats.loading,
      gradient: "from-green-500 to-green-600",
      iconBg: "bg-green-400/20",
    },
    {
      title: "Average Score",
      value: `${stats.averageScore.toFixed(1)}%`,
      change: "",
      icon: <TrendingUp className="h-6 w-6" />,
      loading: stats.loading,
      gradient: "from-orange-500 to-orange-600",
      iconBg: "bg-orange-400/20",
    },
  ];

  return (
    <div className="grid gap-6 grid-cols-2">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.gradient}`}
        >
          <div className="p-6 flex flex-col h-[120px]">
            <div className="flex flex-col gap-0.5">
              <div className="w-5 h-5 text-white mb-1">{stat.icon}</div>
              <h3 className="text-sm text-white/90 leading-none">{stat.title}</h3>
            </div>
            <div className="mt-auto">
              {stat.loading ? (
                <div className="h-8 w-16 animate-pulse rounded bg-white/10" />
              ) : (
                <div className="text-3xl font-semibold text-white leading-none">{stat.value}</div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
