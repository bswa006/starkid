import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCWM0RegXLpneAx658221-Ijjice3DFxHo",
  authDomain: "starkid-397f2.firebaseapp.com",
  projectId: "starkid-397f2",
  storageBucket: "starkid-397f2.appspot.com",
  messagingSenderId: "172299862492",
  appId: "1:172299862492:web:f70038be5ca59ba6b5cf19"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);

// Initialize Firestore with persistence settings
export const db = initializeFirestore(app, {
  cache: {
    // Enable offline persistence with a size limit of 100MB
    cacheSizeBytes: 100000000
  }
});

export default app;
