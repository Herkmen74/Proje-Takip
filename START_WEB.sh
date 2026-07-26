#!/bin/bash
set -e
cd "$(dirname "$0")"

echo "============================================================"
echo "  YouTube Alt Yazi Cevirici - Web Sunucusu"
echo "============================================================"
echo ""

# python / python3 hangisi varsa onu kullan
if command -v python3 >/dev/null 2>&1; then
    PYTHON=python3
elif command -v python >/dev/null 2>&1; then
    PYTHON=python
else
    echo "HATA: Python bulunamadi!"
    echo "Once su komutu calistirin: pip install -r requirements.txt"
    exit 1
fi

echo "Python: $($PYTHON --version)"
echo ""

# IP adresini bul
if [[ "$OSTYPE" == "darwin"* ]]; then
    IP=$(ipconfig getifaddr en0 2>/dev/null || ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
elif command -v hostname >/dev/null 2>&1 && hostname -I >/dev/null 2>&1; then
    IP=$(hostname -I | awk '{print $1}')
else
    IP=$(hostname -i 2>/dev/null || echo "BILGISAYAR_IP")
fi

echo "iOS Safari'den acin:"
echo "   http://${IP}:5000"
echo ""
echo "Bilgisayardan acin:"
echo "   http://localhost:5000"
echo ""
echo "Durdurmak icin: Ctrl+C"
echo "============================================================"
echo ""

$PYTHON app.py
