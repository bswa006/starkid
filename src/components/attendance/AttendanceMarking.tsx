import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { attendanceService } from "@/services/attendance.service";
import { studentService } from "@/services/student.service";
import type {
  AttendanceRecord,
  AttendanceStatus,
  Student,
} from "@/types/school";
import toast from "@/utils/toast";
import { Calendar, Check, Clock, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";

interface AttendanceMarkingProps {
  classId: string;
  date: Date;
  onComplete?: () => void;
}

export function AttendanceMarking({
  classId,
  date,
  onComplete,
}: AttendanceMarkingProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<
    Record<string, AttendanceStatus>
  >({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userProfile } = useAuth();

  useEffect(() => {
    async function fetchStudents() {
      setLoading(true);
      setError(null);
      try {
        const [classStudents, existingAttendance] = await Promise.all([
          studentService.getByClass(classId),
          attendanceService.getByDateAndClass(date, classId),
        ]);

        if (!classStudents.length) {
          setError("No students found in this class");
          return;
        }

        setStudents(classStudents);

        // Get existing attendance records
        const attendanceMap: Record<string, AttendanceStatus> = {};
        existingAttendance.forEach((attendance) => {
          attendance.records.forEach((record) => {
            attendanceMap[record.studentId] = record.status;
          });
        });
        setAttendance(attendanceMap);
      } catch (error) {
        console.error("Error fetching students:", error);
        setError("Failed to load students and attendance records");
        toast.error("Failed to load attendance data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, [classId, date]);

  const handleMarkAttendance = (
    studentId: string,
    status: AttendanceStatus
  ) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSave = async () => {
    if (!userProfile) {
      toast.error("You must be logged in to mark attendance");
      return;
    }

    if (Object.keys(attendance).length === 0) {
      toast.error("Please mark attendance for at least one student");
      return;
    }

    setSaving(true);
    try {
      const records: Omit<AttendanceRecord, "id">[] = Object.entries(
        attendance
      ).map(([studentId, status]) => ({
        studentId,
        classId,
        date,
        status,
        markedBy: userProfile.id,
        markedAt: new Date(),
        notes: "",
      }));

      // Optimistically update UI
      const previousAttendance = { ...attendance };

      try {
        // First, get existing records to determine which to update vs create
        const existingRecords = await attendanceService.getByDateAndClass(
          date,
          classId
        );
        const existingMap = new Map(
          existingRecords.flatMap((attendance) =>
            attendance.records.map((record) => [
              record.studentId,
              attendance.id,
            ])
          )
        );

        await Promise.all(
          records.map(async (record) => {
            const existingId = existingMap.get(record.studentId);
            if (existingId) {
              return attendanceService.update(existingId, {
                records: [record],
                updatedAt: new Date(),
              });
            } else {
              return attendanceService.create({
                classId,
                date,
                records: [record],
                markedBy: userProfile?.id || "",
                markedAt: new Date(),
                updatedAt: new Date(),
              });
            }
          })
        );

        toast.success("Attendance saved successfully");
        onComplete?.();
      } catch (error) {
        // Revert optimistic update on error
        setAttendance(previousAttendance);
        throw error;
      }
    } catch (error) {
      console.error("Error saving attendance:", error);
      toast.error("Failed to save attendance. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-gray-500">Loading attendance records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <p className="text-sm text-red-500">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          size="sm"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Mark Attendance</h3>
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>{date.toLocaleDateString()}</span>
        </div>
      </div>

      <div className="space-y-2">
        {students.map((student) => (
          <div
            key={student.id}
            className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
          >
            <div>
              <p className="font-medium">
                {student.firstName} {student.lastName}
              </p>
              <p className="text-sm text-gray-500">ID: {student.id}</p>
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant={
                  attendance[student.id] === "present" ? "primary" : "outline"
                }
                onClick={() => handleMarkAttendance(student.id, "present")}
                className={cn(
                  "transition-colors",
                  attendance[student.id] === "present"
                    ? "bg-green-500 hover:bg-green-600"
                    : ""
                )}
              >
                <Check className="w-4 h-4 mr-1" />
                Present
              </Button>
              <Button
                size="sm"
                variant={
                  attendance[student.id] === "absent" ? "danger" : "outline"
                }
                onClick={() => handleMarkAttendance(student.id, "absent")}
                className={cn(
                  "transition-colors",
                  attendance[student.id] === "absent"
                    ? "bg-red-500 hover:bg-red-600"
                    : ""
                )}
              >
                <X className="w-4 h-4 mr-1" />
                Absent
              </Button>
              <Button
                size="sm"
                variant={
                  attendance[student.id] === "late" ? "primary" : "outline"
                }
                onClick={() => handleMarkAttendance(student.id, "late")}
                className={cn(
                  "transition-colors",
                  attendance[student.id] === "late"
                    ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                    : ""
                )}
              >
                <Clock className="w-4 h-4 mr-1" />
                Late
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-4">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full sm:w-auto"
        >
          {saving ? "Saving..." : "Save Attendance"}
        </Button>
      </div>
    </div>
  );
}
