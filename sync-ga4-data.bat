@echo off
echo.
echo ===================================================
echo   Google Analytics (GA4) Data Sync
echo ===================================================
echo.

cd backend

echo Checking if npm is installed...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not installed or not in PATH
    exit /b 1
)

echo.
echo Running GA4 sync...
echo.

npm run sync:ga4

echo.
echo ===================================================
echo   Sync Complete!
echo ===================================================
echo.
pause
