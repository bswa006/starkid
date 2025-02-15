import { Page, Locator, expect } from '@playwright/test';

export class StudentsPage {
  readonly page: Page;
  readonly addStudentButton: Locator;
  readonly searchInput: Locator;
  readonly studentsList: Locator;
  readonly studentForm: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addStudentButton = page.getByRole('button', { name: 'Add Student' });
    this.searchInput = page.getByPlaceholder('Search students...');
    this.studentsList = page.locator('[data-testid="students-list"]');
    this.studentForm = page.locator('[data-testid="student-form"]');
  }

  async goto() {
    await this.page.goto('/students');
  }

  async addStudent(studentData: {
    firstName: string;
    lastName: string;
    rollNumber: string;
    grade: string;
    section: string;
    email: string;
    phone?: string;
    parentName?: string;
  }) {
    await this.addStudentButton.click();
    await this.studentForm.getByLabel('First Name').fill(studentData.firstName);
    await this.studentForm.getByLabel('Last Name').fill(studentData.lastName);
    await this.studentForm.getByLabel('Roll Number').fill(studentData.rollNumber);
    await this.studentForm.getByLabel('Grade').fill(studentData.grade);
    await this.studentForm.getByLabel('Section').fill(studentData.section);
    await this.studentForm.getByLabel('Email').fill(studentData.email);
    
    if (studentData.phone) {
      await this.studentForm.getByLabel('Phone').fill(studentData.phone);
    }
    if (studentData.parentName) {
      await this.studentForm.getByLabel('Parent Name').fill(studentData.parentName);
    }

    await this.studentForm.getByRole('button', { name: 'Save' }).click();
  }

  async searchStudent(query: string) {
    await this.searchInput.fill(query);
    await this.page.keyboard.press('Enter');
  }

  async getStudentCard(name: string) {
    return this.studentsList.getByText(name).first();
  }

  async deleteStudent(name: string) {
    const card = await this.getStudentCard(name);
    await card.getByTestId('delete-student').click();
    await this.page.getByRole('button', { name: 'Confirm' }).click();
  }

  async expectStudentExists(name: string) {
    await expect(this.getStudentCard(name)).toBeVisible();
  }

  async expectStudentNotExists(name: string) {
    await expect(this.getStudentCard(name)).not.toBeVisible();
  }
}
