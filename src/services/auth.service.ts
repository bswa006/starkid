import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import type { RegisterData, UserProfile, UserRole } from '@/types/auth';

const USERS_COLLECTION = 'users';

export const authService = {
  async signIn(email: string, password: string): Promise<{ user: User; profile: UserProfile }> {
    try {
      // First authenticate the user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;
      
      console.log("Firebase auth successful for:", user.email);
      
      try {
        // Try to get existing profile
        const userDocRef = doc(db, USERS_COLLECTION, user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          const profile: UserProfile = {
            id: user.uid,
            email: data.email,
            role: data.role as UserRole,
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          };
          console.log("Existing profile found:", { email: user.email, profile });
          return { user, profile };
        }
        
        // Create new profile
        console.log("Creating new profile for user:", user.email);
        const newProfile: UserProfile = {
          id: user.uid,
          email: user.email!,
          role: 'teacher', // Default role
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ')[1] || '',
          phoneNumber: user.phoneNumber || '',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        // Create the profile document
        await setDoc(userDocRef, {
          email: newProfile.email,
          role: newProfile.role,
          firstName: newProfile.firstName,
          lastName: newProfile.lastName,
          phoneNumber: newProfile.phoneNumber,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        
        console.log("New profile created:", { email: user.email, profile: newProfile });
        return { user, profile: newProfile };
      } catch (profileError: any) {
        console.error('Error handling user profile:', profileError);
        throw new Error(`Failed to handle user profile: ${profileError.message}`);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  },

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
        // If it's a teacher, generate a default classId using their uid
        ...(data.role === 'teacher' && { classId: `class-${user.uid}` }),
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
        console.error('User profile document does not exist:', userId);
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
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error; // Throw the error instead of silently returning null
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
