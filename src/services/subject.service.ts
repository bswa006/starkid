import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { Subject } from '@/types/school';

const COLLECTION = 'subjects';

export const subjectsCollection = collection(db, COLLECTION);

const mapSubjectFromFirestore = (doc: QueryDocumentSnapshot<DocumentData>): Subject => {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    code: data.code,
    description: data.description,
    class: data.class,
    teacherIds: data.teacherIds || [],
    teacherNames: data.teacherNames || [],
    credits: data.credits,
    grade: data.grade,
    schedule: data.schedule,
    status: data.status || 'active',
  };
};

export async function getSubjects(): Promise<Subject[]> {
  try {
    const q = query(subjectsCollection, orderBy('name'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(mapSubjectFromFirestore);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    throw error;
  }
}

export async function getSubjectsByTeacher(teacherId: string): Promise<Subject[]> {
  try {
    const q = query(
      subjectsCollection,
      where('teacherIds', 'array-contains', teacherId),
      orderBy('name')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(mapSubjectFromFirestore);
  } catch (error) {
    console.error('Error fetching subjects by teacher:', error);
    throw error;
  }
}

export async function addSubject(data: Omit<Subject, 'id'>): Promise<Subject> {
  try {
    const docRef = await addDoc(subjectsCollection, {
      ...data,
      status: 'active',
    });
    return {
      ...data,
      id: docRef.id,
    };
  } catch (error) {
    console.error('Error adding subject:', error);
    throw error;
  }
}

export async function updateSubject(id: string, data: Partial<Subject>): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error('Error updating subject:', error);
    throw error;
  }
}

export async function deleteSubject(id: string): Promise<void> {
  try {
    const subjectRef = doc(db, COLLECTION, id);
    await deleteDoc(subjectRef);
  } catch (error) {
    console.error('Error deleting subject:', error);
    throw error;
  }
}
