import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

async function seedStudents() {
  const studentsRef = collection(db, 'students');
  
  const testStudents = [
    {
      firstName: "John",
      lastName: "Doe",
      rollNumber: "001",
      grade: "10",
      section: "A",
      email: "john@example.com",
      phone: "1234567890",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      firstName: "Jane",
      lastName: "Smith",
      rollNumber: "002",
      grade: "10",
      section: "A",
      email: "jane@example.com",
      phone: "0987654321",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  for (const student of testStudents) {
    try {
      const docRef = await addDoc(studentsRef, student);
      console.log("Added student with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding student: ", e);
    }
  }
}

seedStudents().then(() => console.log("Seeding complete"));
