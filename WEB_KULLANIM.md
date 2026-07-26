# 🌐 Web Arayüzü Kullanım Kılavuzu

iOS cihazınızdan YouTube videolarına Türkçe alt yazı eklemek için web arayüzü kullanın.

> ⚠️ Önce şunu okuyun: [ONEMLI_OKU.md](ONEMLI_OKU.md)  
> Cursor telefon/bulut terminalinde sunucu açıp `localhost:5000` denemek **çalışmaz** (boş sayfa).  
> Sunucu **kendi PC/Mac’inizde** çalışmalı.

## 📱 iOS'tan Nasıl Kullanılır?

### 1️⃣ Kendi bilgisayarınızda Sunucuyu Başlatın

Cursor Cloud değil — Windows/Mac bilgisayarınızın kendi terminali:

```bash
# Gerekli paketleri yükleyin (ilk seferde)
pip install -r requirements.txt

# Web sunucusunu başlatın (dikkat: python — phyton değil!)
python app.py
```

veya daha kolay:

```bash
# Windows
START_WEB.bat

# Mac / Linux
./START_WEB.sh
```

> ⚠️ **Sık hata:** `phyton app.py` yazmak → `command not found`  
> Doğrusu: `python app.py` veya `python3 app.py`

Sunucu başladığında şuna benzer bir çıktı göreceksiniz:

```
============================================================
🌐 YouTube Subtitle Translator - Web Arayüzü
============================================================

✨ Sunucu başlatılıyor...

📱 iOS Cihazınızdan Erişim:

   1. Bilgisayar ve telefon AYNI WiFi'ye bağlı olmalı
   2. Bilgisayarınızın IP adresini öğrenin:
      • Windows: ipconfig
      • Mac/Linux: ifconfig veya ip addr

   3. iOS Safari'den şu adrese gidin:
      http://BILGISAYAR_IP:5000
      Örnek: http://192.168.1.100:5000

💻 Bilgisayardan Erişim:
   http://localhost:5000

============================================================
```

### 2️⃣ Bilgisayarınızın IP Adresini Bulun

**Windows:**
```bash
ipconfig
```
`IPv4 Address` satırını bulun (örn: 192.168.1.100)

**Mac:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Linux:**
```bash
ip addr show | grep "inet " | grep -v 127.0.0.1
```

### 3️⃣ iOS Safari'den Bağlanın

1. **Aynı WiFi'ye bağlanın** - Bilgisayar ve iPhone aynı WiFi ağında olmalı
2. **Safari'yi açın**
3. **IP adresini girin**: `http://192.168.1.100:5000` (kendi IP'nizi kullanın)
4. **Web arayüzü açılacak** ✨

### 4️⃣ Video İşleyin

1. YouTube video URL'sini yapıştırın
2. "Başlat" butonuna tıklayın
3. İşlem tamamlanırken ilerlemeyi takip edin:
   - 📥 Video indiriliyor
   - 🔄 Alt yazılar çevriliyor
   - 🎬 Videoya ekleniyor
4. ✅ Tamamlandığında dosyaları indirin

---

## 🖥️ Bilgisayardan Kullanım

Daha basit! Sadece:

```bash
python app.py
```

Sonra tarayıcıdan: **http://localhost:5000**

---

## ⚙️ Özellikler

- ✅ **Mobil Uyumlu**: iOS Safari için optimize edilmiş tasarım
- ✅ **Gerçek Zamanlı İlerleme**: Her adımı canlı takip edin
- ✅ **Kolay İndirme**: Video ve alt yazı dosyalarını tek tıkla indirin
- ✅ **Modern Arayüz**: Kullanıcı dostu ve şık tasarım
- ✅ **Güvenli**: Veriler sadece yerel ağınızda işlenir

---

## 🎯 Kullanım Senaryoları

### Senaryo 1: iPhone'dan Kullanım
1. Bilgisayarda `python app.py` çalıştır
2. iPhone'u aynı WiFi'ye bağla
3. Safari'den IP:5000'e gir
4. YouTube URL yapıştır, işle, indir

### Senaryo 2: Bilgisayardan Kullanım
1. `python app.py` çalıştır
2. `localhost:5000` aç
3. URL yapıştır, işle

### Senaryo 3: Birden Fazla Cihaz
- Bir bilgisayarda sunucu çalışsın
- Tüm aile üyeleri kendi cihazlarından erişsin
- Aynı anda farklı videolar işlenebilir

---

## 🔧 Sorun Giderme

### "Siteye erişilemiyor" hatası

**Çözüm 1: Aynı WiFi'de misiniz?**
```bash
# iOS: Ayarlar → WiFi → Ağ adını kontrol et
# Bilgisayar: Aynı ağa bağlı olmalı
```

**Çözüm 2: Firewall kontrolü**
```bash
# Windows Firewall'da port 5000'i açın
# Mac: Sistem Tercihleri → Güvenlik → Güvenlik Duvarı
```

**Çözüm 3: IP adresini doğru mu girdiniz?**
```bash
# Tekrar kontrol edin: ipconfig veya ifconfig
# http:// ile başlamalı
# :5000 ile bitmeli
```

### "Bağlantı hatası" mesajı

1. Sunucu çalışıyor mu kontrol edin
2. Terminal/CMD'de hata var mı bakın
3. Başka bir tarayıcı deneyin

### Video indirilmiyor

1. FFmpeg yüklü mü kontrol edin: `ffmpeg -version`
2. Yeterli disk alanı var mı?
3. İnternet bağlantınız stabil mi?

### iOS'ta indirme çalışmıyor

iOS Safari dosyaları "İndirilenler" klasörüne kaydeder:
1. Safari → İndirilenler simgesi (yukarı ok)
2. Dosyayı bul
3. Paylaş → Fotoğraflar'a kaydet (video için)

---

## 💡 İpuçları

1. **Hızlı Bağlantı**: IP adresini Safari'de yer imlerine ekleyin
2. **Offline İzleme**: İndirilen videoları VLC veya iPhone'un Video oynatıcısında izleyin
3. **Toplu İşlem**: Birden fazla tarayıcı sekmesinde farklı videolar işleyin
4. **Disk Alanı**: Büyük videolar için `output/` klasörünü düzenli temizleyin

---

## 🔒 Güvenlik

- ✅ Tüm işlemler yerel ağınızda gerçekleşir
- ✅ Veriler internete gönderilmez (sadece YouTube indirme)
- ✅ Dosyalar sadece sizin cihazlarınızda saklanır
- ⚠️ Güvenlik için sadece güvendiğiniz WiFi ağlarında kullanın

---

## 📞 Destek

Sorun yaşıyorsanız:
1. Terminal/CMD'deki hata mesajlarını kontrol edin
2. `README.md` ve `HIZLI_BASLANGIÇ.md` dosyalarını okuyun
3. GitHub'da issue açın

---

## 🎉 Başarılı Kullanım!

Artık iPhone'unuzdan YouTube videolarına Türkçe alt yazı ekleyebilirsiniz!

**Web Arayüzü Avantajları:**
- ❌ iOS'a Python yüklemek yok
- ❌ Karmaşık kurulum yok
- ✅ Sadece tarayıcı yeterli
- ✅ Her cihazdan erişim
- ✅ Kolay ve hızlı

**İyi Çeviriler! 🚀**
