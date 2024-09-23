@echo off
:: Installing Dependency
start npm install -a


:: Start the ReactJS application using the vite dev command with the dynamic port
echo Starting ReactJS application on port 3000...
start npm run dev -- --port 3000

:: Wait for a few seconds to allow the server to start
timeout /t 5 /nobreak >nul

:: Open the application in the default browser with the dynamic port
start http://localhost:3000

:: Pause the script so the command window stays open
pause