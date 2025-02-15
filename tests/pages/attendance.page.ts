import { Page, Locator, expect } from '@playwright/test';

export class AttendancePage {
  readonly page: Page;
  readonly dateSelector: Locator;
  readonly attendanceList: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dateSelector = page.getByTestId('attendance-date');
    this.attendanceList = page.getByTestId('attendance-list');
    this.submitButton = page.getByRole('button', { name: 'Submit Attendance' });
  }

  async goto() {
    await this.page.goto('/attendance');
  }

  async selectDate(date: Date) {
    await this.dateSelector.click();
    await this.dateSelector.fill(date.toISOString().split('T')[0]);
  }

  async markAttendance(studentName: string, status: 'present' | 'absent' | 'late') {
    const studentRow = this.attendanceList.getByText(studentName).first();
    await studentRow.getByLabel(status).check();
  }

  async submitAttendance() {
    await this.submitButton.click();
  }

  async expectAttendanceStatus(studentName: string, status: 'present' | 'absent' | 'late') {
    const studentRow = this.attendanceList.getByText(studentName).first();
    await expect(studentRow.getByLabel(status)).toBeChecked();
  }

  async expectAttendanceSubmitted() {
    await expect(this.page.getByText('Attendance submitted successfully')).toBeVisible();
  }
}
