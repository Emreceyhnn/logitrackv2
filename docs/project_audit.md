# LogiTrack v2 — Full Project Audit Report

> **Date:** 2026-04-15  
> **Audited By:** Senior Cross-Functional Team (PM · UX · Full-Stack · QA · Security)  
> **Scope:** Full codebase review — architecture, security, types, performance, UX, logistics domain

---

## Summary

| Category | Total Issues | Critical | High | Medium | Low |
|---|---|---|---|---|---|
| Architecture | 8 | 3 | 2 | 2 | 1 |
| Security | 6 | 2 | 3 | 1 | 0 |
| Type System | 5 | 1 | 2 | 2 | 0 |
| Performance | 5 | 1 | 2 | 2 | 0 |
| Code Quality | 7 | 0 | 2 | 3 | 2 |
| UX / Domain | 4 | 0 | 1 | 2 | 1 |
| **Total** | **35** | **7** | **12** | **12** | **4** |

---

## 🔴 CATEGORY 1 — CRITICAL ARCHITECTURE ISSUES

---

### [CRITICAL] #1 — Dual Type System (Prisma vs. lib/type/enums.ts)

**Location:** `app/lib/types.ts` and `app/lib/type/enums.ts`

**Problem:**  
There are **two parallel type systems** that can drift out of sync:
1. `app/lib/types.ts` — imports directly from `@prisma/client` (e.g., `ShipmentWithRelations`)
2. `app/lib/type/enums.ts` — a manually maintained mirror of Prisma types for client-safe use

The `types.ts` file exposes Prisma types directly to the client layer via `ShipmentWithRelations`, `DriverWithRelations`, etc., which can trigger bundling errors in Client Components.

```ts
// app/lib/types.ts — BAD: pulls from @prisma/client into shared module
import { Shipment, Driver, Route, Warehouse, Inventory, User, Customer, ShipmentHistory } from "@prisma/client";
```

Also, the `Priority` type in `types.ts` is `"URGENT"` but Prisma has `"CRITICAL"` — an **out-of-sync enum**.

```ts
// types.ts
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT"; // ← WRONG, not in schema

// Prisma schema
enum ShipmentPriority { LOW, MEDIUM, HIGH, CRITICAL }
```

**Fix:** Deprecate `app/lib/types.ts` entirely. Migrate all exports into `app/lib/type/enums.ts`. Remove all `@prisma/client` imports outside of controllers.

---

### [CRITICAL] #2 — Controllers Marked `"use server"` but Called in Both Context

**Location:** All files in `app/lib/controllers/`

**Problem:**  
Files like `vehicle.ts`, `driver.ts`, `warehouse.ts` open with `"use server"` and use `authenticatedAction()` correctly. However, they are **directly imported** by some dialogs like `editWarehouseDialog/index.tsx` via:

```ts
import { updateWarehouse } from "@/app/lib/controllers/warehouse";
```

This is problematic because `"use server"` functions should only be called via Server Actions or fetches. Importing them in Client Components works in practice (Next.js wraps them), but creates **implicit serialization boundaries** that can silently fail with complex argument types.

**Fix:** Expose controller functions only from `app/lib/actions/` wrappers, which create explicit Server Action boundaries. Never import controllers directly in `"use client"` files.

---

### [CRITICAL] #3 — Only One API Route Exists (`/api/vehicles/[id]`)

**Location:** `app/api/vehicles/`

**Problem:**  
The entire backend data layer relies on Server Actions (controllers). There is only **one REST API route** visible (`/api/vehicles/[id]`). This means:
- No public endpoints for external integrations (ERP, fleet telematics, customer portals)
- No webhooks, no OpenAPI spec
- **Firebase/Supabase data (live vehicle GPS) goes directly to the client** via `vehicleTracking.ts` with no server-side validation layer

**Fix:** Define a proper API layer for external-facing data. Protect realtime data updates with server-verified tokens.

---

### [HIGH] #4 — `formik` AND `react-hook-form` Both Present

**Location:** `package.json`

**Problem:**  
Both `formik` and `react-hook-form` are dependencies. This means:
- Two different form validation paradigms in the codebase
- Duplicated bundle size
- Validation inconsistency (Yup used with both, differently)
- Onboarding confusion for new developers

```json
"formik": "^2.4.9",
"react-hook-form": "^7.71.1",
```

**Fix:** Standardize on `react-hook-form` (which is already used with `@hookform/resolvers`). Migrate and remove `formik`.

---

### [HIGH] #5 — No Middleware Route Protection (`middleware.ts` missing)

**Location:** Project root

**Problem:**  
There is **no `middleware.ts`** file at the project root. All route protection is done inside server components via `getAuthenticatedUser()`. This means:
- Unauthenticated users can **hit dashboard routes** — the server will fetch and attempt to render data before redirecting
- No edge-level protection, every page load costs a full Prisma session query
- No role-based route access control at the request level

**Fix:** Implement `middleware.ts` using `jose` (already installed) to validate JWT at the edge. Define a protected routes config.

---

### [MEDIUM] #6 — Single `useUser` Hook with Waterfall Server Action Call

**Location:** `app/lib/hooks/useUser.ts`

**Problem:**  
Every client component that needs user data calls `useUser()`, which triggers a `getUserSession()` Server Action on mount. Multiple components mounting simultaneously causes **N parallel session validation calls**.

```ts
useEffect(() => {
  const fetchUser = async () => {
    const session = await getUserSession(); // called per component
    ...
  };
  fetchUser();
}, []);
```

**Fix:** Lift user state to a Context Provider. Call the session action once at the layout level, pass user down via context. Alternatively, use TanStack Query (already installed) with a `staleTime`.

---

### [MEDIUM] #7 — Playground Route Exists in Production

**Location:** `app/[lang]/(pages)/playground/`

**Problem:**  
A `/playground` route exists in the app. If this is a development sandbox, it will be publicly accessible in production builds (the app uses `output: "standalone"`).

**Fix:** Guard the playground route with `process.env.NODE_ENV !== "production"` check or remove it entirely.

---

### [LOW] #8 — `app/layout.tsx` is Empty / Minimal

**Location:** `app/layout.tsx` (9 bytes root layout)

**Problem:**  
The root `app/layout.tsx` has almost no content. All layout logic is inside `app/[lang]/layout.tsx`, which is correct for i18n. However, there is no root `not-found.tsx`, `error.tsx`, or `global-error.tsx` at the root level, only relying on nested layouts.

**Fix:** Add `global-error.tsx` at the root `app/` level for catastrophic error boundaries.

---

## 🔴 CATEGORY 2 — SECURITY VULNERABILITIES

---

### [CRITICAL] #9 — `bcrypt` AND `bcryptjs` Both Installed

**Location:** `package.json`

**Problem:**  
Both `bcrypt` (native C++ binding) and `bcryptjs` (pure JS) are in dependencies. This is a **supply chain risk** — two separate hash implementations run in the same app. If different parts of the code compare hashes from different libraries, authentication can silently fail or be bypassed.

```json
"bcrypt": "^6.0.0",
"bcryptjs": "^3.0.3",
```

**Fix:** Pick **one** (`bcryptjs` for edge compatibility). Remove the other. Audit all password comparison sites.

---

### [CRITICAL] #10 — Authorization Check is Permission-String Based with No RBAC Model

**Location:** `app/lib/controllers/utils/checkPermission.ts`

**Problem:**  
Permissions are validated via string arrays like `["role_admin", "role_manager"]`. These strings are stored in the `Role.permissions` column as a `String[]`. This is:
- Not type-safe (anyone can add an arbitrary string)
- Not validated at schema level
- Vulnerable to permission string injection if the `permissions` array is user-controlled
- **No column-level authorization** — any user with role_admin can touch any company's data if companyId check fails

**Fix:** Use a proper enum-based permission map. Enforce `companyId` scoping at the db query layer, not just in if-checks.

---

### [HIGH] #11 — JWT Tokens Stored & Not Rotated Properly

**Location:** `app/lib/controllers/session.ts`

**Problem:**  
Session tokens and refreshTokens are stored in the DB. The `refreshSession()` function is called inline in `getAuthenticatedUser()` which runs on **every server render**. If the refresh fails midway, partial state exists. Additionally, sessions only have `isRevoked` flag but no `maxActiveSessions` enforcement, allowing unlimited concurrent sessions.

**Fix:** Implement session limits per user. Add transactional token rotation that atomically revokes old and creates new.

---

### [HIGH] #12 — `vehicleTracking.ts` Reads Firebase Directly from Client

**Location:** `app/lib/vehicleTracking.ts`, `app/lib/firebase.ts`

**Problem:**  
Firebase config (apiKey, projectId, etc.) is exposed to the client bundle. Firebase Realtime Database rules must be the sole guard. If Firebase security rules are misconfigured, **live GPS data for all vehicles is publicly readable**.

**Fix:** Proxy Firebase reads through a server endpoint with authenticated user context. Never expose `apiKey` grants to the client for sensitive data.

---

### [HIGH] #13 — No Input Sanitization for Free-Text Fields

**Location:** `app/lib/validationSchema.ts`

**Problem:**  
Validation schemas use Yup `.string()` and `.required()` but do **no sanitization** (no `.trim()`, no max length, no HTML stripping) on free-text fields like `techNotes`, `description`, `address`. If these are rendered as HTML anywhere (even in logs), XSS risk exists.

**Fix:** Add `.trim().max(N)` to all free-text Yup fields. Ensure all renders use text content, not `dangerouslySetInnerHTML`.

---

### [MEDIUM] #14 — `Server Action bodySizeLimit: "10mb"` with No Rate Limiting

**Location:** `next.config.ts`

**Problem:**  
Server Actions allow 10MB bodies. There is **no rate limiting** on any route or action. This allows:
- Document upload abuse (10MB × N concurrent requests)
- Brute-force attacks on login Server Action

**Fix:** Add rate limiting middleware using a Redis-backed solution or Vercel edge rate limiting. Reduce bodySizeLimit unless document uploads need 10MB.

---

## 🔴 CATEGORY 3 — TYPE SYSTEM ISSUES

---

### [CRITICAL] #15 — `types.ts` Has Wrong Enum Value

**Location:** `app/lib/types.ts:22`

**Problem:**  
```ts
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
```
Prisma schema defines `ShipmentPriority { LOW, MEDIUM, HIGH, CRITICAL }`. **URGENT does not exist**. Any code using this type to filter or set a priority will silently produce invalid data.

---

### [HIGH] #16 — Controllers Use `as unknown as` Type Casting

**Location:** `app/lib/controllers/vehicle.ts`, `driver.ts`

**Problem:**  
```ts
return vehicles as unknown as VehicleWithRelations[];
```
This completely bypasses TypeScript's type system. Prisma returns typed data, but the controller immediately erases the type. This means **type errors in the shape of returned data are invisible at compile time**.

**Fix:** Define proper Prisma query return types using `Prisma.VehicleGetPayload<typeof query>` pattern.

---

### [HIGH] #17 — `VehicleInput` Interface Defined Inside Function Body

**Location:** `app/lib/controllers/vehicle.ts:27`

**Problem:**  
```ts
async (user, vehicleData: Record<string, unknown>) => {
  interface VehicleInput { ... } // defined inside function
  const { year, plate... } = vehicleData as unknown as VehicleInput;
```
An interface defined inside a function body is a code smell and indicates `vehicleData` should be typed at the function signature level.

---

### [MEDIUM] #18 — `EditWarehouseLocation.postalCode` Not in Prisma Schema

**Location:** `app/lib/type/edit-warehouse.ts:17`

**Problem:**  
```ts
export interface EditWarehouseLocation {
  postalCode: string; // ← This field doesn't exist in the Prisma Warehouse model
```
The dialog sets `postalCode: ""` but it is never persisted because `updateWarehouse` doesn't include it. Silent data loss.

---

### [MEDIUM] #19 — `Vehicle.fleetNo` is `optional` in Client Type but `@unique` in DB

**Location:** `app/lib/type/enums.ts:189` vs `prisma/schema.prisma:214`

**Problem:**  
```ts
// enums.ts
export interface Vehicle {
  fleetNo?: string; // optional
}
// Prisma
fleetNo String @unique // required & unique
```
This divergence allows client code to omit `fleetNo` while the DB rejects it.

---

## 🔴 CATEGORY 4 — PERFORMANCE ISSUES

---

### [CRITICAL] #20 — `getVehicles` Returns Full Relations with No Pagination

**Location:** `app/lib/controllers/vehicle.ts:183`

**Problem:**  
```ts
const vehicles = await db.vehicle.findMany({
  include: {
    issues: true,        // ALL issues
    documents: true,     // ALL documents
    maintenanceRecords: true, // ALL records
    routes: true,        // ALL routes
  }
});
```
For a fleet with 100 vehicles × many related records, this is a **massive unbounded query**. No cursor or limit is applied.

**Fix:** Add pagination (`take`, `skip`, `cursor`). Use field selection (`select`) instead of `include: true` for list views. Defer detail queries to individual record fetches.

---

### [HIGH] #21 — `VehiclePageState` Holds Both List and Dashboard Data

**Location:** `app/lib/type/vehicle.ts:97`

**Problem:**  
```ts
export interface VehiclePageState {
  vehicles: VehicleWithRelations[]; // full vehicle list with all relations
  dashboardData: VehicleDashboardResponseType | null; // separate KPI queries
```
Two separate data-heavy fetches are tracked in one state object. Any state update (filter change, selection) triggers a re-render of the entire page including dashboard KPIs.

**Fix:** Split into separate TanStack Query hooks. Dashboard data is independent of the vehicle list.

---

### [HIGH] #22 — `DriverTable` Does Client-Side Pagination When API Pagination Exists

**Location:** `app/components/dashboard/driver/driverTable/index.tsx:34`

**Problem:**  
```ts
const meta = useMemo(() => apiMeta || {
  page: localPage,
  limit: localLimit,
  total: drivers.length,
}, [...]);
const paginatedDrivers = apiMeta ? drivers : drivers.slice(...);
```
The table falls back to **client-side slicing** of the full `drivers[]` array. If `apiMeta` is absent, all drivers are fetched and sliced in the browser — defeating server-side pagination.

**Fix:** Always require `apiMeta` from the server. Remove the client-side pagination fallback.

---

### [MEDIUM] #23 — `getLocalizedPath` Called Per Re-render in Sidebar

**Location:** `app/components/sidebar/listItem.tsx:40`

**Problem:**  
```ts
const getFullLocalizedPath = (path: string) => {
  const localizedPath = getLocalizedPath(path, lang);
  return `/${lang}${localizedPath}`;
};
```
This function is recreated and called on every render for every sidebar item. `useMemo` or moving it outside the component would prevent unnecessary recalculation.

---

### [MEDIUM] #24 — `validationSchema.ts` is 339 Lines in a Single File

**Location:** `app/lib/validationSchema.ts`

**Problem:**  
All Yup schemas for the entire application (login, vehicles, drivers, shipments, routes, warehouses, customers, company) live in one 23KB file. This creates:
- A large import even when only one schema is needed
- Impossible tree-shaking of unused schemas
- Hot module replacement slowdowns

**Fix:** Split into domain-specific schema files: `validation/vehicle.schema.ts`, `validation/driver.schema.ts`, etc.

---

## 🔴 CATEGORY 5 — CODE QUALITY & MAINTAINABILITY

---

### [HIGH] #25 — Deprecated Alias Exports at Bottom of validationSchema.ts

**Location:** `app/lib/validationSchema.ts:319-338`

**Problem:**  
```ts
// These will be fully migrated as components are updated.
export const loginValidationSchema = (dict) => getLoginValidationSchema(dict);
export const signUpValidationSchema = (dict) => getSignUpValidationSchema(dict);
// ... 12 more aliases
```
These backwards-compatibility aliases have been there since refactoring. There is no tracking issue, no deadline, and no automated warning. They will never be removed.

**Fix:** Use `@deprecated` JSDoc tags. Add an ESLint rule or grep test to detect usage, then delete after refactoring.

---

### [HIGH] #26 — Hardcoded Background Color in EditWarehouseDialog

**Location:** `app/components/dialogs/warehouse/editWarehouseDialog/index.tsx:214`

**Problem:**  
```tsx
bgcolor: "#0B0F19", // hardcoded hex
```
This breaks dark/light mode support and violates the design token system. The project uses a full MUI theme; all colors should reference `theme.palette.*`.

---

### [MEDIUM] #27 — `editWarehouseDialog` Calls `actions.closeDialog` in handleSubmit After Success

**Location:** `app/components/dialogs/warehouse/editWarehouseDialog/index.tsx:178`

**Problem:**  
```ts
onSuccess?.();
actions.closeDialog(); // ← closes AFTER onSuccess fires
```
If `onSuccess` triggers a refetch that causes the parent to unmount the dialog, calling `actions.closeDialog()` on an unmounted component will throw a warning. Also, `isSuccess` state is set in `EditWarehousePageState` but **never set to `true`** anywhere in the `handleSubmit` code.

---

### [MEDIUM] #28 — `proxy.ts` at Root Level

**Location:** `proxy.ts` (project root)

**Problem:**  
A `proxy.ts` file exists at the root directory. Its purpose is unclear from the filename. Root-level TypeScript files outside `app/` or a `scripts/` folder are unusual and may be accidentally included in builds.

---

### [MEDIUM] #29 — `check_roles.ts` at Root Level

**Location:** `check_roles.ts` (project root)

**Problem:**  
Same issue as above. A role-checking utility at the project root suggests remnants of a refactoring. Should be moved to `app/lib/` or deleted if unused.

---

### [LOW] #30 — `npm` Listed as a Dependency

**Location:** `package.json:46`

**Problem:**  
```json
"npm": "^11.10.1"
```
`npm` as a `dependency` (not `devDependency`) is incorrect and will bloat production bundles. `npm` is a package manager, not an application dependency.

**Fix:** Remove from `dependencies`. If needed at all, move to `devDependencies`.

---

### [LOW] #31 — `install` Package Listed as Dependency

**Location:** `package.json:42`

**Problem:**  
```json
"install": "^0.13.0"
```
This is a standalone npm package called `install` that is almost certainly a remnant of a past troubleshooting session. It should not be a production dependency.

---

## 🔴 CATEGORY 6 — UX / LOGISTICS DOMAIN ISSUES

---

### [HIGH] #32 — No SLA Breach Alert Mechanism

**Location:** Prisma schema, `Shipment.slaDeadline`

**Problem:**  
`slaDeadline` exists on the Shipment model but there is **no background job, cron, or trigger** that checks for breached SLAs and updates shipment status or notifies the dispatcher. In a real logistics system, SLA tracking is a core KPI — silent SLA breaches go unreported.

**Fix:** Implement a scheduled job (Edge Function or cron) that queries shipments where `slaDeadline < now() AND status NOT IN ['DELIVERED', 'COMPLETED']` and creates an Issue or notification.

---

### [MEDIUM] #33 — `InventoryMovement.type` is a Plain String

**Location:** `prisma/schema.prisma:401`

**Problem:**  
```prisma
type String // PICK, PUTAWAY, ADJUSTMENT
```
This should be an enum (`InventoryMovementType`). As a plain string, any value can be inserted (invalid types like `"REMOVE"`, `"delete"`, etc.), breaking analytics and reports that rely on knowing movement type.

---

### [MEDIUM] #34 — `Document.status` is a Plain String with No Schema Validation

**Location:** `prisma/schema.prisma:525`

**Problem:**  
```prisma
status String
```
Document status should be an enum (VALID, EXPIRED, PENDING_REVIEW). Without it, document compliance tracking is unreliable.

---

### [LOW] #35 — `FuelLog.fuelType` Duplicates `Vehicle.fuelType` with No Consistency Check

**Location:** `prisma/schema.prisma:557`

**Problem:**  
Both `Vehicle` and `FuelLog` have a `fuelType: String` field. A diesel vehicle could have an `ELECTRIC_KWH` fuel log. There's no constraint that `fuelLog.fuelType` matches `vehicle.fuelType`, leading to unreliable fuel efficiency analytics.

---

## 🎯 Recommended Prioritization (Sprint Plan)

### Sprint 1 — Blockers & Security (Fix Now)
- [ ] #1 Deprecate `types.ts`, unify into `enums.ts`
- [ ] #9 Remove duplicate `bcrypt`/`bcryptjs`
- [ ] #15 Fix `"URGENT"` enum drift
- [ ] #5 Add `middleware.ts` route protection
- [ ] #19 Fix `Vehicle.fleetNo` optionality mismatch

### Sprint 2 — Architecture Hardening
- [ ] #2 Stop direct controller imports in Client Components
- [ ] #6 Lift `useUser` to Context Provider
- [ ] #20 Add pagination to `getVehicles` and all list controllers
- [ ] #4 Remove `formik`, standardize on `react-hook-form`

### Sprint 3 — Performance & Quality
- [ ] #22 Remove client-side pagination fallback in DriverTable
- [ ] #24 Split `validationSchema.ts` into domain files
- [ ] #26 Replace hardcoded `"#0B0F19"` with theme token
- [ ] #30 Remove `npm` and `install` from dependencies
- [ ] #32 Implement SLA breach monitoring job

### Sprint 4 — Schema & Domain Corrections
- [ ] #18 Remove `postalCode` from EditWarehouseLocation or add to schema
- [ ] #33 Convert `InventoryMovement.type` to enum
- [ ] #34 Convert `Document.status` to enum
- [ ] #27 Fix `isSuccess` state never being set
