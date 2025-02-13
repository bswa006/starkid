import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { Attendance, AttendanceStatus } from '@/types/school';

const COLLECTION_NAME = 'attendance';

export const attendanceService = {
  async getAll(): Promise<Attendance[]> {
    try {
      const attendanceRef = collection(db, COLLECTION_NAME);
      const querySnapshot = await getDocs(attendanceRef);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: (doc.data().date as Timestamp).toDate()
      })) as Attendance[];
    } catch (error: any) {
      console.error('Error in getAll:', error?.message, error?.code);
      if (error?.code === 'unavailable') {
        throw new Error('Unable to connect to the database. Please ensure the Firestore emulator is running.');
      }
      throw new Error('Failed to fetch attendance records: ' + error?.message);
    }
  },

  async getByStudent(studentId: string): Promise<Attendance[]> {
    try {
      const attendanceRef = collection(db, COLLECTION_NAME);
      const q = query(
        attendanceRef,
        where('studentId', '==', studentId),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: (doc.data().date as Timestamp).toDate()
      })) as Attendance[];
    } catch (error: any) {
      console.error('Error in getByStudent:', error);
      throw new Error('Failed to fetch student attendance: ' + error?.message);
    }
  },

  async getByDateRange(startDate: Date, endDate: Date): Promise<Attendance[]> {
    try {
      const attendanceRef = collection(db, COLLECTION_NAME);
      const q = query(
        attendanceRef,
        where('date', '>=', Timestamp.fromDate(startDate)),
        where('date', '<=', Timestamp.fromDate(endDate)),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: (doc.data().date as Timestamp).toDate()
      })) as Attendance[];
    } catch (error: any) {
      console.error('Error in getByDateRange:', error);
      throw new Error('Failed to fetch attendance by date range: ' + error?.message);
    }
  },

  async create(attendance: Omit<Attendance, 'id'>): Promise<Attendance> {
    const attendanceRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(attendanceRef, {
      ...attendance,
      date: Timestamp.fromDate(attendance.date)
    });
    return {
      id: docRef.id,
      ...attendance
    };
  },

  async update(id: string, data: Partial<Omit<Attendance, 'id'>>): Promise<void> {
    const attendanceRef = doc(db, COLLECTION_NAME, id);
    const updateData = { ...data };
    if (data.date) {
      updateData.date = Timestamp.fromDate(data.date);
    }
    await updateDoc(attendanceRef, updateData);
  },

  async delete(id: string): Promise<void> {
    const attendanceRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(attendanceRef);
  },

  async getStudentAttendanceStats(studentId: string): Promise<{
    total: number;
    present: number;
    absent: number;
    late: number;
  }> {
    try {
      const attendanceRef = collection(db, COLLECTION_NAME);
      const q = query(
        attendanceRef,
        where('studentId', '==', studentId)
      );
      const querySnapshot = await getDocs(q);
      const records = querySnapshot.docs.map(doc => doc.data());
      
      return records.reduce((stats, record) => {
        stats.total++;
        stats[record.status.toLowerCase()]++;
        return stats;
      }, {
        total: 0,
        present: 0,
        absent: 0,
        late: 0
      });
    } catch (error: any) {
      console.error('Error in getStudentAttendanceStats:', error);
      throw new Error('Failed to fetch attendance statistics: ' + error?.message);
    }
  }
};
