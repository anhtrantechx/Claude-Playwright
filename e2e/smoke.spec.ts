import { test, expect } from '@playwright/test';

/**
 * Smoke E2E — runs in CI on every push/PR that touches e2e/*.spec.ts
 * Add more *.spec.ts files in this folder; they run automatically in GitHub Actions.
 */
test.describe('Smoke', () => {
  test('homepage loads', async ({ page, baseURL }) => {
    await page.goto(baseURL ?? 'https://example.com');
    await expect(page).toHaveTitle(/Example Domain|./);
  });
});
