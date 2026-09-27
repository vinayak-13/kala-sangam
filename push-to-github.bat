@echo off
setlocal
echo ===================================================================
echo   KALA-SANGAM: Upload All 123 Source Files to GitHub
echo ===================================================================
cd /d "%~dp0"

echo.
echo Current Local Commit: 8c61a30 (Contains .npmrc, @types/node 22, and all src files)
echo Target GitHub Repo  : https://github.com/vinayak-13/kala-sangam
echo.

echo Staging all files...
"C:\Users\Admin\mingit\cmd\git.exe" add .
"C:\Users\Admin\mingit\cmd\git.exe" commit -m "feat: complete KALA-SANGAM Next.js app with all 123 files and deployment fixes" --allow-empty
"C:\Users\Admin\mingit\cmd\git.exe" branch -M main

echo.
echo Pushing to GitHub...
echo (If a browser window appears, click 'Authorize GitHub' or 'Sign in with your browser')
echo.

"C:\Users\Admin\mingit\cmd\git.exe" push -u origin main --force

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ===================================================================
    echo   PUSH FAILED OR NEEDS TOKEN AUTHENTICATION
    echo ===================================================================
    echo   If GitHub asked for a password, enter your Personal Access Token
    echo   from https://github.com/settings/tokens
    echo.
) else (
    echo.
    echo ===================================================================
    echo   SUCCESS! All files uploaded to GitHub.
    echo   Vercel will now automatically build the new commit!
    echo ===================================================================
)

pause
