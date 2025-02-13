const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, serverTimestamp } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyCWM0RegXLpneAx658221-Ijjice3DFxHo",
  authDomain: "starkid-397f2.firebaseapp.com",
  projectId: "starkid-397f2",
  storageBucket: "starkid-397f2.appspot.com",
  messagingSenderId: "172299862492",
  appId: "1:172299862492:web:f70038be5ca59ba6b5cf19"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const createUserProfile = async () => {
  try {
    // Create user profile for bswa006@gmail.com
    const userId = 'kjLQ7uwZcJgUshRZGAmVpT341rg1'; // This will be the UID from Firebase Auth
    
    const userProfile = {
      email: 'bswa006@gmail.com',
      role: 'teacher', // or 'admin' based on your preference
      firstName: 'Biswa',
      lastName: 'Teacher',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Create user profile in Firestore
    await setDoc(doc(db, 'users', userId), userProfile);
    console.log('Successfully created user profile');
  } catch (error) {
    console.error('Error creating user profile:', error);
  }
};

createUserProfile();
