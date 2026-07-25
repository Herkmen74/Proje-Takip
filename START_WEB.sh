#!/bin/bash

echo "============================================================"
echo "🌐 YouTube Alt Yazı Çevirici - Web Sunucusu"
echo "============================================================"
echo ""
echo "🔍 Bilgisayar IP adresi bulunuyor..."
echo ""

# Get IP address based on OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    IP=$(hostname -I | awk '{print $1}')
else
    # Windows (Git Bash)
    IP=$(ipconfig | grep "IPv4" | awk '{print $NF}' | head -1)
fi

echo "📱 iOS Safari'den şu adrese gidin:"
echo ""
echo "   http://$IP:5000"
echo ""
echo "💻 Bilgisayardan:"
echo ""
echo "   http://localhost:5000"
echo ""
echo "============================================================"
echo ""
echo "🚀 Sunucu başlatılıyor..."
echo ""

python3 app.py
