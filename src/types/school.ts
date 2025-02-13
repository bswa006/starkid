export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subjects: string[];
  qualifications: string[];
  department: string;
  classes: string[];
  joinDate: string;
  status: 'active' | 'inactive';
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  rollNumber: string;
  grade: string;
  section: string;
  email: string;
  phone: string;
  address: string;
  parentName: string;
  parentPhone: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
  class: string;
  teacherIds: string[];
  teacherNames: string[];
  credits: number;
  grade: string;
  schedule: string;
  status: 'active' | 'inactive';
}

export interface Class {
  id: string;
  name: string;
  section: string;
  academicYear: string;
  classTeacherId: string;
  subjects: string[];
  status: 'active' | 'inactive';
}

export type AssignmentStatus = 'draft' | 'published' | 'submitted' | 'graded' | 'late' | 'missing';

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  teacherId: string;
  studentId?: string;
  class: string;
  section: string;
  dueDate: Date;
  points: number;
  score?: number;
  attachments?: string[];
  status: AssignmentStatus;
  feedback?: string;
  submittedAt?: Date;
  gradedAt?: Date;
  createdAt: Date;
}

export type AttendanceStatus = 'present' | 'absent' | 'late';

export interface Attendance {
  id: string;
  studentId: string;
  date: Date;
  status: AttendanceStatus;
  subject?: string;
  notes?: string;
  recordedBy: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  teacherId: string;
  class: string;
  section: string;
  duration: number; // in minutes
  totalPoints: number;
  questions: QuizQuestion[];
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'published' | 'closed';
  createdAt: Date;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  correctAnswer: string | string[];
  points: number;
}

export interface QuizResult {
  id: string;
  quizId: string;
  studentId: string;
  answers: {
    questionId: string;
    answer: string | string[];
  }[];
  score: number;
  timeSpent: number; // in seconds
  submittedAt: Date;
}

export type TimelineEventType = 
  | 'assignment_created'
  | 'assignment_submitted'
  | 'assignment_graded'
  | 'quiz_started'
  | 'quiz_completed'
  | 'attendance_marked'
  | 'grade_updated'
  | 'note_added';

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  description: string;
  studentId?: string;
  teacherId?: string;
  subjectId?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}
