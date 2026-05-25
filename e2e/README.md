# E2E test cases

Add Playwright test files here: `**/*.spec.ts`

## Local

```bash
npm install
npm run build
npx playwright install chromium
npm run test:e2e
```

Optional — test against your app:

```bash
PLAYWRIGHT_BASE_URL=http://localhost:4200 npm run test:e2e
```

## Examples

| File | Scenario |
|------|----------|
| [`smoke.spec.ts`](./smoke.spec.ts) | Smoke (example.com) |
| [`xops-leader-scorecard.spec.ts`](./xops-leader-scorecard.spec.ts) | XOps → Leader Scorecard → Nguyễn Thái Bình → Quarterly FY26 Q1 |
| [`XOPS-DEMO.md`](./XOPS-DEMO.md) | Step-by-step demo guide |

## CI

On **push** or **pull request**, workflow `.github/workflows/e2e.yml` runs all specs in this folder and reports pass/fail on GitHub.

For XOps tests, set GitHub variable `PLAYWRIGHT_BASE_URL` to the perf portal origin (see [XOPS-DEMO.md](./XOPS-DEMO.md)).
