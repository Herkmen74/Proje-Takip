# Diyetisyen Takip ve Yönetim Uygulaması

Modern ve kapsamlı diyetisyen takip uygulaması - React Native ile geliştirilmiştir.

## 🌟 Özellikler

### 📊 Ana Özellikler
- ✅ **Hasta Yönetimi**: Hasta bilgileri, kilo takibi, vücut ölçüleri
- ✅ **Yemek Listesi**: Tarifler, malzemeler ve besin değerleri
- ✅ **Kalori Takibi**: Kalori, protein, karbonhidrat, yağ takibi
- ✅ **Randevu Yönetimi**: Randevu planlama ve takip
- ✅ **Muhasebe**: Gelir-gider takibi ve raporlama
- ✅ **Dashboard**: Özet istatistikler ve grafikler

### 💎 Teknik Özellikler
- React Native (iOS + Android)
- SQLite (lokal veritabanı)
- Modern UI/UX (React Native Paper)
- Grafikler ve istatistikler
- Offline çalışma

## 🚀 Kurulum

### Gereksinimler
- Node.js 18 veya üzeri
- React Native CLI
- Android Studio (Android için)
- Xcode (iOS için - sadece macOS)

### Kurulum Adımları

1. **Bağımlılıkları yükleyin:**
```bash
cd DiyetisyenApp
npm install
```

2. **iOS için (sadece macOS):**
```bash
cd ios
pod install
cd ..
npm run ios
```

3. **Android için:**
```bash
npm run android
```

## 📱 Kullanım

### Ana Menü
- **Dashboard**: Günlük özet ve istatistikler
- **Hastalar**: Hasta listesi ve detayları
- **Yemekler**: Yemek ve tarif yönetimi
- **Randevular**: Randevu takvimi
- **Muhasebe**: Finansal takip

### Hasta Ekleme
1. Hastalar sekmesine gidin
2. (+) butonuna tıklayın
3. Hasta bilgilerini girin
4. Kaydedin

### Yemek Ekleme
1. Yemekler sekmesine gidin
2. (+) butonuna tıklayın
3. Yemek adı, tarif ve besin değerlerini girin
4. Malzemeleri ekleyin
5. Kaydedin

### Randevu Oluşturma
1. Randevular sekmesine gidin
2. (+) butonuna tıklayın
3. Hasta, tarih ve saat seçin
4. Not ekleyin (opsiyonel)
5. Kaydedin

### Muhasebe Kaydı
1. Muhasebe sekmesine gidin
2. (+) butonuna tıklayın
3. Gelir veya gider seçin
4. Miktar ve açıklama girin
5. Kaydedin

## 📂 Proje Yapısı

```
DiyetisyenApp/
├── src/
│   ├── screens/          # Ekranlar
│   │   ├── DashboardScreen.js
│   │   ├── PatientsScreen.js
│   │   ├── MealsScreen.js
│   │   ├── AppointmentsScreen.js
│   │   └── AccountingScreen.js
│   ├── components/       # Bileşenler
│   ├── database/         # Veritabanı
│   │   ├── db.js
│   │   └── models/
│   ├── navigation/       # Navigasyon
│   │   └── AppNavigator.js
│   └── utils/           # Yardımcı fonksiyonlar
├── assets/              # Görseller ve ikonlar
├── App.js              # Ana uygulama
└── package.json
```

## 🎨 Ekran Görüntüleri

### Dashboard
- Bugünkü randevular
- Haftalık gelir özeti
- Hasta istatistikleri
- Hızlı erişim butonları

### Hasta Detay
- Kişisel bilgiler
- Kilo grafiği
- Vücut ölçüleri
- Randevu geçmişi
- Diet planları

### Yemek Detay
- Yemek fotoğrafı
- Tarif ve hazırlanış
- Malzeme listesi
- Besin değerleri (kalori, protein, karbonhidrat, yağ)
- Porsiyon bilgisi

## 🔧 Geliştirme

### Veritabanı Yapısı

**Patients (Hastalar)**
- id, name, phone, email, birthdate, gender
- weight, height, target_weight
- notes, created_at

**Meals (Yemekler)**
- id, name, description, recipe
- calories, protein, carbs, fat
- serving_size, created_at

**Ingredients (Malzemeler)**
- id, meal_id, name, quantity, unit

**Appointments (Randevular)**
- id, patient_id, date, time
- notes, status, created_at

**Accounting (Muhasebe)**
- id, type (income/expense), amount
- description, category, date, created_at

## 📋 Yapılacaklar

- [ ] Cloud senkronizasyon ekle
- [ ] PDF rapor oluşturma
- [ ] Yemek fotoğrafı ekleme
- [ ] Bildirim sistemi
- [ ] Çoklu dil desteği
- [ ] Tema seçimi (karanlık/aydınlık)

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Pull request göndermekten çekinmeyin.

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📧 İletişim

Sorularınız için issue açabilirsiniz.
