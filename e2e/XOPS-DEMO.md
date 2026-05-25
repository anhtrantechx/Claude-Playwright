# Demo E2E — XOps Leader Scorecard

Test file: [`xops-leader-scorecard.spec.ts`](./xops-leader-scorecard.spec.ts)

Portal: [Performance Dashboard (dev)](https://perf-portal-dev.xops-core-platform.techxdata.io/?period_id=M05+-+FY2026)

---

## Luồng người dùng (step by step)

| Bước | Hành vi người dùng | Automation (Playwright) |
|------|--------------------|-------------------------|
| 1 | Mở link XOps Performance Portal | `page.goto(XOPS_PORTAL_URL)` |
| 2 | Click **Leader Scorecard** | `getByRole('link'/'button', { name: /Leader Scorecard/ })` |
| 3 | Chọn leader **Nguyễn Thái Bình** | Combobox hoặc click tên leader |
| 4 | Chọn period **Quarterly FY26 Q1** | Combobox period hoặc click label |
| 5 | Xem scorecard đã load | `expect` heading + tên leader + period; screenshot |

---

## Chạy trên máy bạn

```bash
cd ~/Desktop/claude-playwright   # hoặc repo đã clone

npm install
npm run build
npx playwright install chromium

# Chỉ chạy test XOps
npm run test:e2e -- e2e/xops-leader-scorecard.spec.ts

# UI mode (xem từng bước — khuyên dùng lần đầu)
npx playwright test -c playwright.e2e.config.ts e2e/xops-leader-scorecard.spec.ts --headed --debug
```

Tuỳ chọn — đổi URL:

```bash
XOPS_PORTAL_URL="https://perf-portal-dev.xops-core-platform.techxdata.io/?period_id=M05+-+FY2026" \
  npm run test:e2e -- e2e/xops-leader-scorecard.spec.ts
```

---

## Sau khi viết xong → CI tự chạy

```bash
git add e2e/xops-leader-scorecard.spec.ts e2e/XOPS-DEMO.md
git commit -m "test(e2e): XOps leader scorecard — Nguyễn Thái Bình, Quarterly FY26 Q1"
git push
```

Trên GitHub: **Actions** → workflow **E2E (Playwright)** → xem pass/fail.

**CI:** Workflow E2E không chạy `npm run build` (tránh OOM tsup DTS trên runner).  
Tuỳ chọn variable `XOPS_PORTAL_URL` trong Settings → Actions → Variables.

Nếu cần build package trên CI khác: dùng `npm run build:ci` (heap 6GB).

---

## Nếu test fail (selector / login)

1. Chạy codegen để ghi lại đúng selector trên UI thật:

   ```bash
   npx playwright codegen "https://perf-portal-dev.xops-core-platform.techxdata.io/?period_id=M05+-+FY2026"
   ```

2. Cập nhật `xops-leader-scorecard.spec.ts` theo thao tác thật.

3. Nếu cần đăng nhập SSO: thêm `storageState` hoặc bước login trong `test.beforeEach` (chưa có trong demo).

---

## Bước cuối cùng

- **Local pass** → push → **CI pass** → merge PR.
- **Fail** → mở log Actions + screenshot `test-results/e2e/xops-leader-scorecard-result.png` → sửa spec → push lại.
