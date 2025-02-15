import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly title: Locator;
  readonly statsSection: Locator;
  readonly progressSection: Locator;
  readonly timelineSection: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByRole('heading', { level: 2, name: /Classes|Dashboard/ });
    this.statsSection = page.locator('.stats-grid, .dashboard-stats');
    this.progressSection = page.locator('.progress-section, .dashboard-progress');
    this.timelineSection = page.locator('.timeline-section, .dashboard-timeline');
  }

  async goto() {
    await this.page.goto('/dashboard');
  }

  async expectLoaded() {
    await expect(this.title).toBeVisible();
    // Only check for title since other sections might be loading or empty
  }

  async getStats() {
    return {
      totalStudents: await this.statsSection.locator('[data-testid="total-students"]').textContent(),
      averageAttendance: await this.statsSection.locator('[data-testid="avg-attendance"]').textContent(),
      activeAssignments: await this.statsSection.locator('[data-testid="active-assignments"]').textContent()
    };
  }
}
