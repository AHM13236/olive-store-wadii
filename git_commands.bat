@echo off
echo ========================================
echo    Git Commands for GitHub Upload
echo ========================================
echo.

echo Step 1: Initialize Git repository...
git init

echo.
echo Step 2: Add all files...
git add .

echo.
echo Step 3: Create initial commit...
git commit -m "Initial commit - Olive Store for Vercel"

echo.
echo Step 4: Set main branch...
git branch -M main

echo.
echo ========================================
echo IMPORTANT: Replace 'yourusername' with your GitHub username
echo ========================================
echo.
echo Copy and run this command manually:
echo git remote add origin https://github.com/yourusername/olive-store-vercel.git
echo git push -u origin main
echo.
echo ========================================
echo Done! Now go to GitHub and create the repository first!
echo ========================================
pause