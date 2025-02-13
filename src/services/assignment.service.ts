import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { Assignment, AssignmentStatus } from '@/types/school';

const COLLECTION_NAME = 'assignments';

export const assignmentService = {
  async getAll(): Promise<Assignment[]> {
    try {
      const assignmentsRef = collection(db, COLLECTION_NAME);
      const querySnapshot = await getDocs(assignmentsRef);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Assignment[];
    } catch (error: any) {
      console.error('Error in getAll:', error?.message, error?.code);
      if (error?.code === 'unavailable') {
        throw new Error('Unable to connect to the database. Please ensure the Firestore emulator is running.');
      }
      throw new Error('Failed to fetch assignments: ' + error?.message);
    }
  },

  async getByStudent(studentId: string): Promise<Assignment[]> {
    try {
      const assignmentsRef = collection(db, COLLECTION_NAME);
      const q = query(
        assignmentsRef,
        where('studentId', '==', studentId),
        orderBy('dueDate', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Assignment[];
    } catch (error: any) {
      console.error('Error in getByStudent:', error);
      throw new Error('Failed to fetch student assignments: ' + error?.message);
    }
  },

  async getByStatus(status: AssignmentStatus): Promise<Assignment[]> {
    try {
      const assignmentsRef = collection(db, COLLECTION_NAME);
      const q = query(
        assignmentsRef,
        where('status', '==', status),
        orderBy('dueDate', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Assignment[];
    } catch (error: any) {
      console.error('Error in getByStatus:', error);
      throw new Error('Failed to fetch assignments by status: ' + error?.message);
    }
  },

  async create(assignment: Omit<Assignment, 'id'>): Promise<Assignment> {
    const assignmentsRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(assignmentsRef, assignment);
    return {
      id: docRef.id,
      ...assignment
    };
  },

  async update(id: string, data: Partial<Omit<Assignment, 'id'>>): Promise<void> {
    const assignmentRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(assignmentRef, data);
  },

  async delete(id: string): Promise<void> {
    const assignmentRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(assignmentRef);
  }
};
