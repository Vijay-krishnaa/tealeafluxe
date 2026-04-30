@echo off
REM Swadistchai - Quick Start for Windows
REM =====================================

echo 🍵 Swadistchai - Quick Start (Windows)
echo =======================================
echo.

REM Check if backend exists
if exist "backend" (
    echo ✅ Backend folder found
) else (
    echo ❌ Backend folder not found - Exiting
    exit /b 1
)

REM Check if frontend exists
if exist "frontend" (
    echo ✅ Frontend folder found
) else (
    echo ❌ Frontend folder not found - Exiting
    exit /b 1
)

echo.
echo 📋 SETUP CHECKLIST:
echo.
echo Step 1: Backend Setup
echo   - Create a file called .env in the backend folder
echo   - Copy content from backend\.env.example to .env
echo   - Update MONGODB_URI with your MongoDB connection string
echo.
echo Step 2: Install Backend Dependencies
echo   - Open PowerShell/CMD in backend folder
echo   - Run: npm install
echo.
echo Step 3: Start Backend
echo   - In backend folder, run: npm run dev
echo   - Should see: ✅ MongoDB connected and 🚀 Server running
echo.
echo Step 4: Start Frontend
echo   - Open NEW PowerShell/CMD window in frontend folder
echo   - Run: npm run dev
echo   - Frontend should open at http://localhost:5173
echo.
echo 🔑 DEFAULT ADMIN CREDENTIALS:
echo   Email: admin@tealeaf.com
echo   Password: admin123
echo.
echo 🌐 URLS:
echo   Frontend: http://localhost:5173
echo   Backend API: http://localhost:5000
echo   Admin Dashboard: http://localhost:5173/admin/dashboard
echo.
echo 📚 DOCUMENTATION:
echo   Backend API: backend\README.md
echo   Full Setup: SETUP.md
echo   Project Summary: PROJECT_SUMMARY.md
echo.
echo ✨ Your Swadistchai platform is ready to go!
echo.
pause
