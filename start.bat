@echo off
REM Starts the whole app: the backend and the Expo app, each in its own window.
REM %~dp0 is the folder this file is in, so it works from anywhere.

start "MiniLedger Backend" cmd /k "cd /d %~dp0backend && npm run dev"
start "MiniLedger App" cmd /k "cd /d %~dp0mobile && npx expo start"
