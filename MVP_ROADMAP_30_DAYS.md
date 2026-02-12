# 🎯 LOGITRACK V2 - 30 GÜNLÜK MVP ROADMAP

**Başlangıç:** 12 Şubat 2026  
**Hedef Teslim:** 13 Mart 2026  
**Toplam:** 240 saat (30 gün × 8 saat)

---

# 📅 HAFTA 1: VEHICLE & DRIVER MODULES (5 Gün)

## GÜN 1 - Vehicle CRUD Backend (8 saat)

**Tarih:** 12 Şubat 2026

- [ ] **TASK 1.1** - createVehicle Controller (2h)
  - [ ] Permission check ekle
  - [ ] Unique plate & fleetNo validation
  - [ ] Prisma create işlemi
  - [ ] Relations ile return
  - **Dosya:** `app/lib/controllers/vehicle.ts`

- [ ] **TASK 1.2** - updateVehicle Controller (1.5h)
  - [ ] Permission check
  - [ ] Ownership kontrolü
  - [ ] Update işlemi
  - [ ] Updated data return
  - **Dosya:** `app/lib/controllers/vehicle.ts`

- [ ] **TASK 1.3** - deleteVehicle Controller (1.5h)
  - [ ] Permission check
  - [ ] Driver assignment kontrolü
  - [ ] Active route kontrolü
  - [ ] Soft delete veya hard delete
  - **Dosya:** `app/lib/controllers/vehicle.ts`

- [ ] **TASK 1.4** - Validation Schemas (1h)
  - [ ] createVehicleSchema tanımla
  - [ ] updateVehicleSchema tanımla
  - [ ] Yup validations ekle
  - **Dosya:** `app/lib/validations/vehicle.ts`

- [ ] **TASK 1.5** - Backend Testing (2h)
  - [ ] Postman/Thunder Client ile test
  - [ ] Create endpoint test
  - [ ] Update endpoint test
  - [ ] Delete endpoint test
  - [ ] Validation error testleri

**GÜN 1 BİTİŞ KONTROLÜ:**

- [ ] Tüm endpoint'ler çalışıyor
- [ ] Validasyonlar doğru çalışıyor
- [ ] Git commit yapıldı
- [ ] README güncellendi

---

## GÜN 2 - Vehicle CRUD Frontend (8 saat)

**Tarih:** 13 Şubat 2026

- [ ] **TASK 2.1** - AddVehicleDialog Component (3h)
  - [ ] Dialog component oluştur
  - [ ] Formik setup
  - [ ] MUI TextFields ekle (fleetNo, plate, brand, model, year)
  - [ ] Select için type dropdown
  - [ ] Yup validation entegre et
  - [ ] Submit handler yaz
  - [ ] Success/Error toast göster
  - [ ] Dialog close ve parent refresh
  - **Dosya:** `app/components/dialogs/vehicle/addVehicleDialog.tsx`

- [ ] **TASK 2.2** - EditVehicleDialog Component (2h)
  - [ ] AddVehicleDialog'u kopyala
  - [ ] Form'u pre-populate et (initialValues)
  - [ ] Update modu için patch logic
  - [ ] Submit handler güncelle
  - **Dosya:** `app/components/dialogs/vehicle/editVehicleDialog.tsx`

- [ ] **TASK 2.3** - Delete Confirmation Dialog (1h)
  - [ ] ConfirmDialog component oluştur
  - [ ] Warning mesajı göster
  - [ ] Confirm/Cancel buttons
  - [ ] deleteVehicle action çağır
  - [ ] Error handling
  - **Dosya:** `app/components/dialogs/vehicle/deleteConfirmDialog.tsx`

- [ ] **TASK 2.4** - VehicleTable Integration (2h)
  - [ ] "Add Vehicle" button ekle
  - [ ] Menu'ye Edit/Delete actions ekle
  - [ ] Dialog'ları aç/kapa state management
  - [ ] Success sonrası table refresh
  - [ ] Loading state göster
  - **Dosya:** `app/components/dashboard/vehicle/vehicleTable/index.tsx`

**GÜN 2 BİTİŞ KONTROLÜ:**

- [ ] Add/Edit/Delete dialog'lar çalışıyor
- [ ] Form validasyonları doğru
- [ ] Table refresh sonrası güncel data
- [ ] UI polish yapıldı
- [ ] Git commit yapıldı

---

## GÜN 3 - Vehicle Advanced Features (8 saat)

**Tarih:** 14 Şubat 2026

- [ ] **TASK 3.1** - Assign/Unassign Driver (3h)
  - [ ] assignDriverToVehicle controller (1h)
  - [ ] unassignDriver controller (0.5h)
  - [ ] AssignDriverDialog component (1.5h)
    - [ ] Available driver listesi
    - [ ] Dropdown selection
    - [ ] Assign logic
    - [ ] Success feedback
  - **Dosyalar:**
    - `app/lib/controllers/vehicle.ts`
    - `app/components/dialogs/vehicle/assignDriverDialog.tsx`

- [ ] **TASK 3.2** - Update Vehicle Status (2h)
  - [ ] updateVehicleStatus controller (1h)
  - [ ] Status quick update menu (1h)
    - [ ] Available/On Trip/Maintenance toggle
    - [ ] Confirmation
  - **Dosyalar:**
    - `app/lib/controllers/vehicle.ts`
    - `app/components/dashboard/vehicle/vehicleTable/menu.tsx`

- [ ] **TASK 3.3** - Vehicle Details Enhancement (2h)
  - [ ] OverviewTab'ı güncelle
  - [ ] Tüm alanları doğru göster
  - [ ] Driver bilgisi ve avatar
  - [ ] Status badge'leri
  - [ ] Real-time data
  - **Dosya:** `app/components/dialogs/vehicle/overviewTab.tsx`

- [ ] **TASK 3.4** - Test & Polish (1h)
  - [ ] E2E flow test: Create → Assign → Status Update
  - [ ] Loading states kontrol
  - [ ] Error messages kontrol
  - [ ] UI consistency check

**GÜN 3 BİTİŞ KONTROLÜ:**

- [ ] Driver assignment çalışıyor
- [ ] Status update çalışıyor
- [ ] Tüm vehicle features complete
- [ ] Git commit yapıldı

---

## GÜN 4 - Driver CRUD Backend (8 saat)

**Tarih:** 15 Şubat 2026

- [ ] **TASK 4.1** - createDriver Controller (2h)
  - [ ] User oluşturma (email, name, password)
  - [ ] Driver oluşturma (userId ile link)
  - [ ] License bilgileri ekle
  - [ ] Transaction kullan
  - [ ] Full driver object return (with user)
  - **Dosya:** `app/lib/controllers/driver.ts`

- [ ] **TASK 4.2** - updateDriver Controller (1.5h)
  - [ ] User data update
  - [ ] Driver data update
  - [ ] License update
  - [ ] Nested update handling
  - **Dosya:** `app/lib/controllers/driver.ts`

- [ ] **TASK 4.3** - deleteDriver Controller (1.5h)
  - [ ] Active route check
  - [ ] Vehicle'dan unassign
  - [ ] User cascade delete
  - [ ] Soft delete option
  - **Dosya:** `app/lib/controllers/driver.ts`

- [ ] **TASK 4.4** - Driver Validation Schemas (1h)
  - [ ] createDriverSchema (email, phone, license...)
  - [ ] updateDriverSchema
  - [ ] Yup validations
  - **Dosya:** `app/lib/validations/driver.ts`

- [ ] **TASK 4.5** - Backend Testing (2h)
  - [ ] Create driver endpoint test
  - [ ] Update endpoint test
  - [ ] Delete endpoint test
  - [ ] User-Driver relation kontrolü
  - [ ] Validation tests

**GÜN 4 BİTİŞ KONTROLÜ:**

- [ ] Driver CRUD endpoints ready
- [ ] User-Driver ilişkisi doğru
- [ ] Git commit yapıldı

---

## GÜN 5 - Driver CRUD Frontend (8 saat)

**Tarih:** 16 Şubat 2026

- [ ] **TASK 5.1** - AddDriverDialog (3h)
  - [ ] Multi-step form wizard oluştur
  - [ ] Step 1: Personal Info (name, surname, email, phone)
  - [ ] Step 2: License Info (number, type, expiry)
  - [ ] Step 3: Employment (employeeId, status)
  - [ ] Stepper component
  - [ ] Form validation her step'te
  - [ ] Submit handler
  - **Dosya:** `app/components/dialogs/driver/addDriverDialog.tsx`

- [ ] **TASK 5.2** - EditDriverDialog (2h)
  - [ ] Multi-step formu kopyala
  - [ ] Existing data ile pre-populate
  - [ ] User + Driver update logic
  - [ ] License update
  - **Dosya:** `app/components/dialogs/driver/editDriverDialog.tsx`

- [ ] **TASK 5.3** - Delete & Status Update (1h)
  - [ ] Delete confirmation dialog
  - [ ] Status toggle component (ON_JOB/OFF_DUTY/ON_LEAVE)
  - [ ] Quick status menu
  - **Dosyalar:**
    - `app/components/dialogs/driver/deleteConfirmDialog.tsx`
    - `app/components/dashboard/driver/driverTable/menu.tsx`

- [ ] **TASK 5.4** - DriverTable Integration (2h)
  - [ ] Add Driver button
  - [ ] Edit/Delete menu actions
  - [ ] Dialog state management
  - [ ] Table refresh after mutations
  - [ ] Loading states
  - **Dosya:** `app/components/dashboard/driver/driverTable/index.tsx`

**GÜN 5 BİTİŞ KONTROLÜ:**

- [ ] Driver CRUD frontend complete
- [ ] Multi-step wizard çalışıyor
- [ ] Table integration OK
- [ ] Git commit yapıldı

**🎉 HAFTA 1 TAMAMLANDI - Vehicle & Driver Modülleri %100**

---

# 📅 HAFTA 2: SHIPMENT & CUSTOMER MODULES (5 Gün)

## GÜN 6 - Customer Module (8 saat)

**Tarih:** 19 Şubat 2026

- [ ] **TASK 6.1** - Customer CRUD Backend (4h)
  - [ ] createCustomer controller (1h)
  - [ ] updateCustomer controller (1h)
  - [ ] deleteCustomer controller (0.5h)
  - [ ] addDeliverySite controller (1h)
  - [ ] removeDeliverySite controller (0.5h)
  - **Dosya:** `app/lib/controllers/customer.ts`

- [ ] **TASK 6.2** - Customer Validation (0.5h)
  - [ ] Customer schema (code, name, email, phone)
  - [ ] DeliverySite schema
  - **Dosya:** `app/lib/validations/customer.ts`

- [ ] **TASK 6.3** - Customer CRUD Frontend (3h)
  - [ ] AddCustomerDialog (1.5h)
  - [ ] EditCustomerDialog (1h)
  - [ ] DeliverySite management UI (0.5h)
  - **Dosyalar:**
    - `app/components/dialogs/customer/addCustomerDialog.tsx`
    - `app/components/dialogs/customer/editCustomerDialog.tsx`

- [ ] **TASK 6.4** - Test & Integration (0.5h)
  - [ ] E2E customer flow test
  - [ ] Delivery site CRUD test

**GÜN 6 BİTİŞ KONTROLÜ:**

- [ ] Customer CRUD complete
- [ ] Delivery sites yönetimi OK
- [ ] Git commit yapıldı

---

## GÜN 7 - Shipment CRUD Backend (8 saat)

**Tarih:** 20 Şubat 2026

- [ ] **TASK 7.1** - createShipment Controller (3h)
  - [ ] Customer validation
  - [ ] Origin/Destination validation
  - [ ] Tracking number generation
  - [ ] Shipment items oluşturma
  - [ ] Initial status set (PENDING)
  - **Dosya:** `app/lib/controllers/shipments.ts`

- [ ] **TASK 7.2** - updateShipment Controller (2h)
  - [ ] Basic info update
  - [ ] Items update (add/remove/modify)
  - [ ] Validation
  - **Dosya:** `app/lib/controllers/shipments.ts`

- [ ] **TASK 7.3** - updateShipmentStatus Controller (2h)
  - [ ] Status transition validation
  - [ ] Timestamp güncelleme
  - [ ] Status history oluştur
  - [ ] Notification trigger
  - **Dosya:** `app/lib/controllers/shipments.ts`

- [ ] **TASK 7.4** - Shipment Validation & Test (1h)
  - [ ] Shipment schema
  - [ ] Backend endpoint testleri
  - **Dosya:** `app/lib/validations/shipment.ts`

**GÜN 7 BİTİŞ KONTROLÜ:**

- [ ] Shipment backend complete
- [ ] Status flow logic OK
- [ ] Git commit yapıldı

---

## GÜN 8 - Shipment Frontend Part 1: Create Wizard (8 saat)

**Tarih:** 21 Şubat 2026

- [ ] **TASK 8.1** - CreateShipmentDialog - Step 1 (3h)
  - [ ] Multi-step wizard component
  - [ ] Step 1: Customer & Destination
    - [ ] Customer dropdown
    - [ ] Delivery site selection
    - [ ] Origin warehouse dropdown
  - [ ] Next button validation
  - **Dosya:** `app/components/dialogs/shipment/createShipmentDialog.tsx`

- [ ] **TASK 8.2** - CreateShipmentDialog - Step 2 (3h)
  - [ ] Step 2: Items & Details
    - [ ] Dynamic item rows (add/remove)
    - [ ] Description, quantity, weight, dimensions
    - [ ] Special instructions textarea
    - [ ] Calculate total weight/volume
  - [ ] Form validation
  - **Dosya:** `app/components/dialogs/shipment/createShipmentDialog.tsx`

- [ ] **TASK 8.3** - CreateShipmentDialog - Step 3 (2h)
  - [ ] Step 3: Review & Submit
    - [ ] Summary view (all entered data)
    - [ ] Edit links to go back
    - [ ] Submit button
  - [ ] Submit handler
  - [ ] Success feedback
  - [ ] Close & refresh
  - **Dosya:** `app/components/dialogs/shipment/createShipmentDialog.tsx`

**GÜN 8 BİTİŞ KONTROLÜ:**

- [ ] Multi-step wizard complete
- [ ] Shipment creation çalışıyor
- [ ] Git commit yapıldı

---

## GÜN 9 - Shipment Frontend Part 2: Edit & Status (8 saat)

**Tarih:** 22 Şubat 2026

- [ ] **TASK 9.1** - EditShipmentDialog (3h)
  - [ ] Load existing shipment data
  - [ ] Populate form fields
  - [ ] Items editing (add/remove/modify)
  - [ ] Update logic
  - **Dosya:** `app/components/dialogs/shipment/editShipmentDialog.tsx`

- [ ] **TASK 9.2** - Shipment Status Flow (3h)
  - [ ] Status progression UI component
  - [ ] Visual timeline/stepper
  - [ ] Quick status update buttons
  - [ ] Status history viewer
  - [ ] Timestamp display
  - **Dosya:** `app/components/dialogs/shipment/statusFlow.tsx`

- [ ] **TASK 9.3** - ShipmentTable Integration (2h)
  - [ ] Add Shipment button
  - [ ] Edit/Delete/Status menu
  - [ ] Dialog integrations
  - [ ] Table refresh
  - **Dosya:** `app/components/dashboard/shipments/shipmentTable/index.tsx`

**GÜN 9 BİTİŞ KONTROLÜ:**

- [ ] Edit shipment OK
- [ ] Status update OK
- [ ] Table integration complete
- [ ] Git commit yapıldı

---

## GÜN 10 - Shipment Tracking & Analytics (8 saat)

**Tarih:** 23 Şubat 2026

- [ ] **TASK 10.1** - Track & Trace View (4h)
  - [ ] Tracking timeline component
  - [ ] Status history with timestamps
  - [ ] Location updates (if available)
  - [ ] ETA calculation
  - [ ] Visual progress bar
  - **Dosya:** `app/components/dialogs/shipment/trackingView.tsx`

- [ ] **TASK 10.2** - Shipment Analytics Update (2h)
  - [ ] ShipmentAnalytics component'i güncelle
  - [ ] Real data entegrasyonu
  - [ ] Status breakdown pie chart
  - [ ] Trend charts
  - **Dosya:** `app/components/dashboard/shipments/ShipmentAnalytics.tsx`

- [ ] **TASK 10.3** - ShipmentKPI Real Data (1h)
  - [ ] KPI card'ları real data ile
  - [ ] Active, Delayed, In Transit counts
  - **Dosya:** `app/components/dashboard/shipments/shipmentKpiCard.tsx`

- [ ] **TASK 10.4** - Test & Polish (1h)
  - [ ] E2E shipment flow
  - [ ] UI polish

**GÜN 10 BİTİŞ KONTROLÜ:**

- [ ] Shipment module %100 complete
- [ ] Tracking çalışıyor
- [ ] Analytics updated
- [ ] Git commit yapıldı

**🎉 HAFTA 2 TAMAMLANDI - Shipment & Customer Modülleri %100**

---

# 📅 HAFTA 3: ROUTE & WAREHOUSE MODULES (5 Gün)

## GÜN 11 - Route CRUD Backend (8 saat)

**Tarih:** 26 Şubat 2026

- [ ] **TASK 11.1** - createRoute Controller (3h)
  - [ ] Driver & vehicle availability check
  - [ ] Warehouse/Location validation
  - [ ] Route oluştur
  - [ ] Waypoints oluştur
  - [ ] Distance/Duration hesapla
  - **Dosya:** `app/lib/controllers/routes.ts`

- [ ] **TASK 11.2** - updateRoute Controller (2h)
  - [ ] Route details update
  - [ ] Waypoints update
  - [ ] Reorder stops
  - [ ] Recalculate distance
  - **Dosya:** `app/lib/controllers/routes.ts`

- [ ] **TASK 11.3** - assignShipmentsToRoute (2h)
  - [ ] Capacity validation
  - [ ] Shipment update (routeId set)
  - [ ] Route stats güncelle
  - **Dosya:** `app/lib/controllers/routes.ts`

- [ ] **TASK 11.4** - Route Validation & Test (1h)
  - [ ] Route schema
  - [ ] Backend tests
  - **Dosya:** `app/lib/validations/route.ts`

**GÜN 11 BİTİŞ KONTROLÜ:**

- [ ] Route backend complete
- [ ] Shipment assignment OK
- [ ] Git commit yapıldı

---

## GÜN 12 - Route Frontend Part 1: Create & Map (8 saat)

**Tarih:** 27 Şubat 2026

- [ ] **TASK 12.1** - CreateRouteDialog (4h)
  - [ ] Driver selection dropdown
  - [ ] Vehicle selection dropdown
  - [ ] Start date/time picker
  - [ ] Waypoint builder UI
    - [ ] Add waypoint button
    - [ ] Sortable list (drag-drop)
    - [ ] Remove waypoint
  - [ ] Distance calculation görüntüle
  - **Dosya:** `app/components/dialogs/routes/createRouteDialog.tsx`

- [ ] **TASK 12.2** - Route Map Integration (3h)
  - [ ] Google Maps component
  - [ ] Draw route polyline
  - [ ] Waypoint markers
  - [ ] Interactive marker editing
  - [ ] Directions API kullan
  - **Dosya:** `app/components/dialogs/routes/map.tsx`

- [ ] **TASK 12.3** - Map Features Test (1h)
  - [ ] Map rendering
  - [ ] Marker interactions
  - [ ] Route drawing

**GÜN 12 BİTİŞ KONTROLÜ:**

- [ ] Route creation UI complete
- [ ] Map integration OK
- [ ] Git commit yapıldı

---

## GÜN 13 - Route Frontend Part 2: Edit & Progress (8 saat)

**Tarih:** 28 Şubat 2026

- [ ] **TASK 13.1** - EditRouteDialog (3h)
  - [ ] Load existing route
  - [ ] Pre-populate form
  - [ ] Edit waypoints
  - [ ] Add/remove stops
  - [ ] Update assignments
  - **Dosya:** `app/components/dialogs/routes/editRouteDialog.tsx`

- [ ] **TASK 13.2** - Route Progress Tracking (3h)
  - [ ] Current location map marker
  - [ ] Completed stops (checkmarks)
  - [ ] Remaining stops
  - [ ] ETA for each stop
  - [ ] Progress percentage
  - **Dosya:** `app/components/dialogs/routes/progress.tsx`

- [ ] **TASK 13.3** - Assign Shipments UI (2h)
  - [ ] Available shipments listesi
  - [ ] Assigned shipments listesi
  - [ ] Drag-drop to assign/unassign
  - [ ] Capacity validation visual
  - **Dosya:** `app/components/dialogs/routes/assignShipments.tsx`

**GÜN 13 BİTİŞ KONTROLÜ:**

- [ ] Route edit OK
- [ ] Progress tracking OK
- [ ] Shipment assignment UI OK
- [ ] Git commit yapıldı

---

## GÜN 14 - Warehouse Module (8 saat)

**Tarih:** 1 Mart 2026

- [ ] **TASK 14.1** - Warehouse CRUD Backend (4h)
  - [ ] createWarehouse controller (1h)
  - [ ] updateWarehouse controller (1h)
  - [ ] deleteWarehouse controller (0.5h)
  - [ ] updateCapacity controller (0.5h)
  - [ ] getWarehouseStats controller (1h)
  - **Dosya:** `app/lib/controllers/warehouse.ts`

- [ ] **TASK 14.2** - Warehouse CRUD Frontend (3h)
  - [ ] AddWarehouseDialog (1.5h)
  - [ ] EditWarehouseDialog (1h)
  - [ ] Capacity management form (0.5h)
  - **Dosyalar:**
    - `app/components/dialogs/warehouse/addWarehouseDialog.tsx`
    - `app/components/dialogs/warehouse/editWarehouseDialog.tsx`

- [ ] **TASK 14.3** - WarehouseList Enhancement (1h)
  - [ ] Real-time capacity display
  - [ ] Utilization percentage
  - [ ] Color-coded alerts
  - **Dosya:** `app/components/dashboard/warehouse/warehouseList.tsx`

**GÜN 14 BİTİŞ KONTROLÜ:**

- [ ] Warehouse CRUD complete
- [ ] Capacity tracking OK
- [ ] Git commit yapıldı

---

## GÜN 15 - Warehouse Advanced Features (8 saat)

**Tarih:** 2 Mart 2026

- [ ] **TASK 15.1** - Capacity Utilization View (3h)
  - [ ] capacityUtilization component güncelle
  - [ ] Real data integration
  - [ ] Visual capacity bars (MUI Progress)
  - [ ] Over-capacity alerts
  - [ ] Historical trends chart
  - **Dosya:** `app/components/dashboard/warehouse/capacityUtilization.tsx`

- [ ] **TASK 15.2** - Warehouse Assignment Logic (3h)
  - [ ] Assign manager to warehouse
  - [ ] Default warehouse for shipments
  - [ ] Inventory warehouse assignment
  - [ ] Assignment history
  - **Dosya:** `app/lib/controllers/warehouse.ts`

- [ ] **TASK 15.3** - Warehouse Analytics (1h)
  - [ ] Warehouse KPI updates
  - [ ] Stock value by warehouse
  - **Dosya:** `app/components/dashboard/warehouse/warehouseKpiCard.tsx`

- [ ] **TASK 15.4** - Test & Polish (1h)
  - [ ] E2E warehouse management
  - [ ] Capacity calculations doğru mu?

**GÜN 15 BİTİŞ KONTROLÜ:**

- [ ] Warehouse module %100
- [ ] Advanced features OK
- [ ] Git commit yapıldı

**🎉 HAFTA 3 TAMAMLANDI - Route & Warehouse Modülleri %100**

---

# 📅 HAFTA 4: INVENTORY & FILE MANAGEMENT (5 Gün)

## GÜN 16 - Inventory CRUD Backend (8 saat)

**Tarih:** 5 Mart 2026

- [ ] **TASK 16.1** - Inventory Item Controllers (4h)
  - [ ] createInventoryItem (1h)
  - [ ] updateInventoryItem (1h)
  - [ ] deleteInventoryItem (0.5h)
  - [ ] adjustStock (increase/decrease) (1h)
  - [ ] getInventoryByWarehouse (0.5h)
  - **Dosya:** `app/lib/controllers/inventory.ts`

- [ ] **TASK 16.2** - Stock Movement Controllers (3h)
  - [ ] createStockMovement (1h)
  - [ ] getStockHistory (1h)
  - [ ] transferBetweenWarehouses (1h)
  - **Dosya:** `app/lib/controllers/inventory.ts`

- [ ] **TASK 16.3** - Inventory Validation & Test (1h)
  - [ ] Inventory schemas
  - [ ] Backend tests
  - **Dosya:** `app/lib/validations/inventory.ts`

**GÜN 16 BİTİŞ KONTROLÜ:**

- [ ] Inventory backend complete
- [ ] Stock movements OK
- [ ] Git commit yapıldı

---

## GÜN 17 - Inventory Frontend (8 saat)

**Tarih:** 6 Mart 2026

- [ ] **TASK 17.1** - Add/Edit Inventory Dialogs (4h)
  - [ ] AddInventoryDialog (2h)
    - [ ] SKU, name, category
    - [ ] Warehouse selection
    - [ ] Initial quantity
    - [ ] Min/Max stock levels
  - [ ] EditInventoryDialog (2h)
  - **Dosyalar:**
    - `app/components/dialogs/inventory/addInventoryDialog.tsx`
    - `app/components/dialogs/inventory/editInventoryDialog.tsx`

- [ ] **TASK 17.2** - Stock Adjustment UI (2h)
  - [ ] Quick adjust component (modal)
  - [ ] Increase/Decrease buttons
  - [ ] Quantity input
  - [ ] Reason dropdown/textarea
  - [ ] Submit ve stock movement oluştur
  - **Dosya:** `app/components/dialogs/inventory/stockAdjustDialog.tsx`

- [ ] **TASK 17.3** - Stock Movement History (2h)
  - [ ] recentStockMovements güncelle
  - [ ] Real data integration
  - [ ] Filter by warehouse/item
  - [ ] Movement type indicators (IN/OUT/TRANSFER)
  - **Dosya:** `app/components/dashboard/warehouse/recentStockMovements.tsx`

**GÜN 17 BİTİŞ KONTROLÜ:**

- [ ] Inventory dialogs OK
- [ ] Stock adjustment OK
- [ ] Movement history OK
- [ ] Git commit yapıldı

---

## GÜN 18 - Inventory Advanced Features (8 saat)

**Tarih:** 7 Mart 2026

- [ ] **TASK 18.1** - Low Stock Alerts (3h)
  - [ ] Alert generation logic (min stock kontrolü)
  - [ ] Alert notification oluştur
  - [ ] Alert dashboard widget
  - [ ] Alert list page
  - **Dosyalar:**
    - `app/lib/controllers/inventory.ts`
    - `app/components/alerts/lowStockAlerts.tsx`

- [ ] **TASK 18.2** - Bulk Operations (3h)
  - [ ] Bulk import component (CSV upload)
  - [ ] CSV parsing logic
  - [ ] Bulk export to CSV/Excel
  - [ ] Bulk stock adjustment (multi-select)
  - **Dosya:** `app/components/inventory/bulkOperations.tsx`

- [ ] **TASK 18.3** - Inventory Analytics (2h)
  - [ ] Stock value calculation
  - [ ] Inventory turnover rate
  - [ ] Top moving items
  - [ ] Charts & visualizations
  - **Dosya:** `app/components/dashboard/inventory/InventoryAnalytics.tsx`

**GÜN 18 BİTİŞ KONTROLÜ:**

- [ ] Alerts çalışıyor
- [ ] Bulk operations OK
- [ ] Analytics updated
- [ ] Git commit yapıldı

---

## GÜN 19 - File Upload System (8 saat)

**Tarih:** 8 Mart 2026

- [ ] **TASK 19.1** - File Upload Backend (4h)
  - [ ] Storage setup (local /public/uploads veya S3)
  - [ ] Upload endpoint (/api/upload)
  - [ ] File validation (size, type)
  - [ ] Generate unique filename
  - [ ] Return file URL
  - [ ] Integrate with documents controller
  - **Dosyalar:**
    - `app/lib/fileUpload.ts`
    - `app/api/upload/route.ts`

- [ ] **TASK 19.2** - File Upload Component (2h)
  - [ ] FileUpload component
  - [ ] Drag & drop zone
  - [ ] File selection
  - [ ] Upload progress bar
  - [ ] Multiple file support
  - [ ] File preview (image, PDF)
  - **Dosya:** `app/components/common/fileUpload.tsx`

- [ ] **TASK 19.3** - Integrate with Documents (2h)
  - [ ] Document creation ile upload entegre et
  - [ ] Download functionality
  - [ ] Preview in browser (PDF viewer)
  - [ ] Delete file when document deleted
  - **Dosya:** `app/components/dialogs/documents/uploadDocumentDialog.tsx`

**GÜN 19 BİTİŞ KONTROLÜ:**

- [ ] File upload çalışıyor
- [ ] Document integration OK
- [ ] Preview/download OK
- [ ] Git commit yapıldı

---

## GÜN 20 - Documents & Maintenance (8 saat)

**Tarih:** 9 Mart 2026

- [ ] **TASK 20.1** - Document Management Enhancement (3h)
  - [ ] Upload documents for vehicles
  - [ ] Upload documents for drivers
  - [ ] Expiry date tracking
  - [ ] Auto-alerts for expiring documents (30 days before)
  - [ ] Document list view with filters
  - **Dosyalar:**
    - `app/components/dialogs/vehicle/documentsTab.tsx` (güncelle)
    - `app/components/dialogs/driver/documentsTab.tsx` (güncelle)

- [ ] **TASK 20.2** - Maintenance Scheduling (3h)
  - [ ] createMaintenanceRecord controller
  - [ ] scheduleNextMaintenance controller
  - [ ] calculateMaintenanceDue logic
  - **Dosya:** `app/lib/controllers/maintenance.ts`

- [ ] **TASK 20.3** - Maintenance UI (2h)
  - [ ] Maintenance calendar view
  - [ ] Schedule maintenance dialog
  - [ ] Maintenance history viewer
  - [ ] Due maintenance alerts
  - **Dosyalar:**
    - `app/components/dialogs/maintenance/scheduleMaintenanceDialog.tsx`
    - `app/components/dashboard/vehicle/maintenanceCalendar.tsx`

**GÜN 20 BİTİŞ KONTROLÜ:**

- [ ] Document upload/management OK
- [ ] Maintenance scheduling OK
- [ ] Git commit yapıldı

**🎉 HAFTA 4 TAMAMLANDI - Inventory, Files, Documents, Maintenance %100**

---

# 📅 HAFTA 5: SETTINGS, USER & COMPANY MANAGEMENT (5 Gün)

## GÜN 21 - User Management (8 saat)

**Tarih:** 12 Mart 2026

- [ ] **TASK 21.1** - User CRUD Backend Enhancement (3h)
  - [ ] createUser - verify/enhance
  - [ ] updateUser - enhance
  - [ ] deleteUser
  - [ ] updateUserRole
  - [ ] resetPassword
  - [ ] updateUserStatus (ACTIVE/INACTIVE/SUSPENDED)
  - **Dosya:** `app/lib/controllers/users.ts`

- [ ] **TASK 21.2** - User Management UI (4h)
  - [ ] User list table
  - [ ] Add User dialog
  - [ ] Edit User dialog
  - [ ] Delete confirmation
  - [ ] Role assignment dropdown
  - [ ] Status toggle
  - [ ] Password reset button
  - **Dosya:** `app/(pages)/(dashboard)/settings/users/page.tsx`

- [ ] **TASK 21.3** - Test User Flows (1h)
  - [ ] Create user
  - [ ] Edit user
  - [ ] Change role
  - [ ] Delete user

**GÜN 21 BİTİŞ KONTROLÜ:**

- [ ] User management complete
- [ ] All CRUD operations OK
- [ ] Git commit yapıldı

---

## GÜN 22 - Company Settings (8 saat)

**Tarih:** 13 Mart 2026 (**MVP TESLİM GÜNÜ!**)

- [ ] **TASK 22.1** - Company Profile Backend (3h)
  - [ ] updateCompanyProfile controller
  - [ ] uploadCompanyLogo (file upload integration)
  - [ ] getCompanySettings controller
  - [ ] updateCompanySettings controller
  - **Dosya:** `app/lib/controllers/company.ts`

- [ ] **TASK 22.2** - Company Settings Page (4h)
  - [ ] Company info form (name, address, phone, email)
  - [ ] Logo upload
  - [ ] Business details (tax ID, registration)
  - [ ] Operating hours
  - [ ] Notification preferences (email, push)
  - [ ] Save button
  - **Dosya:** `app/(pages)/(dashboard)/settings/company/page.tsx`

- [ ] **TASK 22.3** - Test & Polish (1h)
  - [ ] Company settings save/load
  - [ ] Logo upload test
  - [ ] Final polishing

\*\*GÜN 22 BİT

İŞ KONTROLÜ:\*\*

- [ ] Company settings complete
- [ ] MVP hazır! 🎉
- [ ] Git commit yapıldı
- [ ] **DEMO HAZIRLIKlari**

---

# 🎯 MVP TESLİM CHECKPOINT

**Tarih:** 13 Mart 2026  
**Süre:** 22 iş günü (30 takvim günü hedefinin 22'si)

## ✅ TAMAMLANAN MODÜLLER

- [x] Vehicle Management (Full CRUD, Assign Driver, Status)
- [x] Driver Management (Full CRUD, Documents, Status)
- [x] Customer Management (CRUD, Delivery Sites)
- [x] Shipment Management (Create Wizard, Track, Status Flow)
- [x] Route Management (Create, Edit, Map, Progress, Assign Shipments)
- [x] Warehouse Management (CRUD, Capacity Tracking)
- [x] Inventory Management (CRUD, Stock Movements, Alerts, Bulk Ops)
- [x] Document Management (Upload, Track Expiry, Alerts)
- [x] Maintenance Tracking (Schedule, History, Alerts)
- [x] User Management (CRUD, Roles, Status)
- [x] Company Settings (Profile, Logo, Preferences)

## 🎯 CORE FEATURES %100 COMPLETE

**Total Tasks:** ~110 major tasks  
**Toplam Saat:** ~176 saat (22 gün × 8 saat)

---

# 📅 BONUS GÜNLER (GÜN 23-30) - Optional Polish & Advanced

Bu günleri kullanarak:

- User Profile & Preferences
- Role Management UI
- Analytics Dashboard enhancements
- Reports system
- Notifications
- Global search
- Final testing & bug fixes

---

# 📊 İLERLEME TAKİP TABLOSU

| Modül       | Backend | Frontend | Test | Durum |
| ----------- | ------- | -------- | ---- | ----- |
| Vehicle     | [ ]     | [ ]      | [ ]  | ⏳    |
| Driver      | [ ]     | [ ]      | [ ]  | ⏳    |
| Customer    | [ ]     | [ ]      | [ ]  | ⏳    |
| Shipment    | [ ]     | [ ]      | [ ]  | ⏳    |
| Route       | [ ]     | [ ]      | [ ]  | ⏳    |
| Warehouse   | [ ]     | [ ]      | [ ]  | ⏳    |
| Inventory   | [ ]     | [ ]      | [ ]  | ⏳    |
| Documents   | [ ]     | [ ]      | [ ]  | ⏳    |
| Maintenance | [ ]     | [ ]      | [ ]  | ⏳    |
| Users       | [ ]     | [ ]      | [ ]  | ⏳    |
| Company     | [ ]     | [ ]      | [ ]  | ⏳    |

---

# 🎯 GÜNLÜK KONTROL LİSTESİ (Her Gün)

- [ ] Sabah: Günün task listesini oku
- [ ] Her task bitince checkbox işaretle
- [ ] Kod yazarken comment'ler ekle
- [ ] Hata almadan çalıştığını test et
- [ ] Git commit yap (anlamlı mesaj ile)
- [ ] README/docs güncelle (gerekirse)
- [ ] Akşam: Yarının task'larını oku
- [ ] Stuck olursan: 2 saat sonra yardım iste

---

# 🚀 BAŞARIYA GIDEN 5 KURAL

1. **Her gün task'ları bitir** - Erteleme yok
2. **Her task sonunda commit** - Küçük adımlar
3. **Her gün test et** - Erken bug tespiti
4. **Stuck olursan 2 saat sonra sor** - Zaman kaybetme
5. **Her hafta sonu review** - İlerlemeyi gör ve kutla

---

**Bu dosyayı print et veya Notion/Trello/Excel'e aktar!**

**🎯 HEDEF: 13 Mart 2026 - MVP RELEASE! 🚀**
