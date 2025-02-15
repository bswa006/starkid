import { createContext, useContext, useEffect, useState } from "react";
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/config/firebase";
import { authService } from "@/services/auth.service";
import type { RegisterData, UserProfile } from "@/types/auth";

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  login: (email: string, password: string) => Promise<{ user: User; profile: UserProfile }>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  async function login(email: string, password: string) {
    try {
      const { user, profile } = await authService.signIn(email, password);

      // Validate profile role
      if (!profile.role) {
        throw new Error("Invalid user role. Please contact support.");
      }

      // Set user state
      setCurrentUser(user);
      setUserProfile(profile);
      
      return { user, profile };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async function register(data: RegisterData) {
    try {
      const profile = await authService.register(data);
      setUserProfile(profile);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  async function logout() {
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }

  async function resetPassword(email: string) {
    try {
      await authService.resetPassword(email);
    } catch (error) {
      console.error("Password reset error:", error);
      throw error;
    }
  }

  async function updateProfile(data: Partial<UserProfile>) {
    if (!currentUser) throw new Error("No user logged in");
    try {
      await authService.updateUserProfile(currentUser.uid, data);
      if (userProfile) {
        setUserProfile({ ...userProfile, ...data });
      }
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    }
  }

  useEffect(() => {
    console.log("Setting up auth state listener...");
    try {
      const unsubscribe = onAuthStateChanged(
        auth,
        async (user) => {
          console.log("Auth state changed:", { 
            email: user?.email,
            uid: user?.uid,
            emailVerified: user?.emailVerified,
          });
          setCurrentUser(user);
          try {
            if (user) {
              // Fetch user profile
              const profile = await authService.getUserProfile(user.uid);
              console.log("Auth Debug:", {
                uid: user.uid,
                profile,
                profileExists: !!profile,
                role: profile?.role,
              });
              
              if (!profile) {
                console.log("Creating default profile...");
                // Create a default profile if none exists
                const defaultProfile: UserProfile = {
                  id: user.uid,
                  email: user.email!,
                  role: 'teacher', // Set as teacher since that's what the logs show
                  firstName: user.displayName?.split(' ')[0] || '',
                  lastName: user.displayName?.split(' ')[1] || '',
                  phoneNumber: '',
                  createdAt: new Date(),
                  updatedAt: new Date(),
                };
                await authService.updateUserProfile(user.uid, defaultProfile);
                console.log("Created default profile:", defaultProfile);
                setUserProfile(defaultProfile);
              } else {
                console.log("Using existing profile:", profile);
                setUserProfile(profile);
              }
            } else {
              console.log("No user, setting profile to null");
              setUserProfile(null);
            }
          } catch (error) {
            console.error("Error fetching user profile:", error);
            // Don't throw here, just log the error
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          // Handle auth state change errors
          console.error("Auth state change error:", error);
          setLoading(false);
        }
      );

      return () => {
        console.log("Cleaning up auth state listener...");
        unsubscribe();
      };
    } catch (error) {
      console.error("Error setting up auth state listener:", error);
      setLoading(false);
    }
  }, []);

  const value = {
    currentUser,
    userProfile,
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B7FE3]"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
