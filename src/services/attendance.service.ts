import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { Attendance } from '@/types/school';

const COLLECTION_NAME = 'attendance';

// Utility function to ensure we have a Date object
const ensureDate = (date: Date | Timestamp): Date => {
  if (date instanceof Timestamp) {
    return date.toDate();
  }
  return date;
};

export const attendanceService = {
  async getAll(): Promise<Attendance[]> {
    try {
      const attendanceRef = collection(db, COLLECTION_NAME);
      const querySnapshot = await getDocs(attendanceRef);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: ensureDate(doc.data().date)
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
        date: ensureDate(doc.data().date)
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
        date: ensureDate(doc.data().date)
      })) as Attendance[];
    } catch (error: any) {
      console.error('Error in getByDateRange:', error);
      throw new Error('Failed to fetch attendance by date range: ' + error?.message);
    }
  },

  async getByDateAndClass(date: Date, classId: string): Promise<Attendance[]> {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const attendanceRef = collection(db, COLLECTION_NAME);
      const q = query(
        attendanceRef,
        where('classId', '==', classId),
        where('date', '>=', Timestamp.fromDate(startOfDay)),
        where('date', '<=', Timestamp.fromDate(endOfDay))
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: ensureDate(doc.data().date)
      })) as Attendance[];
    } catch (error: any) {
      console.error('Error in getByDateAndClass:', error);
      throw new Error('Failed to fetch class attendance for date: ' + error?.message);
    }
  },

  async getByTeacher(teacherId: string): Promise<Attendance[]> {
    try {
      const attendanceRef = collection(db, COLLECTION_NAME);
      const q = query(
        attendanceRef,
        where('teacherId', '==', teacherId),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: ensureDate(doc.data().date)
      })) as Attendance[];
    } catch (error: any) {
      console.error('Error in getByTeacher:', error);
      throw new Error('Failed to fetch teacher attendance records: ' + error?.message);
    }
  },

  async create(attendance: Omit<Attendance, 'id'>): Promise<Attendance> {
    const attendanceRef = collection(db, COLLECTION_NAME);
    
    // Convert dates to Timestamps
    const date = attendance.date instanceof Timestamp 
      ? attendance.date 
      : Timestamp.fromDate(attendance.date instanceof Date ? attendance.date : new Date(attendance.date));
    
    const markedAt = attendance.markedAt instanceof Timestamp
      ? attendance.markedAt
      : Timestamp.fromDate(attendance.markedAt instanceof Date ? attendance.markedAt : new Date(attendance.markedAt));

    const updatedAt = attendance.updatedAt instanceof Timestamp
      ? attendance.updatedAt
      : Timestamp.fromDate(attendance.updatedAt instanceof Date ? attendance.updatedAt : new Date(attendance.updatedAt));
    
    const docRef = await addDoc(attendanceRef, {
      ...attendance,
      date,
      markedAt,
      updatedAt
    });
    
    return {
      id: docRef.id,
      ...attendance,
      date: date.toDate(),
      markedAt: markedAt.toDate(),
      updatedAt: updatedAt.toDate()
    };
  },

  async update(id: string, data: Partial<Omit<Attendance, 'id'>>): Promise<void> {
    const attendanceRef = doc(db, COLLECTION_NAME, id);
    const updateData = { ...data };
    
    if (data.date) {
      updateData.date = data.date instanceof Timestamp 
        ? data.date 
        : Timestamp.fromDate(data.date instanceof Date ? data.date : new Date(data.date));
    }

    if (data.markedAt) {
      updateData.markedAt = data.markedAt instanceof Timestamp
        ? data.markedAt
        : Timestamp.fromDate(data.markedAt instanceof Date ? data.markedAt : new Date(data.markedAt));
    }

    if (data.updatedAt) {
      updateData.updatedAt = data.updatedAt instanceof Timestamp
        ? data.updatedAt
        : Timestamp.fromDate(data.updatedAt instanceof Date ? data.updatedAt : new Date(data.updatedAt));
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
        where('records', 'array-contains', { studentId })
      );
      const querySnapshot = await getDocs(q);
      const records = querySnapshot.docs.map(doc => doc.data() as Attendance);
      
      return records.reduce((stats, record) => {
        const studentRecord = record.records.find(r => r.studentId === studentId);
        if (studentRecord) {
          stats.total++;
          if (studentRecord.status === 'present') stats.present++;
          else if (studentRecord.status === 'absent') stats.absent++;
          else if (studentRecord.status === 'late') stats.late++;
        }
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
