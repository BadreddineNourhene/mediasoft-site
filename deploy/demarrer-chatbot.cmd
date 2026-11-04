@echo off
rem Lance l API du chatbot (tache planifiee "Mediasoft Chatbot", au demarrage de Windows)
cd /d "%~dp0"
if not exist logs mkdir logs
set PYTHONIOENCODING=utf-8
"%~dp0venv\Scripts\python.exe" -m uvicorn app:app --host 127.0.0.1 --port 8010 >> logs\chatbot.log 2>&1
