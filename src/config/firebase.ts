import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCWM0RegXLpneAx658221-Ijjice3DFxHo",
  authDomain: "starkid-397f2.firebaseapp.com",
  projectId: "starkid-397f2",
  storageBucket: "starkid-397f2.appspot.com",
  messagingSenderId: "172299862492",
  appId: "1:172299862492:web:f70038be5ca59ba6b5cf19"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Firestore with specific settings
export const db = getFirestore(app);

// Always use emulator in development
if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
  console.log('Using Firestore emulator');
  connectFirestoreEmulator(db, 'localhost', 8080);
}

export default app;
