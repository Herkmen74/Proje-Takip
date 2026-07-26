@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ============================================================
echo   YouTube Alt Yazi Cevirici - Web Sunucusu
echo ============================================================
echo.

where python >nul 2>&1
if %ERRORLEVEL%==0 (
    set PYTHON=python
    goto :found
)

where python3 >nul 2>&1
if %ERRORLEVEL%==0 (
    set PYTHON=python3
    goto :found
)

where py >nul 2>&1
if %ERRORLEVEL%==0 (
    set PYTHON=py
    goto :found
)

echo HATA: Python bulunamadi!
echo Once su komutu calistirin: pip install -r requirements.txt
echo.
echo NOT: Komut "python" olmali. "phyton" yazarsaniz calismaz.
pause
exit /b 1

:found
echo Python bulundu: %PYTHON%
%PYTHON% --version
echo.

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set IP=%%a
    goto :show
)

:show
echo iOS Safari'den acin:
echo    http://%IP:~1%:5000
echo.
echo Bilgisayardan acin:
echo    http://localhost:5000
echo.
echo Durdurmak icin: Ctrl+C
echo ============================================================
echo.

%PYTHON% app.py
pause
