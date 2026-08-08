# Diyetisyen Takip Uygulaması - Kullanım Kılavuzu

## 📱 Ana Özellikler

### 1. 🏠 Dashboard (Ana Sayfa)

Ana sayfa uygulamanın özet görünümüdür:

- **Toplam Hasta Sayısı**: Sistemdeki tüm hasta sayısı
- **Bugünkü Randevular**: Bugün için planlanmış randevu sayısı
- **Finansal Özet**: Bugün, bu hafta ve bu ay için gelir özeti
- **Bugünkü Randevu Listesi**: Bugünün detaylı randevu programı
- **Hızlı İşlemler**: Sık kullanılan işlemler için kısayollar

#### Nasıl Kullanılır?
1. Uygulamayı açın
2. Dashboard ekranında tüm önemli bilgileri görün
3. Hızlı işlemler butonları ile direkt ekleme yapın
4. Aşağı çekerek sayfayı yenileyin

---

### 2. 👥 Hasta Yönetimi

Hastalarınızı ekleyin, düzenleyin ve takip edin.

#### Yeni Hasta Ekleme

1. **Hastalar** sekmesine gidin
2. Sağ alttaki **+** butonuna tıklayın
3. Formu doldurun:
   - **Ad Soyad** (zorunlu)
   - Telefon
   - E-posta
   - Doğum tarihi
   - Cinsiyet
   - Boy (cm)
   - Kilo (kg)
   - Hedef kilo (kg)
   - Notlar
4. **Kaydet** butonuna tıklayın

#### Hasta Arama

- Üstteki arama çubuğuna hasta adı, telefon veya e-posta yazın
- Sonuçlar anında filtrelenir

#### Hasta Detayları

Hasta kartına tıklayarak detaylı bilgilere ulaşın:

- **Kişisel Bilgiler**: Ad, yaş, cinsiyet, iletişim
- **Vücut Bilgileri**: Boy, kilo, hedef kilo, BMI
- **Kilo Grafiği**: Son 10 ölçümün grafiği
- **Son Randevular**: Hasta ile yapılan son 5 randevu
- **Notlar**: Hastaya özel notlar

#### Hasta Düzenleme

1. Hasta detay sayfasında **Düzenle** butonuna tıklayın
2. İstediğiniz alanları güncelleyin
3. **Güncelle** butonuna tıklayın

#### Hasta Silme

1. Hasta detay sayfasında **Sil** butonuna tıklayın
2. Onay verin
3. ⚠️ **DİKKAT:** Bu işlem geri alınamaz!

---

### 3. 🍎 Yemek ve Tarif Yönetimi

Yemek tariflerini ve besin değerlerini yönetin.

#### Yeni Yemek Ekleme

1. **Yemekler** sekmesine gidin
2. Sağ alttaki **+** butonuna tıklayın
3. Temel bilgileri girin:
   - **Yemek Adı** (zorunlu)
   - Açıklama
4. **Besin Değerlerini** girin:
   - Kalori (kcal)
   - Protein (g)
   - Karbonhidrat (g)
   - Yağ (g)
   - Lif (g)
5. **Porsiyon Bilgisi**:
   - Porsiyon miktarı
   - Birim (porsiyon, gram, vb.)
6. **Kategori** seçin:
   - Kahvaltı
   - Öğle
   - Akşam
   - Atıştırmalık
   - Tatlı
7. **Süre Bilgisi**:
   - Hazırlık süresi (dakika)
   - Pişirme süresi (dakika)

#### Malzeme Ekleme

1. Yemek formu açıkken **Malzemeler** bölümüne gidin
2. **Malzeme Ekle** butonuna tıklayın
3. Malzeme bilgilerini girin:
   - Malzeme adı
   - Miktar
   - Birim (gram, adet, çay kaşığı, vb.)
4. **Ekle** butonuna tıklayın
5. İstediğiniz kadar malzeme ekleyin
6. Yanlışlıkla eklenen malzemeyi silmek için X işaretine tıklayın

#### Tarif Ekleme

1. Yemek formu açıkken **Tarif** bölümüne gidin
2. Yemeğin hazırlanış tarifini detaylı yazın
3. Adım adım açıklayın

#### Yemek Arama ve Filtreleme

- **Arama çubuğu**: Yemek adı veya açıklamaya göre arayın
- **Kategori filtreleri**: Üstteki butonlardan kategori seçin
  - Tümü
  - Kahvaltı
  - Öğle
  - Akşam
  - Atıştırmalık
  - Tatlı

#### Yemek Detayları

Yemek kartına tıklayarak şunları görün:

- Yemek adı ve kategorisi
- Tam besin değerleri tablosu
- Porsiyon bilgisi
- Tüm malzemeler listesi
- Detaylı tarif
- Hazırlık ve pişirme süreleri

---

### 4. 📅 Randevu Yönetimi

Randevularınızı planlayın ve takip edin.

#### Yeni Randevu Oluşturma

1. **Randevular** sekmesine gidin
2. Sağ alttaki **+** butonuna tıklayın
3. Formu doldurun:
   - **Hasta Seç** (zorunlu): Listeden hasta seçin
   - **Tarih Seç** (zorunlu): Randevu tarihini seçin
   - **Saat Seç** (zorunlu): Randevu saatini seçin
   - **Süre**: Randevu süresi (varsayılan 30 dakika)
   - **Durum**: Planlandı, Tamamlandı, İptal
   - **Notlar**: Randevuya özel notlar
4. **Kaydet** butonuna tıklayın

#### Randevu Filtreleme

Üstteki filtre butonlarını kullanın:

- **Tümü**: Tüm randevular
- **Bugün**: Sadece bugünün randevuları
- **Yaklaşan**: Gelecek randevular
- **Geçmiş**: Tamamlanan randevular
- **Tamamlanan**: Tamamlandı olarak işaretlenmiş
- **İptal**: İptal edilen randevular

#### Randevu Renk Kodları

- 🔵 **Mavi çerçeve**: Planlanmış randevu
- 🟢 **Yeşil çerçeve**: Tamamlanmış randevu
- 🔴 **Kırmızı çerçeve**: İptal edilmiş randevu
- 🟠 **Turuncu çerçeve**: Bugünkü randevu

#### Randevu Düzenleme

1. Randevuya tıklayın (veya liste ekranından)
2. **Düzenle** butonuna tıklayın
3. Bilgileri güncelleyin
4. **Güncelle** butonuna tıklayın

---

### 5. 💰 Muhasebe Yönetimi

Gelir ve giderlerinizi takip edin.

#### Aylık Özet Kartı

Ekranın üstünde:
- **Gelir**: Bu ayki toplam gelir (yeşil)
- **Gider**: Bu ayki toplam gider (kırmızı)
- **Net**: Gelir - Gider (yeşil/kırmızı)

#### Yeni Kayıt Ekleme

1. **Muhasebe** sekmesine gidin
2. Sağ alttaki **+** butonuna tıklayın
3. **İşlem Tipi** seçin:
   - **Gelir**: Para girişi
   - **Gider**: Para çıkışı
4. **Tutar** girin (₺)
5. **Kategori** seçin:
   
   **Gelir kategorileri:**
   - Danışmanlık
   - İlk Muayene
   - Kontrol
   - Diyet Planı
   - Online Danışmanlık
   - Diğer
   
   **Gider kategorileri:**
   - Kira
   - Elektrik
   - Su
   - İnternet
   - Malzeme
   - Maaş
   - Vergi
   - Diğer

6. **Açıklama** yazın (opsiyonel ama önerilen)
7. **Tarih** seçin
8. **Hasta** seçin (sadece gelir için, opsiyonel)
9. **Ödeme Yöntemi** seçin:
   - Nakit
   - Kredi Kartı
   - Banka Havalesi
   - Diğer
10. **Fatura/Fiş Numarası** girin (opsiyonel)
11. **Kaydet** butonuna tıklayın

#### Kayıt Filtreleme

Üstteki butonları kullanın:
- **Tümü**: Tüm kayıtlar
- **Gelir**: Sadece gelirler
- **Gider**: Sadece giderler

#### Kayıt Arama

Arama çubuğuna:
- Açıklama
- Hasta adı
- Kategori
yazarak arayabilirsiniz.

#### Kayıt Renk Kodları

- 🟢 **Yeşil**: Gelir kaydı
- 🔴 **Kırmızı**: Gider kaydı

---

## 💡 İpuçları ve Püf Noktaları

### Genel İpuçları

1. **Düzenli Veri Girişi**: Her randevudan sonra hasta bilgilerini güncelleyin
2. **Kilo Takibi**: Her randevuda hasta kilosunu kaydedin
3. **Notlar**: Önemli bilgileri not bölümüne yazın
4. **Kategoriler**: Yemekleri ve muhasebe kayıtlarını kategorilere ayırın
5. **Yedekleme**: Düzenli olarak uygulama verilerini yedekleyin

### Hasta Yönetimi İpuçları

- Hasta telefon numaralarını ekleyin (randevu hatırlatması için)
- Hedef kilo belirleyin (motivasyon için)
- Her randevuda kilo ve ölçü güncellemesi yapın
- Özel durumları (alerji, hastalık vb.) notlar bölümüne yazın

### Yemek Yönetimi İpuçları

- Sık kullandığınız tarifleri önceden ekleyin
- Besin değerlerini doğru girin (hastalar için önemli)
- Malzemeleri detaylı yazın
- Tarifleri adım adım açıklayın
- Porsiyon bilgisini mutlaka belirtin

### Randevu Yönetimi İpuçları

- Randevuları bir gün önceden planlayın
- Her randevuya not ekleyin
- Tamamlanan randevuları işaretleyin
- İptal edilen randevuları kaydedin (istatistik için)
- Randevu süresini gerçekçi belirleyin

### Muhasebe İpuçları

- Her gelir/gideri aynı gün kaydedin
- Kategori seçmeyi unutmayın (rapor için önemli)
- Açıklama yazın (sonradan hatırlamak için)
- Fatura numaralarını kaydedin
- Aylık kontrollerini düzenli yapın

---

## 🔄 Veri Yönetimi

### Veri Güvenliği

- Veriler cihazınızda lokal olarak saklanır
- İnternet bağlantısı gerektirmez
- Şu anda cloud senkronizasyon yok (gelecekte eklenecek)

### Veri Yedekleme (Manuel)

⚠️ **ÖNEMLİ:** Düzenli yedekleme yapın!

**iOS:**
- iTunes/Finder ile cihaz yedeği alın
- iCloud yedekleme açık olsun

**Android:**
- Google Drive otomatik yedekleme açık olsun
- Manuel olarak uygulama verisini yedekleyin

### Veri Silme

Uygulamayı sildiğinizde:
- ⚠️ Tüm veriler silinir
- Geri getirilemez
- Önce yedek alın!

---

## 🆘 Sık Sorulan Sorular

### Uygulama nasıl çalışıyor?

Uygulama tamamen offline çalışır. Tüm veriler cihazınızda SQLite veritabanında saklanır.

### İnternet gerekli mi?

Hayır! Uygulama tamamen offline çalışır.

### Verilerim güvende mi?

Evet! Veriler sadece sizin cihazınızda saklanır. Hiçbir yere gönderilmez.

### Birden fazla cihazda kullanabilir miyim?

Şu anda hayır. Cloud senkronizasyon özelliği henüz eklenmedi.

### Veri yedekleme nasıl yapılır?

iOS: iCloud yedekleme
Android: Google Drive yedekleme
Her ikisi de otomatik çalışır.

### Hasta verilerini nasıl dışa aktarabilirim?

Şu anda manuel dışa aktarma özelliği yok. Gelecek sürümlerde eklenecek (PDF, Excel).

### Uygulamayı birden fazla diyetisyen kullanabilir mi?

Şu anda tek kullanıcılı. Multi-user desteği gelecek versiyonlarda eklenecek.

---

## 📞 Destek

Sorun yaşıyorsanız:

1. Uygulamayı tamamen kapatıp açın
2. Cihazı yeniden başlatın
3. Uygulama güncellemesi var mı kontrol edin
4. Sorun devam ederse issue açın

---

## 🎯 Gelecek Özellikler

- [ ] Cloud senkronizasyon
- [ ] PDF rapor oluşturma
- [ ] Excel dışa aktarma
- [ ] Yemek fotoğrafı ekleme
- [ ] Bildirim sistemi
- [ ] Randevu hatırlatıcıları
- [ ] SMS gönderimi
- [ ] E-posta gönderimi
- [ ] Çoklu diyetisyen desteği
- [ ] Tema seçimi (karanlık/aydınlık)
- [ ] Çoklu dil desteği
- [ ] Tablet optimizasyonu
- [ ] Web versiyonu

---

**İyi Kullanımlar! 🎉**
