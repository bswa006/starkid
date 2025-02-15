import { db } from "@/config/firebase";
import type { Class } from "@/types/school";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";

const COLLECTION_NAME = "classes";

export interface ClassService {
  getAll(): Promise<Class[]>;
  getById(id: string): Promise<Class | null>;
  create(classData: Omit<Class, "id" | "createdAt" | "updatedAt">): Promise<Class>;
  update(id: string, data: Partial<Omit<Class, "id">>): Promise<void>;
  delete(id: string): Promise<void>;
  getByTeacher(teacherId: string): Promise<Class[]>;
}

export const classService: ClassService = {
  async getAll() {
    const classesRef = collection(db, COLLECTION_NAME);
    const q = query(classesRef, orderBy("grade"), orderBy("section"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp).toDate(),
      updatedAt: (doc.data().updatedAt as Timestamp).toDate(),
    })) as Class[];
  },

  async getById(id: string) {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;

    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: (data.createdAt as Timestamp).toDate(),
      updatedAt: (data.updatedAt as Timestamp).toDate(),
    } as Class;
  },

  async create(classData: Omit<Class, "id" | "createdAt" | "updatedAt">) {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...classData,
      createdAt: now,
      updatedAt: now,
    });

    return {
      id: docRef.id,
      ...classData,
      createdAt: now.toDate(),
      updatedAt: now.toDate(),
    };
  },

  async update(id: string, data: Partial<Omit<Class, "id">>) {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  },

  async delete(id: string) {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },

  async getByTeacher(teacherId: string) {
    const classesRef = collection(db, COLLECTION_NAME);
    const q = query(
      classesRef,
      where("classTeacherId", "==", teacherId),
      orderBy("grade"),
      orderBy("section")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp).toDate(),
      updatedAt: (doc.data().updatedAt as Timestamp).toDate(),
    })) as Class[];
  },
};
