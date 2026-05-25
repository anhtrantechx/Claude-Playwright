import { test, expect } from '@playwright/test';

/**
 * XOps Performance Portal — Leader Scorecard (demo flow)
 *
 * User journey:
 *   1. Mở XOps Performance Dashboard
 *   2. Vào Leader Scorecard
 *   3. Chọn leader: Nguyễn Thái Bình
 *   4. Chọn period: Quarterly FY26 Q1
 *
 * Run:
 *   npm run test:e2e -- e2e/xops-leader-scorecard.spec.ts
 *
 * Portal: https://perf-portal-dev.xops-core-platform.techxdata.io/
 */

const XOPS_PORTAL_URL =
  process.env.XOPS_PORTAL_URL ||
  'https://perf-portal-dev.xops-core-platform.techxdata.io/?period_id=M05+-+FY2026';

const LEADER_NAME = 'Nguyễn Thái Bình';
const PERIOD_LABEL = /Quarterly\s+FY26\s+Q1/i; // UI có thể hiển thị "Quaterly" — chỉnh regex nếu cần

test.describe('XOps — Leader Scorecard', () => {
  test.describe.configure({ mode: 'serial', timeout: 120_000 });

  test.beforeEach(async ({ page }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  test('navigate → Leader Scorecard → leader Nguyễn Thái Bình → period Quarterly FY26 Q1', async ({
    page,
  }) => {
    // --- Bước 1: Mở trang XOps Performance Dashboard ---
    await test.step('1. Navigate to XOps Performance Portal', async () => {
      await page.goto(XOPS_PORTAL_URL, { waitUntil: 'domcontentloaded' });
      await expect(page).toHaveTitle(/Performance Dashboard/i, { timeout: 30_000 });
      await page.waitForLoadState('networkidle').catch(() => {});
    });

    // --- Bước 2: Vào Leader Scorecard ---
    await test.step('2. Open Leader Scorecard', async () => {
      const leaderScorecard = page
        .getByRole('link', { name: /Leader Scorecard/i })
        .or(page.getByRole('button', { name: /Leader Scorecard/i }))
        .or(page.getByRole('menuitem', { name: /Leader Scorecard/i }))
        .or(page.getByText(/Leader Scorecard/i).first());

      await expect(leaderScorecard).toBeVisible({ timeout: 30_000 });
      await leaderScorecard.click();
      await page.waitForLoadState('networkidle').catch(() => {});
    });

    // --- Bước 3: Chọn leader Nguyễn Thái Bình ---
    await test.step(`3. Select leader "${LEADER_NAME}"`, async () => {
      const leaderOption = page
        .getByRole('option', { name: LEADER_NAME })
        .or(page.getByRole('button', { name: LEADER_NAME }))
        .or(page.getByRole('link', { name: LEADER_NAME }))
        .or(page.getByText(LEADER_NAME, { exact: true }).first());

      const leaderCombobox = page.getByRole('combobox', { name: /leader/i }).first();

      if (await leaderCombobox.isVisible().catch(() => false)) {
        await leaderCombobox.click();
        await page.getByRole('option', { name: LEADER_NAME }).click({ timeout: 15_000 });
      } else {
        await expect(leaderOption).toBeVisible({ timeout: 30_000 });
        await leaderOption.click();
      }

      await expect(page.getByText(LEADER_NAME).first()).toBeVisible({ timeout: 20_000 });
    });

    // --- Bước 4: Chọn period Quarterly FY26 Q1 ---
    await test.step('4. Select period Quarterly FY26 Q1', async () => {
      const periodControl = page
        .getByRole('combobox', { name: /period/i })
        .or(page.getByLabel(/period/i))
        .first();

      const periodOption = page
        .getByRole('option', { name: PERIOD_LABEL })
        .or(page.getByRole('button', { name: PERIOD_LABEL }))
        .or(page.getByText(PERIOD_LABEL).first());

      if (await periodControl.isVisible().catch(() => false)) {
        await periodControl.click();
        await page.getByRole('option', { name: PERIOD_LABEL }).click({ timeout: 15_000 });
      } else {
        await expect(periodOption).toBeVisible({ timeout: 30_000 });
        await periodOption.click();
      }

      await expect(page.getByText(PERIOD_LABEL).first()).toBeVisible({ timeout: 20_000 });
    });

    // --- Bước 5: Xác nhận scorecard hiển thị ---
    await test.step('5. Verify Leader Scorecard view is loaded', async () => {
      await expect(
        page
          .getByRole('heading', { name: /Leader Scorecard|Scorecard/i })
          .or(page.getByText(/Leader Scorecard/i))
          .first(),
      ).toBeVisible({ timeout: 20_000 });

      await expect(page.getByText(LEADER_NAME).first()).toBeVisible();
      await expect(page.getByText(PERIOD_LABEL).first()).toBeVisible();

      await page.screenshot({
        path: 'test-results/e2e/xops-leader-scorecard-result.png',
        fullPage: true,
      });
    });
  });
});
