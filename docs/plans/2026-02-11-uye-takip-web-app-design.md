# Hamza PT — Üye Takip Web Uygulaması Tasarımı

## Genel Bakış
Personal trainer Hamza için üye takip web uygulaması. Üyeler giriş yapıp kendi sayfalarını görür, admin (Hamza) tüm sistemi yönetir. PWA olarak telefondan indirilebilir.

## Teknoloji
- **Next.js 14** — App Router
- **Supabase** — PostgreSQL + Auth + Storage
- **Tailwind CSS** — Stil
- **Recharts** — Grafikler
- **PWA** — Service Worker + Push Notifications

## Renk Paleti
| Kullanım | Renk | Kod |
|----------|------|-----|
| Ana arka plan | Siyah | `#0A0A0A` |
| Kartlar/yüzeyler | Koyu gri | `#1A1A1A` |
| Vurgu/butonlar | Kırmızı | `#DC2626` |
| Metin (birincil) | Krem | `#F5F0E8` |
| Metin (ikincil) | Gri | `#9CA3AF` |
| Başarı/pozitif | Kırmızı-turuncu gradient | — |

## Kullanıcı Rolleri
- **Admin (Hamza):** Tam yönetim
- **Üye:** Kendi sayfası, grafikler, blog okuma

## Üye Sayfası

### Üst Bar
- Sol: Logo / "Hamza PT"
- Sağ: Üye adı + çıkış

### 1. Hoşgeldin Kartı
- "Hoşgeldin, Ahmet" + ilk başlangıç tarihi
- Aktif paket özeti: kalan ders, kalan gün
- Durum etiketi: Aktif / Son 2 Ders / Süre Doluyor / Bitti

### 2. Kişisel Bilgiler & İlerleme Grafiği
- Güncel ölçüler: Kilo, Boy, Göğüs, Bel, Kol, Bacak (sadece görüntüleme)
- Grafik: X=tarih, Y=seçilen ölçü
- Ölçü seçici butonlar (Kilo / Bel / Kol vs.)
- Birden fazla ölçüyü karşılaştırma

### 3. Paket Geçmişi
- Aktif paket üstte (kırmızı kenarlık)
- Tamamlanmış paketler kartlar halinde
- Tıklayınca ders listesi açılır

### 4. Blog Yazıları
- Son 3 yazı kartı + "Tüm yazıları gör" butonu

## Admin Paneli

### Sol Menü (Sidebar)
- Dashboard, Üyeler, Paketler, Ölçümler, Bildirimler, Blog Yönetimi, Ayarlar

### 1. Dashboard
- Toplam aktif üye, bu hafta toplam ders
- Son 2 dersi kalan üyeler (uyarı)
- 4+ gün gelmeyen üyeler (uyarı)
- Bugün gelen üyeler
- Hızlı aksiyonlar: Ders Ekle, Yeni Üye, Ölçüm Gir

### 2. Üye Yönetimi
- Üye listesi (arama + filtreleme)
- Üye detay: tüm bilgiler, ölçüm/paket/ders geçmişi
- Yeni üye ekle, düzenle, pasife al

### 3. Ders & Paket Yönetimi
- Hızlı ders ekleme: üye seç → tarih otomatik → kaydet
- Paket oluşturma: üye seç → 10/20/30 → başlangıç tarihi
- Paket geçmişi

### 4. Ölçüm Girişi
- Üye seç → kilo, göğüs, bel, kol, bacak → tarih otomatik
- Geçmiş ölçümler tablo + grafik

### 5. Bildirim Yönetimi
- Otomatik bildirim logu
- Mesaj şablonları düzenleme
- Manuel bildirim gönderme

### 6. Blog Yönetimi
- Yeni yazı (başlık, içerik, kapak görseli)
- Taslak / yayında durumu
- Düzenle / sil

## Veritabanı Şeması

### users
- id (UUID), username, password_hash, full_name, phone
- role (admin/member), start_date, is_active, created_at

### packages
- id (UUID), user_id (FK), total_lessons (10/20/30)
- start_date, expire_date (otomatik: her 10 ders = 40 gün)
- status (active/completed/expired)

### lessons
- id (UUID), package_id (FK), user_id (FK), date, notes

### measurements
- id (UUID), user_id (FK), date
- weight, height, chest, waist, arm, leg (decimal)

### blog_posts
- id (UUID), title, content (Markdown), cover_image
- status (draft/published), published_at, created_at

### notifications
- id (UUID), user_id (FK), type (low_lessons/weekly_report/inactive/manual)
- title, message, is_read, sent_at

## Sayfa Yapısı

### Genel (Giriş gereksiz)
- `/login` — Giriş
- `/blog` — Tüm yazılar
- `/blog/[slug]` — Yazı detay

### Üye Paneli
- `/dashboard` — Ana sayfa
- `/dashboard/progress` — Grafikler, ölçüm geçmişi
- `/dashboard/packages` — Paketlerim
- `/dashboard/notifications` — Bildirimler

### Admin Paneli
- `/admin` — Dashboard
- `/admin/members` — Üye listesi
- `/admin/members/[id]` — Üye detay
- `/admin/lessons/new` — Ders ekle
- `/admin/measurements/new` — Ölçüm gir
- `/admin/packages/new` — Paket oluştur
- `/admin/notifications` — Bildirim yönetimi
- `/admin/blog` — Blog yönetimi
- `/admin/settings` — Ayarlar

## Bildirim Sistemi

### Otomatik (Cron - her gece 00:00)
- Son 2 dersi kalan → "Derslerin bitmek üzere" bildirimi + push
- 4+ gün gelmeyenler → Samimi tonda motivasyon mesajı + push
- Pazar günü → Haftalık rapor (kaç ders, seri, motivasyon) + push

### Kanal
- Push notification (Service Worker)
- Uygulama içi bildirim (zil ikonu)

## PWA
- Ana ekrana ekle
- Push notification desteği
- Offline cache (son görüntülenen veriler)
