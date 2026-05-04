@echo off
chcp 65001 >nul
echo === Запуск AI Health (Режим Разработки и Презентаций) ===

:: 1. Всегда собираем свежий фронтенд (костыль убран!)
echo [1/3] Собираем фронтенд...
cd frontend
call npm run build
cd ..

:: 2. Жесткая фиксация ИИ в памяти
echo [2/3] Прогрев нейросетей Qwen и LLaVA...
start "AI - Консультант (Qwen)" cmd /k "echo Нейросеть Qwen загружена в память. НЕ ЗАКРЫВАЙТЕ ОКНО! && ollama run qwen"
start "AI - Диагност (LLaVA)" cmd /k "echo Нейросеть LLaVA загружена в память. НЕ ЗАКРЫВАЙТЕ ОКНО! && ollama run llava"

timeout /t 5 >nul

:: 3. Запуск Бэкенда
echo [3/3] Запуск ядра системы...
cd backend
if not exist "venv" (python -m venv venv && call venv\Scripts\activate && pip install -r requirements.txt) else (call venv\Scripts\activate)

echo.
echo =======================================================
echo ВСЕ СИСТЕМЫ РАБОТАЮТ! Открой: http://127.0.0.1:8000
echo =======================================================
echo.
uvicorn app.main:app --host 0.0.0.0 --port 8000