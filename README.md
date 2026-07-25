# YouTube Alt Yazı Çevirici (İngilizce → Türkçe)

YouTube'dan İngilizce videolar indirip, alt yazıları Türkçeye çeviren ve videoya ekleyen Python programı.

## 🌐 Web Arayüzü (Yeni!)

**iOS cihazlardan kullanım için web arayüzü eklenmiştir!**

```bash
python app.py
```

Sonra iOS Safari'den: `http://BILGISAYAR_IP:5000`

📖 Detaylı kullanım için: [WEB_KULLANIM.md](WEB_KULLANIM.md)

## 🌟 Özellikler

- ✅ YouTube videolarını otomatik indirir
- ✅ İngilizce alt yazıları otomatik bulur ve indirir
- ✅ Google Translate ile İngilizce → Türkçe çeviri yapar
- ✅ Türkçe alt yazıları videoya ekler (hardcoded)
- ✅ Ayrı .srt dosyası olarak da kaydeder
- ✅ Kolay kullanım ve kurulum

## 📋 Gereksinimler

- Python 3.7 veya üzeri
- FFmpeg (video işleme için)

## 🚀 Kurulum

### 1. Python Paketlerini Yükleyin

```bash
pip install -r requirements.txt
```

### 2. FFmpeg Yükleyin

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

**macOS:**
```bash
brew install ffmpeg
```

**Windows:**
[FFmpeg İndirme Sayfası](https://ffmpeg.org/download.html) üzerinden indirip PATH'e ekleyin.

## 💻 Kullanım

### Temel Kullanım

```bash
python youtube_subtitle_translator.py "https://www.youtube.com/watch?v=VIDEO_ID"
```

### Seçenekler

```bash
# Sadece .srt dosyası oluştur (videoya gömme)
python youtube_subtitle_translator.py "URL" --no-embed

# Sadece videoya göm (ayrı .srt dosyası oluşturma)
python youtube_subtitle_translator.py "URL" --no-separate

# Özel çıktı dizini belirt
python youtube_subtitle_translator.py "URL" --output-dir my_videos

# Yardım
python youtube_subtitle_translator.py --help
```

## 📁 Çıktı Dosyaları

Program varsayılan olarak `output/` dizinine şunları oluşturur:

1. **Orijinal Video** - İndirilen YouTube videosu
2. **İngilizce Alt Yazı (.srt)** - Orijinal alt yazı dosyası
3. **Türkçe Alt Yazı (.srt)** - Çevrilmiş alt yazı dosyası
4. **Türkçe Alt Yazılı Video (.mp4)** - Alt yazıları gömülü video

## 🔧 Nasıl Çalışır?

1. **İndirme**: yt-dlp ile YouTube videosunu ve İngilizce alt yazılarını indirir
2. **Çeviri**: Google Translate API'si ile alt yazıları satır satır Türkçeye çevirir
3. **Ekleme**: FFmpeg ile Türkçe alt yazıları videoya ekler

## ⚠️ Önemli Notlar

- Videoda İngilizce alt yazı yoksa program çalışmaz
- İnternet bağlantısı gereklidir (indirme ve çeviri için)
- Büyük videolar için işlem süresi uzun olabilir
- Google Translate ücretsiz API'si kullanır, çok fazla istekte rate limit uygulanabilir

## 🛠️ Sorun Giderme

### "FFmpeg bulunamadı" hatası
FFmpeg'in kurulu olduğundan ve PATH'de bulunduğundan emin olun:
```bash
ffmpeg -version
```

### "Alt yazı bulunamadı" hatası
Videonun İngilizce alt yazısı olmayabilir. YouTube'da manuel kontrol edin.

### Çeviri hataları
İnternet bağlantınızı kontrol edin. Çok fazla istek yapıyorsanız birkaç dakika bekleyin.

## 📝 Örnek Çıktı

```
============================================================
YouTube Subtitle Translator - İngilizce → Türkçe
============================================================
📥 Video indiriliyor: https://www.youtube.com/watch?v=...
✅ Video indirildi: output/video.mp4
✅ Alt yazı indirildi: output/subtitles.en.srt
🔄 Alt yazılar çevriliyor...
   İlerleme: 10/100 (10%)
   İlerleme: 20/100 (20%)
   ...
✅ Türkçe alt yazı oluşturuldu: output/subtitles.tr.srt
💾 Türkçe alt yazı dosyası: output/turkish_subtitles.srt
🎬 Alt yazılar videoya ekleniyor...
✅ Türkçe alt yazılı video oluşturuldu: output/video_with_turkish_subtitles.mp4

============================================================
✨ İşlem Tamamlandı!
============================================================

📂 Oluşturulan Dosyalar:
   • output/turkish_subtitles.srt
   • output/video_with_turkish_subtitles.mp4
```

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Pull request göndermekten çekinmeyin.

## 📧 İletişim

Sorularınız için issue açabilirsiniz.