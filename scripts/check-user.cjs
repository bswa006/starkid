const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');

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

const checkUserProfile = async () => {
  try {
    const userId = 'kjLQ7uwZcJgUshRZGAmVpT341rg1';
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      console.log('User profile does not exist');
      return;
    }

    console.log('User profile:', userDoc.data());
  } catch (error) {
    console.error('Error checking user profile:', error);
  }
};

checkUserProfile();
