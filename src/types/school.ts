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
  classId: string;
  parentId?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
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

export type AssignmentStatus = 'draft' | 'published' | 'submitted' | 'graded' | 'late' | 'missing' | 'completed';

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  teacherId: string;
  classId: string;
  dueDate: Date;
  maxPoints: number;
  attachments?: string[];
  status: AssignmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  studentId: string;
  status: AttendanceStatus;
  notes?: string;
}

import { Timestamp } from 'firebase/firestore';

export interface Attendance {
  id: string;
  classId: string;
  date: Date | Timestamp;
  records: AttendanceRecord[];
  markedBy: string;
  markedAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  teacherId: string;
  classId: string;
  duration: number; // in minutes
  totalPoints: number;
  questions: QuizQuestion[];
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'published' | 'closed';
  createdAt: Date;
  updatedAt: Date;
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
  classId: string;
  results: {
    studentId: string;
    score: number;
    answers: {
      questionId: string;
      answer: string | string[];
    }[];
    timeSpent: number; // in seconds
  }[];
  gradedBy: string;
  gradedAt: Date;
  updatedAt: Date;
}

export type TimelineEventType = 
  | 'assignment_created'
  | 'assignment_graded'
  | 'attendance_marked'
  | 'quiz_published'
  | 'quiz_graded'
  | 'class_announcement';

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  description: string;
  teacherId?: string;
  classId: string;
  subjectId?: string;
  timestamp: Date | Timestamp;
  metadata?: Record<string, any>;
  createdAt: Date | Timestamp;
}
