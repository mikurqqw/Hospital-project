# AI Health — presentation demo

An educational health dashboard built with React 19 / Vite 8 and FastAPI / SQLAlchemy / SQLite.
Features: authenticated chat, symptom education, image descriptions, health records, BMI/calorie calculations and quizzes.
Ollama Qwen and LLaVA are replaced by the Gemini REST API (`gemini-3.5-flash-lite`). No local model or GPU is required.

## Local launch (Windows)

1. Install Python 3.13, Node.js 24 and npm.
2. Create `backend/.env` from `backend/.env.example`. Supply a NEW Gemini key and generate a random `SECRET_KEY`.
3. Run `start.bat` and open http://127.0.0.1:8000.
4. Register with invented data. Sessions live in memory: sign in again after refreshing.

For development, run `npm run dev` in `frontend`; Vite proxies `/api` to FastAPI on port 8000.

## Presentation outline (3–5 minutes)

1. Explain the idea: one interface for educational health information and personal records.
2. Register a fictional account. Ask the AI consultant a general question about sleep habits.
3. Select symptoms and show educational information and warnings, rather than a diagnosis.
4. Upload a non-personal sample PNG/JPEG/WebP under 5 MB. Gemini describes it without diagnosing.
5. Complete the profile and show BMI and nutrition calculations. These use formulas, not AI diagnosis.
6. Show a quiz, language switch and light/dark theme.

The specialist directory and appointments are demo UI, not real appointments or a hospital integration.

## Render deployment

Use one Docker Web Service, Free plan, Frankfurt, repository `mikurqqw/Hospital-project`, branch `feat/render-cloud-ai`, Dockerfile `./Dockerfile`, context `.`.
Docker builds React and serves it through FastAPI on `0.0.0.0:$PORT` as a non-root user.
Set `GEMINI_API_KEY`, `GEMINI_MODEL=gemini-3.5-flash-lite`, `SECRET_KEY` and `DEMO_MODE=true` in Render Environment.
Readiness: `/api/healthz` (does not call Gemini or consume quota).

Free Render sleeps after inactivity. Open the app before the presentation. SQLite is ephemeral: accounts/history disappear on restart, deploy or sleep. Create a fresh demo account if needed.
Free services in a workspace share a monthly allowance; this workspace also hosts other services.

## Checks

Install Python tools with `pip install -r backend/requirements-dev.txt` in an isolated Python 3.13 environment.

From `frontend`:

```sh
npm ci
npm run lint
npm run build
npm audit
npx playwright install chromium
npm run test:e2e
```

From `backend` with the virtual environment active:

```sh
python -m ruff check app
python -m ruff format --check app
python -m mypy --strict app
python -m pytest
python -m bandit -r app -q
python -m pip_audit -r requirements.lock
```

Browser tests cover registration, authenticated navigation, AI success/quota errors, accessibility and responsive themes. Browser AI responses are mocked; separate real Gemini checks require the key.

## Security and limits

- Educational demo, not a clinical product. Do not enter real patient data or use output for medical decisions.
- Text/images go to Google. Gemini free-tier content can be used to improve products; availability and quotas depend on the account/region.
- API keys stay on the backend. Previously published credentials must be revoked; removing files does not erase Git history.
- Historical `.env`, databases, bytecode, `node_modules` and built assets are untracked. Local copies are preserved.
- Tokens remain in memory. Ownership checks protect records, uploads are validated and limited, and provider errors are not exposed.
- Throttling is for one demo process. Production needs persistent storage, migrations, shared rate limiting and further auth/privacy/clinical review.

References: [Gemini model](https://aistudio.google.com/docs/models/gemini-3.5-flash-lite), [Gemini pricing/data policy](https://aistudio.google.com/docs/pricing), [Render Free limits](https://render.com/docs/free).
