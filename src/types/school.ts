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

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  teacherId: string;
  class: string;
  section: string;
  dueDate: string;
  points: number;
  attachments?: string[];
  status: 'draft' | 'published' | 'closed';
  createdAt: string;
}
