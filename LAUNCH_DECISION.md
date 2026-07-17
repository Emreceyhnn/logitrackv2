# LANSMAN GO/NO-GO KARARI — LogiTrack v2

> **Karar tarihi:** 2026-07-17
> **Karar sahibi:** Release Manager (Lansman karar denetimi)
> **Kapsam:** `master` branch — Next.js 16.2.9 (Turbopack) · Prisma 7.8 · Neon · Firebase RTDB · JWT/jose

**Reklamla yayına: NO-GO** — Reklam barı daha yüksektir; canlı-katman gating'i tek ekranda kanıtlanmışken ve manuel UAT hiç yapılmamışken reklam trafiği ürünü en zayıf yerinden vurabilir.

---

## 3. ANA BULGU TABLOSU (şiddete göre sıralı)

| #   | Alan                 | Şiddet    | Bulgu                                                                                                                                                     | Engeller? | Durum | Sahip |
| --- | -------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----- | ----- |
| 3   | 9 UAT                | **MAJOR** | Chrome uçtan uca canlı tıklama / konsol-network kanıtı **hiç yok** — çekirdek akışlar (login→dashboard→shipment) canlı doğrulanmadı                       | **EVET**  | EKSİK | QA    |
| 4   | 1,2,10,11 İnsan-gözü | **MAJOR** | Operasyonel gerçeklik, sıfırdan-UX, filo-müdürü iş mantığı, çapraz-cihaz canlı — kod tabanından üretilemez, denetlenmedi                                  | KISMEN    | EKSİK | PM/QA |
| 5   | 11 Canlı-katman      | MINOR     | `useFirebaseConnection` bayat-veri-gating'i **yalnızca vehicle-dialog map'inde** tüketiliyor; filo-geneli canlı ekran varsa orada tutarlılık kanıtlanmadı | HAYIR     | AÇIK  | Dev   |
| 7   | 5 Güvenlik           | MINOR     | Tenant-guard **fail-open** (`getTenantCompanyId()` null dönerse filtre eklenmez); pratikte 2. katman `where:{companyId}` kapatıyor                        | HAYIR     | KABUL | Dev   |
| 8   | 5 Bağımlılık         | MINOR     | `npm audit`: 3 moderate (hono/node-server, prisma transitive), 0 critical/high; fix breaking                                                              | HAYIR     | KABUL | Dev   |
| 9   | 7 Performans         | MINOR     | En büyük shared chunk 101KB gzip (MUI+charts+leaflet+firebase); ölçüldü, kabul edilebilir ama bölünebilir                                                 | HAYIR     | KABUL | Dev   |

---

## 4. ALAN KAPSAM DURUMU (11 alan)

| #   | Alan                  | Durum          | En ağır bulgu                                                                                    |
| --- | --------------------- | -------------- | ------------------------------------------------------------------------------------------------ |
| 1   | Lojistik operasyon    | **EKSİK**      | İnsan-gözü; denetlenmedi (kör nokta)                                                             |
| 2   | Sıfırdan UX           | **EKSİK**      | İlk-oturum sürtünmesi ölçülmedi (kör nokta)                                                      |
| 3   | Kod kalitesi & yapı   | **DENETLENDİ** | Temiz: tsc 0 hata, lint 0, `any` 0 (no-explicit-any=error)                                       |
| 4   | Veritabanı            | **DENETLENDİ** | Güçlü: 29 model, 85 index/unique, companyId + onDelete:Restrict her tenant modelinde             |
| 5   | Güvenlik              | **DENETLENDİ** | Tasarım güçlü (2-katmanlı tenant-guard, IDOR/SSRF kapalı, secret sızıntısı yok); MINOR fail-open |
| 6   | Test kapsamı          | **DENETLENDİ** | 791/791 geçti, 0 fail — auth/session çekirdeği dahil tüm suite yeşil                             |
| 7   | Performans & prod     | **DENETLENDİ** | Build ✓, 110 SSG sayfa, standalone output; en büyük chunk 101KB gz                               |
| 8   | Ürün/UX cilası        | **KISMİ**      | 57 EmptyState, 7 skeleton, i18n(tr/en) var; loading.tsx tek, canlı a11y kanıtı yok               |
| 9   | UAT                   | **EKSİK**      | Canlı tıklama kanıtı yok (kör nokta)                                                             |
| 10  | Lojistik alan-uzmanı  | **EKSİK**      | Rakip kıyası / iş-mantığı denetlenmedi (kör nokta)                                               |
| 11  | Çapraz & dayanıklılık | **KISMİ**      | Bayat-veri-gating doğru ama tek ekranda; responsive canlı test yok                               |

**Denetlenen (kanıt toplanan) alanlar:** 3, 4, 5, 6, 7 — otomatik/kod-tabanlı denetimlerle.
**Kör noktalar (NO-GO gerekçesi):** 1, 2, 9, 10 — insan-gözü / canlı-ortam gerektiriyor, kod tabanından üretilemez.

---

## 5. YAYIN ENGELLEYİCİLER (GO'ya dönüş sırası + efor)

4. **[M] Manuel UAT:** Chrome'da login→dashboard→shipment oluştur→canlı harita akışını konsol/network temiz kanıtıyla koştur (Bulgu #3).

> Efor: **S** = Küçük (saatler), **M** = Orta (yarım–bir gün), **L** = Büyük.

---

## 6. RİSK KAYDI (KOŞULLU-GO'da kabul ettiklerimiz)

| Risk                                                                   | Olasılık × Etki                         | Azaltma / Geri-alma                                                                                                                                                   |
| ---------------------------------------------------------------------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tenant-guard fail-open (`getTenantCompanyId()` null → filtre eklenmez) | Düşük × Kritik                          | 2. katman manuel `where:{companyId}` mevcut (getShipments'ta doğrulandı). Geri-alma: guard'ı fail-closed yap — context yoksa throw. _İzlenmeli, yayını engellemiyor._ |
| Canlı-gating tek ekranda                                               | Orta × Yüksek (yanlış "canlı" izlenimi) | Filo-geneli canlı ekran varsa aynı `isConnected` gating'i uygula; UAT'de doğrula.                                                                                     |
| 3 moderate npm audit                                                   | Düşük × Düşük                           | Prod-runtime path'te değil; prisma major upgrade'de kapanır.                                                                                                          |
| 101KB gz shared chunk                                                  | Düşük × Orta (yavaş 3G ilk yük)         | charts/leaflet'i lazy-load; en büyük chunk'ı böl.                                                                                                                     |

---

## 7. KARAR GEREKÇESİ & KOŞULLAR

### Neden NO-GO değil, KOŞULLU-GO

Rubriğin **5 otomatik-NO-GO tetikleyicisinin hiçbiri açık değil** — kod okumasıyla ve build kanıtıyla doğrulandı:

- **Multi-tenant sızıntı: YOK** — `db.ts` içinde `tenant-guard` Prisma extension her read/write/create/update'e `companyId` zorluyor + cross-tenant create/update **throw** ediyor; ayrıca controller'larda manuel `where:{companyId}` 2. katman.
- **Bayat-veri-canlı gösterme: KAPALI** — `map.tsx`: `degraded = !isConnected || !!error`, canlı gösterim `!degraded && isLive(timestamp)` ile kapılanmış.
- **Kimliksiz endpoint: YOK** — Server Action'lar `authenticatedAction` HOC ile sarılı; cron `timingSafeEqual` + `CRON_SECRET` ile korunuyor.
- **IDOR / yetki yükseltme: KAPALI** — `[id]/location` yabancı vehicle id'yi tenant-scoped **404**'e çeviriyor; RBAC `checkPermission` ile.
- **Client'a secret sızıntısı: YOK** — `JWT_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `FIREBASE_PRIVATE_KEY` yalnızca server-only dosyalarda; hiçbiri `NEXT_PUBLIC` ile karışmamış.

Kod / DB / güvenlik-tasarımı olağanüstü olgun.

### Neden GO değil

Auth/session test kanıtı artık yeşil, ancak insan-gözü doğrulama (UAT, operasyonel gerçeklik, sıfırdan-UX) hâlâ hiç yapılmadı — kod tabanından üretilemeyen bu denetimler tamamlanmadan tam GO verilmiyor.

### GO'ya dönüş checklist'i (işaretlenebilir)

- [ ] Manuel Chrome UAT: login→dashboard→shipment→canlı harita, konsol temiz

### Reklama dönüş için ek olarak

Yukarıdakiler **+** filo-geneli canlı ekran gating tutarlılığı **+** mobil responsive canlı doğrulama.

---

## 8. LANSMAN SONRASI İZLEME (GO durumunda — ilk 48 saat)

| Metrik                      | Anında rollback eşiği                                             |
| --------------------------- | ----------------------------------------------------------------- |
| 5xx oranı                   | >%1 sürekli (5 dk)                                                |
| Uncaught client error       | >%2 oturum                                                        |
| Firebase reconnect başarısı | <%95 (bayat-veri gösterimi riski)                                 |
| Login→dashboard tamamlama   | <%90                                                              |
| Cross-tenant izolasyon      | Herhangi bir 200 + yabancı companyId verisi → **anında rollback** |

---

## Denetim Kanıt Özeti (bu karar neye dayanıyor)

| Denetim           | Komut / Yöntem                   | Sonuç                                                                         |
| ----------------- | -------------------------------- | ----------------------------------------------------------------------------- |
| TypeScript        | `tsc --noEmit`                   | **0 hata** (strict + noUncheckedIndexedAccess + exactOptionalPropertyTypes)   |
| Lint              | `eslint .`                       | **0 uyarı**                                                                   |
| `any` kullanımı   | grep `app/**`                    | **0** (`no-explicit-any` = error)                                             |
| npm audit         | `npm audit`                      | 0 critical / 0 high / **3 moderate**                                          |
| Prisma şema       | `schema.prisma`                  | 29 model, 85 index/unique, tüm tenant modelinde companyId + onDelete:Restrict |
| Tenant izolasyonu | `db.ts` extension                | 2-katmanlı guard, cross-tenant write → throw                                  |
| Auth/RBAC         | `auth-middleware.ts`, `proxy.ts` | HOC + AsyncLocalStorage tenant context + rate-limit                           |
| Secret sızıntısı  | grep client bundle               | server-only dosyalarda, sızıntı yok                                           |
| Build             | `npm run build`                  | **exit 0**, 110 SSG sayfa, standalone                                         |
| Bundle            | `.next/static` ölçüm             | en büyük shared chunk **101KB gz** (341KB raw)                                |
| Test              | `npm test` (257 dosya)           | **791/791 geçti, 0 fail, 0 batch çöktü**                                      |
