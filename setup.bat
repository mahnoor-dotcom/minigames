@echo off
REM Setup script for Multi-Game Platform
REM Windows batch file to install dependencies and start the server

echo ====================================
echo Multi-Game Platform Setup
echo ====================================
echo.

echo Step 1: Creating virtual environment...
python -m venv venv
echo Virtual environment created!
echo.

echo Step 2: Activating virtual environment...
call venv\Scripts\activate.bat
echo Virtual environment activated!
echo.

echo Step 3: Installing dependencies...
pip install -r requirements.txt
echo Dependencies installed!
echo.

echo Step 4: Starting Flask server...
echo.
echo ====================================
echo Server is running!
echo Open your browser and go to:
echo http://localhost:5000
echo ====================================
echo.

python app.py

pause
