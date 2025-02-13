import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { Teacher } from '@/types/school';

const COLLECTION_NAME = 'teachers';
const teachersRef = collection(db, COLLECTION_NAME);

export const teacherService = {
  async getAll(): Promise<Teacher[]> {
    const q = query(teachersRef, orderBy('joinDate', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Teacher[];
  },

  async create(data: Omit<Teacher, 'id'>): Promise<Teacher> {
    const docRef = await addDoc(teachersRef, {
      ...data,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0]
    });
    return {
      id: docRef.id,
      ...data,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0]
    };
  },

  async update(id: string, data: Partial<Teacher>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, data);
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  }
};
