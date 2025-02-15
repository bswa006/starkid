import { test as baseTest } from '../setup/test-setup';
import { expect } from '@playwright/test';
import { mockFirebaseAuth, mockFirebaseFirestore } from '../utils/test-utils';
import { StudentsPage } from '../pages/students.page';

const test = baseTest.extend({
  studentsPage: async ({ page }, use) => {
    await use(new StudentsPage(page));
  },
});

test.describe('Students Management', () => {
  test.beforeEach(async ({ page, loginPage }) => {
    // Mock Firebase responses
    await mockFirebaseAuth(page);
    await mockFirebaseFirestore(page);

    // Login as teacher
    await loginPage.goto();
    await loginPage.login('teacher@example.com', 'password123');
    await expect(page).toHaveURL(/.*\/dashboard/);
  });

  test('should add a new student', async ({ studentsPage }) => {
    await studentsPage.goto();
    
    const studentData = {
      firstName: 'John',
      lastName: 'Doe',
      rollNumber: 'R001',
      grade: '10',
      section: 'A',
      email: 'john.doe@example.com',
      phone: '1234567890',
      parentName: 'Jane Doe'
    };

    await studentsPage.addStudent(studentData);
    await studentsPage.expectStudentExists(`${studentData.firstName} ${studentData.lastName}`);
  });

  test('should search for students', async ({ studentsPage }) => {
    await studentsPage.goto();
    await studentsPage.searchStudent('John');
    
    // Verify search results
    await expect(studentsPage.studentsList).toContainText('John');
  });

  test('should delete a student', async ({ studentsPage }) => {
    await studentsPage.goto();
    await studentsPage.deleteStudent('John Doe');
    await studentsPage.expectStudentNotExists('John Doe');
  });

  test('should validate required fields in student form', async ({ studentsPage }) => {
    await studentsPage.goto();
    await studentsPage.addStudentButton.click();
    
    // Try to save without filling required fields
    await studentsPage.studentForm.getByRole('button', { name: 'Save' }).click();
    
    // Check for validation messages
    await expect(studentsPage.studentForm).toContainText('First name is required');
    await expect(studentsPage.studentForm).toContainText('Last name is required');
    await expect(studentsPage.studentForm).toContainText('Roll number is required');
  });

  test('should filter students by grade and section', async ({ studentsPage }) => {
    await studentsPage.goto();
    
    // Add test students
    await studentsPage.addStudent({
      firstName: 'Student',
      lastName: 'A',
      rollNumber: 'R001',
      grade: '10',
      section: 'A',
      email: 'student.a@example.com'
    });

    await studentsPage.addStudent({
      firstName: 'Student',
      lastName: 'B',
      rollNumber: 'R002',
      grade: '11',
      section: 'B',
      email: 'student.b@example.com'
    });

    // Filter by grade
    await studentsPage.searchStudent('grade:10');
    await studentsPage.expectStudentExists('Student A');
    await studentsPage.expectStudentNotExists('Student B');

    // Filter by section
    await studentsPage.searchStudent('section:B');
    await studentsPage.expectStudentExists('Student B');
    await studentsPage.expectStudentNotExists('Student A');
  });
});
