@echo off
echo ========================================================
echo   Uploading complete KALA-SANGAM project to GitHub...
echo ========================================================
cd /d "%~dp0"
"C:\Users\Admin\mingit\cmd\git.exe" add .
"C:\Users\Admin\mingit\cmd\git.exe" commit -m "feat: complete KALA-SANGAM Next.js app with all 123 source files" --allow-empty
"C:\Users\Admin\mingit\cmd\git.exe" branch -M main
"C:\Users\Admin\mingit\cmd\git.exe" push -u origin main --force
echo.
echo ========================================================
echo   Done! Check https://github.com/vinayak-13/kala-sangam
echo ========================================================
pause
