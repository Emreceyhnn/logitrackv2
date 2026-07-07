# LogiTrack v2 — Code Quality & Clarity Yol Haritası → 100/100

> Oluşturulma: 2026-07-07 | Ölçülen taban: **Quality 85 / Clarity 77**
> Amaç: **100 / 100**. Bu dosya tüm bilinen sorunları tek yerde toplar.
> Her madde: kanıt (dosya:sayı) · kök neden · çözüm · efor · risk · puan etkisi.
>
> KURAL (launch dersi): dosya-dosya / domain-domain ilerle, HER grup sonrası
> ilgili testi çalıştır. Toptan değiştirip tek commit yapma.
> Kalite kapısı (her commit öncesi yeşil olmalı):
>   `node scripts/run-tests.mjs` · `npx tsc --noEmit` · `npx eslint --max-warnings=0`

---

## 0) MEVCUT DURUM — NELER İYİ (regresyon yaptırma)

Bunlar zaten örnek seviyede; dokunurken bozmamak referans:
- `strict: true` + non-test kodda **0 `any`**, **0 `@ts-ignore`**, **0 TODO/FIXME**
- Kaynak kodda **0 `console.log`/`console.debug`**
- 25 `eslint-disable`'ın tamamı meşru React-hooks kuralı (keyfi susturma yok)
- Tam test suite yeşil: 120 unit + 165 component, izole runner ile deterministik
- Kontrolör katmanı: `controllerGuard`, tenant guard, enum invariant, durum makineleri
- A11y kaba tarama: `alt`'sız `<img>` = 0

---

## A) GOD-COMPONENT'LER  ·  [Clarity]  ·  EN YÜKSEK ETKİ  ·  ~ +10 puan

**Kök neden:** Tek dosyada UI + state + data-fetch + iş kuralı iç içe. Okunması,
test edilmesi, code-review'ı ve onboarding'i zor. Merge-conflict mıknatısı.

**Kanıt — 500+ satır, non-test (21 dosya):**

| Satır | Dosya |
|------:|-------|
| 1245 | `app/[lang]/(pages)/warehouse-worker/WarehouseWorkerClient.tsx` |
| 1190 | `app/components/dialogs/inventory/InventoryDetailsDialog.tsx` |
| 1122 | `app/components/landing/OperationsDashboard.tsx` |
| 1089 | `app/components/dialogs/shipment/shipmentDetailDialog.tsx` |
|  918 | `app/components/ui/DataTable/index.tsx` |
|  757 | `app/components/dialogs/shipment/addShipmentDialog/sections/StopsSection.tsx` |
|  731 | `app/components/dialogs/inventory/InventoryEditDialog.tsx` |
|  729 | `app/components/dialogs/vehicle/vehicleDetailsDialog/maintenance.tsx` |
|  714 | `app/components/dialogs/driver/addDriverDialog/secondStep.tsx` |
|  688 | `app/components/dialogs/driver/editDriverDialog/secondStep.tsx` |
|  651 | `app/components/dialogs/warehouse/warehouseDetailsDialog/overviewTab.tsx` |
|  637 | `app/components/dialogs/routes/index.tsx` |
|  630 | `app/components/dialogs/vehicle/maintenanceDetailDialog/index.tsx` |
|  602 | `app/components/dialogs/vehicle/vehicleDetailsDialog/documentsTab.tsx` |
|  598 | `app/components/dialogs/vehicle/maintenanceRecordDialog/index.tsx` |
|  564 | `app/[lang]/(pages)/(dashboard)/vehicle/components/VehicleContent.tsx` |
|  548 | `app/components/dialogs/shipment/edit-shipment-dialog.tsx` |
|  531 | `app/components/dialogs/customer/customerDetailDialog.tsx` |
|  516 | `app/components/dialogs/shipment/addShipmentDialog/sections/InventorySection.tsx` |
|  513 | `app/components/dialogs/company/AddCompanyMemberDialog.tsx` |
|  511 | `app/components/dialogs/shipment/addShipmentDialog/index.tsx` |

**Çözüm (dosya başına):**
1. Saf sunum parçalarını alt-bileşene çıkar (`./components/*` veya `./sections/*`).
2. Form/veri mantığını custom hook'a taşı (`useXForm`, `useXData`).
3. Kolon tanımları / sabit dizileri ayrı modüle (`columns.ts`, `constants.ts`).
4. Hedef: her dosya < 300 satır, tek sorumluluk.

**Öncelik sırası:** İlk 5 (1000+ ve 918) en yüksek getiri. Diğerleri parti parti.
**Efor:** yüksek (dosya başına 1–3 saat). **Risk:** düşük-orta — davranış aynı
kalmalı; her bölmeden sonra ilgili `*.test.tsx` yeşil olmalı (snapshot değil,
davranış testi mevcut).
**Puan etkisi:** Clarity +8~10 (asıl tavan kırıcı).

- [ ] A1  WarehouseWorkerClient (1245) böl
- [ ] A2  InventoryDetailsDialog (1190) böl
- [ ] A3  OperationsDashboard (1122) böl
- [ ] A4  shipmentDetailDialog (1089) böl
- [ ] A5  DataTable/index (918) böl (paylaşımlı — dikkatli, çok tüketici var)
- [ ] A6  Kalan 16 dosyayı < 400 satıra indir (parti parti)

---

## B) BİLDİRİM METNİ i18n  ·  [Quality/Consistency]  ·  ORTA ETKİ  ·  ~ +4 puan

**Kök neden:** Kullanıcıya giden bildirim `title`/`message` metinleri server-side
sabit-kodlu **Türkçe**. Dil standardı bozuk ve tek-dilli.
**İYİ HABER:** i18n sözlüğünde **zaten `notifications` namespace'i var**
(`app/lib/language/dictionaries/{en,tr}.json`) — altyapı mevcut, sadece
kontrolörler kullanmıyor.

**Kanıt — sabit Türkçe metin içeren 19 kontrolör:**
```
documents.ts, driver/crud.ts, driver/status.ts, maintenance.ts,
routes/assignments.ts, routes/mutations.ts, routes/status.ts,
shipments/assign.ts, shipments/create.ts, shipments/update.ts,
users/management.ts, vehicle/assignments.ts, vehicle/crud.ts,
vehicle/documents.ts, vehicle/issues.ts, vehicle/maintenance.ts,
vehicle/queries.ts, warehouse/crud.ts, warehouse/inventory.ts
```
Örn: `driver/status.ts:45` `label: "Görevde"`; `maintenance.ts:93`
`title: "Yeni Bakım Kaydı 👨‍🔧"`.

**Karar noktası (mimari):** Bildirim alıcının diline göre nasıl render edilecek?
- **Seçenek 1 (önerilen):** DB'ye i18n `key` + `params` (JSON) sakla, gösterim
  anında alıcının diline göre çöz. Doğru ve ölçeklenir; şema/gösterim dokunuşu.
- **Seçenek 2 (hızlı):** Üretim anında alıcının `locale`'ini bilip sözlükten
  string üret. Daha az doğru (dil sonradan değişirse eski metin kalır).

**Efor:** orta (şema kararına bağlı). **Risk:** orta (bildirim akışı + şema).
**Puan etkisi:** Quality +3~4.

- [ ] B1  Mimari kararı ver (key+params vs locale-at-write) — **user onayı gerek**
- [ ] B2  `notifications` namespace'ini eksik anahtarlarla tamamla (tr+en)
- [ ] B3  19 kontrolörü sırayla dict'e bağla, her domain sonrası test
- [ ] B4  Regresyon testi: bildirim üretimi doğru key/param üretiyor mu

---

## C) tsconfig KATILIK BOŞLUKLARI  ·  [Quality/Type-safety]  ·  ~ +3 puan

**Kök neden:** Sadece `strict: true` açık. Ek katılık bayrakları kapalı →
kullanılmayan değişken, kontrolsüz index erişimi, düşen switch-case gibi
sınıf-düzeyi hatalar tipçe görünmez.

**Kanıt:** `tsconfig.json` compilerOptions yalnızca `strict: true` içeriyor.
Ayrıca `"types": ["jest"]` var ama proje `node:test` kullanıyor (gereksiz/yanıltıcı).
Ayrıca test dosyaları `exclude`'da → `tsc` testleri TİP KONTROL ETMİYOR (yalnızca
`tsx` runtime'ında çalışıyorlar).

**Çözüm (her bayrağı tek tek aç, çıkan hataları temizle, sonra sonrakine geç):**
- [ ] C1  `noUncheckedIndexedAccess: true`  (en değerli; index erişimlerini güvenli yapar)
- [ ] C2  `noUnusedLocals: true` + `noUnusedParameters: true`
- [ ] C3  `noImplicitReturns: true`
- [ ] C4  `noFallthroughCasesInSwitch: true`
- [ ] C5  `forceConsistentCasingInFileNames: true`
- [ ] C6  `exactOptionalPropertyTypes: true` (en gürültülü — en sona bırak)
- [ ] C7  `"types": ["jest"]` → kaldır veya `node`/gerçek runner tipiyle değiştir
- [ ] C8  Test dosyalarını ayrı bir `tsconfig.test.json` ile tip kontrolüne dahil et
         (şu an tsc kapsam dışı — sessiz tip borcu birikebilir)

**Efor:** orta (her bayrak N hata açabilir). **Risk:** düşük (derleme-zamanı,
runtime davranışı değişmez). **Puan etkisi:** Quality +2~3.

---

## D) CACHE KATMANI DRY BORCU (#1b)  ·  [Quality/Maintainability]  ·  ~ +1 puan

**Kök neden:** İki desen bir arada — bazı kontrolörler `createCacheManager`,
bazıları manuel `withCache + xCacheKeys`. `redis.ts` zaten hepsini
`createCacheKeys` ile üretiyor, dolayısıyla anahtarlar AYNI; bu saf tutarlılık borcu.

**Kanıt — hâlâ manuel `withCache` kullanan 11 kontrolör:**
```
company/stats.ts, inventory/dashboard.ts, inventory/queries.ts, overview.ts,
routes/queries.ts, routes/stats.ts, shipments/queries.ts, shipments/stats.ts,
vehicle/queries.ts, warehouse/crud.ts, warehouse/stats.ts
```

**DİKKAT (regresyon riski):** overview özel dashboard key + 300s TTL kullanıyor;
inventory/company/trailer `createCacheKeys` üzerine ekstra anahtar override ediyor.
Bunlar manager'a birebir oturmaz → manager'ı ekstra anahtarlarla genişlet ya da
bu 3'ünü bilinçli manuel bırak. Testler redis'i mock'lar → anahtar-format
regresyonunu YAKALAMAZ; değişiklik sonrası anahtarları elle diff'le.

**Efor:** orta-düşük. **Risk:** düşük-orta (sessiz cache-miss riski).
**Puan etkisi:** Quality +1 (kozmetik/DRY).

- [ ] D1  Standart domainleri (routes/stats, shipments/stats, vehicle/queries,
         warehouse/stats) manager'a çevir — anahtar diff doğrula
- [ ] D2  overview / inventory / company: manager'ı genişlet ya da bilinçli bırak (yorumla belgele)

---

## E) YORUM DİLİ TUTARLILIĞI  ·  [Clarity]  ·  DÜŞÜK ETKİ  ·  ~ +1 puan

**Kök neden:** Yorumlar TR/EN karışık. TODO hedefi: tek dil (öneri: İngilizce).
**Kanıt:** non-test kaynakta ~9 Türkçe yorum satırı (görece az) + `run-tests.mjs`
gibi script'lerde karışık. Düşük hacim → hızlı temizlenir.
**Efor:** düşük. **Risk:** yok (yorum). **Puan etkisi:** Clarity +1.

- [ ] E1  Kalan Türkçe yorumları İngilizceye çevir (grep ile bul, dosya-dosya)

---

## F) TEST TİP KONTROL BOŞLUĞU  ·  [Quality]  ·  ~ +1 puan
> (C8 ile örtüşür — ayrı izlensin diye burada da)

**Kök neden:** `tsconfig` test dosyalarını `exclude` ediyor. Testler yalnızca
`tsx` ile çalışıyor; tip hataları CI kapısında görünmüyor. 256 test dosyası
tipçe denetimsiz.
**Çözüm:** `tsconfig.test.json` (extends base, test glob'larını include) + CI'da
`tsc -p tsconfig.test.json --noEmit`.
**Efor:** düşük-orta (mevcut test tip hatalarını temizlemek gerekebilir).
**Risk:** düşük. **Puan etkisi:** Quality +1.

- [ ] F1  tsconfig.test.json ekle, test tip hatalarını temizle, kalite kapısına ekle

---

## PUAN PROJEKSİYONU

| Aşama | Quality | Clarity | Not |
|-------|:-------:|:-------:|-----|
| Şimdi | 85 | 77 | taban |
| +A (god-file bölme) | 85 | ~86 | en büyük clarity sıçraması |
| +B (bildirim i18n) | ~89 | 86 | dil standardı kapanır |
| +C/F (tsconfig+test tip) | ~93 | 86 | tip güvenliği tavanı |
| +D (cache DRY) | ~94 | 88 | tutarlılık |
| +E (yorum dili) | 94 | ~90 | cila |
| Hedef (A tam + cila) | **~96–98** | **~95+** | 100 pratikte asimptot |

> Gerçekçi ol: **100/100 mutlak değil**; kalan 2–4 puan öznel review/mimari
> tercihlerdir. A + B + C bitince proje "prelaunch elit" bandına girer (95+).

## ÖNERİLEN SIRA
1. **C** (tsconfig — hızlı, yüksek güven, diğer işlerde hata yakalar) → önce
2. **B1 kararı** (mimari — user onayı, sonra B2–B4)
3. **A1–A5** (en büyük 5 god-file — asıl clarity kazancı)
4. **D, E, A6, F** (cila)
