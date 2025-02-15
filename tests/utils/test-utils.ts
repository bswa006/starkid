import { Page } from '@playwright/test';

export async function mockFirebaseAuth(page: Page) {
  await page.route('**/auth/**', async (route) => {
    const url = route.request().url();
    if (url.includes('signInWithPassword')) {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          localId: 'testUserId',
          email: 'test@example.com',
          displayName: 'Test User',
          idToken: 'fake-id-token',
          registered: true
        })
      });
    } else {
      await route.continue();
    }
  });
}

export async function mockFirebaseFirestore(page: Page) {
  await page.route('**/firestore.googleapis.com/**', async (route) => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify({
        documents: []
      })
    });
  });
}
