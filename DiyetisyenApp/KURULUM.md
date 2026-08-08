# Diyetisyen Takip Uygulaması - Kurulum Rehberi

## 📱 Gereksinimler

### Genel Gereksinimler
- **Node.js**: 18.x veya üzeri
- **npm** veya **yarn**
- **Git**

### iOS için (sadece macOS)
- **Xcode**: 14.0 veya üzeri
- **CocoaPods**: `sudo gem install cocoapods`
- **macOS**: 12.0 (Monterey) veya üzeri

### Android için
- **Android Studio**: Son sürüm
- **JDK**: 11 veya üzeri
- **Android SDK**: API 31 veya üzeri
- **Android Emulator** veya fiziksel cihaz

## 🚀 Hızlı Başlangıç

### 1. Bağımlılıkları Yükleyin

```bash
cd DiyetisyenApp
npm install
```

### 2. iOS için Ek Kurulum (sadece macOS)

```bash
cd ios
pod install
cd ..
```

### 3. Uygulamayı Çalıştırın

**iOS için:**
```bash
npm run ios
# veya belirli bir cihaz için
npm run ios -- --simulator="iPhone 14"
```

**Android için:**
```bash
npm run android
```

## 📱 Detaylı Kurulum

### iOS Kurulumu (macOS)

1. **Xcode Yükleyin**
   - App Store'dan Xcode'u indirin ve yükleyin
   - Command Line Tools yükleyin:
     ```bash
     xcode-select --install
     ```

2. **CocoaPods Yükleyin**
   ```bash
   sudo gem install cocoapods
   ```

3. **Proje Bağımlılıklarını Yükleyin**
   ```bash
   cd DiyetisyenApp
   npm install
   cd ios
   pod install
   cd ..
   ```

4. **Uygulamayı Başlatın**
   ```bash
   npm run ios
   ```

### Android Kurulumu

1. **Android Studio Yükleyin**
   - [Android Studio](https://developer.android.com/studio)'yu indirin ve yükleyin
   - SDK Manager'dan aşağıdakileri yükleyin:
     - Android SDK Platform 31 veya üzeri
     - Android SDK Build-Tools
     - Google Play Services

2. **Ortam Değişkenlerini Ayarlayın**
   
   **Windows:**
   ```
   ANDROID_HOME = C:\Users\KULLANICI_ADI\AppData\Local\Android\Sdk
   PATH = %ANDROID_HOME%\platform-tools
   PATH = %ANDROID_HOME%\tools
   ```
   
   **macOS/Linux:**
   `.bashrc` veya `.zshrc` dosyanıza ekleyin:
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   export PATH=$PATH:$ANDROID_HOME/tools
   ```

3. **Emulator Oluşturun**
   - Android Studio > AVD Manager
   - "Create Virtual Device"
   - Pixel 5 veya benzer bir cihaz seçin
   - API Level 31+ seçin

4. **Uygulamayı Başlatın**
   ```bash
   npm run android
   ```

## 🔧 Sorun Giderme

### Metro Bundler Hataları

Metro bundler ile ilgili sorun yaşıyorsanız:

```bash
# Cache temizle
npm start -- --reset-cache

# Veya
rm -rf node_modules
npm install
```

### iOS Build Hataları

```bash
# Pod cache temizle
cd ios
pod deintegrate
pod install
cd ..

# Derived data temizle
rm -rf ~/Library/Developer/Xcode/DerivedData
```

### Android Build Hataları

```bash
# Gradle cache temizle
cd android
./gradlew clean
cd ..

# Gradle wrapper yeniden indir
cd android
./gradlew wrapper
cd ..
```

### SQLite Veritabanı Sorunları

Eğer veritabanı başlatılamıyorsa:

1. Uygulamayı tamamen kapatın
2. Uygulamayı cihazdan silin
3. Yeniden yükleyin

```bash
# iOS için
npm run ios

# Android için  
npm run android
```

## 📦 Release Build (Üretim)

### iOS Release

1. **Provisioning Profile ve Certificate ayarlayın**
   - Apple Developer hesabınızda App ID oluşturun
   - Distribution certificate oluşturun
   - Provisioning profile oluşturun

2. **Xcode'da Archive oluşturun**
   ```bash
   cd ios
   open DiyetisyenApp.xcworkspace
   ```
   - Product > Archive
   - Distribute App

### Android Release

1. **Keystore oluşturun**
   ```bash
   keytool -genkeypair -v -storetype PKCS12 -keystore diyetisyen-release.keystore -alias diyetisyen -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **`android/gradle.properties` dosyasına ekleyin**
   ```properties
   MYAPP_RELEASE_STORE_FILE=diyetisyen-release.keystore
   MYAPP_RELEASE_KEY_ALIAS=diyetisyen
   MYAPP_RELEASE_STORE_PASSWORD=****
   MYAPP_RELEASE_KEY_PASSWORD=****
   ```

3. **APK oluşturun**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```
   
   APK dosyası: `android/app/build/outputs/apk/release/app-release.apk`

## 🎨 Geliştirme İpuçları

### Hot Reload

Geliştirme sırasında kod değişikliklerini anında görmek için:
- iOS Simulator: `Cmd + R`
- Android Emulator: `R + R` (iki kere R)

### Debug Menüsü

- iOS Simulator: `Cmd + D`
- Android Emulator: `Cmd + M` (macOS) veya `Ctrl + M` (Windows/Linux)

### React Native Debugger

```bash
npm install -g react-native-debugger
```

### Veritabanını İnceleme

SQLite veritabanını incelemek için:

**iOS:**
```bash
# Simulator içindeki veritabanı yolu
~/Library/Developer/CoreSimulator/Devices/[DEVICE_ID]/data/Containers/Data/Application/[APP_ID]/Documents/diyetisyen.db
```

**Android:**
```bash
adb shell
run-as com.diyetisyenapp
cd databases
sqlite3 diyetisyen.db
```

## 📚 Ek Kaynaklar

- [React Native Dökümanları](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [SQLite](https://github.com/andpor/react-native-sqlite-storage)

## 🆘 Destek

Sorun yaşıyorsanız:

1. `node_modules` ve cache'i temizleyin
2. Bağımlılıkları yeniden yükleyin
3. iOS için pods'u yeniden yükleyin
4. Uygulamayı tamamen kapatıp yeniden başlatın

## 🔐 Güvenlik Notları

- **Üretim ortamında:**
  - Keystore dosyalarını güvenli yerde saklayın
  - Şifreleri Git'e commit etmeyin
  - Release keystore'u yedekleyin

## ⚡ Performans Optimizasyonu

- **Büyük listeler için:** FlatList kullanılıyor (optimize)
- **Veritabanı:** SQLite ile hızlı offline erişim
- **Görseller:** Optimize edilmiş icon set kullanılıyor
- **Navigation:** React Navigation 6.x (en güncel)

## 📱 Test Cihazları

Önerilen test cihazları:

**iOS:**
- iPhone 12 veya üzeri
- iOS 14.0 veya üzeri

**Android:**
- Android 8.0 (API 26) veya üzeri
- En az 2GB RAM

## 🎯 Sonraki Adımlar

Uygulama başarıyla çalıştıktan sonra:

1. Demo veriler ekleyin
2. Kullanıcı arayüzünü test edin
3. Her özelliği deneyin
4. Kendi verilerinizi ekleyin

**Başarılar! 🎉**
