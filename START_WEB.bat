@echo off
echo ============================================================
echo 🌐 YouTube Alt Yazı Çevirici - Web Sunucusu
echo ============================================================
echo.
echo 🔍 Bilgisayar IP adresi bulunuyor...
echo.

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| find "IPv4"') do (
    set IP=%%a
    goto :found
)

:found
echo 📱 iOS Safari'den şu adrese gidin:
echo.
echo    http://%IP:~1%:5000
echo.
echo 💻 Bilgisayardan:
echo.
echo    http://localhost:5000
echo.
echo ============================================================
echo.
echo 🚀 Sunucu başlatılıyor...
echo.

python app.py
pause
