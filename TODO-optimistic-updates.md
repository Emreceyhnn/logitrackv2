# TODO — TanStack Query Optimistic Update Eksikleri

**Durum:** Projede hiçbir mutation'da optimistic update yok. Tüm `useXMutations()` hook'ları
aynı pessimistic deseni izliyor:

```ts
onSuccess: () => queryClient.invalidateQueries({ queryKey: xKeys.all }) + toast
onError:   () => logger.error + toast
```

`onMutate`, `setQueryData`, `cancelQueries` kod tabanında (skill dosyaları hariç) **hiçbir yerde**
kullanılmıyor. Kullanıcı her aksiyonda: mutation round-trip + invalidate sonrası refetch round-trip
= 2 ardışık network bekliyor, arada UI hiçbir şey göstermiyor.

Ayrıca `invalidateQueries({ queryKey: xKeys.all })` deseni kaynağın **tüm** query'lerini (liste +
dashboard + detay + tüm filtre/sayfa kombinasyonları) geçersiz kılıyor — tek kayıt güncellemesi
bütün açık sayfaların yeniden fetch edilmesine yol açıyor.

Ayrıca bazı dialog/hook'lar (`useAssignDriver`, `useAddRoute`, `useAddShipment`, `useEditVehicle`,
`useEditShipment`, `useUploadDocument`) TanStack Query'ye hiç bağlı değil — `useMutation` bile
kullanmıyorlar, manuel `useState(loading)` + doğrudan server action + `onSuccess?.()` callback
deseninde. Bunlar "Öncelik 0" altında ayrı listelendi çünkü optimistic update'ten önce bunların
mutation altyapısına taşınması gerekiyor.

Bu dosya, hangi mutation'a optimistic update eklenmesi (veya önce TanStack'e taşınması) gerektiğini
önceliğe göre listeler.

---

## Öncelik 1 — Yüksek etki (sık tıklanan, "anlık" hissetmesi beklenen aksiyonlar)

Bunlar tablo/detay ekranlarında inline dropdown/select ile tetiklenen, kullanıcının sonucu
saniyeler içinde tekrar tekrar görmek isteyeceği aksiyonlar.

- [ ] **`useDriverMutations().updateDriverStatus`** — [useDrivers.ts:261-267](app/hooks/useDrivers.ts#L261-L267)
      Kullanım yeri: `app/components/dialogs/driver/overviewTab.tsx`
      Optimistic: sürücü listesi/detay cache'inde `status` alanını anında güncelle, hata olursa rollback.

- [ ] **`useVehicleMutations().updateVehicleStatus`** — [useVehicles.ts:144-155](app/hooks/useVehicles.ts#L144-L155)
      Kullanım yeri: `app/components/dashboard/vehicle/vehicleTable/index.tsx`
      Optimistic: araç tablosundaki satırın status badge'i anında değişmeli.

- [ ] **`useShipmentMutations().updateShipmentStatus`** — [useShipments.ts:257-271](app/hooks/useShipments.ts#L257-L271)
      Kullanım yeri: `app/components/dashboard/shipments/shipmentTable/index.tsx`
      Optimistic: en sık kullanılan aksiyonlardan biri (sevkiyat durumu), tablo + detay dialogunda anında yansımalı.

- [ ] **`useDriverMutations().assignVehicle` / `unassignVehicle`** — [useDrivers.ts:269-285](app/hooks/useDrivers.ts#L269-L285)
      Sürücü-araç atama/kaldırma. Optimistic: hem driver hem vehicle cache'inde ilişkiyi anında güncelle
      (iki query key'i de etkiliyor — dikkatli tasarlanmalı).

- [ ] **`useTrailerMutations().assignTrailer`** — [useTrailers.ts:131-136](app/hooks/useTrailers.ts#L131-L136)
      Kullanım yeri: `app/components/dialogs/vehicle/trailerAssignmentDialog/index.tsx`
      Optimistic: trailer + vehicle cache'i birlikte güncellenmeli (zaten `handleSuccess` ikisini de invalidate ediyor).

- [ ] **`useInventoryMutations().adjustStock`** — [useInventory.ts:246-255](app/hooks/useInventory.ts#L246-L255)
      Kullanım yeri: `app/components/dialogs/inventory/InventoryDetailsDialog.tsx`
      Optimistic: stok miktarı +/- anında yansımalı (özellikle depo ekranında art arda tıklanan bir aksiyon).

- [ ] **`useRouteDialog().handleStatusChange`** — [useRouteDialog.ts:54-67](app/hooks/useRouteDialog.ts#L54-L67)
      Rota durumu değiştirme. Bu hook TanStack Query'ye hiç bağlı değil (bkz. aşağıdaki "Query'siz
      mutation'lar" bölümü) — `updateRouteStatus` çağrısı hem kendi `statusLoading` state'ini bekliyor
      hem de `onSuccess?.()` ile üst bileşenin refetch'ini tetikliyor. İki kat gecikme + optimistic yok.

---

## Öncelik 2 — Orta etki (create/update formları, dialog kapanışı sonrası bekleniyor)

Kullanıcı zaten dialogun kapanmasını/toast'ı beklerken bir miktar gecikmeyi tolere ediyor, ama
liste ekranına dönünce kaydın orada olmaması ("nereye gitti?" hissi) yine de rahatsız edici.

- [ ] **`useVehicleMutations().createVehicle` / `updateVehicle`** — [useVehicles.ts:119-136](app/hooks/useVehicles.ts#L119-L136)
- [ ] **`useDriverMutations().createDriver` / `updateDriver`** — [useDrivers.ts:236-253](app/hooks/useDrivers.ts#L236-L253)
- [ ] **`useShipmentMutations().createShipment` / `updateShipment`** — [useShipments.ts:204-249](app/hooks/useShipments.ts#L204-L249)
- [ ] **`useInventoryMutations().createItem` / `updateItem`** — [useInventory.ts:196-220](app/hooks/useInventory.ts#L196-L220)
- [ ] **`useTrailerMutations().createTrailer` / `updateTrailer`** — [useTrailers.ts:113-123](app/hooks/useTrailers.ts#L113-L123)
- [ ] **`useWarehouseMutations().createWarehouse` / `updateWarehouse` / `assignManager`** — [useWarehouses.ts:157-212](app/hooks/useWarehouses.ts#L157-L212)
- [ ] **`useInventoryMutations().logFulfillment`** — [useInventory.ts:229-244](app/hooks/useInventory.ts#L229-L244)

---

## Öncelik 3 — Düşük etki (genelde onay dialogu var, kullanıcı zaten bekliyor)

Silme işlemleri çoğunlukla bir confirm dialogundan geçiyor, bu da doğal bir "bekleme" beklentisi
yaratıyor. Yine de optimistic silme (satırı anında listeden kaldırıp hata olursa geri getirme)
tabloların "kayıp/donmuş" hissini azaltır.

- [ ] `useVehicleMutations().deleteVehicle` — [useVehicles.ts:138-142](app/hooks/useVehicles.ts#L138-L142)
- [ ] `useDriverMutations().deleteDriver` — [useDrivers.ts:255-259](app/hooks/useDrivers.ts#L255-L259)
- [ ] `useShipmentMutations().deleteShipment` — [useShipments.ts:251-255](app/hooks/useShipments.ts#L251-L255)
- [ ] `useRouteMutations().deleteRoute` — [useRoutes.ts:171-175](app/hooks/useRoutes.ts#L171-L175)
- [ ] `useInventoryMutations().deleteItem` — [useInventory.ts:222-227](app/hooks/useInventory.ts#L222-L227)
- [ ] `useTrailerMutations().deleteTrailer` — [useTrailers.ts:125-129](app/hooks/useTrailers.ts#L125-L129)
- [ ] `useCustomerMutations().deleteCustomer` — [useCustomers.ts:93-97](app/hooks/useCustomers.ts#L93-L97)
- [ ] `useWarehouseMutations().deleteWarehouse` — [useWarehouses.ts:201-205](app/hooks/useWarehouses.ts#L201-L205)
- [ ] `useCompanyMutations().deleteMember` — [useCompany.ts:82-86](app/hooks/useCompany.ts#L82-L86)
- [ ] `useJoinRequestMutations().accept` / `reject` — [useCompany.ts:107-128](app/hooks/useCompany.ts#L107-L128)

---

## Öncelik 0 — TanStack Query'ye hiç bağlı olmayan mutation'lar

Bunlar `useMutation` bile kullanmıyor: manuel `useState(loading)` + doğrudan server action çağrısı
+ `onSuccess?.()` callback ile üst bileşenin `refetch()`'ini tetikleme deseninde. Optimistic update
eklemeden önce bunların TanStack Query mutation'larına taşınması gerekir — yoksa cache ile senkron
olmayan, kendi bildiğini okuyan bir state adası olarak kalırlar ve aynı veriye bakan başka bir
query/ekran bu değişiklikten habersiz kalabilir.

- [ ] **`useAssignDriver`** — [useAssignDriver.ts](app/hooks/useAssignDriver.ts) (`assignDriverToVehicle` / `unassignDriverFromVehicle`, satır 39 & 53)
      Kullanım: araç detay dialogunda sürücü atama. `useMutation`'a taşınıp `driverKeys` + `vehicleKeys`
      invalidate/optimistic edilmeli.
- [ ] **`useAddRoute`** — [useAddRoute.ts:49-64](app/hooks/useAddRoute.ts#L49-L64) (`createRoute`)
- [ ] **`useAddShipment`** — [useAddShipment.ts:73-96](app/hooks/useAddShipment.ts#L73-L96) (`createShipment`)
- [ ] **`useEditVehicle`** — [useEditVehicle.tsx:46-76](app/hooks/useEditVehicle.tsx#L46-L76) (`updateVehicle`, + resim upload)
- [ ] **`useEditShipment`** — [useEditShipment.ts:104-132](app/hooks/useEditShipment.ts#L104-L132) (`updateShipment`)
- [ ] **`useUploadDocument`** — [useUploadDocument.ts:37-59](app/hooks/useUploadDocument.ts#L37-L59) (`uploadVehicleDocument`)

Not: `useAddRoute`/`useAddShipment`/`useEditVehicle`/`useEditShipment` zaten `toast.promise` ile
sarılı — kullanıcı en azından loading/success/error geri bildirimi görüyor, tamamen sessiz değil.
Ama cache güncellemesi yine `onSuccess?.()` → üst bileşenin elle çağırdığı `refetch()`'e bağlı,
TanStack'in kendi invalidation/optimistic mekanizmasına değil.

---

## Ek iyileştirme — invalidate kapsamı

Optimistic update'ten bağımsız, ayrı bir konu ama aynı yerlerde ele alınabilir:

- [ ] Tüm `handleSuccess` fonksiyonları `invalidateQueries({ queryKey: xKeys.all })` kullanıyor
      (ör. [useVehicles.ts:110](app/hooks/useVehicles.ts#L110), [useDrivers.ts:227](app/hooks/useDrivers.ts#L227),
      [useShipments.ts:195](app/hooks/useShipments.ts#L195), [useInventory.ts:187](app/hooks/useInventory.ts#L187),
      [useTrailers.ts:103-104](app/hooks/useTrailers.ts#L103-L104), [useWarehouses.ts:148](app/hooks/useWarehouses.ts#L148),
      [useCustomers.ts:84](app/hooks/useCustomers.ts#L84), [useCompany.ts:73](app/hooks/useCompany.ts#L73)).
      `.all` yerine mutasyona özgü daha dar bir key kullanmak (ör. sadece etkilenen liste/detay) gereksiz
      refetch'leri azaltır. Optimistic update eklenince zaten çoğu invalidate gereksizleşecek.

---

## Uygulama notu (her madde için ortak iskelet)

```ts
useMutation({
  mutationFn: (...) => updateX(...),
  onMutate: async (vars) => {
    await queryClient.cancelQueries({ queryKey: xKeys.all });
    const previous = queryClient.getQueriesData({ queryKey: xKeys.all });
    queryClient.setQueriesData({ queryKey: xKeys.all }, (old) => /* patch old with vars */);
    return { previous };
  },
  onError: (err, vars, context) => {
    context?.previous?.forEach(([key, data]) => queryClient.setQueryData(key, data));
    handleError(...);
  },
  onSettled: () => queryClient.invalidateQueries({ queryKey: xKeys.all }),
});
```

Assignment mutation'larında (driver↔vehicle, trailer↔vehicle) iki ayrı query key ailesi
etkilendiği için `onMutate`/rollback ikisini birden kapsamalı.
