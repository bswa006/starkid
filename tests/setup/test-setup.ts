import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { mockFirebaseAuth, mockFirebaseFirestore } from '../utils/test-utils';

// Declare the types of your fixtures
type Fixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  autoMock: void;
};

// Extend base test with your fixtures
export const test = base.extend<Fixtures>({
  // Add auth mocking for each test
  autoMock: async ({ page }, use) => {
    await mockFirebaseAuth(page);
    await mockFirebaseFirestore(page);
    await use();
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
});
