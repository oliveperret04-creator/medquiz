@echo off
echo ========================================
echo    MedQuiz - Quiz Medical Competitif
echo ========================================
echo.

echo Demarrage de MongoDB...
echo (Assurez-vous que MongoDB est installe et en cours d'execution)
echo.

echo Installation des dependances...
cd backend
call npm install
echo.

echo Initialisation de la base de donnees...
call node initDb.js
echo.

echo Demarrage du serveur...
echo Le serveur sera accessible sur http://localhost:3000
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.
call npm start

pause
