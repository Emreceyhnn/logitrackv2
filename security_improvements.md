# Logitrackv2 - Güvenlik İyileştirme Raporu

Projenin genel güvenlik (Security) mimarisi oldukça sağlamdır (IDOR, RBAC, Rate Limiting ve Cookie güvenliği gibi temel kontroller büyük ölçüde başarıyla uygulanmıştır). Bu doküman iki bölümden oluşuyor: **(A) tespit edilip düzeltilen gerçek açıklar** ve **(B) ileride sıkılaştırılması önerilen maddeler**.

---

## A. Tespit Edilip Düzeltilen Açıklar (2026-07-09 denetimi)

Bu bölümdeki maddeler kod okunarak doğrulanmış, gerçek exploit senaryosu tespit edilmiş ve düzeltilmiştir.

### A1. `updateUser` — privilege escalation + cross-tenant account takeover 🔴 Kritik
**Dosya:** `app/lib/controllers/users/management.ts`

**Sorun:** Fonksiyon `db.user.upsert({ where: { email }, ... })` kullanıyordu — `companyId` scope kontrolü yoktu. Bir admin, **başka bir şirkete ait bir email** girerse o kullanıcının adını, soyadını, avatarını, rolünü ve şifresini değiştirebiliyordu. Ayrıca `roleId` parametresi hiçbir whitelist/sahiplik kontrolü olmadan doğrudan set ediliyordu — başka bir tenant'ın custom role'ü bile atanabilirdi.

**Exploit senaryosu:** Şirket A'nın admin'i, Şirket B'de kayıtlı bir kullanıcının email'ini bilerek `updateUser` server action'ını çağırır; sistem email üzerinden o kullanıcıyı bulup güncelleyip şifresini kendi belirlediği bir değere çevirir → hesap ele geçirme.

**Düzeltme:** `id`-bazlı `db.user.update` kullanılıyor artık (email değil), `targetUser.companyId !== companyId` kontrolü eklendi, `roleId` için `targetRole.companyId === null || companyId` (sistem rolü ya da kendi tenant'ının rolü) doğrulaması eklendi, email çakışması ayrı ve açık bir `ConflictError` ile ele alınıyor.

### A2. `updateShipment` / `updateRoute` — tenant hijacking 🔴 Kritik
**Dosyalar:** `app/lib/controllers/shipments/update.ts`, `app/lib/controllers/routes/mutations.ts`

**Sorun:** Kullanıcıdan gelen `data` objesi doğrudan Prisma `update`'e spread ediliyordu (`data: { ...updateData }`). `companyId` alanı bu Prisma tipinde teorik olarak mevcut olduğundan, TypeScript tip kontrolünü bypass eden bir çağrı (örn. doğrudan server action ID'sine network üzerinden istek) bir shipment/route'u başka bir tenant'a taşıyabilirdi.

**Exploit senaryosu:** Kimliği doğrulanmış ama düşük yetkili bir kullanıcı, `updateShipment(shipmentId, { ...normalAlanlar, companyId: "hedef-sirket-id" })` çağrısı yaparak kendi şirketindeki bir sevkiyat kaydını farklı bir tenant'a bağlar; veri artık orijinal şirketin erişemeyeceği bir yerde durur (veri kaybı/manipülasyon).

**Düzeltme:** Her iki dosyada da `data`'dan `companyId`/`company` alanları update objesine yazılmadan önce açıkça `delete` ediliyor.

### A3. `createShipment` — cross-tenant `customerId`/`trailerId` okuma + eksik validation 🟠 Yüksek
**Dosya:** `app/lib/controllers/shipments/create.ts`

**Sorun:** `customerId` ve `trailerId` parametreleri için `companyId` kontrolü yapılmadan `db.customer.findUnique`/`db.trailer.findUnique` çağrılıyordu — başka bir şirketin customer/trailer kaydına erişilip yeni shipment'a bağlanabiliyordu. Ayrıca zaten yazılmış olan `createShipmentSchema` (Zod) hiç kullanılmıyordu; girdi hiçbir runtime validation'dan geçmeden Prisma'ya gidiyordu.

**Düzeltme:** `createShipmentSchema.parse(data)` ile girdi validate ediliyor; `customer.companyId !== companyId` ve `trailer.companyId !== companyId` kontrolleri eklenip uyuşmazlıkta `NotFoundError` fırlatılıyor.

### A4. `getSignedUrlAction` — IDOR (Insecure Direct Object Reference) 🟠 Yüksek
**Dosya:** `app/lib/actions/upload.ts`

**Sorun:** Fonksiyon `_user` parametresini hiç kullanmıyordu — sadece "bir kullanıcı login olmuş olmalı" garantisi vardı, ama dosyanın çağıranın şirketine ait olup olmadığı hiç doğrulanmıyordu. Herhangi bir authenticated kullanıcı, bir `fileUrl` tahmin ederek/gözlemleyerek başka bir şirketin özel dokümanı için imzalı (signed, 1 saat geçerli) bir URL alabiliyordu.

**Exploit senaryosu:** Kullanıcı, kendi şirketindeki bir dokümanın URL yapısını inceler (örn. `documents/<company-id>/<file>.pdf` deseni), aynı deseni tahmin ederek başka bir company-id ile `getSignedUrlAction` çağırır ve o şirketin özel belgesine (ehliyet, sigorta, sözleşme vb.) erişir.

**Düzeltme:** `fileUrl`'in çağıranın kendi `companyId`'sine ait bir `Document` kaydına (`db.document.findFirst({ where: { url: fileUrl, companyId } })`) karşılık geldiği doğrulanıyor; eşleşme yoksa erişim reddediliyor.

### A5. Prisma şema sertleştirmesi (ayrı otururumda yapıldı, burada özetlenmiştir)
- **Tenant izolasyonu:** `driver/crud.ts`'de `currentVehicleId` için eksik olan `companyId` kontrolü eklendi (cross-tenant araç ataması engellendi).
- **Soft-delete tutarlılığı:** `Vehicle.deletedAt`/`Trailer.deletedAt` filtresi unutulmuş 9+ sorguya (`reports.ts`, `company/resources.ts`, `routes/stats.ts`, `vehicle/issues.ts`, `vehicle/queries.ts`, `overview.ts`, `analytics/fleet.ts`, cron) eklendi — silinmiş araçlar artık dashboard/rapor/istatistiklerde görünmüyor.
- **Eksik yetkilendirme:** `trailer.ts`'deki `getTrailers`/`getTrailerById`/`updateTrailer`/`deleteTrailer`/`assignTrailerToVehicle` fonksiyonlarına eksik olan `checkPermission` çağrıları eklendi.
- **Şema bütünlüğü:** Tüm optional foreign key'lere explicit `onDelete: Restrict` yazıldı (davranış değişmedi, niyet netleşti); `Shipment.priority`/`type` gereksiz nullable+default kombinasyonu `NOT NULL`'a çevrildi (mevcut veri kontrol edilip güvenli olduğu teyit edildikten sonra).
- **Performans/DoS-adjacent:** `Shipment.slaDeadline` ve `Document.expiryDate` üzerinde eksik olan index'ler eklendi (cron job'un tam tablo taraması yapmasını önlemek için).

---

## B. İleride Sıkılaştırılması Önerilen Maddeler (henüz düzeltilmedi)

Bu bölümdeki maddeler ya düşük öncelikli ya da kapsamı daha geniş bir refactor gerektiriyor.

### B1. `updateShipment`'ta kalan cross-tenant read-only bağlama riski
`customerId`/`trailerId`/`routeId`/`driverId`/`originWarehouseId` alanları için hâlâ `companyId` sahiplik kontrolü yok (A3'te create tarafı düzeltildi, update tarafı düzeltilmedi). Öncelik: orta — read-only bağlama riski, veri sızıntısı değil ama mantıksal bütünlük ihlali.

### B2. CSRF koruması — `app/api/*` REST uçları
> [!WARNING]
> Next.js Server Actions varsayılan olarak CSRF korumasına sahiptir, ancak `app/api/*` altındaki klasik REST uçları (örn. `valhalla/route.ts`) dışarıdan POST isteklerine açık olabilir.

**Öneri:** `app/api/*` altındaki `POST/PUT/DELETE` uçlarına gelen isteklerde `Origin`/`Referer` header kontrolü eklenmeli, sadece `NEXT_PUBLIC_BASE_URL`'den gelen isteklerin kabul edildiğinden emin olunmalı.

### B3. Cron/exchange-rate secret karşılaştırması timing-safe değil
`CRON_SECRET` kontrolü basit `===`/`!==` ile yapılıyor (`crypto.timingSafeEqual` değil). Pratik risk minimal (network jitter zaten timing farkını maskeliyor) ama defense-in-depth için düzeltilebilir.

### B4. Arama (search) parametrelerinde uzunluk sınırı yok
`searchPlatformUsers` gibi Prisma `contains` kullanan arama fonksiyonlarında `query` parametresi için Zod `.max(50)` gibi bir üst sınır yok. Çok uzun girdiler DB tarafında yavaş sorgulara yol açabilir (ReDoS değil, ama gereksiz yük).

### B5. `NEXT_PUBLIC_*` isimlendirme disiplini
Mevcut `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` server-side fallback'i kod içinde zaten uyarı olarak loglanmış (düşük risk, Google Maps key'leri zaten client-side kullanım için tasarlanmış). İleride eklenecek Stripe/AWS/Twilio/Supabase Service Role Key gibi gerçek server-only secret'ların asla `NEXT_PUBLIC_` prefix'i almaması gerektiği hatırlatması olarak kalsın.

### B6. Şifre sıfırlama (forgot-password) akışı
Kod tabanında bu özellik bulunamadı — muhtemelen henüz implemente edilmemiş. İleride eklenirse token üretiminin tahmin edilemez (kriptografik rastgele) ve süreli (expiration) olması gerekir.
