import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where, orderBy, Timestamp, limit } from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { TimelineEvent, TimelineEventType } from '@/types/school';

const COLLECTION_NAME = 'timeline_events';

export const timelineService = {
  // Helper function to convert Timestamp to Date
  convertTimestampToDate(event: TimelineEvent): TimelineEvent {
    return {
      ...event,
      timestamp: event.timestamp instanceof Timestamp ? event.timestamp.toDate() : event.timestamp,
      createdAt: event.createdAt instanceof Timestamp ? event.createdAt.toDate() : event.createdAt
    };
  },

  async getAll(): Promise<TimelineEvent[]> {
    try {
      const eventsRef = collection(db, COLLECTION_NAME);
      const q = query(eventsRef, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return this.convertTimestampToDate({
          ...data,
          id: doc.id
        } as TimelineEvent);
      });
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
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return this.convertTimestampToDate({
          ...data,
          id: doc.id
        } as TimelineEvent);
      });
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
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return this.convertTimestampToDate({
          ...data,
          id: doc.id
        } as TimelineEvent);
      });
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
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return this.convertTimestampToDate({
          ...data,
          id: doc.id
        } as TimelineEvent);
      });
    } catch (error: any) {
      console.error('Error in getByDateRange:', error);
      throw new Error('Failed to fetch events by date range: ' + error?.message);
    }
  },

  async create(event: Omit<TimelineEvent, 'id'>): Promise<TimelineEvent> {
    try {
      const eventsRef = collection(db, COLLECTION_NAME);
      
      // Convert timestamps to Firebase Timestamp objects
      const timestamp = event.timestamp instanceof Timestamp 
        ? event.timestamp 
        : Timestamp.fromDate(event.timestamp instanceof Date ? event.timestamp : new Date(event.timestamp));
      
      const createdAt = event.createdAt instanceof Timestamp 
        ? event.createdAt 
        : Timestamp.fromDate(event.createdAt instanceof Date ? event.createdAt : new Date(event.createdAt));
      
      const docRef = await addDoc(eventsRef, {
        ...event,
        timestamp,
        createdAt
      });
      
      return this.convertTimestampToDate({
        ...event,
        id: docRef.id
      } as TimelineEvent);
    } catch (error: any) {
      console.error('Error in create:', error);
      throw new Error('Failed to create timeline event: ' + error?.message);
    }
  },

  async update(id: string, data: Partial<Omit<TimelineEvent, 'id'>>): Promise<void> {
    try {
      const eventRef = doc(db, COLLECTION_NAME, id);
      const updateData = { ...data };
      
      // Convert Date to Timestamp for Firebase
      if (data.timestamp) {
        const timestamp = data.timestamp instanceof Date 
          ? data.timestamp 
          : data.timestamp instanceof Timestamp 
            ? data.timestamp.toDate() 
            : new Date(data.timestamp);
        updateData.timestamp = Timestamp.fromDate(timestamp);
      }
      
      if (data.createdAt) {
        const createdAt = data.createdAt instanceof Date 
          ? data.createdAt 
          : data.createdAt instanceof Timestamp 
            ? data.createdAt.toDate() 
            : new Date(data.createdAt);
        updateData.createdAt = Timestamp.fromDate(createdAt);
      }
      
      await updateDoc(eventRef, updateData);
    } catch (error: any) {
      console.error('Error in update:', error);
      throw new Error('Failed to update timeline event: ' + error?.message);
    }
  },

  async delete(id: string): Promise<void> {
    const eventRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(eventRef);
  },

  async getRecentEvents(maxResults: number = 10): Promise<TimelineEvent[]> {
    try {
      const eventsRef = collection(db, COLLECTION_NAME);
      const q = query(
        eventsRef,
        orderBy('timestamp', 'desc'),
        limit(maxResults)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return this.convertTimestampToDate({
          ...data,
          id: doc.id
        } as TimelineEvent);
      });
    } catch (error: any) {
      console.error('Error in getRecentEvents:', error);
      throw new Error('Failed to fetch recent events: ' + error?.message);
    }
  },

  async getTeacherEvents(teacherId: string, maxResults: number = 10): Promise<TimelineEvent[]> {
    try {
      const eventsRef = collection(db, COLLECTION_NAME);
      const q = query(
        eventsRef,
        where('teacherId', '==', teacherId),
        orderBy('timestamp', 'desc'),
        limit(maxResults)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return this.convertTimestampToDate({
          ...data,
          id: doc.id
        } as TimelineEvent);
      });
    } catch (error: any) {
      console.error('Error in getTeacherEvents:', error);
      throw new Error('Failed to fetch teacher events: ' + error?.message);
    }
  }
};
