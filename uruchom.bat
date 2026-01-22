@echo off
cd /d "%~dp0"
echo Uruchamianie aplikacji Next.js...
echo.

if not exist "node_modules" (
    echo Instalowanie zaleznosci...
    npm install
    echo.
)

echo Startowanie serwera deweloperskiego na http://localhost:3000
start http://localhost:3000
npm run dev
pause
