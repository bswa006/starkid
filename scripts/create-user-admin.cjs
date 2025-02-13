const admin = require('firebase-admin');
const serviceAccount = require('../service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const createUserProfile = async () => {
  try {
    const userId = 'kjLQ7uwZcJgUshRZGAmVpT341rg1';
    
    const userProfile = {
      email: 'bswa006@gmail.com',
      role: 'teacher',
      firstName: 'Biswa',
      lastName: 'Teacher',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Create user profile in Firestore
    await db.collection('users').doc(userId).set(userProfile);
    console.log('Successfully created user profile');
  } catch (error) {
    console.error('Error creating user profile:', error);
  }
};

createUserProfile();
