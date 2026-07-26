# Bilgisayarınızda Kurulum (localhost için zorunlu)

Cursor telefon/bulut uygulamasındaki sunucu, bilgisayarınızdaki `localhost:5000` değildir.  
`localhost` ancak program **sizin PC’nizde** çalışınca açılır.

## Windows

### 1) Python kurun
https://www.python.org/downloads/

Kurulumda **“Add python.exe to PATH”** kutusunu işaretleyin.

### 2) FFmpeg kurun
https://ffmpeg.org/download.html  
veya: https://www.gyan.dev/ffmpeg/builds/ → `ffmpeg-release-essentials.zip`

`ffmpeg.exe` yolunu PATH’e ekleyin. Kontrol:

```bat
ffmpeg -version
```

### 3) Projeyi indirin
GitHub: https://github.com/Herkmen74/Proje-Takip

ZIP indirip bir klasöre çıkarın, örneğin:

```
C:\Users\Adiniz\Desktop\Proje-Takip
```

### 4) O klasörde CMD açın
Klasörde adres çubuğuna `cmd` yazıp Enter.

### 5) Kurulum + başlatma

```bat
pip install -r requirements.txt
python app.py
```

Şunu görmelisiniz:

```
Running on http://127.0.0.1:5000
```

### 6) Tarayıcı

```
http://127.0.0.1:5000
```

## Mac

```bash
brew install python ffmpeg
cd Proje-Takip
pip3 install -r requirements.txt
python3 app.py
```

Tarayıcı: `http://127.0.0.1:5000`

## iPhone (sonraki adım)

1. PC’de `python app.py` çalışır durumda kalsın  
2. PC ve iPhone aynı WiFi  
3. PC IP’sini öğrenin (`ipconfig`)  
4. Safari: `http://192.168.x.x:5000`

## Olmazsa kontrol

| Belirti | Çözüm |
|---|---|
| `python: command not found` | Python kurun / PATH’e ekleyin; veya `py app.py` deneyin |
| `Address already in use` | Eski sunucuyu kapatın (Ctrl+C) veya pencereyi kapatıp tekrar açın |
| Sayfa açılmıyor | Adres `http://` olsun (`https://` değil) |
| Cursor’da sunucu açtım | Bu bilgisayar localhost’u değildir — yukarıdaki adımlarla PC’de çalıştırın |
