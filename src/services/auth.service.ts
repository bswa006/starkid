import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import type { RegisterData, UserProfile, UserRole } from '@/types/auth';

const USERS_COLLECTION = 'users';

export const authService = {
  async register(data: RegisterData): Promise<UserProfile> {
    try {
      // Create Firebase auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const { user } = userCredential;

      // Update display name
      await updateProfile(user, {
        displayName: `${data.firstName} ${data.lastName}`,
      });

      // Create user profile in Firestore
      const userProfile: Omit<UserProfile, 'id'> = {
        email: data.email,
        role: data.role,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, USERS_COLLECTION, user.uid), {
        ...userProfile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return {
        id: user.uid,
        ...userProfile,
      };
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.message);
    }
  },

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId));
      
      if (!userDoc.exists()) {
        return null;
      }

      const data = userDoc.data();
      return {
        id: userId,
        email: data.email,
        role: data.role as UserRole,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  },

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw new Error(error.message);
    }
  },

  async updateUserProfile(
    userId: string,
    data: Partial<Omit<UserProfile, 'id' | 'email' | 'role' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      await setDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      // Update display name if first or last name is changed
      if (data.firstName || data.lastName) {
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();
        const displayName = `${data.firstName || userData?.firstName} ${data.lastName || userData?.lastName}`;
        const currentUser = auth.currentUser;
        if (currentUser) {
          await updateProfile(currentUser, { displayName });
        }
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      throw new Error(error.message);
    }
  },
};
