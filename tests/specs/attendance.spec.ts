import { test as baseTest } from '../setup/test-setup';
import { expect } from '@playwright/test';
import { mockFirebaseAuth, mockFirebaseFirestore } from '../utils/test-utils';
import { AttendancePage } from '../pages/attendance.page';

const test = baseTest.extend({
  attendancePage: async ({ page }, use) => {
    await use(new AttendancePage(page));
  },
});

test.describe('Attendance Management', () => {
  test.beforeEach(async ({ page, loginPage }) => {
    // Mock Firebase responses
    await mockFirebaseAuth(page);
    await mockFirebaseFirestore(page);

    // Login as teacher
    await loginPage.goto();
    await loginPage.login('teacher@example.com', 'password123');
    await expect(page).toHaveURL(/.*\/dashboard/);
  });

  test('should mark attendance for multiple students', async ({ attendancePage }) => {
    await attendancePage.goto();
    
    // Select today's date
    const today = new Date();
    await attendancePage.selectDate(today);

    // Mark attendance for different students
    await attendancePage.markAttendance('John Doe', 'present');
    await attendancePage.markAttendance('Jane Smith', 'absent');
    await attendancePage.markAttendance('Bob Wilson', 'late');

    // Submit attendance
    await attendancePage.submitAttendance();
    await attendancePage.expectAttendanceSubmitted();

    // Verify attendance status
    await attendancePage.expectAttendanceStatus('John Doe', 'present');
    await attendancePage.expectAttendanceStatus('Jane Smith', 'absent');
    await attendancePage.expectAttendanceStatus('Bob Wilson', 'late');
  });

  test('should validate attendance submission', async ({ attendancePage }) => {
    await attendancePage.goto();
    
    // Try to submit without marking attendance
    await attendancePage.submitButton.click();
    
    // Check for validation message
    await expect(attendancePage.page.getByText('Please mark attendance for all students')).toBeVisible();
  });

  test('should show attendance history', async ({ attendancePage }) => {
    await attendancePage.goto();
    
    // Navigate to history tab
    await attendancePage.page.getByRole('tab', { name: 'History' }).click();
    
    // Verify history view
    await expect(attendancePage.page.getByTestId('attendance-history')).toBeVisible();
    await expect(attendancePage.page.getByTestId('attendance-history')).toContainText('Attendance History');
  });

  test('should generate attendance report', async ({ attendancePage }) => {
    await attendancePage.goto();
    
    // Navigate to reports tab
    await attendancePage.page.getByRole('tab', { name: 'Reports' }).click();
    
    // Select date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); // Last 7 days
    await attendancePage.page.getByLabel('Start Date').fill(startDate.toISOString().split('T')[0]);
    await attendancePage.page.getByLabel('End Date').fill(new Date().toISOString().split('T')[0]);
    
    // Generate report
    await attendancePage.page.getByRole('button', { name: 'Generate Report' }).click();
    
    // Verify report generation
    await expect(attendancePage.page.getByText('Report generated successfully')).toBeVisible();
    await expect(attendancePage.page.getByTestId('attendance-report')).toBeVisible();
  });
});
