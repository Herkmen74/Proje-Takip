# ⚠️ ÖNEMLİ: localhost:5000 Neden Açılmıyor?

## Kısa cevap

Cursor uygulamasındaki (bulut) terminalde çalıştırdığınız sunucu, **telefonunuzun veya bilgisayarınızın localhost’u değildir.**

Bu yüzden Safari / Chrome’da `localhost:5000` açınca **boş sayfa** veya bağlantı hatası görürsünüz.

---

## Doğru kullanım (kendi bilgisayarınızda)

Programı **kendi Windows / Mac / Linux bilgisayarınızda** çalıştırmanız gerekir.

### 1) Bilgisayara projeyi indirin

GitHub’dan indirin veya şu klasöre gidin:

```
Proje-Takip
```

### 2) Terminali bilgisayarınızda açın

- **Windows:** klasörde adres çubuğuna `cmd` yazıp Enter
- **Mac:** Terminal uygulaması

### 3) Kurulum

```bash
pip install -r requirements.txt
```

FFmpeg yoksa kurun:

- Windows: https://ffmpeg.org/download.html
- Mac: `brew install ffmpeg`
- Ubuntu: `sudo apt-get install ffmpeg`

### 4) Sunucuyu başlatın

Cursor / Linux ortamında çoğu zaman `python` yoktur. Şunu kullanın:

```bash
python3 app.py
```

veya:

```bash
./baslat
```

Windows’ta genelde:

```bash
python app.py
```

Şunu görmelisiniz:

```
* Running on http://127.0.0.1:5000
```

### 5) Aynı bilgisayardan açın

Tarayıcıda:

```
http://localhost:5000
```

### 6) iPhone’dan açın

1. Bilgisayar ve iPhone **aynı WiFi**’de olsun
2. Bilgisayarın IP’sini öğrenin:
   - Windows: `ipconfig` → IPv4
   - Mac: `ipconfig getifaddr en0`
3. iPhone Safari’de açın:

```
http://192.168.x.x:5000
```

(`192.168.x.x` yerine kendi IP’nizi yazın)

---

## Cursor telefon uygulamasından çalışmaz mı?

Cursor Cloud terminali uzak bir sunucudadır. Orada `python app.py` çalışsa bile:

| Nerede açıyorsunuz? | Sonuç |
|---|---|
| Telefon Safari → `localhost:5000` | ❌ Boş / açılmaz |
| Cursor Cloud içi `localhost:5000` | ❌ Telefondan erişilemez |
| Kendi PC’de `python app.py` → `localhost:5000` | ✅ Çalışır |
| Kendi PC’de sunucu + iPhone’dan IP:5000 | ✅ Çalışır |

---

## Sık hatalar

| Yazılan | Sonuç |
|---|---|
| `phyton app.py` | `command not found` |
| Cursor’da sunucu + telefonda localhost | Boş sayfa |
| Farklı WiFi | iPhone bağlanamaz |

Doğru komut:

```bash
python app.py
```

---

## Hâlâ boş sayfa mı?

Bilgisayarınızda şu kontrolü yapın:

1. Terminalde sunucu hâlâ çalışıyor mu? (`Running on http://127.0.0.1:5000` görünmeli)
2. Adres tam olarak `http://localhost:5000` mi? (`https` değil)
3. Windows Firewall 5000 portunu engelliyor olabilir — izin verin
