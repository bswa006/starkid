import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { Quiz, QuizResult } from '@/types/school';

const QUIZ_COLLECTION = 'quizzes';
const QUIZ_RESULTS_COLLECTION = 'quiz_results';

export const quizService = {
  async getAllQuizzes(): Promise<Quiz[]> {
    try {
      const quizzesRef = collection(db, QUIZ_COLLECTION);
      const querySnapshot = await getDocs(quizzesRef);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Quiz[];
    } catch (error: any) {
      console.error('Error in getAllQuizzes:', error?.message, error?.code);
      if (error?.code === 'unavailable') {
        throw new Error('Unable to connect to the database. Please ensure the Firestore emulator is running.');
      }
      throw new Error('Failed to fetch quizzes: ' + error?.message);
    }
  },

  async getQuizById(quizId: string): Promise<Quiz | null> {
    try {
      const quizRef = doc(db, QUIZ_COLLECTION, quizId);
      const docSnap = await getDocs(quizRef);
      if (!docSnap.exists()) return null;
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Quiz;
    } catch (error: any) {
      console.error('Error in getQuizById:', error);
      throw new Error('Failed to fetch quiz: ' + error?.message);
    }
  },

  async createQuiz(quiz: Omit<Quiz, 'id'>): Promise<Quiz> {
    const quizzesRef = collection(db, QUIZ_COLLECTION);
    const docRef = await addDoc(quizzesRef, quiz);
    return {
      id: docRef.id,
      ...quiz
    };
  },

  async updateQuiz(id: string, data: Partial<Omit<Quiz, 'id'>>): Promise<void> {
    const quizRef = doc(db, QUIZ_COLLECTION, id);
    await updateDoc(quizRef, data);
  },

  async deleteQuiz(id: string): Promise<void> {
    const quizRef = doc(db, QUIZ_COLLECTION, id);
    await deleteDoc(quizRef);
  },

  // Quiz Results
  async getQuizResults(quizId: string): Promise<QuizResult[]> {
    try {
      const resultsRef = collection(db, QUIZ_RESULTS_COLLECTION);
      const q = query(
        resultsRef,
        where('quizId', '==', quizId),
        orderBy('submittedAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as QuizResult[];
    } catch (error: any) {
      console.error('Error in getQuizResults:', error);
      throw new Error('Failed to fetch quiz results: ' + error?.message);
    }
  },

  async getStudentQuizResults(studentId: string): Promise<QuizResult[]> {
    try {
      const resultsRef = collection(db, QUIZ_RESULTS_COLLECTION);
      const q = query(
        resultsRef,
        where('studentId', '==', studentId),
        orderBy('submittedAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as QuizResult[];
    } catch (error: any) {
      console.error('Error in getStudentQuizResults:', error);
      throw new Error('Failed to fetch student quiz results: ' + error?.message);
    }
  },

  async submitQuizResult(result: Omit<QuizResult, 'id'>): Promise<QuizResult> {
    const resultsRef = collection(db, QUIZ_RESULTS_COLLECTION);
    const docRef = await addDoc(resultsRef, {
      ...result,
      submittedAt: new Date()
    });
    return {
      id: docRef.id,
      ...result
    };
  },

  async getStudentQuizStats(studentId: string): Promise<{
    totalQuizzes: number;
    averageScore: number;
    highestScore: number;
    lowestScore: number;
  }> {
    try {
      const results = await this.getStudentQuizResults(studentId);
      if (results.length === 0) {
        return {
          totalQuizzes: 0,
          averageScore: 0,
          highestScore: 0,
          lowestScore: 0
        };
      }

      const scores = results.map(r => r.score);
      return {
        totalQuizzes: results.length,
        averageScore: scores.reduce((a, b) => a + b, 0) / scores.length,
        highestScore: Math.max(...scores),
        lowestScore: Math.min(...scores)
      };
    } catch (error: any) {
      console.error('Error in getStudentQuizStats:', error);
      throw new Error('Failed to fetch quiz statistics: ' + error?.message);
    }
  }
};
