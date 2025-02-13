export interface Assignment {
  id: string;
  title: string;
  description: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  attachments?: string[]; // URLs to attached files
  maxPoints?: number;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  submittedAt: Date;
  status: 'submitted' | 'late' | 'graded';
  attachments?: string[]; // URLs to submitted files
  grade?: number;
  feedback?: string;
  gradedBy?: string; // teacher's ID
  gradedAt?: Date;
}
