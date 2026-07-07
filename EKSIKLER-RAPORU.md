# LogiTrack v2 — EKSİKLER RAPORU (Gaps Report)

> Oluşturulma: 2026-07-07 | Bu oturumda ölçülüp doğrulanan eksikler.
> Amaç: bu raporla gerekli yerleri sırayla düzeltmek.
> Kalite kapısı (her düzeltme sonrası yeşil olmalı):
>   `npm run build` (exit 0) · `npx tsc --noEmit` (exit 0) ·
>   `npx eslint --max-warnings=0` (exit 0) · `node scripts/run-tests.mjs`
>
> ÖNEMLİ TEST NOTU: Tam test suite'i ölçerken makinede ARTIK node süreci
> kalmadığından emin ol (`taskkill //F //IM node.exe`). Zombie süreçler CPU'yu
> aç bırakıp component testlerini flaky yapıyor ve yanlış sonuç verdiriyor.
> İlgili dersi bu oturumda yaşadık (yarım koşuyu "yeşil" sandık).

---

## DURUM ÖZETİ

| Alan | Durum |
|------|-------|
| Production build | ✅ DÜZELTİLDİ (önceden KIRIKTI — commit 17d5bf7) |
| `tsc --noEmit` (kaynak) | ✅ exit 0 |
| `eslint --max-warnings=0` | ✅ 0/0 |
| Unit testler | ✅ geçiyor |
| Component testleri | ❌ **3 dosya kırık** (izolasyonda doğrulandı) |
| Runtime perf (Lighthouse) | ⏳ HENÜZ ÖLÇÜLMEDİ |

---

## P0 — KIRIK TESTLER (önce bunlar; hepsi TEST-tarafı bug, ürün değil)

> App production'da derleniyor (build exit 0). Bu 3 hata testlerin kendi
> mock/assertion eksikliği. TODO #6'nın "KALAN bespoke" listesindekilerle birebir.
> Not: Bunlar benim build düzeltmemden ÖNCE de kırıktı (bağımsız).

### P0.1 — `app/components/sidebar/index.test.tsx`  (2 test)
- **Hata:** `SyntaxError: The requested module '@/app/lib/language/navigation'
  does not provide an export named 'getCanonicalPath'`
- **Kök neden:** Test, `navigation` modülünden `getCanonicalPath` bekliyor ama
  modül bunu export etmiyor (gerçek app derlendiğine göre sidebar bileşeni bu
  ismi kullanmıyor — test eski/yanlış isme atıf yapıyor ya da eksik mock).
- **Çözüm:** `app/lib/language/navigation.ts` gerçek export'larını kontrol et;
  testin import/mock'unu gerçek isimle hizala (veya `mock.module` ile
  `navigation`'ı doğru namedExports'la mock'la).

### P0.2 — `app/[lang]/(pages)/(landing)/pricing/page.test.tsx`  (1 test)
- **Hata:** `Unable to find an accessible element with the role "checkbox"`
  (test: `should_RenderPricingTiers_AndToggleYearly`)
- **Kök neden:** Yıllık/aylık geçiş MUI `Switch` ile render ediliyor →
  erişilebilir rolü `switch`, `checkbox` değil. Test `getByRole("checkbox")`
  arıyor.
- **Çözüm:** Testte `getByRole("switch")` kullan (veya switch'in `inputProps`
  rolüne göre uygun sorgu). Toggle sonrası fiyatların yıllık değere döndüğünü
  doğrula.

### P0.3 — `app/[lang]/(pages)/(dashboard)/customers/components/CustomerContent.test.tsx`  (2 test)
- **Hata:** `Error: useUserContext must be used within a UserProvider`
- **Kök neden:** Test bileşeni `UserProvider` ile sarmıyor / `useUserContext`
  mock'lanmamış. (TODO #6: "YARIM/EKSİK yazılmış test".)
- **Çözüm:** Render'ı `UserProvider` ile sar veya `useUserContext`'i mock'la;
  TODO'da geçen tanımsız `mockRefetch`/`mockDeleteMutateAsync` referanslarını
  tanımla veya ilgili hook'ları mock'la. Delete-dialog testi için mutation
  hook'unu mock'la.

---

## P1 — KALİTE / TİP GÜVENLİĞİ BOŞLUKLARI

### P1.1 — tsconfig katılık bayrakları eksik  ·  `tsconfig.json`
- Şu an yalnızca `strict: true`. Eksikler (tek tek aç, çıkan hataları temizle):
  - `noUncheckedIndexedAccess` (en değerli)
  - `noUnusedLocals`, `noUnusedParameters`
  - `noImplicitReturns`, `noFallthroughCasesInSwitch`
  - `forceConsistentCasingInFileNames`
  - `exactOptionalPropertyTypes` (en gürültülü — en sona)
- Ayrıca `"types": ["jest"]` var ama proje `node:test` kullanıyor → kaldır/düzelt.

### P1.2 — Test dosyaları tsc kapsamı dışında  ·  `tsconfig.json` (exclude)
- 256 test dosyası `exclude` edilmiş → tip hataları CI'da görünmüyor, yalnızca
  `tsx` runtime'ında. **Sessiz tip borcu.**
- **Çözüm:** `tsconfig.test.json` (base'i extends, test glob'larını include) +
  kalite kapısına `tsc -p tsconfig.test.json --noEmit` ekle.

### P1.3 — Bildirim metinleri i18n dışı (sabit Türkçe)  ·  ~19 kontrolör
- Kullanıcıya giden notification `title`/`message` sabit Türkçe; sözlükte
  `notifications` namespace'i ZATEN var ama kontrolörler kullanmıyor.
- Dosyalar: `documents.ts, driver/crud.ts, driver/status.ts, maintenance.ts,
  routes/{assignments,mutations,status}.ts, shipments/{assign,create,update}.ts,
  users/management.ts, vehicle/{assignments,crud,documents,issues,maintenance,
  queries}.ts, warehouse/{crud,inventory}.ts`
- **Karar gerekiyor (mimari):** (a) DB'ye i18n key+params sakla, gösterimde
  alıcı diline göre çöz (doğru, önerilen) — VEYA (b) üretim anında locale'e göre
  string üret (hızlı, daha az doğru).
- Not: teknik `throw new Error(...)` mesajları zaten İngilizce ✓ (bu madde
  sadece bildirim metinleri).

---

## P2 — CLARITY / SÜRDÜRÜLEBİLİRLİK

### P2.1 — God-component'ler (>500 satır)  ·  21 dosya  ·  EN YÜKSEK CLARITY ETKİSİ
En büyük 5 (öncelik): 
- `app/[lang]/(pages)/warehouse-worker/WarehouseWorkerClient.tsx` (1245)
- `app/components/dialogs/inventory/InventoryDetailsDialog.tsx` (1190)
- `app/components/landing/OperationsDashboard.tsx` (1122)
- `app/components/dialogs/shipment/shipmentDetailDialog.tsx` (1089)
- `app/components/ui/DataTable/index.tsx` (918 — çok tüketici, dikkatli)

Tam liste + yöntem: `CODE-QUALITY-ROADMAP.md` A maddesi. Bonus: bu dosyalar
en büyük client chunk'ları besliyor → bölmek bundle/perf'e de yarar.

### P2.2 — Cache DRY borcu (#1b)  ·  11 manuel `withCache` kontrolör
- `company/stats.ts, inventory/{dashboard,queries}.ts, overview.ts,
  routes/{queries,stats}.ts, shipments/{queries,stats}.ts, vehicle/queries.ts,
  warehouse/{crud,stats}.ts`
- DİKKAT: overview/inventory/company özel anahtar kullanıyor → manager'a temiz
  oturmaz; anahtar formatını değiştirme (testler redis mock'lar, regresyonu
  yakalamaz). Detay: `CODE-QUALITY-ROADMAP.md` D maddesi.

### P2.3 — Yorum dili tutarsızlığı  ·  ~9 Türkçe yorum satırı (+ scriptler)
- Tek dile (İngilizce) çevir. Düşük efor, sıfır risk.

---

## P3 — DOĞRULANMAMIŞ (ölçüm eksik)

### P3.1 — Runtime performans metrikleri (Lighthouse) ölçülmedi
- Static/build perf iyi (SSG landing, tree-shaking, lazy, brotli). Ama gerçek
  **LCP / TBT / CLS / TTI** ölçülmedi.
- **Çözüm:** prod build'i çalıştır (`npm start`), landing + bir dashboard
  sayfasına Lighthouse uygula (Chrome). En büyük chunk 341KB ham (~100KB brotli)
  → TBT'yi izle.

---

## ÖNERİLEN DÜZELTME SIRASI
1. **P0.1–P0.3** — 3 kırık testi yeşile al, sonra TEMİZ makinede tam suite'i tek
   koşuda doğrula (0 zombie süreç).
2. **P1.1 + P1.2** — tsconfig katılık + test tip kontrolü (gizli hataları açar).
3. **P1.3 kararı** — bildirim i18n mimari kararı (user onayı), sonra uygula.
4. **P2.1** — en büyük 5 god-component'i böl (clarity + perf).
5. **P2.2 / P2.3 / P3.1** — cila + Lighthouse doğrulaması.

## İLGİLİ DOSYALAR
- `CODE-QUALITY-ROADMAP.md` — kalite/clarity detayları (god-file listesi, puan projeksiyonu)
- `PRELAUNCH-TODO.txt` — önceki oturumların launch hazırlık kayıtları
