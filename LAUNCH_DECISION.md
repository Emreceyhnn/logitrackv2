# LANSMAN GO/NO-GO KARARI — LogiTrack v2

> **Karar tarihi:** 2026-07-17
> **Karar sahibi:** Release Manager (Lansman karar denetimi)
> **Kapsam:** `master` branch — Next.js 16.2.9 (Turbopack) · Prisma 7.8 · Neon · Firebase RTDB · JWT/jose

---

## 1. GENEL KARAR: **KOŞULLU-GO**

Ürün kodu yayına hazır ve tek bir açık güvenlik/veri BLOCKER'ı yok; ancak **test kanıtı çökük** (auth/session çekirdeği dahil suite'in ~%18'i `server-only` resolve hatası + chart timeout'ları yüzünden hiç koşmuyor) — güvenlik-kritik akışları yeşil testle doğrulayamadığım için imzayı test altyapısı onarılana kadar koşula bağlıyorum.

**Reklamla yayına: NO-GO** — Reklam barı daha yüksektir; auth/session revocation ve token rotation davranışı test kanıtıyla doğrulanmadan, canlı-katman gating'i tek ekranda kanıtlanmışken ve manuel UAT hiç yapılmamışken reklam trafiği ürünü en zayıf yerinden (doğrulanmamış oturum güvenliği) vurabilir.

---

## 2. HAZIRLIK SKORU: **74/100** — Risk seviyesi: **Orta**

Kod / mimari / güvenlik-tasarımı çok güçlü çektiği için yüksek; test kanıtının çökük olması ve 4 insan-gözü alanının hiç denetlenmemiş olması nedeniyle 74'te tavanlı.

---

## 3. ANA BULGU TABLOSU (şiddete göre sıralı)

| # | Alan | Şiddet | Bulgu | Engeller? | Durum | Sahip |
|---|------|--------|-------|-----------|-------|-------|
| 1 | 6 Test | **BLOCKER** | Suite'in ~18 batch'i (~90 dosya) `ERR_MODULE_NOT_FOUND: server-only` + chart 120s timeout ile hiç koşmuyor; **session/auth çekirdeği testleri komple fail** | **EVET** | AÇIK | Dev |
| 2 | 6/5 Test-Güvenlik | **MAJOR** | Auth/session (createSession, revoke, refresh rotation, expired-token) davranışı hiçbir yeşil testle doğrulanmıyor — kod doğru görünüyor ama kanıt yok | **EVET** | AÇIK | Dev |
| 3 | 9 UAT | **MAJOR** | Chrome uçtan uca canlı tıklama / konsol-network kanıtı **hiç yok** — çekirdek akışlar (login→dashboard→shipment) canlı doğrulanmadı | **EVET** | EKSİK | QA |
| 4 | 1,2,10,11 İnsan-gözü | **MAJOR** | Operasyonel gerçeklik, sıfırdan-UX, filo-müdürü iş mantığı, çapraz-cihaz canlı — kod tabanından üretilemez, denetlenmedi | KISMEN | EKSİK | PM/QA |
| 5 | 11 Canlı-katman | MINOR | `useFirebaseConnection` bayat-veri-gating'i **yalnızca vehicle-dialog map'inde** tüketiliyor; filo-geneli canlı ekran varsa orada tutarlılık kanıtlanmadı | HAYIR | AÇIK | Dev |
| 6 | 3 Test-hijyen | MINOR | `valhalla.ts` testi eski (`/route` bekliyor, kod doğru olarak `/api/valhalla`); render smoke testleri jsdom altında kırık | HAYIR | AÇIK | Dev |
| 7 | 5 Güvenlik | MINOR | Tenant-guard **fail-open** (`getTenantCompanyId()` null dönerse filtre eklenmez); pratikte 2. katman `where:{companyId}` kapatıyor | HAYIR | KABUL | Dev |
| 8 | 5 Bağımlılık | MINOR | `npm audit`: 3 moderate (hono/node-server, prisma transitive), 0 critical/high; fix breaking | HAYIR | KABUL | Dev |
| 9 | 7 Performans | MINOR | En büyük shared chunk 101KB gzip (MUI+charts+leaflet+firebase); ölçüldü, kabul edilebilir ama bölünebilir | HAYIR | KABUL | Dev |

---

## 4. ALAN KAPSAM DURUMU (11 alan)

| # | Alan | Durum | En ağır bulgu |
|---|------|-------|---------------|
| 1 | Lojistik operasyon | **EKSİK** | İnsan-gözü; denetlenmedi (kör nokta) |
| 2 | Sıfırdan UX | **EKSİK** | İlk-oturum sürtünmesi ölçülmedi (kör nokta) |
| 3 | Kod kalitesi & yapı | **DENETLENDİ** | Temiz: tsc 0 hata, lint 0, `any` 0 (no-explicit-any=error) |
| 4 | Veritabanı | **DENETLENDİ** | Güçlü: 29 model, 85 index/unique, companyId + onDelete:Restrict her tenant modelinde |
| 5 | Güvenlik | **DENETLENDİ** | Tasarım güçlü (2-katmanlı tenant-guard, IDOR/SSRF kapalı, secret sızıntısı yok); MINOR fail-open |
| 6 | Test kapsamı | **KISMİ** | BLOCKER: suite'in ~%18'i + auth çekirdeği hiç koşmuyor |
| 7 | Performans & prod | **DENETLENDİ** | Build ✓, 110 SSG sayfa, standalone output; en büyük chunk 101KB gz |
| 8 | Ürün/UX cilası | **KISMİ** | 57 EmptyState, 7 skeleton, i18n(tr/en) var; loading.tsx tek, canlı a11y kanıtı yok |
| 9 | UAT | **EKSİK** | Canlı tıklama kanıtı yok (kör nokta) |
| 10 | Lojistik alan-uzmanı | **EKSİK** | Rakip kıyası / iş-mantığı denetlenmedi (kör nokta) |
| 11 | Çapraz & dayanıklılık | **KISMİ** | Bayat-veri-gating doğru ama tek ekranda; responsive canlı test yok |

**Denetlenen (kanıt toplanan) alanlar:** 3, 4, 5, 7 — otomatik/kod-tabanlı denetimlerle.
**Kör noktalar (NO-GO gerekçesi):** 1, 2, 9, 10 — insan-gözü / canlı-ortam gerektiriyor, kod tabanından üretilemez.

---

## 5. YAYIN ENGELLEYİCİLER (GO'ya dönüş sırası + efor)

1. **[S] `server-only`'yi devDependency olarak kur** → test runner'ın resolve etmesini sağla (`npm i -D server-only` veya runner'da stub'la). Bu tek adım ~18 batch'i ve session testlerini geri açar.
2. **[S] Chart bileşen testlerinin jsdom timeout'unu çöz** (x-charts mock'la veya bu dosyaları ayrı shard'a al) → batch 6-24 çökmesini kapat.
3. **[S] Test suite'i yeşil koştur ve session/auth testlerinin GEÇTİĞİNİ kanıtla** → auth çekirdeği doğrulanmadan GO yok (Bulgu #2 buna bağlı).
4. **[M] Manuel UAT:** Chrome'da login→dashboard→shipment oluştur→canlı harita akışını konsol/network temiz kanıtıyla koştur (Bulgu #3).
5. **[S] Eski `valhalla.ts` testini düzelt** (`/api/valhalla`).

> Efor: **S** = Küçük (saatler), **M** = Orta (yarım–bir gün), **L** = Büyük.

---

## 6. RİSK KAYDI (KOŞULLU-GO'da kabul ettiklerimiz)

| Risk | Olasılık × Etki | Azaltma / Geri-alma |
|------|-----------------|---------------------|
| Tenant-guard fail-open (`getTenantCompanyId()` null → filtre eklenmez) | Düşük × Kritik | 2. katman manuel `where:{companyId}` mevcut (getShipments'ta doğrulandı). Geri-alma: guard'ı fail-closed yap — context yoksa throw. *İzlenmeli, yayını engellemiyor.* |
| Canlı-gating tek ekranda | Orta × Yüksek (yanlış "canlı" izlenimi) | Filo-geneli canlı ekran varsa aynı `isConnected` gating'i uygula; UAT'de doğrula. |
| 3 moderate npm audit | Düşük × Düşük | Prod-runtime path'te değil; prisma major upgrade'de kapanır. |
| 101KB gz shared chunk | Düşük × Orta (yavaş 3G ilk yük) | charts/leaflet'i lazy-load; en büyük chunk'ı böl. |

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

Test kanıtı çökük. Güvenlik-kritik auth katmanını "kod bakınca doğru" diye imzalamam — bu tam olarak kovulan release manager'ın hatasıdır. `server-only` bir **prod sorunu değil** (build exit 0 + 110 SSG sayfa kanıtlıyor) ama **testleri kör ediyor**, ve kör test = doğrulanmamış auth.

Gerçek assertion fail'leri yalnızca 3 (`Totals: 554/576 passed, 3 failed`) ve hepsi zararsız: `valhalla.ts` testi eski (kod doğru), diğerleri jsdom render smoke'ları. Asıl sorun çöken ~18 batch'in hiç koşmaması.

### GO'ya dönüş checklist'i (işaretlenebilir)

- [ ] `server-only` kurulu, test runner resolve ediyor
- [ ] `npm test` yeşil, session/auth testleri GEÇİYOR (0 gerçek fail)
- [ ] Chart batch timeout'ları giderildi
- [ ] Manuel Chrome UAT: login→dashboard→shipment→canlı harita, konsol temiz

### Reklama dönüş için ek olarak

Yukarıdakiler **+** filo-geneli canlı ekran gating tutarlılığı **+** mobil responsive canlı doğrulama.

---

## 8. LANSMAN SONRASI İZLEME (GO durumunda — ilk 48 saat)

| Metrik | Anında rollback eşiği |
|--------|----------------------|
| 5xx oranı | >%1 sürekli (5 dk) |
| Uncaught client error | >%2 oturum |
| Firebase reconnect başarısı | <%95 (bayat-veri gösterimi riski) |
| Login→dashboard tamamlama | <%90 |
| Cross-tenant izolasyon | Herhangi bir 200 + yabancı companyId verisi → **anında rollback** |

---

## Denetim Kanıt Özeti (bu karar neye dayanıyor)

| Denetim | Komut / Yöntem | Sonuç |
|---------|----------------|-------|
| TypeScript | `tsc --noEmit` | **0 hata** (strict + noUncheckedIndexedAccess + exactOptionalPropertyTypes) |
| Lint | `eslint .` | **0 uyarı** |
| `any` kullanımı | grep `app/**` | **0** (`no-explicit-any` = error) |
| npm audit | `npm audit` | 0 critical / 0 high / **3 moderate** |
| Prisma şema | `schema.prisma` | 29 model, 85 index/unique, tüm tenant modelinde companyId + onDelete:Restrict |
| Tenant izolasyonu | `db.ts` extension | 2-katmanlı guard, cross-tenant write → throw |
| Auth/RBAC | `auth-middleware.ts`, `proxy.ts` | HOC + AsyncLocalStorage tenant context + rate-limit |
| Secret sızıntısı | grep client bundle | server-only dosyalarda, sızıntı yok |
| Build | `npm run build` | **exit 0**, 110 SSG sayfa, standalone |
| Bundle | `.next/static` ölçüm | en büyük shared chunk **101KB gz** (341KB raw) |
| Test | `npm test` (257 dosya) | **554/576 geçti, 3 gerçek fail, ~18 batch çöktü** (server-only + timeout) |
