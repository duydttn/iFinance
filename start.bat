@echo off
setlocal
title iFinance Production Launcher

echo ==========================================
echo    iFinance Production Launcher
echo ==========================================

:: Step 1: Kill any existing processes on port 3500
echo [0/2] Cleaning up existing processes on port 3500...
powershell -Command "Get-NetTCPConnection -LocalPort 3500 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"
ping 127.0.0.1 -n 3 >nul

:: Step 2: Check for dependencies
if not exist "node_modules\" (
    echo [ERROR] node_modules not found. Running 'npm install'...
    call npm install
)

:: Step 2: Build the UI for production
echo [1/2] Building UI (Production)...
cd client
if not exist "node_modules\" (
    echo [INFO] client/node_modules not found. Running 'npm install'...
    call npm install
)
call npm run build
cd ..

:: Step 3: Launch Electron in Production Mode
echo [2/2] Launching iFinance App...
echo.
echo Press Ctrl+C in this window to stop the server if needed.
echo.

:: Set environment variables for production behavior
set ELECTRON_IS_DEV=0
set NODE_ENV=production

:: Use cross-env if available, otherwise just node/electron
call npx electron .

echo.
echo iFinance has been closed.
pause
