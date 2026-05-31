@echo off
REM start.bat — double-click to launch Alexander's Photo Store
REM Starts a tiny local web server and opens the app in your browser.

powershell -ExecutionPolicy Bypass -NoProfile -File "%~dp0start.ps1"
pause
