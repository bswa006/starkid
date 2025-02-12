import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import dotenv from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function createAndVerifyTestUser() {
  const email = 'test@example.com';
  const password = 'Test123!';

  try {
    // First try to create the user
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Test user created successfully:', userCredential.user.email);
    } catch (createError) {
      if (createError.code === 'auth/email-already-in-use') {
        console.log('User already exists, attempting to sign in...');
      } else {
        throw createError;
      }
    }

    // Try to sign in with the credentials
    const signInResult = await signInWithEmailAndPassword(auth, email, password);
    console.log('Successfully verified credentials for:', signInResult.user.email);

  } catch (error) {
    console.error('Error:', error.code, error.message);
  } finally {
    process.exit(0);
  }
}

createAndVerifyTestUser();
