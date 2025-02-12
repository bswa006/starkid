export interface User {
  id: string;
  email: string;
  role: 'parent' | 'teacher' | 'admin';
  name: string;
  profilePicture?: string;
}

export interface Student {
  id: string;
  name: string;
  class: string;
  section: string;
  rollNumber: string;
  parentId: string;
  attendance: Record<string, boolean>;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  subjects: string[];
  classes: string[];
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  class: string;
  dueDate: string;
  teacherId: string;
  attachments?: string[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'academic' | 'cultural' | 'sports' | 'other';
  images?: string[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
  targetAudience: ('parents' | 'teachers' | 'all')[];
}

export interface Fee {
  id: string;
  studentId: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  type: string;
  paymentId?: string;
}
