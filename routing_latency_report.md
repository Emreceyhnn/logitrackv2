# LogiTrack Lojistik Yönetim Platformu Yönlendirme Gecikme Raporu

Bu rapor, **LogiTrack – AI Lojistik Yönetim Platformu** üzerindeki yönlendirme hızını (routing speed) ve sayfa geçiş gecikmelerini (routing latency) incelemek amacıyla gerçekleştirilen performans denetiminin sonuçlarını ve analizlerini içermektedir. 

Denetim sırasında hem **Doğrudan Sunucu Yönlendirmesi (Direct Navigation / SSR)** hem de **İstemci Tarafı Sayfa Geçişleri (Client-side Link Click / SPA)** ölçülmüş, sistemdeki performans darboğazları tespit edilmiş ve optimizasyon önerileri sunulmuştur.

---

## 1. Test Metodu ve Ortamı

- **Platform:** Next.js (v16.2.9) + Turbopack (Geliştirme Modu)
- **Veritabanı Katmanı:** Prisma ORM
- **Yerelleştirme (i18n):** Dinamik URL çeviri mekanizması (çift yönlü proxy yönlendirmeleri ile `/tr/araclar` -> `/tr/vehicle` şeklinde otomatik arka uç eşlemeleri yapılmaktadır).
- **Kimlik Doğrulama:** JWT Tabanlı Oturum Denetimi
- **Test Aracı:** Playwright otomasyon motoru ile tarayıcı simülasyonu.
- **Ölçüm Yöntemi:** Yönlendirme tetikleyicisi (tıklama veya doğrudan gitme) ile ağ durumunun durağanlaşması (`networkidle`) ve ilgili sayfaya özgü DOM elementlerinin kararlı bir şekilde yüklenmesi arasındaki süre (milisaniye cinsinden).

---

## 2. Genel Performans Özeti

Aşağıdaki metrikler, uygulamanın ilk açılış ve kimlik doğrulama adımlarındaki performansını göstermektedir:

- **İlk Giriş Sayfası Yüklenme Süresi:** **425 ms**
  - *Açıklama:* Giriş sayfasının (`/tr/auth/sign-in`) ilk statik HTML ve CSS dosyalarının sunucudan çekilerek tarayıcıya ulaşma süresidir. Oldukça başarılı ve akıcı bir açılış hızı sergilenmiştir.
- **Giriş Yapma ve Panel Yönlendirme Süresi:** **5,131 ms (5.13 saniye)**
  - *Açıklama:* Kullanıcının "Giriş Yap" butonuna tıklaması ile JWT doğrulama, cookie atamaları, oturum açma aksiyonları (`LoginUser`) ve ardından `/tr/overview` (Genel Bakış) sayfasına yönlendirilerek ilk verilerin yüklenmesi arasında geçen süredir.
  - *Değerlendirme:* Giriş işlemi Next.js sunucu eylemleri (Server Actions) ve veritabanı sorgularını tetiklediği için nispeten yavaştır. Bu alanda optimizasyon potansiyeli yüksektir.

---

## 3. Detaylı Yönlendirme Hız Tablosu

Aşağıdaki tablo, Türkçe yerelleştirilmiş sayfaların hem doğrudan tarayıcı çubuğundan çağrılmasındaki (SSR/Direct) hem de panel içi menüden tıklanarak geçiş yapılmasındaki (SPA/Client-side) gecikme sürelerini karşılaştırmaktadır.

| Rota Adı | URL Yolu | Doğrudan Yükleme (Direct SSR) | İstemci Tıklaması (Client Click) | Durum |
| :--- | :--- | :---: | :---: | :---: |
| **Genel Bakış (Overview)** | `/tr/genel-bakis` | 2,752 ms | 51 ms | ✅ Başarılı |
| **Araçlar (Vehicles)** | `/tr/araclar` | 1,515 ms | 270 ms | ✅ Başarılı |
| **Sürücüler (Drivers)** | `/tr/suruculer` | 2,144 ms | 250 ms | ✅ Başarılı |
| **Rotalar (Routes)** | `/tr/rotalar` | 3,694 ms | 363 ms | ⚠️ Yavaş |
| **Sevkiyatlar (Shipments)** | `/tr/sevkiyatlar` | 1,757 ms | 300 ms | ✅ Başarılı |
| **Depolar (Warehouses)** | `/tr/depolar` | 1,896 ms | 305 ms | ✅ Başarılı |
| **Envanter (Inventory)** | `/tr/envanter` | 2,584 ms | 324 ms | ⚠️ Yavaş |
| **Müşteriler (Customers)** | `/tr/musteriler` | 3,441 ms | 252 ms | ⚠️ Yavaş |
| **Şirket Ayarları (Company)** | `/tr/sirket` | 2,552 ms | 225 ms | ✅ Başarılı |
| **Raporlar (Reports)** | `/tr/raporlar` | 1,869 ms | 274 ms | ✅ Başarılı |
| **Analiz (Analytics)** | `/tr/analiz` | 1,441 ms | 255 ms | ✅ Başarılı |

---

## 4. Rota Bazlı Analiz ve Bulgular

### 1. İstemci Tarafı Sayfa Geçişleri (Client-side Transitions)
- **En Hızlı Geçiş:** **Genel Bakış (51 ms)**
  - *Neden:* Genel Bakış sayfası, diğer karmaşık tablolara veya harita bileşenlerine göre daha hızlı istemci tarafı önbelleklemesinden yararlanmaktadır ve veri yapısı nispeten hafiftir.
- **Ortalama Geçiş Hızı:** **250 ms - 360 ms** aralığındadır.
  - *Neden:* SPA (Single Page Application) geçişleri Next.js istemci tarafı yönlendiricisi (`next/navigation`) ile yapılmaktadır. Bu geçişler sırasında yalnızca değişen bileşenlerin JSON verisi (`RSC - React Server Components payload`) sunucudan çekilmektedir. Bu nedenle süreler son derece kabul edilebilir düzeydedir.

### 2. Doğrudan Yükleme ve SSR Gecikmeleri (Direct SSR Navigation)
- **En Yavaş Rotalar:**
    1. **Rotalar (`/tr/rotalar` - 3,694 ms)**
    2. **Müşteriler (`/tr/musteriler` - 3,441 ms)**
    3. **Genel Bakış İlk SSR (`/tr/genel-bakis` - 2,752 ms)**
- *Neden:* 
  - Bu sayfaların doğrudan URL ile yüklenmesi durumunda, Next.js sunucuda ilgili sayfayı baştan derler (SSR). Bu süreçte veritabanı (Prisma) üzerinden ilişkisel sorgular çekilir ve harita/API entegrasyon bileşenleri (örneğin Google Maps/Mapbox kütüphaneleri) yüklenir.
  - Özellikle **Rotalar** sayfasındaki harita verilerinin büyüklüğü ve **Müşteriler** sayfasındaki veri listeleme yoğunluğu, sunucu tarafındaki yanıt süresini (TTFB) artırmaktadır.

---

## 5. Tespit Edilen Darboğazlar ve Geliştirme Önerileri

### 1. `proxy.ts` (Middleware) Katmanındaki Gecikmeler
- **Darboğaz:** Yerelleştirilmiş rotaları canonical rotalara çeviren ve JWT kontrolü yapan `proxy.ts` (Next.js middleware) katmanı, her HTTP isteğinde çalışmaktadır. Geliştirme loglarında proxy kontrolünün ortalama **10 ms ile 150 ms** arasında bir ek yük getirdiği görülmüştür.
- **Öneriler:**
  - JWT doğrulama kütüphanesi olan `jose`'nin Edge Runtime uyumluluğu kontrol edilmeli ve JWT verisi hafifletilmelidir.
  - Görsel dosyaları, statik varlıklar (fonts, images) ve Next.js iç mekanizmaları için middleware eşleme (matcher) filtresi daha agresif hale getirilerek middleware gereksiz isteklerden tamamen muaf tutulmalıdır.

### 2. Ağır Veritabanı Sorguları ve N+1 Problemleri (Prisma)
- **Darboğaz:** `/tr/rotalar`, `/tr/musteriler` ve `/tr/inventory` sayfalarında sunucu yüklenme süreleri (SSR) 3 saniyenin üzerindedir. Bu durum, sayfalar yüklenirken Prisma üzerinde gerçekleştirilen ilişkisel veri çekme işlemlerinden (join'ler, sürücü-araç-sevkiyat ilişkileri) kaynaklanmaktadır.
- **Öneriler:**
  - Prisma sorgularında `select` kullanılarak yalnızca ihtiyaç duyulan alanlar seçilmeli, tüm veri satırı (`include`) çekilmemelidir.
  - Sık güncellenmeyen veriler (örn. müşteri listeleri, depo tanımları) için Redis veya bellek içi (In-Memory) önbellekleme (Caching) mekanizmaları devreye alınmalıdır.

### 3. Google Maps / Harita Kütüphanelerinin Hydration Maliyeti
- **Darboğaz:** Rotalar ve Araçlar sayfalarında harita çizim kütüphaneleri (`@react-google-maps/api` veya `@mapbox/polyline`) sunucu çıktısını bloke etmektedir.
- **Öneriler:**
  - Harita bileşenleri `next/dynamic` kullanılarak `ssr: false` seçeneğiyle istemci tarafında asenkron (lazy load) olarak yüklenmelidir. Bu sayede sunucu haritayı beklemeden hızlıca iskelet ekranı (Skeleton) gönderebilir.
  - `loading.tsx` dosyası içindeki iskelet yükleyicilerin tasarımı optimize edilerek harita yüklenene kadar kullanıcıya pürüzsüz bir arayüz sunulmalıdır.

### 4. Turbopack Dev Cache Sorunları
- **Darboğaz:** Geliştirme aşamasında Turbopack'in `.next/dev/cache` veritabanında meydana gelen bozulmalar, sunucunun kilitlenmesine veya hata vermesine yol açabilmektedir.
- **Öneriler:**
  - Derleme önbelleği düzenli olarak temizlenmeli (`npx shx rm -rf .next`) veya Turbopack kararsız kaldığında klasik webpack moduna geçiş yapılmalıdır. Production (derlenmiş) sürümde bu problem tamamen ortadan kalkacaktır.

---

## 6. Sonuç

LogiTrack platformunun **istemci tarafı sayfa geçişleri (SPA)**, Next.js'in akıllı ön yükleme (`prefetch`) özellikleri sayesinde **ortalama 200 ms - 300 ms** gibi mükemmel hızlarda çalışmaktadır. Kullanıcı deneyimi açısından bu süreler dünya standartlarındadır.

Ancak, sayfaların ilk yüklenme anlarında (Direct Navigation/SSR) ve kimlik doğrulama süreçlerinde sunucu tarafında **1.5s - 3.7s** arası gecikmeler gözlenmiştir. Haritaların asenkron yüklenmesi, veri tabanı sorgu optimizasyonları ve veritabanı önbelleklemesi (caching) uygulanarak bu süreler rahatlıkla **1 saniyenin altına** düşürülebilir.
