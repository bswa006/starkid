import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { TimelineEvent, TimelineEventType } from '@/types/school';

const COLLECTION_NAME = 'timeline_events';

export const timelineService = {
  async getAll(): Promise<TimelineEvent[]> {
    try {
      const eventsRef = collection(db, COLLECTION_NAME);
      const q = query(eventsRef, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: (doc.data().timestamp as Timestamp).toDate()
      })) as TimelineEvent[];
    } catch (error: any) {
      console.error('Error in getAll:', error?.message, error?.code);
      if (error?.code === 'unavailable') {
        throw new Error('Unable to connect to the database. Please ensure the Firestore emulator is running.');
      }
      throw new Error('Failed to fetch timeline events: ' + error?.message);
    }
  },

  async getByType(type: TimelineEventType): Promise<TimelineEvent[]> {
    try {
      const eventsRef = collection(db, COLLECTION_NAME);
      const q = query(
        eventsRef,
        where('type', '==', type),
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: (doc.data().timestamp as Timestamp).toDate()
      })) as TimelineEvent[];
    } catch (error: any) {
      console.error('Error in getByType:', error);
      throw new Error('Failed to fetch events by type: ' + error?.message);
    }
  },

  async getByStudent(studentId: string): Promise<TimelineEvent[]> {
    try {
      const eventsRef = collection(db, COLLECTION_NAME);
      const q = query(
        eventsRef,
        where('studentId', '==', studentId),
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: (doc.data().timestamp as Timestamp).toDate()
      })) as TimelineEvent[];
    } catch (error: any) {
      console.error('Error in getByStudent:', error);
      throw new Error('Failed to fetch student events: ' + error?.message);
    }
  },

  async getByDateRange(startDate: Date, endDate: Date): Promise<TimelineEvent[]> {
    try {
      const eventsRef = collection(db, COLLECTION_NAME);
      const q = query(
        eventsRef,
        where('timestamp', '>=', Timestamp.fromDate(startDate)),
        where('timestamp', '<=', Timestamp.fromDate(endDate)),
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: (doc.data().timestamp as Timestamp).toDate()
      })) as TimelineEvent[];
    } catch (error: any) {
      console.error('Error in getByDateRange:', error);
      throw new Error('Failed to fetch events by date range: ' + error?.message);
    }
  },

  async create(event: Omit<TimelineEvent, 'id'>): Promise<TimelineEvent> {
    const eventsRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(eventsRef, {
      ...event,
      timestamp: Timestamp.fromDate(event.timestamp)
    });
    return {
      id: docRef.id,
      ...event
    };
  },

  async update(id: string, data: Partial<Omit<TimelineEvent, 'id'>>): Promise<void> {
    const eventRef = doc(db, COLLECTION_NAME, id);
    const updateData = { ...data };
    if (data.timestamp) {
      updateData.timestamp = Timestamp.fromDate(data.timestamp);
    }
    await updateDoc(eventRef, updateData);
  },

  async delete(id: string): Promise<void> {
    const eventRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(eventRef);
  },

  async getRecentEvents(limit: number = 10): Promise<TimelineEvent[]> {
    try {
      const eventsRef = collection(db, COLLECTION_NAME);
      const q = query(
        eventsRef,
        orderBy('timestamp', 'desc'),
        limit
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: (doc.data().timestamp as Timestamp).toDate()
      })) as TimelineEvent[];
    } catch (error: any) {
      console.error('Error in getRecentEvents:', error);
      throw new Error('Failed to fetch recent events: ' + error?.message);
    }
  }
};
