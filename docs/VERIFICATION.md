# Presentation deployment verification

Verified on 2026-11-16.

- Live app: https://ai-health-hospital-demo.onrender.com
- Render service: `srv-dbtbki56e07s73c0kvng`, Free, Frankfurt, Docker.
- Application source commit: `400ef4dfcb44b27ccae9ebfdafb4ff893d82e50c`.
- Automatic deploys are disabled. Later code changes require a manual Render deploy.
- `/api/healthz`: HTTP 200, database ready, AI configured.
- Public registration: HTTP 201; login: HTTP 200.
- Real Gemini smoke calls: chat, symptoms, quiz and a generated non-personal PNG all returned HTTP 200.
- Chat history persisted two messages; unknown API returned HTTP 404; no error-level Render logs during verification.

## Local automated checks

- `npm run lint`, `npm run build`, `npm audit`: passed, zero npm vulnerabilities.
- `python -m ruff check app`, `python -m ruff format --check app`: passed.
- `python -m mypy --strict app`: passed for 29 modules.
- `python -m pytest`: 19 passed, 91.28% coverage (80% minimum).
- `python -m bandit -r app -q`: passed.
- `python -m pip_audit -r requirements.txt`: no known vulnerabilities.
- Playwright: registration, authenticated navigation, chat success and quota-error UI passed.
- axe WCAG A/AA: no violations on home/chat/images/symptoms, both themes.
- Screenshots and overflow checks: 375/768/1280/1920 px, both themes, those four pages; no horizontal overflow or page errors.
- Docker image built successfully on Render. No local Docker installation was available.

## Mobile Lighthouse (local production build)

Performance 92; Accessibility 98; Best Practices 100; SEO 54.
LCP 1.2 s, CLS 0, TBT 340 ms.
Initial baseline: Performance 77, LCP 4.7 s, CLS 0, TBT 290 ms.
SEO is intentionally limited by `noindex` for an educational demo.
TBT is a laboratory metric, not field INP. Field INP has not been measured.
The initial JS is approximately 207 KB gzip across shared/main chunks (previously 478 KB).
It exceeds the 170 KB guideline by about 37 KB; the remaining client stack includes React, routing, forms, i18n and animations.
PDF export is a separate, on-demand 266 KB gzip chunk. No performance guarantee is made for cold starts on free Render.

## Remaining limits

- Ephemeral SQLite: demo accounts/history reset on restart, deploy and idle sleep.
- Single-process, in-memory throttling; not a production security or clinical certification.
- Frontend remains the existing JavaScript project; no TypeScript migration was performed. Backend type checking is strict.
- Gemini free-tier quotas/availability vary and content may be used to improve Google products. Use only fictional data.
- Old credentials remain in repository history/main and must be revoked separately. No history rewrite was performed.
- App tokens are memory-only; sign in again after refreshing.
