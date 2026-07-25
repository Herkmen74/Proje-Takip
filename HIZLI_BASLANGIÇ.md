# 🚀 Hızlı Başlangıç Kılavuzu

YouTube videolarına Türkçe alt yazı eklemek için adım adım rehber.

## ⚡ 3 Adımda Başlayın

### 1️⃣ Kurulum (Tek Seferlik)

```bash
# Python paketlerini yükle
pip install -r requirements.txt

# FFmpeg kontrolü (genellikle zaten yüklüdür)
ffmpeg -version
```

FFmpeg yoksa:
- **Ubuntu/Debian**: `sudo apt-get install ffmpeg`
- **macOS**: `brew install ffmpeg`
- **Windows**: [ffmpeg.org](https://ffmpeg.org/download.html)'dan indir

### 2️⃣ YouTube Video URL'sini Kopyala

YouTube'da videoyu aç ve URL'yi kopyala:
- `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- `https://youtu.be/dQw4w9WgXcQ`

### 3️⃣ Programı Çalıştır

```bash
python youtube_subtitle_translator.py "BURAYA_URL_YAPIŞTIR"
```

✨ **Bitti!** `output/` klasöründe Türkçe alt yazılı videonuz hazır!

---

## 📋 Örnek Kullanımlar

### Varsayılan (Hem video hem .srt dosyası)
```bash
python youtube_subtitle_translator.py "https://www.youtube.com/watch?v=abc123"
```

### Sadece .srt dosyası istiyorum
```bash
python youtube_subtitle_translator.py "URL" --no-embed
```

### Sadece videoya gömülü alt yazı istiyorum
```bash
python youtube_subtitle_translator.py "URL" --no-separate
```

### Farklı bir klasöre kaydet
```bash
python youtube_subtitle_translator.py "URL" --output-dir my_videos
```

---

## 🎬 Ne Yapıyor?

1. ⬇️ YouTube'dan videoyu indirir
2. 📝 İngilizce alt yazıları bulur
3. 🔄 Google Translate ile Türkçeye çevirir
4. 🎥 Alt yazıları videoya ekler
5. ✅ Türkçe alt yazılı video hazır!

---

## 📂 Çıktı Dosyaları

`output/` klasöründe:

- `Video_Adı_TR.mp4` - Türkçe alt yazılı video
- `Video_Adı_turkish.srt` - Türkçe alt yazı dosyası
- `video.mp4` - Orijinal video
- `subtitles.en.srt` - Orijinal İngilizce alt yazı

---

## ❓ Sık Sorulan Sorular

### Hangi videolar çalışır?
YouTube'da İngilizce alt yazısı olan tüm videolar.

### Çeviri kalitesi nasıl?
Google Translate kullanır - genelde iyi ama %100 mükemmel değil.

### Ne kadar sürer?
5 dakikalık video için yaklaşık 1-2 dakika (internet hızına bağlı).

### Ücretsiz mi?
Evet, tamamen ücretsiz! Tüm araçlar açık kaynak.

---

## 🆘 Sorun mu Yaşıyorsun?

### "FFmpeg bulunamadı"
```bash
# Ubuntu/Debian
sudo apt-get install ffmpeg

# macOS
brew install ffmpeg
```

### "Alt yazı bulunamadı"
Videoda İngilizce alt yazı olmayabilir. YouTube'da kontrol et:
1. Videoyu aç
2. Ayarlar (⚙️) → Alt yazılar
3. İngilizce seçeneği var mı?

### "İnternet bağlantısı hatası"
İnternet bağlantınızı kontrol edin. Tekrar deneyin.

### Çeviri çok yavaş
Normal! Her alt yazı satırı tek tek çevriliyor. Sabırlı olun.

---

## 💡 İpuçları

1. **Kısa videolarla başlayın** - İlk testte 2-3 dakikalık video kullanın
2. **İnternet hızınız önemli** - Video indirme için iyi bağlantı gerekli
3. **Disk alanı** - Büyük videolar için yeterli alan olsun
4. **Çeviri kontrolü** - Oluşan .srt dosyasını kontrol edip düzenleyebilirsiniz

---

## 🎓 İleri Seviye

### Interaktif Mod
```bash
python example.py
```
URL'yi programı çalıştırdıktan sonra girin.

### Test Çalıştır
```bash
python test_translator.py
```
Çeviri fonksiyonunu test eder (YouTube indirmeden).

### Yardım
```bash
python youtube_subtitle_translator.py --help
```
Tüm seçenekleri görün.

---

## 📞 Destek

Sorunla karşılaşırsan:
1. `README.md` dosyasını oku
2. Hata mesajını oku ve anlat
3. GitHub'da issue aç

---

**Mutlu Çeviriler! 🎉**
