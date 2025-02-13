import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { Student } from '@/types/school';

const COLLECTION_NAME = 'students';

export const studentService = {
  async getAll(): Promise<Student[]> {
    try {
      console.log('Fetching students from collection:', COLLECTION_NAME);
      const studentsRef = collection(db, COLLECTION_NAME);
      console.log('Executing getDocs query...');
      const querySnapshot = await getDocs(studentsRef);
      console.log('Query completed, processing results...');
      const students = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Student[];
      console.log('Successfully fetched', students.length, 'students');
      return students;
    } catch (error: any) {
      console.error('Error in getAll:', error?.message, error?.code);
      if (error?.code === 'unavailable') {
        throw new Error('Unable to connect to the database. Please ensure the Firestore emulator is running.');
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
  }
};
