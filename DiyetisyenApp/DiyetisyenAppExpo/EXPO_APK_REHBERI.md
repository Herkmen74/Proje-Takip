# 📱 Expo Diyetisyen Uygulaması - APK Oluşturma Rehberi

## 🎉 Tebrikler! Expo Versiyonu Hazır

Expo ile çok daha kolay APK oluşturabilirsiniz!

---

## 🚀 Yöntem 1: EAS Build ile APK (Önerilen - En Kolay!)

### Adım 1: EAS CLI'yi Yükleyin

```bash
npm install -g eas-cli
```

### Adım 2: Expo Hesabı Oluşturun (Ücretsiz)

```bash
eas login
```

Henüz hesabınız yoksa: https://expo.dev/signup

### Adım 3: Projeyi Yapılandırın

```bash
cd DiyetisyenAppExpo
eas build:configure
```

- Platform seçin: **Android**
- Enter'a basın (varsayılan ayarlar)

### Adım 4: APK Oluşturun

```bash
eas build --platform android --profile preview
```

**Sonuç:**
- ☁️ Cloud'da build yapılacak (bilgisayarınıza yük yok!)
- ⏱️ 10-15 dakika sürer
- 📥 Bitince download linki verilir
- 📱 QR kod ile direkt telefonunuza yüklersiniz!

---

## 🔥 Yöntem 2: Lokal APK Build (Bilgisayarınızda)

### Adım 1: Bağımlılıkları Yükleyin

```bash
cd DiyetisyenAppExpo
npm install
```

### Adım 2: APK Oluşturun

```bash
eas build --platform android --profile preview --local
```

**Gereksinimler:**
- Android SDK
- Java 17+
- ~10 GB boş disk

**Sonuç:**
- APK dosyası: `DiyetisyenAppExpo/build-xxxxxxxxx.apk`

---

## 📲 Yöntem 3: Expo Go ile Test (APK Gerekmez!)

En hızlı test yöntemi - APK'ya gerek yok!

### Adım 1: Expo Go İndirin

Telefonunuzdan:
- **Android:** [Google Play'den Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS:** [App Store'dan Expo Go](https://apps.apple.com/app/expo-go/id982107779)

### Adım 2: Geliştirme Sunucusunu Başlatın

```bash
cd DiyetisyenAppExpo
npx expo start
```

### Adım 3: QR Kod İle Bağlanın

- Terminal'de QR kod görünecek
- Expo Go uygulamasını açın
- QR kodu taratın
- Uygulama yüklenir! 🎉

**Not:** Bilgisayar ve telefon AYNI WiFi'ye bağlı olmalı!

---

## 🎯 Hangi Yöntemi Seçmeliyim?

| Yöntem | Süre | Avantaj | APK? |
|--------|------|---------|------|
| **EAS Build (Cloud)** | 15 dk | En kolay, bilgisayara yük yok | ✅ Evet |
| **Expo Go** | 30 sn | Anında test, APK gerekmez | ❌ Hayır |
| **Local Build** | 20 dk | Offline, tam kontrol | ✅ Evet |

### 💡 Önerim

1. **Hemen test etmek için:** Expo Go (30 saniye!)
2. **APK dosyası istiyorsanız:** EAS Build (15 dakika)
3. **Offline çalışmak istiyorsanız:** Local Build

---

## ⚡ HIZLI TEST - Expo Go (30 Saniye)

```bash
# 1. Expo Go'yu telefonunuza indirin (Google Play/App Store)

# 2. Bilgisayarda:
cd DiyetisyenAppExpo
npx expo start

# 3. QR kodu Expo Go ile taratın

# 4. Uygulama açıldı! 🎉
```

---

## 📦 EAS Build Detayları

### Build Profilleri

`eas.json` dosyası otomatik oluşturulur:

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

### Build Komutları

```bash
# Preview APK (Test için)
eas build --platform android --profile preview

# Production AAB (Google Play için)
eas build --platform android --profile production

# Her iki platform
eas build --platform all --profile preview
```

### Build İzleme

```bash
# Build listesini görün
eas build:list

# Build detaylarını görün
eas build:view BUILD_ID
```

---

## 📱 APK Yükleme

### Android'de APK Yükleme:

1. **Ayarlar → Güvenlik → Bilinmeyen Kaynaklardan Yükleme** açın
2. APK dosyasını telefonunuza atın
3. Dosya yöneticisinden APK'yı açın
4. **Yükle** butonuna basın
5. Uygulama yüklendi! 🎉

### EAS Build'den İndirme:

Build tamamlandığında:
1. Terminal'de link verilecek
2. Linke tıklayın
3. QR kod göreceksiniz
4. QR'ı telefonunuzdan taratın
5. APK indirilecek ve yüklenecek!

---

## 🐛 Sorun Giderme

### "eas: command not found"
```bash
npm install -g eas-cli
```

### "Not logged in"
```bash
eas login
```

### "Build failed"
```bash
# Build loglarını inceleyin
eas build:list
eas build:view BUILD_ID
```

### Expo Go'da açılmıyor
- Bilgisayar ve telefon aynı WiFi'de mi?
- `npx expo start` çalışıyor mu?
- Firewall kapalı mı?

---

## 💰 Maliyet

- **Expo Go:** ÜCRETSİZ ✅
- **EAS Build:** İlk 30 build/ay ÜCRETSİZ ✅
- **Sonrası:** $29/ay (Priority Plan)

**Sonuç:** Test için TAMAMEN ÜCRETSİZ!

---

## 🎓 Ek Kaynaklar

- [Expo Docs](https://docs.expo.dev/)
- [EAS Build Guide](https://docs.expo.dev/build/introduction/)
- [Expo Go Guide](https://docs.expo.dev/get-started/expo-go/)

---

## ✅ Hızlı Başlangıç Checklist

- [ ] Expo Go uygulamasını telefonunuza indirin
- [ ] `npm install -g eas-cli` (sadece APK için)
- [ ] `cd DiyetisyenAppExpo`
- [ ] `npm install`
- [ ] `npx expo start`
- [ ] QR kodu Expo Go ile taratın
- [ ] Uygulama çalışıyor! 🎉

---

## 🚀 Şimdi Ne Yapmalı?

### Test için (30 saniye):
```bash
cd DiyetisyenAppExpo
npx expo start
# QR'ı Expo Go ile taratın
```

### APK için (15 dakika):
```bash
cd DiyetisyenAppExpo
npm install -g eas-cli
eas login
eas build --platform android --profile preview
# Linki bekleyin ve indirin
```

---

**Kolay Gelsin! 🎉**
