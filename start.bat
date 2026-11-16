@echo off
setlocal
cd /d "%~dp0"
echo Preparing AI Health demo with cloud Gemini...
if not exist ".venv\Scripts\python.exe" py -3.13 -m venv .venv
if errorlevel 1 exit /b 1
.venv\Scripts\python.exe -m pip install -r backend\requirements.lock
if errorlevel 1 exit /b 1
if not exist "backend\.env" (
  echo Create backend\.env from backend\.env.example and set GEMINI_API_KEY.
  exit /b 1
)
pushd frontend
call npm ci
if errorlevel 1 exit /b 1
call npm run build
if errorlevel 1 exit /b 1
popd
cd backend
echo Open http://127.0.0.1:8000
..\.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --no-server-header
