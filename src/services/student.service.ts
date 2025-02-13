import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { Student } from '@/types/school';

const COLLECTION_NAME = 'students';

export interface StudentService {
  getAll(): Promise<Student[]>;
  create(student: Omit<Student, 'id'>): Promise<Student>;
  update(id: string, data: Partial<Omit<Student, 'id'>>): Promise<void>;
  delete(id: string): Promise<void>;
  getByTeacher(teacherId: string): Promise<Student[]>;
  getByClass(classId: string): Promise<Student[]>;
}

export const studentService: StudentService = {
  async getAll(): Promise<Student[]> {
    try {
      console.log('Fetching students from collection:', COLLECTION_NAME);
      console.log('DB instance:', db);
      const studentsRef = collection(db, COLLECTION_NAME);
      console.log('Collection reference:', studentsRef);
      
      console.log('Executing getDocs query...');
      const querySnapshot = await getDocs(studentsRef);
      console.log('Query snapshot:', {
        empty: querySnapshot.empty,
        size: querySnapshot.size,
        metadata: querySnapshot.metadata
      });
      
      console.log('Query completed, processing results...');
      const students = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Document data:', { id: doc.id, data });
        return {
          id: doc.id,
          ...data
        };
      }) as Student[];
      
      console.log('Successfully fetched', students.length, 'students');
      return students;
    } catch (error: any) {
      console.error('Error in getAll:', {
        message: error?.message,
        code: error?.code,
        name: error?.name,
        stack: error?.stack
      });
      if (error?.code === 'unavailable' || error?.code === 'permission-denied') {
        throw new Error(`Database error: ${error?.code}. Please ensure the Firestore emulator is running and you have proper permissions.`);
      }
      throw new Error('Failed to fetch students: ' + error?.message);
    }
  },



  async create(student: Omit<Student, 'id'>): Promise<Student> {
    const studentsRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(studentsRef, student);
    return {
      id: docRef.id,
      ...student
    };
  },

  async update(id: string, data: Partial<Omit<Student, 'id'>>): Promise<void> {
    const studentRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(studentRef, data);
  },

  async delete(id: string): Promise<void> {
    const studentRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(studentRef);
  },

  async getByTeacher(teacherId: string): Promise<Student[]> {
    try {
      console.log('Fetching students for teacher:', teacherId);
      const studentsRef = collection(db, COLLECTION_NAME);
      
      console.log('Building query with teacherId filter...');
      const q = query(studentsRef, where('teacherId', '==', teacherId));
      
      console.log('Executing teacher-specific query...');
      const querySnapshot = await getDocs(q);
      console.log('Query snapshot for teacher:', {
        empty: querySnapshot.empty,
        size: querySnapshot.size,
        metadata: querySnapshot.metadata
      });
      
      const students = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Teacher student document:', { id: doc.id, data });
        return {
          id: doc.id,
          ...data
        };
      }) as Student[];
      
      console.log('Successfully fetched', students.length, 'students for teacher');
      return students;
    } catch (error: any) {
      console.error('Error in getByTeacher:', {
        message: error?.message,
        code: error?.code,
        name: error?.name,
        stack: error?.stack
      });
      throw new Error('Failed to fetch students by teacher: ' + error?.message);
    }
  },

  async getByClass(classId: string): Promise<Student[]> {
    const studentsRef = collection(db, COLLECTION_NAME);
    const q = query(studentsRef, where('classId', '==', classId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Student));
  }
};
