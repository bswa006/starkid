export interface Attendance {
  id: string;
  studentId: string;
  classId: string;
  date: Date;
  status: 'present' | 'absent' | 'late';
  markedBy: string; // teacher's ID
  markedAt: Date;
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  status: 'present' | 'absent' | 'late';
  notes?: string;
}
