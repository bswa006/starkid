import { test } from '../setup/test-setup';
import { expect } from '@playwright/test';
import { mockFirebaseAuth, mockFirebaseFirestore } from '../utils/test-utils';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Start dev server and wait for it to be ready
    await page.goto('http://localhost:5174');
  });

  test('should login successfully', async ({ page, loginPage, dashboardPage }) => {
    await loginPage.goto();
    await loginPage.login('bswa006@gmail.com', '123456');
    
    // Wait for navigation and verify dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);
    await dashboardPage.expectLoaded();
  });

  test('should login as admin successfully', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login('bswa006+1@gmail.com', 'biswa123');
    await expect(page).toHaveURL(/.*\/dashboard/);
  });

  test('should show error with invalid credentials', async ({ loginPage }) => {
    // Override default mock for this test
    await loginPage.goto();
    await loginPage.login('wrong@email.com', 'wrongpass');
    await loginPage.expectErrorMessage();
  });

  test('should require email and password', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('', '');
    await loginPage.expectErrorMessage();
  });
});
