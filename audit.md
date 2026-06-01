Run npm run test

> logitrackv2@0.1.0 test
> node scripts/run-tests.mjs

🔍 260 test dosyası bulundu.
⚙️ Batch boyutu: 8 | Concurrency: 4

════════════════════════════════════════════════════════════
📦 Batch 1 / 33 (8 dosya)
════════════════════════════════════════════════════════════
• app/[lang]/(pages)/(dashboard)/analytics/components/AnalyticsContent.test.tsx
• app/[lang]/(pages)/(dashboard)/analytics/page.test.tsx
• app/[lang]/(pages)/(dashboard)/company/components/CompanyContent.test.tsx
• app/[lang]/(pages)/(dashboard)/company/page.test.tsx
• app/[lang]/(pages)/(dashboard)/customers/components/CustomerContent.test.tsx
• app/[lang]/(pages)/(dashboard)/customers/page.test.tsx
• app/[lang]/(pages)/(dashboard)/drivers/components/DriverContent.test.tsx
• app/[lang]/(pages)/(dashboard)/drivers/page.test.tsx

TAP version 13

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/analytics/components/@/app/hooks/useAnalytics' imported from /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/analytics/components/AnalyticsContent.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338335041:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338335041:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338335041:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/%5Blang%5D/(pages)/(dashboard)/analytics/components/@/app/hooks/useAnalytics'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/analytics/components/AnalyticsContent.test.tsx

not ok 1 - /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/analytics/components/AnalyticsContent.test.tsx

---

duration_ms: 3972.119137
location: '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/analytics/components/AnalyticsContent.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/analytics/@/app/lib/controllers/analytics' imported from /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/analytics/page.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338335058:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338335058:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338335058:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/%5Blang%5D/(pages)/(dashboard)/analytics/@/app/lib/controllers/analytics'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/analytics/page.test.tsx

not ok 2 - /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/analytics/page.test.tsx

---

duration_ms: 4111.726002
location: '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/analytics/page.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/company/components/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/company/components/CompanyContent.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338335104:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338335104:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338335104:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/%5Blang%5D/(pages)/(dashboard)/company/components/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/company/components/CompanyContent.test.tsx

not ok 3 - /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/company/components/CompanyContent.test.tsx

---

duration_ms: 6737.311061
location: '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/company/components/CompanyContent.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/company/@/app/lib/controllers/company' imported from /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/company/page.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338335061:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338335061:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338335061:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/%5Blang%5D/(pages)/(dashboard)/company/@/app/lib/controllers/company'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/company/page.test.tsx

not ok 4 - /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/company/page.test.tsx

---

duration_ms: 4114.952748
location: '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/company/page.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/customers/components/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/customers/components/CustomerContent.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338339066:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338339066:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338339066:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/%5Blang%5D/(pages)/(dashboard)/customers/components/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/customers/components/CustomerContent.test.tsx

not ok 5 - /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/customers/components/CustomerContent.test.tsx

---

duration_ms: 6182.984647
location: '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/customers/components/CustomerContent.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/customers/@/app/lib/controllers/customer' imported from /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/customers/page.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338339173:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338339173:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338339173:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/%5Blang%5D/(pages)/(dashboard)/customers/@/app/lib/controllers/customer'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/customers/page.test.tsx

not ok 6 - /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/customers/page.test.tsx

---

duration_ms: 4208.502618
location: '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/customers/page.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/drivers/components/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/drivers/components/DriverContent.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338339169:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338339169:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338339169:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/%5Blang%5D/(pages)/(dashboard)/drivers/components/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/drivers/components/DriverContent.test.tsx

not ok 7 - /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/drivers/components/DriverContent.test.tsx

---

duration_ms: 6093.871369
location: '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/drivers/components/DriverContent.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/drivers/@/app/lib/controllers/driver' imported from /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/drivers/page.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338341975:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338341975:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338341975:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/%5Blang%5D/(pages)/(dashboard)/drivers/@/app/lib/controllers/driver'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/drivers/page.test.tsx

not ok 8 - /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/drivers/page.test.tsx

---

duration_ms: 3286.155419
location: '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/drivers/page.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...
1..8

# tests 8

# suites 0

# pass 0

# fail 8

# cancelled 0

# skipped 0

# todo 0

════════════════════════════════════════════════════════════
📦 Batch 2 / 33 (8 dosya)
════════════════════════════════════════════════════════════
• app/[lang]/(pages)/(dashboard)/inventory/components/InventoryContent.test.tsx
• app/[lang]/(pages)/(dashboard)/inventory/page.test.tsx
• app/[lang]/(pages)/(dashboard)/layout.test.tsx
• app/[lang]/(pages)/(dashboard)/loading.test.tsx
• app/[lang]/(pages)/(dashboard)/overview/components/OverviewContent.test.tsx
• app/[lang]/(pages)/(dashboard)/overview/page.test.tsx
• app/[lang]/(pages)/(dashboard)/reports/components/ReportsContent.test.tsx
• app/[lang]/(pages)/(dashboard)/reports/page.test.tsx

TAP version 13

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/inventory/components/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/inventory/components/InventoryContent.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338346014:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338346014:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338346014:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/%5Blang%5D/(pages)/(dashboard)/inventory/components/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/inventory/components/InventoryContent.test.tsx

not ok 1 - /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/inventory/components/InventoryContent.test.tsx

---

duration_ms: 6993.95392
location: '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/inventory/components/InventoryContent.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/inventory/@/app/lib/controllers/inventory' imported from /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/inventory/page.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338346011:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338346011:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338346011:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/%5Blang%5D/(pages)/(dashboard)/inventory/@/app/lib/controllers/inventory'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/inventory/page.test.tsx

not ok 2 - /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/inventory/page.test.tsx

---

duration_ms: 4354.536518
location: '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/inventory/page.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/@/app/components/dashboard/DashboardLayoutClient' imported from /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/layout.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338346032:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338346032:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338346032:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/%5Blang%5D/(pages)/(dashboard)/@/app/components/dashboard/DashboardLayoutClient'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/layout.test.tsx

not ok 3 - /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/layout.test.tsx

---

duration_ms: 4110.196473
location: '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/layout.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# (node:2879) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# Subtest: DashboardLoading Component

    # Subtest: DashboardLoading() Render Testleri
        # Subtest: should_RenderSkeletons_Correctly
        ok 1 - should_RenderSkeletons_Correctly
          ---
          duration_ms: 221.186701
          ...
        1..1
    ok 1 - DashboardLoading() Render Testleri
      ---
      duration_ms: 222.092932
      type: 'suite'
      ...
    1..1

ok 4 - DashboardLoading Component

---

duration_ms: 690.43869
type: 'suite'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/overview/components/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/overview/components/OverviewContent.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338350132:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338350132:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338350132:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/%5Blang%5D/(pages)/(dashboard)/overview/components/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/overview/components/OverviewContent.test.tsx

not ok 5 - /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/overview/components/OverviewContent.test.tsx

---

duration_ms: 6470.345135
location: '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/overview/components/OverviewContent.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/overview/@/app/lib/controllers/overview' imported from /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/overview/page.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338350388:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338350388:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338350388:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/%5Blang%5D/(pages)/(dashboard)/overview/@/app/lib/controllers/overview'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/overview/page.test.tsx

not ok 6 - /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/overview/page.test.tsx

---

duration_ms: 4258.21829
location: '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/overview/page.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/reports/components/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/reports/components/ReportsContent.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338353053:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338353053:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338353053:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/%5Blang%5D/(pages)/(dashboard)/reports/components/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/reports/components/ReportsContent.test.tsx

not ok 7 - /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/reports/components/ReportsContent.test.tsx

---

duration_ms: 4706.161509
location: '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/reports/components/ReportsContent.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/reports/@/app/lib/controllers/reports' imported from /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/reports/page.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338353410:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338353410:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338353410:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/%5Blang%5D/(pages)/(dashboard)/reports/@/app/lib/controllers/reports'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/reports/page.test.tsx

not ok 8 - /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/reports/page.test.tsx

---

duration_ms: 3451.432
location: '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/reports/page.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...
1..8

# tests 8

# suites 2

# pass 1

# fail 7

# cancelled 0

# skipped 0

# todo 0

════════════════════════════════════════════════════════════
📦 Batch 3 / 33 (8 dosya)
════════════════════════════════════════════════════════════
• app/[lang]/(pages)/(dashboard)/routes/components/routesContent.test.tsx
• app/[lang]/(pages)/(dashboard)/routes/page.test.tsx
• app/[lang]/(pages)/(dashboard)/shipments/components/shipmentsContent.test.tsx
• app/[lang]/(pages)/(dashboard)/shipments/page.test.tsx
• app/[lang]/(pages)/(dashboard)/vehicle/components/VehicleContent.test.tsx
• app/[lang]/(pages)/(dashboard)/vehicle/page.test.tsx
• app/[lang]/(pages)/(dashboard)/warehouses/components/WarehouseContent.test.tsx
• app/[lang]/(pages)/(dashboard)/warehouses/page.test.tsx

TAP version 13

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/routes/components/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/routes/components/routesContent.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338358432:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338358432:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338358432:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/%5Blang%5D/(pages)/(dashboard)/routes/components/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/routes/components/routesContent.test.tsx

not ok 1 - /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/routes/components/routesContent.test.tsx

---

duration_ms: 6895.045417
location: '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/routes/components/routesContent.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/routes/@/app/lib/controllers/routes' imported from /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/routes/page.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338358477:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338358477:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338358477:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/%5Blang%5D/(pages)/(dashboard)/routes/@/app/lib/controllers/routes'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/routes/page.test.tsx

not ok 2 - /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/routes/page.test.tsx

---

duration_ms: 4137.261082
location: '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/routes/page.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/shipments/components/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/shipments/components/shipmentsContent.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338358473:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338358473:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338358473:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/%5Blang%5D/(pages)/(dashboard)/shipments/components/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/shipments/components/shipmentsContent.test.tsx

not ok 3 - /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/shipments/components/shipmentsContent.test.tsx

---

duration_ms: 7010.394514
location: '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/shipments/components/shipmentsContent.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/shipments/@/app/lib/controllers/shipments' imported from /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/shipments/page.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338358455:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338358455:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338358455:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/%5Blang%5D/(pages)/(dashboard)/shipments/@/app/lib/controllers/shipments'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/shipments/page.test.tsx

not ok 4 - /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/shipments/page.test.tsx

---

duration_ms: 4389.333298
location: '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/shipments/page.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/vehicle/components/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/vehicle/components/VehicleContent.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338362588:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338362588:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338362588:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/%5Blang%5D/(pages)/(dashboard)/vehicle/components/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/vehicle/components/VehicleContent.test.tsx

not ok 5 - /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/vehicle/components/VehicleContent.test.tsx

---

duration_ms: 6346.959639
location: '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/vehicle/components/VehicleContent.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/vehicle/@/app/lib/controllers/vehicle' imported from /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/vehicle/page.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338362858:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338362858:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338362858:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/%5Blang%5D/(pages)/(dashboard)/vehicle/@/app/lib/controllers/vehicle'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/vehicle/page.test.tsx

not ok 6 - /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/vehicle/page.test.tsx

---

duration_ms: 4118.530775
location: '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/vehicle/page.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/warehouses/components/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/warehouses/components/WarehouseContent.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338365374:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338365374:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338365374:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/%5Blang%5D/(pages)/(dashboard)/warehouses/components/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/warehouses/components/WarehouseContent.test.tsx

not ok 7 - /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/warehouses/components/WarehouseContent.test.tsx

---

duration_ms: 4669.135295
location: '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/warehouses/components/WarehouseContent.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/warehouses/@/app/lib/controllers/warehouse' imported from /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/warehouses/page.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338365557:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338365557:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338365557:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/%5Blang%5D/(pages)/(dashboard)/warehouses/@/app/lib/controllers/warehouse'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/warehouses/page.test.tsx

not ok 8 - /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/warehouses/page.test.tsx

---

duration_ms: 3613.801113
location: '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(dashboard)/warehouses/page.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...
1..8

# tests 8

# suites 0

# pass 0

# fail 8

# cancelled 0

# skipped 0

# todo 0

════════════════════════════════════════════════════════════
📦 Batch 4 / 33 (8 dosya)
════════════════════════════════════════════════════════════
• app/[lang]/(pages)/(landing)/about/page.test.tsx
• app/[lang]/(pages)/(landing)/features/page.test.tsx
• app/[lang]/(pages)/(landing)/how-it-works/page.test.tsx
• app/[lang]/(pages)/(landing)/layout.test.tsx
• app/[lang]/(pages)/(landing)/page.test.tsx
• app/[lang]/(pages)/(landing)/pricing/page.test.tsx
• app/[lang]/(pages)/auth/layout.test.tsx
• app/[lang]/(pages)/auth/sign-in/page.test.tsx

TAP version 13

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(landing)/about/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(landing)/about/page.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338370759:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338370759:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338370759:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/%5Blang%5D/(pages)/(landing)/about/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(landing)/about/page.test.tsx

not ok 1 - /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(landing)/about/page.test.tsx

---

duration_ms: 6704.910534
location: '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(landing)/about/page.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(landing)/features/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(landing)/features/page.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338370756:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338370756:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338370756:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/%5Blang%5D/(pages)/(landing)/features/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(landing)/features/page.test.tsx

not ok 2 - /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(landing)/features/page.test.tsx

---

duration_ms: 6800.216292
location: '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(landing)/features/page.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(landing)/how-it-works/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(landing)/how-it-works/page.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338370769:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338370769:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338370769:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/%5Blang%5D/(pages)/(landing)/how-it-works/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(landing)/how-it-works/page.test.tsx

not ok 3 - /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(landing)/how-it-works/page.test.tsx

---

duration_ms: 4126.007191
location: '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(landing)/how-it-works/page.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(landing)/@/app/components/landing/LandingNavbar' imported from /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(landing)/layout.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338370780:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338370780:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338370780:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/%5Blang%5D/(pages)/(landing)/@/app/components/landing/LandingNavbar'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(landing)/layout.test.tsx

not ok 4 - /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(landing)/layout.test.tsx

---

duration_ms: 4133.200448
location: '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(landing)/layout.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(landing)/@/app/components/landing/HeroSection' imported from /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(landing)/page.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338374892:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338374892:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338374892:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/%5Blang%5D/(pages)/(landing)/@/app/components/landing/HeroSection'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(landing)/page.test.tsx

not ok 5 - /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(landing)/page.test.tsx

---

duration_ms: 4559.181344
location: '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(landing)/page.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(landing)/pricing/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(landing)/pricing/page.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338374906:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338374906:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338374906:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/%5Blang%5D/(pages)/(landing)/pricing/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(landing)/pricing/page.test.tsx

not ok 6 - /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(landing)/pricing/page.test.tsx

---

duration_ms: 6194.057266
location: '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/(landing)/pricing/page.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/auth/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/auth/layout.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338377563:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338377563:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338377563:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/%5Blang%5D/(pages)/auth/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/auth/layout.test.tsx

not ok 7 - /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/auth/layout.test.tsx

---

duration_ms: 4850.903408
location: '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/auth/layout.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/auth/sign-in/@/app/components/forms/signInForm' imported from /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/auth/sign-in/page.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338377594:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338377594:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338377594:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/%5Blang%5D/(pages)/auth/sign-in/@/app/components/forms/signInForm'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/auth/sign-in/page.test.tsx

not ok 8 - /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/auth/sign-in/page.test.tsx

---

duration_ms: 3655.868079
location: '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/auth/sign-in/page.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...
1..8

# tests 8

# suites 0

# pass 0

# fail 8

# cancelled 0

# skipped 0

# todo 0

════════════════════════════════════════════════════════════
📦 Batch 5 / 33 (8 dosya)
════════════════════════════════════════════════════════════
• app/[lang]/(pages)/auth/sign-up/page.test.tsx
• app/[lang]/(pages)/playground/page.test.tsx
• app/[lang]/layout.test.tsx
• app/api/analytics/dashboard/route.test.ts
• app/api/auth/refresh/route.test.ts
• app/api/company/dashboard/route.test.ts
• app/api/cron/check-expirations/route.test.ts
• app/api/customers/dashboard/route.test.ts

TAP version 13

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/auth/sign-up/@/app/components/forms/signUpForm' imported from /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/auth/sign-up/page.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338383072:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338383072:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338383072:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/%5Blang%5D/(pages)/auth/sign-up/@/app/components/forms/signUpForm'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/auth/sign-up/page.test.tsx

not ok 1 - /home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/auth/sign-up/page.test.tsx

---

duration_ms: 3553.522905
location: '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/(pages)/auth/sign-up/page.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# Subtest: PlaygroundPage Component

    # Subtest: PlaygroundPage() Render Testleri
        # Subtest: should_RenderPlaygroundNotice_Correctly
        ok 1 - should_RenderPlaygroundNotice_Correctly
          ---
          duration_ms: 63.133248
          ...
        1..1
    ok 1 - PlaygroundPage() Render Testleri
      ---
      duration_ms: 63.689787
      type: 'suite'
      ...
    1..1

ok 2 - PlaygroundPage Component

---

duration_ms: 1441.651326
type: 'suite'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/@/app/lib/language/language' imported from /home/runner/work/logitrackv2/logitrackv2/app/[lang]/layout.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338383044:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338383044:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338383044:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/%5Blang%5D/@/app/lib/language/language'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/[lang]/layout.test.tsx

not ok 3 - /home/runner/work/logitrackv2/logitrackv2/app/[lang]/layout.test.tsx

---

duration_ms: 3336.26561
location: '/home/runner/work/logitrackv2/logitrackv2/app/[lang]/layout.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/api/analytics/dashboard/@/app/lib/controllers/analytics' imported from /home/runner/work/logitrackv2/logitrackv2/app/api/analytics/dashboard/route.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338383080:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338383080:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338383080:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/api/analytics/dashboard/@/app/lib/controllers/analytics'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/api/analytics/dashboard/route.test.ts

not ok 4 - /home/runner/work/logitrackv2/logitrackv2/app/api/analytics/dashboard/route.test.ts

---

duration_ms: 712.788448
location: '/home/runner/work/logitrackv2/logitrackv2/app/api/analytics/dashboard/route.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/api/auth/refresh/@/app/lib/controllers/session' imported from /home/runner/work/logitrackv2/logitrackv2/app/api/auth/refresh/route.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338383813:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338383813:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338383813:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/api/auth/refresh/@/app/lib/controllers/session'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/api/auth/refresh/route.test.ts

not ok 5 - /home/runner/work/logitrackv2/logitrackv2/app/api/auth/refresh/route.test.ts

---

duration_ms: 607.068889
location: '/home/runner/work/logitrackv2/logitrackv2/app/api/auth/refresh/route.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/api/company/dashboard/@/app/lib/controllers/company' imported from /home/runner/work/logitrackv2/logitrackv2/app/api/company/dashboard/route.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338384372:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338384372:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338384372:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/api/company/dashboard/@/app/lib/controllers/company'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/api/company/dashboard/route.test.ts

not ok 6 - /home/runner/work/logitrackv2/logitrackv2/app/api/company/dashboard/route.test.ts

---

duration_ms: 520.936627
location: '/home/runner/work/logitrackv2/logitrackv2/app/api/company/dashboard/route.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/api/cron/check-expirations/@/app/lib/db' imported from /home/runner/work/logitrackv2/logitrackv2/app/api/cron/check-expirations/route.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338384903:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338384903:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338384903:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/api/cron/check-expirations/@/app/lib/db'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/api/cron/check-expirations/route.test.ts

not ok 7 - /home/runner/work/logitrackv2/logitrackv2/app/api/cron/check-expirations/route.test.ts

---

duration_ms: 598.358803
location: '/home/runner/work/logitrackv2/logitrackv2/app/api/cron/check-expirations/route.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/api/customers/dashboard/@/app/lib/controllers/customer' imported from /home/runner/work/logitrackv2/logitrackv2/app/api/customers/dashboard/route.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338385523:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338385523:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338385523:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/api/customers/dashboard/@/app/lib/controllers/customer'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/api/customers/dashboard/route.test.ts

not ok 8 - /home/runner/work/logitrackv2/logitrackv2/app/api/customers/dashboard/route.test.ts

---

duration_ms: 535.84012
location: '/home/runner/work/logitrackv2/logitrackv2/app/api/customers/dashboard/route.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...
1..8

# tests 8

# suites 2

# pass 1

# fail 7

# cancelled 0

# skipped 0

# todo 0

════════════════════════════════════════════════════════════
📦 Batch 6 / 33 (8 dosya)
════════════════════════════════════════════════════════════
• app/api/customers/route.test.ts
• app/api/drivers/dashboard/route.test.ts
• app/api/drivers/route.test.ts
• app/api/exchange-rates/route.test.ts
• app/api/inventory/dashboard/route.test.ts
• app/api/overview/dashboard/route.test.ts
• app/api/reports/dashboard/route.test.ts
• app/api/routes/dashboard/route.test.ts

TAP version 13

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/api/customers/@/app/lib/controllers/customer' imported from /home/runner/work/logitrackv2/logitrackv2/app/api/customers/route.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338388745:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338388745:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338388745:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/api/customers/@/app/lib/controllers/customer'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/api/customers/route.test.ts

not ok 1 - /home/runner/work/logitrackv2/logitrackv2/app/api/customers/route.test.ts

---

duration_ms: 551.811544
location: '/home/runner/work/logitrackv2/logitrackv2/app/api/customers/route.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/api/drivers/dashboard/@/app/lib/controllers/driver' imported from /home/runner/work/logitrackv2/logitrackv2/app/api/drivers/dashboard/route.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338388756:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338388756:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338388756:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/api/drivers/dashboard/@/app/lib/controllers/driver'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/api/drivers/dashboard/route.test.ts

not ok 2 - /home/runner/work/logitrackv2/logitrackv2/app/api/drivers/dashboard/route.test.ts

---

duration_ms: 587.017315
location: '/home/runner/work/logitrackv2/logitrackv2/app/api/drivers/dashboard/route.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/api/drivers/@/app/lib/controllers/driver' imported from /home/runner/work/logitrackv2/logitrackv2/app/api/drivers/route.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338388761:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338388761:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338388761:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/api/drivers/@/app/lib/controllers/driver'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/api/drivers/route.test.ts

not ok 3 - /home/runner/work/logitrackv2/logitrackv2/app/api/drivers/route.test.ts

---

duration_ms: 606.339015
location: '/home/runner/work/logitrackv2/logitrackv2/app/api/drivers/route.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/api/exchange-rates/@/app/lib/services/exchangeRate' imported from /home/runner/work/logitrackv2/logitrackv2/app/api/exchange-rates/route.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338388769:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338388769:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338388769:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/api/exchange-rates/@/app/lib/services/exchangeRate'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/api/exchange-rates/route.test.ts

not ok 4 - /home/runner/work/logitrackv2/logitrackv2/app/api/exchange-rates/route.test.ts

---

duration_ms: 641.940363
location: '/home/runner/work/logitrackv2/logitrackv2/app/api/exchange-rates/route.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/api/inventory/dashboard/@/app/lib/controllers/inventory' imported from /home/runner/work/logitrackv2/logitrackv2/app/api/inventory/dashboard/route.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338389334:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338389334:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338389334:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/api/inventory/dashboard/@/app/lib/controllers/inventory'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/api/inventory/dashboard/route.test.ts

not ok 5 - /home/runner/work/logitrackv2/logitrackv2/app/api/inventory/dashboard/route.test.ts

---

duration_ms: 659.327121
location: '/home/runner/work/logitrackv2/logitrackv2/app/api/inventory/dashboard/route.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/api/overview/dashboard/@/app/lib/controllers/overview' imported from /home/runner/work/logitrackv2/logitrackv2/app/api/overview/dashboard/route.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338389347:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338389347:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338389347:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/api/overview/dashboard/@/app/lib/controllers/overview'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/api/overview/dashboard/route.test.ts

not ok 6 - /home/runner/work/logitrackv2/logitrackv2/app/api/overview/dashboard/route.test.ts

---

duration_ms: 617.19293
location: '/home/runner/work/logitrackv2/logitrackv2/app/api/overview/dashboard/route.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/api/reports/dashboard/@/app/lib/controllers/reports' imported from /home/runner/work/logitrackv2/logitrackv2/app/api/reports/dashboard/route.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338389409:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338389409:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338389409:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/api/reports/dashboard/@/app/lib/controllers/reports'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/api/reports/dashboard/route.test.ts

not ok 7 - /home/runner/work/logitrackv2/logitrackv2/app/api/reports/dashboard/route.test.ts

---

duration_ms: 568.135149
location: '/home/runner/work/logitrackv2/logitrackv2/app/api/reports/dashboard/route.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/api/routes/dashboard/@/app/lib/controllers/routes' imported from /home/runner/work/logitrackv2/logitrackv2/app/api/routes/dashboard/route.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338389396:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338389396:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338389396:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/api/routes/dashboard/@/app/lib/controllers/routes'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/api/routes/dashboard/route.test.ts

not ok 8 - /home/runner/work/logitrackv2/logitrackv2/app/api/routes/dashboard/route.test.ts

---

duration_ms: 576.781555
location: '/home/runner/work/logitrackv2/logitrackv2/app/api/routes/dashboard/route.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...
1..8

# tests 8

# suites 0

# pass 0

# fail 8

# cancelled 0

# skipped 0

# todo 0

════════════════════════════════════════════════════════════
📦 Batch 7 / 33 (8 dosya)
════════════════════════════════════════════════════════════
• app/api/routes/route.test.ts
• app/api/shipments/dashboard/route.test.ts
• app/api/shipments/route.test.ts
• app/api/trailers/route.test.ts
• app/api/vehicles/[id]/location/route.test.ts
• app/api/vehicles/dashboard/route.test.ts
• app/api/vehicles/route.test.ts
• app/api/warehouses/dashboard/route.test.ts

TAP version 13

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/api/routes/@/app/lib/controllers/routes' imported from /home/runner/work/logitrackv2/logitrackv2/app/api/routes/route.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338390721:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338390721:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338390721:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/api/routes/@/app/lib/controllers/routes'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/api/routes/route.test.ts

not ok 1 - /home/runner/work/logitrackv2/logitrackv2/app/api/routes/route.test.ts

---

duration_ms: 599.597616
location: '/home/runner/work/logitrackv2/logitrackv2/app/api/routes/route.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/api/shipments/dashboard/@/app/lib/controllers/shipments' imported from /home/runner/work/logitrackv2/logitrackv2/app/api/shipments/dashboard/route.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338390718:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338390718:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338390718:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/api/shipments/dashboard/@/app/lib/controllers/shipments'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/api/shipments/dashboard/route.test.ts

not ok 2 - /home/runner/work/logitrackv2/logitrackv2/app/api/shipments/dashboard/route.test.ts

---

duration_ms: 602.599886
location: '/home/runner/work/logitrackv2/logitrackv2/app/api/shipments/dashboard/route.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/api/shipments/@/app/lib/controllers/shipments' imported from /home/runner/work/logitrackv2/logitrackv2/app/api/shipments/route.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338390734:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338390734:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338390734:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/api/shipments/@/app/lib/controllers/shipments'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/api/shipments/route.test.ts

not ok 3 - /home/runner/work/logitrackv2/logitrackv2/app/api/shipments/route.test.ts

---

duration_ms: 608.535616
location: '/home/runner/work/logitrackv2/logitrackv2/app/api/shipments/route.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/api/trailers/@/app/lib/controllers/trailer' imported from /home/runner/work/logitrackv2/logitrackv2/app/api/trailers/route.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338390750:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338390750:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338390750:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/api/trailers/@/app/lib/controllers/trailer'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/api/trailers/route.test.ts

not ok 4 - /home/runner/work/logitrackv2/logitrackv2/app/api/trailers/route.test.ts

---

duration_ms: 620.957777
location: '/home/runner/work/logitrackv2/logitrackv2/app/api/trailers/route.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/api/vehicles/[id]/location/@/app/lib/firebase-admin' imported from /home/runner/work/logitrackv2/logitrackv2/app/api/vehicles/[id]/location/route.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338391310:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338391310:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338391310:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/api/vehicles/%5Bid%5D/location/@/app/lib/firebase-admin'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/api/vehicles/[id]/location/route.test.ts

not ok 5 - /home/runner/work/logitrackv2/logitrackv2/app/api/vehicles/[id]/location/route.test.ts

---

duration_ms: 548.035359
location: '/home/runner/work/logitrackv2/logitrackv2/app/api/vehicles/[id]/location/route.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/api/vehicles/dashboard/@/app/lib/auth-middleware' imported from /home/runner/work/logitrackv2/logitrackv2/app/api/vehicles/dashboard/route.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338391344:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338391344:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338391344:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/api/vehicles/dashboard/@/app/lib/auth-middleware'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/api/vehicles/dashboard/route.test.ts

not ok 6 - /home/runner/work/logitrackv2/logitrackv2/app/api/vehicles/dashboard/route.test.ts

---

duration_ms: 569.731428
location: '/home/runner/work/logitrackv2/logitrackv2/app/api/vehicles/dashboard/route.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/api/vehicles/@/app/lib/controllers/vehicle' imported from /home/runner/work/logitrackv2/logitrackv2/app/api/vehicles/route.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338391344:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338391344:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338391344:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/api/vehicles/@/app/lib/controllers/vehicle'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/api/vehicles/route.test.ts

not ok 7 - /home/runner/work/logitrackv2/logitrackv2/app/api/vehicles/route.test.ts

---

duration_ms: 607.903745
location: '/home/runner/work/logitrackv2/logitrackv2/app/api/vehicles/route.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/api/warehouses/dashboard/@/app/lib/controllers/warehouse' imported from /home/runner/work/logitrackv2/logitrackv2/app/api/warehouses/dashboard/route.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338391396:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338391396:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338391396:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/api/warehouses/dashboard/@/app/lib/controllers/warehouse'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/api/warehouses/dashboard/route.test.ts

not ok 8 - /home/runner/work/logitrackv2/logitrackv2/app/api/warehouses/dashboard/route.test.ts

---

duration_ms: 619.929968
location: '/home/runner/work/logitrackv2/logitrackv2/app/api/warehouses/dashboard/route.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...
1..8

# tests 8

# suites 0

# pass 0

# fail 8

# cancelled 0

# skipped 0

# todo 0

════════════════════════════════════════════════════════════
📦 Batch 8 / 33 (8 dosya)
════════════════════════════════════════════════════════════
• app/api/warehouses/route.test.ts
• app/components/avatar.test.tsx
• app/components/cards/KpiCards.test.tsx
• app/components/cards/StatCard.test.tsx
• app/components/cards/card.test.tsx
• app/components/cards/driverCard.test.tsx
• app/components/charts/TimeRangeSelector.test.tsx
• app/components/chips/priorityChips.test.tsx

TAP version 13

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/api/warehouses/@/app/lib/controllers/warehouse' imported from /home/runner/work/logitrackv2/logitrackv2/app/api/warehouses/route.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338392714:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338392714:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338392714:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/api/warehouses/@/app/lib/controllers/warehouse'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/api/warehouses/route.test.ts

not ok 1 - /home/runner/work/logitrackv2/logitrackv2/app/api/warehouses/route.test.ts

---

duration_ms: 677.76609
location: '/home/runner/work/logitrackv2/logitrackv2/app/api/warehouses/route.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# (node:4225) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# Subtest: DriverAvatar Component

    # Subtest: DriverAvatar() bileşeni
        # Subtest: should_ReturnAvatarWithCorrectProps_WhenSizeIsMedium
        ok 1 - should_ReturnAvatarWithCorrectProps_WhenSizeIsMedium
          ---
          duration_ms: 1.98816
          ...
        # Subtest: should_ReturnAvatarWithSmallSize_WhenSizeIsSmall
        ok 2 - should_ReturnAvatarWithSmallSize_WhenSizeIsSmall
          ---
          duration_ms: 0.358248
          ...
        1..2
    ok 1 - DriverAvatar() bileşeni
      ---
      duration_ms: 2.901485
      type: 'suite'
      ...
    1..1

ok 2 - DriverAvatar Component

---

duration_ms: 1918.888803
type: 'suite'
...

# (node:4231) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# Subtest: KpiCards Component

    # Subtest: KpiCards() bileşeni
        # Subtest: should_RenderStatCards_WhenNotLoading
        ok 1 - should_RenderStatCards_WhenNotLoading
          ---
          duration_ms: 33.867809
          ...
        # Subtest: should_RenderSkeletons_WhenLoading
        ok 2 - should_RenderSkeletons_WhenLoading
          ---
          duration_ms: 2.177093
          ...
        1..2
    ok 1 - KpiCards() bileşeni
      ---
      duration_ms: 36.93348
      type: 'suite'
      ...
    1..1

ok 3 - KpiCards Component

---

duration_ms: 118.772837
type: 'suite'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/cards/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/cards/StatCard.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338392747:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338392747:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338392747:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/cards/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/cards/StatCard.test.tsx

not ok 4 - /home/runner/work/logitrackv2/logitrackv2/app/components/cards/StatCard.test.tsx

---

duration_ms: 626.162543
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/cards/StatCard.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# (node:4303) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# Subtest: CustomCard Component

    # Subtest: CustomCard() bileşeni
        # Subtest: should_RenderChildrenInsideCard
        ok 1 - should_RenderChildrenInsideCard
          ---
          duration_ms: 14.341482
          ...
        1..1
    ok 1 - CustomCard() bileşeni
      ---
      duration_ms: 15.097342
      type: 'suite'
      ...
    1..1

ok 5 - CustomCard Component

---

duration_ms: 49.438573
type: 'suite'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/cards/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/cards/driverCard.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338393439:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338393439:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338393439:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/cards/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/cards/driverCard.test.tsx

not ok 6 - /home/runner/work/logitrackv2/logitrackv2/app/components/cards/driverCard.test.tsx

---

duration_ms: 592.606508
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/cards/driverCard.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# (node:4326) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# Subtest: TimeRangeSelector Component

    # Subtest: TimeRangeSelector() bileşeni
        # Subtest: should_InitializeWithoutErrors_WhenRendered
        ok 1 - should_InitializeWithoutErrors_WhenRendered
          ---
          duration_ms: 17.514663
          ...
        1..1
    ok 1 - TimeRangeSelector() bileşeni
      ---
      duration_ms: 18.267248
      type: 'suite'
      ...
    1..1

ok 7 - TimeRangeSelector Component

---

duration_ms: 48.268845
type: 'suite'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/chips/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/chips/priorityChips.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338393981:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338393981:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338393981:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/chips/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/chips/priorityChips.test.tsx

not ok 8 - /home/runner/work/logitrackv2/logitrackv2/app/components/chips/priorityChips.test.tsx

---

duration_ms: 458.582439
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/chips/priorityChips.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...
1..8

# tests 10

# suites 8

# pass 6

# fail 4

# cancelled 0

# skipped 0

# todo 0

════════════════════════════════════════════════════════════
📦 Batch 9 / 33 (8 dosya)
════════════════════════════════════════════════════════════
• app/components/chips/statusChips.test.tsx
• app/components/dashboard/DashboardBreadcrumbs.test.tsx
• app/components/dashboard/DashboardHeader.test.tsx
• app/components/dashboard/DashboardLayoutClient.test.tsx
• app/components/dashboard/VehicleLiveMap.test.tsx
• app/components/dashboard/analytics/AnalyticsHeader.test.tsx
• app/components/dashboard/analytics/CostAnalysisCharts.test.tsx
• app/components/dashboard/analytics/ForecastingWidget.test.tsx

TAP version 13

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/chips/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/chips/statusChips.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338395955:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338395955:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338395955:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/chips/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/chips/statusChips.test.tsx

not ok 1 - /home/runner/work/logitrackv2/logitrackv2/app/components/chips/statusChips.test.tsx

---

duration_ms: 791.044233
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/chips/statusChips.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/DashboardBreadcrumbs.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338395968:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338395968:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338395968:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/DashboardBreadcrumbs.test.tsx

not ok 2 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/DashboardBreadcrumbs.test.tsx

---

duration_ms: 6940.294644
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/DashboardBreadcrumbs.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/DashboardHeader.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338395968:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338395968:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338395968:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/DashboardHeader.test.tsx

not ok 3 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/DashboardHeader.test.tsx

---

duration_ms: 7579.890027
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/DashboardHeader.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/@/app/lib/context/UserContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/DashboardLayoutClient.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338395970:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338395970:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338395970:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/@/app/lib/context/UserContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/DashboardLayoutClient.test.tsx

not ok 4 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/DashboardLayoutClient.test.tsx

---

duration_ms: 7851.28152
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/DashboardLayoutClient.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/VehicleLiveMap.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338396816:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338396816:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338396816:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/VehicleLiveMap.test.tsx

not ok 5 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/VehicleLiveMap.test.tsx

---

duration_ms: 6632.490772
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/VehicleLiveMap.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/analytics/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/analytics/AnalyticsHeader.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338402913:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338402913:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338402913:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/analytics/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/analytics/AnalyticsHeader.test.tsx

not ok 6 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/analytics/AnalyticsHeader.test.tsx

---

duration_ms: 3706.991187
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/analytics/AnalyticsHeader.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/analytics/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/analytics/CostAnalysisCharts.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338403412:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338403412:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338403412:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/analytics/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/analytics/CostAnalysisCharts.test.tsx

not ok 7 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/analytics/CostAnalysisCharts.test.tsx

---

duration_ms: 4798.691052
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/analytics/CostAnalysisCharts.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/analytics/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/analytics/ForecastingWidget.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338403579:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338403579:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338403579:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/analytics/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/analytics/ForecastingWidget.test.tsx

not ok 8 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/analytics/ForecastingWidget.test.tsx

---

duration_ms: 4646.899539
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/analytics/ForecastingWidget.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...
1..8

# tests 8

# suites 0

# pass 0

# fail 8

# cancelled 0

# skipped 0

# todo 0

════════════════════════════════════════════════════════════
📦 Batch 10 / 33 (8 dosya)
════════════════════════════════════════════════════════════
• app/components/dashboard/analytics/PerformanceGauges.test.tsx
• app/components/dashboard/company/companyInfoCard.test.tsx
• app/components/dashboard/company/companyMembersTable.test.tsx
• app/components/dashboard/customer/CustomerList.test.tsx
• app/components/dashboard/driver/driverPerformanceCharts.test.tsx
• app/components/dashboard/driver/driverTable/index.test.tsx
• app/components/dashboard/driver/driverTable/menu.test.tsx
• app/components/dashboard/driver/driverTable/toolbar.test.tsx

TAP version 13

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/analytics/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/analytics/PerformanceGauges.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338408929:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338408929:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338408929:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/analytics/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/analytics/PerformanceGauges.test.tsx

not ok 1 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/analytics/PerformanceGauges.test.tsx

---

duration_ms: 7425.6222
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/analytics/PerformanceGauges.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/company/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/company/companyInfoCard.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338408962:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338408962:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338408962:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/company/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/company/companyInfoCard.test.tsx

not ok 2 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/company/companyInfoCard.test.tsx

---

duration_ms: 7005.948632
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/company/companyInfoCard.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/company/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/company/companyMembersTable.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338408915:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338408915:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338408915:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/company/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/company/companyMembersTable.test.tsx

not ok 3 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/company/companyMembersTable.test.tsx

---

duration_ms: 7184.234943
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/company/companyMembersTable.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/customer/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/customer/CustomerList.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338408929:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338408929:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338408929:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/customer/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/customer/CustomerList.test.tsx

not ok 4 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/customer/CustomerList.test.tsx

---

duration_ms: 7251.32282
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/customer/CustomerList.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/driver/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/driver/driverPerformanceCharts.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338415937:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338415937:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338415937:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/driver/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/driver/driverPerformanceCharts.test.tsx

not ok 5 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/driver/driverPerformanceCharts.test.tsx

---

duration_ms: 4005.389009
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/driver/driverPerformanceCharts.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/driver/driverTable/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/driver/driverTable/index.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338416131:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338416131:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338416131:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/driver/driverTable/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/driver/driverTable/index.test.tsx

not ok 6 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/driver/driverTable/index.test.tsx

---

duration_ms: 4062.837755
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/driver/driverTable/index.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/driver/driverTable/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/driver/driverTable/menu.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338416211:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338416211:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338416211:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/driver/driverTable/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/driver/driverTable/menu.test.tsx

not ok 7 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/driver/driverTable/menu.test.tsx

---

duration_ms: 3946.525188
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/driver/driverTable/menu.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/driver/driverTable/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/driver/driverTable/toolbar.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338416414:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338416414:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338416414:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/driver/driverTable/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/driver/driverTable/toolbar.test.tsx

not ok 8 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/driver/driverTable/toolbar.test.tsx

---

duration_ms: 5077.064681
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/driver/driverTable/toolbar.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...
1..8

# tests 8

# suites 0

# pass 0

# fail 8

# cancelled 0

# skipped 0

# todo 0

════════════════════════════════════════════════════════════
📦 Batch 11 / 33 (8 dosya)
════════════════════════════════════════════════════════════
• app/components/dashboard/inventory/InventoryHeader.test.tsx
• app/components/dashboard/inventory/InventoryTable.test.tsx
• app/components/dashboard/overview/actionRequiredCard.test.tsx
• app/components/dashboard/overview/dailyOperations.test.tsx
• app/components/dashboard/overview/fuelByVehicleCard.test.tsx
• app/components/dashboard/overview/inventoryCard.test.tsx
• app/components/dashboard/overview/onTimeTrends.test.tsx
• app/components/dashboard/overview/overViewMapCard.test.tsx

TAP version 13

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/inventory/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/inventory/InventoryHeader.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338422185:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338422185:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338422185:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/inventory/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/inventory/InventoryHeader.test.tsx

not ok 1 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/inventory/InventoryHeader.test.tsx

---

duration_ms: 7319.531968
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/inventory/InventoryHeader.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/inventory/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/inventory/InventoryTable.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338422195:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338422195:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338422195:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/inventory/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/inventory/InventoryTable.test.tsx

not ok 2 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/inventory/InventoryTable.test.tsx

---

duration_ms: 7319.68747
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/inventory/InventoryTable.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/actionRequiredCard.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338422185:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338422185:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338422185:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/actionRequiredCard.test.tsx

not ok 3 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/actionRequiredCard.test.tsx

---

duration_ms: 7074.587835
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/actionRequiredCard.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/dailyOperations.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338422173:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338422173:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338422173:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/dailyOperations.test.tsx

not ok 4 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/dailyOperations.test.tsx

---

duration_ms: 7278.300484
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/dailyOperations.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/fuelByVehicleCard.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338429286:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338429286:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338429286:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/fuelByVehicleCard.test.tsx

not ok 5 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/fuelByVehicleCard.test.tsx

---

duration_ms: 4213.676847
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/fuelByVehicleCard.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/inventoryCard.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338429471:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338429471:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338429471:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/inventoryCard.test.tsx

not ok 6 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/inventoryCard.test.tsx

---

duration_ms: 5253.884264
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/inventoryCard.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/onTimeTrends.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338429518:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338429518:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338429518:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/onTimeTrends.test.tsx

not ok 7 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/onTimeTrends.test.tsx

---

duration_ms: 3854.785922
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/onTimeTrends.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/@/app/components/googleMaps/GoogleMapsProvider' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/overViewMapCard.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338429524:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338429524:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338429524:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/@/app/components/googleMaps/GoogleMapsProvider'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/overViewMapCard.test.tsx

not ok 8 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/overViewMapCard.test.tsx

---

duration_ms: 3814.357137
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/overViewMapCard.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...
1..8

# tests 8

# suites 0

# pass 0

# fail 8

# cancelled 0

# skipped 0

# todo 0

════════════════════════════════════════════════════════════
📦 Batch 12 / 33 (8 dosya)
════════════════════════════════════════════════════════════
• app/components/dashboard/overview/picsPacksDailyCard.test.tsx
• app/components/dashboard/overview/shipmentsByStatusCard.test.tsx
• app/components/dashboard/overview/warehouseCapacityCard.test.tsx
• app/components/dashboard/reports/FleetCharts.test.tsx
• app/components/dashboard/reports/InventoryCharts.test.tsx
• app/components/dashboard/reports/ReportSummaryCards.test.tsx
• app/components/dashboard/reports/ShipmentCharts.test.tsx
• app/components/dashboard/routes/routeEfficiency.test.tsx

TAP version 13

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/picsPacksDailyCard.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338435448:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338435448:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338435448:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/picsPacksDailyCard.test.tsx

not ok 1 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/picsPacksDailyCard.test.tsx

---

duration_ms: 7066.020407
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/picsPacksDailyCard.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/shipmentsByStatusCard.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338435454:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338435454:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338435454:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/shipmentsByStatusCard.test.tsx

not ok 2 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/shipmentsByStatusCard.test.tsx

---

duration_ms: 7292.589454
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/shipmentsByStatusCard.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/warehouseCapacityCard.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338435493:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338435493:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338435493:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/warehouseCapacityCard.test.tsx

not ok 3 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/warehouseCapacityCard.test.tsx

---

duration_ms: 7255.157288
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/overview/warehouseCapacityCard.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# (node:5211) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# Subtest: FleetCharts RTL Component

    # Subtest: FleetCharts() bileşeni
        # Subtest: should_RenderNoDataMessage_WhenDataIsEmpty
        ok 1 - should_RenderNoDataMessage_WhenDataIsEmpty
          ---
          duration_ms: 105.587296
          ...
        # Subtest: should_RenderNoDataMessage_WhenDataIsNull
        ok 2 - should_RenderNoDataMessage_WhenDataIsNull
          ---
          duration_ms: 6.264108
          ...
        # Subtest: should_RenderChartTitles_WhenDataProvided
        not ok 3 - should_RenderChartTitles_WhenDataProvided
          ---
          duration_ms: 28.194518
          location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/reports/FleetCharts.test.tsx:1:2357'
          failureType: 'testCodeFailure'
          error: |-
            Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: object.

            Check the render method of `FleetCharts`.
          code: 'ERR_TEST_FAILURE'
          stack: |-
            createFiberFromTypeAndProps (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:5021:28)
            createFiberFromElement (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:5035:14)
            reconcileChildFibersImpl (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:6920:31)
            /home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:7098:33
            reconcileChildren (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:9701:13)
            beginWork (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:12049:13)
            runWithFiberInDEV (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:871:30)
            performUnitOfWork (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:17641:22)
            workLoopSync (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:17469:41)
            renderRootSync (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:17450:11)
          ...
        # Subtest: should_RenderBarChart_SortedByMaintenanceCostDescending
        not ok 4 - should_RenderBarChart_SortedByMaintenanceCostDescending
          ---
          duration_ms: 10.573429
          location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/reports/FleetCharts.test.tsx:1:2619'
          failureType: 'testCodeFailure'
          error: |-
            Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: object.

            Check the render method of `FleetCharts`.
          code: 'ERR_TEST_FAILURE'
          stack: |-
            createFiberFromTypeAndProps (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:5021:28)
            createFiberFromElement (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:5035:14)
            reconcileChildFibersImpl (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:6920:31)
            /home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:7098:33
            reconcileChildren (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:9701:13)
            beginWork (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:12049:13)
            runWithFiberInDEV (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:871:30)
            performUnitOfWork (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:17641:22)
            workLoopSync (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:17469:41)
            renderRootSync (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:17450:11)
          ...
        # Subtest: should_RenderScatterChart_WithOdometerAndConsumption
        not ok 5 - should_RenderScatterChart_WithOdometerAndConsumption
          ---
          duration_ms: 7.719413
          location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/reports/FleetCharts.test.tsx:1:2906'
          failureType: 'testCodeFailure'
          error: |-
            Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: object.

            Check the render method of `FleetCharts`.
          code: 'ERR_TEST_FAILURE'
          stack: |-
            createFiberFromTypeAndProps (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:5021:28)
            createFiberFromElement (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:5035:14)
            reconcileChildFibersImpl (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:6920:31)
            /home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:7098:33
            reconcileChildren (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:9701:13)
            beginWork (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:12049:13)
            runWithFiberInDEV (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:871:30)
            performUnitOfWork (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:17641:22)
            workLoopSync (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:17469:41)
            renderRootSync (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:17450:11)
          ...
        # Subtest: should_LimitBarChartToTopEight_WhenMoreVehiclesExist
        not ok 6 - should_LimitBarChartToTopEight_WhenMoreVehiclesExist
          ---
          duration_ms: 7.836492
          location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/reports/FleetCharts.test.tsx:1:3182'
          failureType: 'testCodeFailure'
          error: |-
            Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: object.

            Check the render method of `FleetCharts`.
          code: 'ERR_TEST_FAILURE'
          stack: |-
            createFiberFromTypeAndProps (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:5021:28)
            createFiberFromElement (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:5035:14)
            reconcileChildFibersImpl (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:6920:31)
            /home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:7098:33
            reconcileChildren (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:9701:13)
            beginWork (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:12049:13)
            runWithFiberInDEV (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:871:30)
            performUnitOfWork (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:17641:22)
            workLoopSync (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:17469:41)
            renderRootSync (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:17450:11)
          ...
        1..6
    not ok 1 - FleetCharts() bileşeni
      ---
      duration_ms: 167.513254
      type: 'suite'
      location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/reports/FleetCharts.test.tsx:1:1952'
      failureType: 'subtestsFailed'
      error: '4 subtests failed'
      code: 'ERR_TEST_FAILURE'
      stack: |-
        async Promise.all (index 0)
      ...
    1..1

not ok 4 - FleetCharts RTL Component

---

duration_ms: 738.426023
type: 'suite'
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/reports/FleetCharts.test.tsx:1:1463'
failureType: 'subtestsFailed'
error: '1 subtest failed'
code: 'ERR_TEST_FAILURE'
...

# (node:5317) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# Subtest: InventoryCharts RTL Component

    # Subtest: InventoryCharts() bileşeni
        # Subtest: should_ReturnNull_WhenDataIsFalsy
        ok 1 - should_ReturnNull_WhenDataIsFalsy
          ---
          duration_ms: 15.172594
          ...
        # Subtest: should_RenderChartTitles_WhenDataProvided
        not ok 2 - should_RenderChartTitles_WhenDataProvided
          ---
          duration_ms: 19.319763
          location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/reports/InventoryCharts.test.tsx:1:1831'
          failureType: 'testCodeFailure'
          error: |-
            Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: object.

            Check the render method of `InventoryCharts`.
          code: 'ERR_TEST_FAILURE'
          stack: |-
            createFiberFromTypeAndProps (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:5021:28)
            createFiberFromElement (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:5035:14)
            reconcileChildFibersImpl (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:6920:31)
            /home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:7098:33
            reconcileChildren (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:9701:13)
            beginWork (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:12049:13)
            runWithFiberInDEV (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:871:30)
            performUnitOfWork (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:17641:22)
            workLoopSync (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:17469:41)
            renderRootSync (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:17450:11)
          ...
        # Subtest: should_RenderValueAndCountPieCharts_WithMappedCategories
        not ok 3 - should_RenderValueAndCountPieCharts_WithMappedCategories
          ---
          duration_ms: 5.628032
          location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/reports/InventoryCharts.test.tsx:1:2074'
          failureType: 'testCodeFailure'
          error: |-
            Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: object.

            Check the render method of `InventoryCharts`.
          code: 'ERR_TEST_FAILURE'
          stack: |-
            createFiberFromTypeAndProps (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:5021:28)
            createFiberFromElement (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:5035:14)
            reconcileChildFibersImpl (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:6920:31)
            /home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:7098:33
            reconcileChildren (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:9701:13)
            beginWork (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:12049:13)
            runWithFiberInDEV (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:871:30)
            performUnitOfWork (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:17641:22)
            workLoopSync (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:17469:41)
            renderRootSync (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:17450:11)
          ...
        # Subtest: should_RenderNoDataSlices_WhenDataRecordIsEmpty
        not ok 4 - should_RenderNoDataSlices_WhenDataRecordIsEmpty
          ---
          duration_ms: 5.286014
          location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/reports/InventoryCharts.test.tsx:1:2707'
          failureType: 'testCodeFailure'
          error: |-
            Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: object.

            Check the render method of `InventoryCharts`.
          code: 'ERR_TEST_FAILURE'
          stack: |-
            createFiberFromTypeAndProps (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:5021:28)
            createFiberFromElement (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:5035:14)
            reconcileChildFibersImpl (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:6920:31)
            /home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:7098:33
            reconcileChildren (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:9701:13)
            beginWork (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:12049:13)
            runWithFiberInDEV (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:871:30)
            performUnitOfWork (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:17641:22)
            workLoopSync (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:17469:41)
            renderRootSync (/home/runner/work/logitrackv2/logitrackv2/node_modules/react-dom/cjs/react-dom-client.development.js:17450:11)
          ...
        1..4
    not ok 1 - InventoryCharts() bileşeni
      ---
      duration_ms: 46.178934
      type: 'suite'
      location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/reports/InventoryCharts.test.tsx:1:1604'
      failureType: 'subtestsFailed'
      error: '3 subtests failed'
      code: 'ERR_TEST_FAILURE'
      stack: |-
        async Promise.all (index 0)
      ...
    1..1

not ok 5 - InventoryCharts RTL Component

---

duration_ms: 426.261303
type: 'suite'
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/reports/InventoryCharts.test.tsx:1:1192'
failureType: 'subtestsFailed'
error: '1 subtest failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/reports/@/app/hooks/useCurrency' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/reports/ReportSummaryCards.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338442708:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338442708:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338442708:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/reports/@/app/hooks/useCurrency'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitra

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/reports/ReportSummaryCards.test.tsx

not ok 6 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/reports/ReportSummaryCards.test.tsx

---

duration_ms: 7383.499222
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/reports/ReportSummaryCards.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/reports/@/app/components/skeletons/AnalyticsSkeleton' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/reports/ShipmentCharts.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338442754:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338442754:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338442754:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/reports/@/app/components/skeletons/AnalyticsSkeleton'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/reports/ShipmentCharts.test.tsx

not ok 7 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/reports/ShipmentCharts.test.tsx

---

duration_ms: 7057.032382
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/reports/ShipmentCharts.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/routes/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/routes/routeEfficiency.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338443422:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338443422:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338443422:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/routes/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/routes/routeEfficiency.test.tsx

not ok 8 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/routes/routeEfficiency.test.tsx

---

duration_ms: 7036.442948
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/routes/routeEfficiency.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...
1..8

# tests 16

# suites 4

# pass 3

# fail 13

# cancelled 0

# skipped 0

# todo 0

════════════════════════════════════════════════════════════
📦 Batch 13 / 33 (8 dosya)
════════════════════════════════════════════════════════════
• app/components/dashboard/routes/routeTable/index.test.tsx
• app/components/dashboard/routes/routesMainMap.test.tsx
• app/components/dashboard/shipments/ShipmentAnalytics.test.tsx
• app/components/dashboard/shipments/shipmentKpiCard.test.tsx
• app/components/dashboard/shipments/shipmentTable/index.test.tsx
• app/components/dashboard/users/UserList.test.tsx
• app/components/dashboard/vehicle/VehicleIssuesCard.test.tsx
• app/components/dashboard/vehicle/documentCalenderCard.test.tsx

TAP version 13

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/routes/routeTable/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/routes/routeTable/index.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338451130:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338451130:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338451130:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/routes/routeTable/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/routes/routeTable/index.test.tsx

not ok 1 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/routes/routeTable/index.test.tsx

---

duration_ms: 7256.92598
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/routes/routeTable/index.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/routes/@/app/components/googleMaps/GoogleMapsProvider' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/routes/routesMainMap.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338451138:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338451138:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338451138:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/routes/@/app/components/googleMaps/GoogleMapsProvider'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/routes/routesMainMap.test.tsx

not ok 2 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/routes/routesMainMap.test.tsx

---

duration_ms: 6956.411727
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/routes/routesMainMap.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/shipments/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/shipments/ShipmentAnalytics.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338451161:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338451161:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338451161:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/shipments/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/shipments/ShipmentAnalytics.test.tsx

not ok 3 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/shipments/ShipmentAnalytics.test.tsx

---

duration_ms: 7311.208512
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/shipments/ShipmentAnalytics.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/shipments/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/shipments/shipmentKpiCard.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338451122:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338451122:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338451122:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/shipments/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/shipments/shipmentKpiCard.test.tsx

not ok 4 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/shipments/shipmentKpiCard.test.tsx

---

duration_ms: 7496.579415
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/shipments/shipmentKpiCard.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/shipments/shipmentTable/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/shipments/shipmentTable/index.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338458086:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338458086:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338458086:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/shipments/shipmentTable/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/shipments/shipmentTable/index.test.tsx

not ok 5 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/shipments/shipmentTable/index.test.tsx

---

duration_ms: 6657.510186
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/shipments/shipmentTable/index.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/users/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/users/UserList.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338458401:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338458401:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338458401:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/users/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/users/UserList.test.tsx

not ok 6 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/users/UserList.test.tsx

---

duration_ms: 6485.744437
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/users/UserList.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/vehicle/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/vehicle/VehicleIssuesCard.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338458462:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338458462:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338458462:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/vehicle/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/vehicle/VehicleIssuesCard.test.tsx

not ok 7 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/vehicle/VehicleIssuesCard.test.tsx

---

duration_ms: 6570.501474
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/vehicle/VehicleIssuesCard.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/vehicle/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/vehicle/documentCalenderCard.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338458680:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338458680:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338458680:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/vehicle/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/vehicle/documentCalenderCard.test.tsx

not ok 8 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/vehicle/documentCalenderCard.test.tsx

---

duration_ms: 4721.627707
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/vehicle/documentCalenderCard.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...
1..8

# tests 8

# suites 0

# pass 0

# fail 8

# cancelled 0

# skipped 0

# todo 0

════════════════════════════════════════════════════════════
📦 Batch 14 / 33 (8 dosya)
════════════════════════════════════════════════════════════
• app/components/dashboard/vehicle/maxLoad.test.tsx
• app/components/dashboard/vehicle/toolbar.test.tsx
• app/components/dashboard/vehicle/trailerTable/index.test.tsx
• app/components/dashboard/vehicle/vehicleTable/index.test.tsx
• app/components/dashboard/warehouse/capacityUtilization.test.tsx
• app/components/dashboard/warehouse/recentStockMovements.test.tsx
• app/components/dashboard/warehouse/warehouseList.test.tsx
• app/components/dialogs/company/AddCompanyMemberDialog.test.tsx

TAP version 13

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/vehicle/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/vehicle/maxLoad.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338465762:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338465762:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338465762:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/vehicle/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/vehicle/maxLoad.test.tsx

not ok 1 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/vehicle/maxLoad.test.tsx

---

duration_ms: 4473.974994
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/vehicle/maxLoad.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/vehicle/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/vehicle/toolbar.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338465760:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338465760:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338465760:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/vehicle/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/vehicle/toolbar.test.tsx

not ok 2 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/vehicle/toolbar.test.tsx

---

duration_ms: 7966.226746
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/vehicle/toolbar.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/vehicle/trailerTable/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/vehicle/trailerTable/index.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338465765:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338465765:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338465765:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/vehicle/trailerTable/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/vehicle/trailerTable/index.test.tsx

not ok 3 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/vehicle/trailerTable/index.test.tsx

---

duration_ms: 7268.674074
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/vehicle/trailerTable/index.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/vehicle/vehicleTable/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/vehicle/vehicleTable/index.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338465769:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338465769:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338465769:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/vehicle/vehicleTable/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/vehicle/vehicleTable/index.test.tsx

not ok 4 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/vehicle/vehicleTable/index.test.tsx

---

duration_ms: 6865.946632
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/vehicle/vehicleTable/index.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/warehouse/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/warehouse/capacityUtilization.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338470246:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338470246:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338470246:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/warehouse/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/warehouse/capacityUtilization.test.tsx

not ok 5 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/warehouse/capacityUtilization.test.tsx

---

duration_ms: 7317.114449
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/warehouse/capacityUtilization.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/warehouse/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/warehouse/recentStockMovements.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338472637:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338472637:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338472637:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/warehouse/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/warehouse/recentStockMovements.test.tsx

not ok 6 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/warehouse/recentStockMovements.test.tsx

---

duration_ms: 6552.181172
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/warehouse/recentStockMovements.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/warehouse/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/warehouse/warehouseList.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338473103:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338473103:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338473103:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/warehouse/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/warehouse/warehouseList.test.tsx

not ok 7 - /home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/warehouse/warehouseList.test.tsx

---

duration_ms: 6389.22828
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dashboard/warehouse/warehouseList.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/company/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/company/AddCompanyMemberDialog.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338473830:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338473830:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338473830:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/company/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/company/AddCompanyMemberDialog.test.tsx

not ok 8 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/company/AddCompanyMemberDialog.test.tsx

---

duration_ms: 5741.671585
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/company/AddCompanyMemberDialog.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...
1..8

# tests 8

# suites 0

# pass 0

# fail 8

# cancelled 0

# skipped 0

# todo 0

════════════════════════════════════════════════════════════
📦 Batch 15 / 33 (8 dosya)
════════════════════════════════════════════════════════════
• app/components/dialogs/company/CompanyMemberDetailsDialog.test.tsx
• app/components/dialogs/company/CreateCompanyDialog.test.tsx
• app/components/dialogs/company/EditCompanyMemberDialog.test.tsx
• app/components/dialogs/customer/addCustomerDialog/index.test.tsx
• app/components/dialogs/customer/customerDetailDialog.test.tsx
• app/components/dialogs/customer/editCustomerDialog.test.tsx
• app/components/dialogs/deleteConfirmationDialog.test.tsx
• app/components/dialogs/driver/DriverHistoryDialog.test.tsx

TAP version 13

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/company/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/company/CompanyMemberDetailsDialog.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338480218:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338480218:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338480218:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/company/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/company/CompanyMemberDetailsDialog.test.tsx

not ok 1 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/company/CompanyMemberDetailsDialog.test.tsx

---

duration_ms: 7124.042752
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/company/CompanyMemberDetailsDialog.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/company/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/company/CreateCompanyDialog.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338480217:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338480217:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338480217:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/company/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/company/CreateCompanyDialog.test.tsx

not ok 2 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/company/CreateCompanyDialog.test.tsx

---

duration_ms: 7052.096919
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/company/CreateCompanyDialog.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/company/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/company/EditCompanyMemberDialog.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338480259:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338480259:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338480259:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/company/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/company/EditCompanyMemberDialog.test.tsx

not ok 3 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/company/EditCompanyMemberDialog.test.tsx

---

duration_ms: 7183.608459
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/company/EditCompanyMemberDialog.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/customer/addCustomerDialog/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/customer/addCustomerDialog/index.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338480260:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338480260:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338480260:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/customer/addCustomerDialog/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/customer/addCustomerDialog/index.test.tsx

not ok 4 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/customer/addCustomerDialog/index.test.tsx

---

duration_ms: 7134.35341
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/customer/addCustomerDialog/index.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/customer/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/customer/customerDetailDialog.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338487278:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338487278:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338487278:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/customer/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/customer/customerDetailDialog.test.tsx

not ok 5 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/customer/customerDetailDialog.test.tsx

---

duration_ms: 5811.84063
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/customer/customerDetailDialog.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/customer/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/customer/editCustomerDialog.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338487361:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338487361:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338487361:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/customer/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/customer/editCustomerDialog.test.tsx

not ok 6 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/customer/editCustomerDialog.test.tsx

---

duration_ms: 5489.88396
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/customer/editCustomerDialog.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/deleteConfirmationDialog.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338487433:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338487433:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338487433:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/deleteConfirmationDialog.test.tsx

not ok 7 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/deleteConfirmationDialog.test.tsx

---

duration_ms: 649.083573
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/deleteConfirmationDialog.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/driver/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/driver/DriverHistoryDialog.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338487409:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338487409:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338487409:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/driver/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/driver/DriverHistoryDialog.test.tsx

not ok 8 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/driver/DriverHistoryDialog.test.tsx

---

duration_ms: 5588.27662
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/driver/DriverHistoryDialog.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...
1..8

# tests 8

# suites 0

# pass 0

# fail 8

# cancelled 0

# skipped 0

# todo 0

════════════════════════════════════════════════════════════
📦 Batch 16 / 33 (8 dosya)
════════════════════════════════════════════════════════════
• app/components/dialogs/driver/addDriverDialog/index.test.tsx
• app/components/dialogs/driver/editDriverDialog/index.test.tsx
• app/components/dialogs/driver/index.test.tsx
• app/components/dialogs/inventory/InventoryDetailsDialog.test.tsx
• app/components/dialogs/inventory/InventoryEditDialog.test.tsx
• app/components/dialogs/inventory/addInventoryDialog/index.test.tsx
• app/components/dialogs/logoutConfirmationDialog.test.tsx
• app/components/dialogs/profile/ProfileDialog.test.tsx

TAP version 13

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/driver/addDriverDialog/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/driver/addDriverDialog/index.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338493835:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338493835:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338493835:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/driver/addDriverDialog/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/driver/addDriverDialog/index.test.tsx

not ok 1 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/driver/addDriverDialog/index.test.tsx

---

duration_ms: 6994.532246
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/driver/addDriverDialog/index.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/driver/editDriverDialog/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/driver/editDriverDialog/index.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338493822:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338493822:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338493822:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/driver/editDriverDialog/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/driver/editDriverDialog/index.test.tsx

not ok 2 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/driver/editDriverDialog/index.test.tsx

---

duration_ms: 7254.369936
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/driver/editDriverDialog/index.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/driver/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/driver/index.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338493859:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338493859:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338493859:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/driver/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/driver/index.test.tsx

not ok 3 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/driver/index.test.tsx

---

duration_ms: 7141.913583
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/driver/index.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/inventory/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/inventory/InventoryDetailsDialog.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338493847:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338493847:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338493847:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/inventory/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/inventory/InventoryDetailsDialog.test.tsx

not ok 4 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/inventory/InventoryDetailsDialog.test.tsx

---

duration_ms: 7405.440228
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/inventory/InventoryDetailsDialog.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/inventory/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/inventory/InventoryEditDialog.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338500842:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338500842:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338500842:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/inventory/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/inventory/InventoryEditDialog.test.tsx

not ok 5 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/inventory/InventoryEditDialog.test.tsx

---

duration_ms: 5625.374223
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/inventory/InventoryEditDialog.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/inventory/addInventoryDialog/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/inventory/addInventoryDialog/index.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338500979:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338500979:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338500979:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/inventory/addInventoryDialog/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/inventory/addInventoryDialog/index.test.tsx

not ok 6 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/inventory/addInventoryDialog/index.test.tsx

---

duration_ms: 5765.733623
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/inventory/addInventoryDialog/index.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/logoutConfirmationDialog.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338501123:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338501123:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338501123:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/logoutConfirmationDialog.test.tsx

not ok 7 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/logoutConfirmationDialog.test.tsx

---

duration_ms: 943.395676
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/logoutConfirmationDialog.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/profile/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/profile/ProfileDialog.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338501338:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338501338:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338501338:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/profile/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/profile/ProfileDialog.test.tsx

not ok 8 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/profile/ProfileDialog.test.tsx

---

duration_ms: 5463.851597
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/profile/ProfileDialog.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...
1..8

# tests 8

# suites 0

# pass 0

# fail 8

# cancelled 0

# skipped 0

# todo 0

════════════════════════════════════════════════════════════
📦 Batch 17 / 33 (8 dosya)
════════════════════════════════════════════════════════════
• app/components/dialogs/profile/components/ProfileHeader.test.tsx
• app/components/dialogs/profile/components/ProfileTab.test.tsx
• app/components/dialogs/profile/components/SecurityTab.test.tsx
• app/components/dialogs/routes/addRouteDialog/index.test.tsx
• app/components/dialogs/routes/edit-route-dialog.test.tsx
• app/components/dialogs/routes/index.test.tsx
• app/components/dialogs/settings/SettingsDialog.test.tsx
• app/components/dialogs/settings/components/AppearanceTab.test.tsx

TAP version 13

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/profile/components/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/profile/components/ProfileHeader.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338507489:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338507489:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338507489:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/profile/components/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/profile/components/ProfileHeader.test.tsx

not ok 1 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/profile/components/ProfileHeader.test.tsx

---

duration_ms: 7470.845392
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/profile/components/ProfileHeader.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/profile/components/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/profile/components/ProfileTab.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338507490:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338507490:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338507490:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/profile/components/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/profile/components/ProfileTab.test.tsx

not ok 2 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/profile/components/ProfileTab.test.tsx

---

duration_ms: 7450.189976
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/profile/components/ProfileTab.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/profile/components/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/profile/components/SecurityTab.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338507493:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338507493:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338507493:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/profile/components/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/profile/components/SecurityTab.test.tsx

not ok 3 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/profile/components/SecurityTab.test.tsx

---

duration_ms: 7386.845261
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/profile/components/SecurityTab.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/routes/addRouteDialog/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/routes/addRouteDialog/index.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338507490:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338507490:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338507490:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/routes/addRouteDialog/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/routes/addRouteDialog/index.test.tsx

not ok 4 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/routes/addRouteDialog/index.test.tsx

---

duration_ms: 6688.345536
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/routes/addRouteDialog/index.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/routes/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/routes/edit-route-dialog.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338514162:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338514162:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338514162:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/routes/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/routes/edit-route-dialog.test.tsx

not ok 5 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/routes/edit-route-dialog.test.tsx

---

duration_ms: 7259.899517
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/routes/edit-route-dialog.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/routes/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/routes/index.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338514903:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338514903:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338514903:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/routes/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/routes/index.test.tsx

not ok 6 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/routes/index.test.tsx

---

duration_ms: 6948.722741
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/routes/index.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/settings/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/settings/SettingsDialog.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338514973:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338514973:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338514973:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/settings/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/settings/SettingsDialog.test.tsx

not ok 7 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/settings/SettingsDialog.test.tsx

---

duration_ms: 7032.857756
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/settings/SettingsDialog.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/settings/components/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/settings/components/AppearanceTab.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338514954:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338514954:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338514954:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/settings/components/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/settings/components/AppearanceTab.test.tsx

not ok 8 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/settings/components/AppearanceTab.test.tsx

---

duration_ms: 6941.418588
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/settings/components/AppearanceTab.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...
1..8

# tests 8

# suites 0

# pass 0

# fail 8

# cancelled 0

# skipped 0

# todo 0

════════════════════════════════════════════════════════════
📦 Batch 18 / 33 (8 dosya)
════════════════════════════════════════════════════════════
• app/components/dialogs/settings/components/NotificationsTab.test.tsx
• app/components/dialogs/settings/components/RegionalTab.test.tsx
• app/components/dialogs/settings/components/SettingsHeader.test.tsx
• app/components/dialogs/shared/DocumentViewerDialog.test.tsx
• app/components/dialogs/shipment/addShipmentDialog/index.test.tsx
• app/components/dialogs/shipment/edit-shipment-dialog.test.tsx
• app/components/dialogs/shipment/shipmentDetailDialog.test.tsx
• app/components/dialogs/vehicle/addTrailerDialog/index.test.tsx

TAP version 13

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/settings/components/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/settings/components/NotificationsTab.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338522701:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338522701:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338522701:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/settings/components/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/settings/components/NotificationsTab.test.tsx

not ok 1 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/settings/components/NotificationsTab.test.tsx

---

duration_ms: 7328.49912
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/settings/components/NotificationsTab.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/settings/components/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/settings/components/RegionalTab.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338522707:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338522707:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338522707:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/settings/components/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/settings/components/RegionalTab.test.tsx

not ok 2 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/settings/components/RegionalTab.test.tsx

---

duration_ms: 7377.601815
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/settings/components/RegionalTab.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/settings/components/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/settings/components/SettingsHeader.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338522724:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338522724:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338522724:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/settings/components/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/settings/components/SettingsHeader.test.tsx

not ok 3 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/settings/components/SettingsHeader.test.tsx

---

duration_ms: 7394.91379
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/settings/components/SettingsHeader.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/shared/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/shared/DocumentViewerDialog.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338522707:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338522707:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338522707:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/shared/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/shared/DocumentViewerDialog.test.tsx

not ok 4 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/shared/DocumentViewerDialog.test.tsx

---

duration_ms: 6857.195454
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/shared/DocumentViewerDialog.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/shipment/addShipmentDialog/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/shipment/addShipmentDialog/index.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338529569:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338529569:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338529569:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/shipment/addShipmentDialog/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/shipment/addShipmentDialog/index.test.tsx

not ok 5 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/shipment/addShipmentDialog/index.test.tsx

---

duration_ms: 6737.898192
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/shipment/addShipmentDialog/index.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/shipment/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/shipment/edit-shipment-dialog.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338530062:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338530062:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338530062:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/shipment/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/shipment/edit-shipment-dialog.test.tsx

not ok 6 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/shipment/edit-shipment-dialog.test.tsx

---

duration_ms: 6244.261549
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/shipment/edit-shipment-dialog.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/shipment/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/shipment/shipmentDetailDialog.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338530114:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338530114:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338530114:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/shipment/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/shipment/shipmentDetailDialog.test.tsx

not ok 7 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/shipment/shipmentDetailDialog.test.tsx

---

duration_ms: 6418.719383
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/shipment/shipmentDetailDialog.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/addTrailerDialog/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/addTrailerDialog/index.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338530247:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338530247:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338530247:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/addTrailerDialog/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/addTrailerDialog/index.test.tsx

not ok 8 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/addTrailerDialog/index.test.tsx

---

duration_ms: 4702.126643
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/addTrailerDialog/index.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...
1..8

# tests 8

# suites 0

# pass 0

# fail 8

# cancelled 0

# skipped 0

# todo 0

════════════════════════════════════════════════════════════
📦 Batch 19 / 33 (8 dosya)
════════════════════════════════════════════════════════════
• app/components/dialogs/vehicle/addVehicleDialog/index.test.tsx
• app/components/dialogs/vehicle/assignDriverDialog/index.test.tsx
• app/components/dialogs/vehicle/editTrailerDialog/index.test.tsx
• app/components/dialogs/vehicle/editVehicleDialog/index.test.tsx
• app/components/dialogs/vehicle/fuelLogDialog/index.test.tsx
• app/components/dialogs/vehicle/issueDetailDialog/index.test.tsx
• app/components/dialogs/vehicle/maintenanceDetailDialog/index.test.tsx
• app/components/dialogs/vehicle/maintenanceRecordDialog/index.test.tsx

TAP version 13

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/addVehicleDialog/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/addVehicleDialog/index.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338537236:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338537236:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338537236:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/addVehicleDialog/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/addVehicleDialog/index.test.tsx

not ok 1 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/addVehicleDialog/index.test.tsx

---

duration_ms: 7498.362334
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/addVehicleDialog/index.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/assignDriverDialog/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/assignDriverDialog/index.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338537246:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338537246:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338537246:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/assignDriverDialog/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/assignDriverDialog/index.test.tsx

not ok 2 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/assignDriverDialog/index.test.tsx

---

duration_ms: 7596.601292
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/assignDriverDialog/index.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/editTrailerDialog/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/editTrailerDialog/index.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338537244:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338537244:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338537244:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/editTrailerDialog/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/editTrailerDialog/index.test.tsx

not ok 3 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/editTrailerDialog/index.test.tsx

---

duration_ms: 4181.013816
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/editTrailerDialog/index.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/editVehicleDialog/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/editVehicleDialog/index.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338537247:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338537247:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338537247:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/editVehicleDialog/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/editVehicleDialog/index.test.tsx

not ok 4 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/editVehicleDialog/index.test.tsx

---

duration_ms: 7411.944858
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/editVehicleDialog/index.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/fuelLogDialog/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/fuelLogDialog/index.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338541491:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338541491:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338541491:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/fuelLogDialog/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/fuelLogDialog/index.test.tsx

not ok 5 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/fuelLogDialog/index.test.tsx

---

duration_ms: 6854.15358
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/fuelLogDialog/index.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/issueDetailDialog/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/issueDetailDialog/index.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338544667:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338544667:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338544667:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/issueDetailDialog/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/issueDetailDialog/index.test.tsx

not ok 6 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/issueDetailDialog/index.test.tsx

---

duration_ms: 6242.181474
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/issueDetailDialog/index.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/maintenanceDetailDialog/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/maintenanceDetailDialog/index.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338544738:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338544738:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338544738:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/maintenanceDetailDialog/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/maintenanceDetailDialog/index.test.tsx

not ok 7 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/maintenanceDetailDialog/index.test.tsx

---

duration_ms: 6037.254574
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/maintenanceDetailDialog/index.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/maintenanceRecordDialog/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/maintenanceRecordDialog/index.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338544894:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338544894:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338544894:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/maintenanceRecordDialog/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/maintenanceRecordDialog/index.test.tsx

not ok 8 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/maintenanceRecordDialog/index.test.tsx

---

duration_ms: 6273.17512
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/maintenanceRecordDialog/index.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...
1..8

# tests 8

# suites 0

# pass 0

# fail 8

# cancelled 0

# skipped 0

# todo 0

════════════════════════════════════════════════════════════
📦 Batch 20 / 33 (8 dosya)
════════════════════════════════════════════════════════════
• app/components/dialogs/vehicle/reportIssueDialog/index.test.tsx
• app/components/dialogs/vehicle/trailerAssignmentDialog/index.test.tsx
• app/components/dialogs/vehicle/uploadDocumentDialog/index.test.tsx
• app/components/dialogs/vehicle/vehicleDetailsDialog/index.test.tsx
• app/components/dialogs/warehouse/addWarehouseDialog/index.test.tsx
• app/components/dialogs/warehouse/editWarehouseDialog/index.test.tsx
• app/components/dialogs/warehouse/warehouseDetailsDialog/index.test.tsx
• app/components/footer/index.test.tsx

TAP version 13

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/reportIssueDialog/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/reportIssueDialog/index.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338551857:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338551857:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338551857:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/reportIssueDialog/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/reportIssueDialog/index.test.tsx

not ok 1 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/reportIssueDialog/index.test.tsx

---

duration_ms: 7266.004951
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/reportIssueDialog/index.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/trailerAssignmentDialog/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/trailerAssignmentDialog/index.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338551842:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338551842:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338551842:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/trailerAssignmentDialog/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/trailerAssignmentDialog/index.test.tsx

not ok 2 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/trailerAssignmentDialog/index.test.tsx

---

duration_ms: 7038.481757
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/trailerAssignmentDialog/index.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/uploadDocumentDialog/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/uploadDocumentDialog/index.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338551908:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338551908:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338551908:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/uploadDocumentDialog/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/uploadDocumentDialog/index.test.tsx

not ok 3 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/uploadDocumentDialog/index.test.tsx

---

duration_ms: 7383.849038
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/uploadDocumentDialog/index.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/vehicleDetailsDialog/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/vehicleDetailsDialog/index.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338551881:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338551881:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338551881:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/vehicleDetailsDialog/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/vehicleDetailsDialog/index.test.tsx

not ok 4 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/vehicleDetailsDialog/index.test.tsx

---

duration_ms: 7168.54874
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/vehicle/vehicleDetailsDialog/index.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/warehouse/addWarehouseDialog/@/app/lib/controllers/warehouse' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/warehouse/addWarehouseDialog/index.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338558911:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338558911:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338558911:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/warehouse/addWarehouseDialog/@/app/lib/controllers/warehouse'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/warehouse/addWarehouseDialog/index.test.tsx

not ok 5 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/warehouse/addWarehouseDialog/index.test.tsx

---

duration_ms: 621.800405
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/warehouse/addWarehouseDialog/index.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/warehouse/editWarehouseDialog/@/app/lib/controllers/warehouse' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/warehouse/editWarehouseDialog/index.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338559068:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338559068:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338559068:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/warehouse/editWarehouseDialog/@/app/lib/controllers/warehouse'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/warehouse/editWarehouseDialog/index.test.tsx

not ok 6 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/warehouse/editWarehouseDialog/index.test.tsx

---

duration_ms: 631.482817
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/warehouse/editWarehouseDialog/index.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/warehouse/warehouseDetailsDialog/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/warehouse/warehouseDetailsDialog/index.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338559139:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338559139:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338559139:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/warehouse/warehouseDetailsDialog/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/warehouse/warehouseDetailsDialog/index.test.tsx

not ok 7 - /home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/warehouse/warehouseDetailsDialog/index.test.tsx

---

duration_ms: 575.94013
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/dialogs/warehouse/warehouseDetailsDialog/index.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/footer/@/app/lib/language/language' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/footer/index.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338559360:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338559360:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338559360:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/footer/@/app/lib/language/language'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/footer/index.test.tsx

not ok 8 - /home/runner/work/logitrackv2/logitrackv2/app/components/footer/index.test.tsx

---

duration_ms: 569.704672
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/footer/index.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...
1..8

# tests 8

# suites 0

# pass 0

# fail 8

# cancelled 0

# skipped 0

# todo 0

════════════════════════════════════════════════════════════
📦 Batch 21 / 33 (8 dosya)
════════════════════════════════════════════════════════════
• app/components/forms/register/signUpStepper.test.tsx
• app/components/forms/register/step1PersonalInfo.test.tsx
• app/components/forms/register/step2Security.test.tsx
• app/components/forms/register/step3Profile.test.tsx
• app/components/forms/signInForm.test.tsx
• app/components/forms/signUpForm.test.tsx
• app/components/googleMaps/AddressAutocomplete.test.tsx
• app/components/googleMaps/DirectionsMap.test.tsx

TAP version 13

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/forms/register/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/forms/register/signUpStepper.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338560573:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338560573:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338560573:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/forms/register/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/forms/register/signUpStepper.test.tsx

not ok 1 - /home/runner/work/logitrackv2/logitrackv2/app/components/forms/register/signUpStepper.test.tsx

---

duration_ms: 662.83577
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/forms/register/signUpStepper.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/forms/register/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/forms/register/step1PersonalInfo.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338560585:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338560585:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338560585:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/forms/register/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/forms/register/step1PersonalInfo.test.tsx

not ok 2 - /home/runner/work/logitrackv2/logitrackv2/app/components/forms/register/step1PersonalInfo.test.tsx

---

duration_ms: 714.582865
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/forms/register/step1PersonalInfo.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/forms/register/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/forms/register/step2Security.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338560603:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338560603:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338560603:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/forms/register/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/forms/register/step2Security.test.tsx

not ok 3 - /home/runner/work/logitrackv2/logitrackv2/app/components/forms/register/step2Security.test.tsx

---

duration_ms: 623.65767
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/forms/register/step2Security.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/forms/register/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/forms/register/step3Profile.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338560615:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338560615:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338560615:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/forms/register/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/forms/register/step3Profile.test.tsx

not ok 4 - /home/runner/work/logitrackv2/logitrackv2/app/components/forms/register/step3Profile.test.tsx

---

duration_ms: 704.422925
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/forms/register/step3Profile.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/forms/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/forms/signInForm.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338561222:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338561222:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338561222:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/forms/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/forms/signInForm.test.tsx

not ok 5 - /home/runner/work/logitrackv2/logitrackv2/app/components/forms/signInForm.test.tsx

---

duration_ms: 716.321437
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/forms/signInForm.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/forms/@/app/lib/language/language' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/forms/signUpForm.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338561268:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338561268:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338561268:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/forms/@/app/lib/language/language'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/forms/signUpForm.test.tsx

not ok 6 - /home/runner/work/logitrackv2/logitrackv2/app/components/forms/signUpForm.test.tsx

---

duration_ms: 664.060392
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/forms/signUpForm.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/googleMaps/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/googleMaps/AddressAutocomplete.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338561321:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338561321:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338561321:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/googleMaps/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/googleMaps/AddressAutocomplete.test.tsx

not ok 7 - /home/runner/work/logitrackv2/logitrackv2/app/components/googleMaps/AddressAutocomplete.test.tsx

---

duration_ms: 654.871344
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/googleMaps/AddressAutocomplete.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# (node:7569) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# Subtest: DirectionsMap Component

    # Subtest: DirectionsMap() bileşeni
        # Subtest: should_InitializeWithoutErrors_WhenRendered
        ok 1 - should_InitializeWithoutErrors_WhenRendered
          ---
          duration_ms: 8.177811
          ...
        1..1
    ok 1 - DirectionsMap() bileşeni
      ---
      duration_ms: 8.65429
      type: 'suite'
      ...
    1..1

ok 8 - DirectionsMap Component

---

duration_ms: 37.050057
type: 'suite'
...
1..8

# tests 8

# suites 2

# pass 1

# fail 7

# cancelled 0

# skipped 0

# todo 0

════════════════════════════════════════════════════════════
📦 Batch 22 / 33 (8 dosya)
════════════════════════════════════════════════════════════
• app/components/googleMaps/GoogleMapsProvider.test.tsx
• app/components/googleMaps/MapPicker.test.tsx
• app/components/googleMaps/MapWithMarker.test.tsx
• app/components/googleMaps/maps.test.tsx
• app/components/how-it-works/TimelineSection.test.tsx
• app/components/inputs/customTextArea.test.tsx
• app/components/landing/FeaturesSection.test.tsx
• app/components/landing/HeroSection.test.tsx

TAP version 13

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/googleMaps/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/googleMaps/GoogleMapsProvider.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338562754:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338562754:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338562754:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/googleMaps/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/googleMaps/GoogleMapsProvider.test.tsx

not ok 1 - /home/runner/work/logitrackv2/logitrackv2/app/components/googleMaps/GoogleMapsProvider.test.tsx

---

duration_ms: 729.644119
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/googleMaps/GoogleMapsProvider.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# (node:7662) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# Subtest: MapPicker Component

    # Subtest: MapPicker() bileşeni
        # Subtest: should_InitializeWithoutErrors_WhenRendered
        ok 1 - should_InitializeWithoutErrors_WhenRendered
          ---
          duration_ms: 21.808154
          ...
        1..1
    ok 1 - MapPicker() bileşeni
      ---
      duration_ms: 22.444201
      type: 'suite'
      ...
    1..1

ok 2 - MapPicker Component

---

duration_ms: 75.267143
type: 'suite'
...

# (node:7668) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# Functions are not valid as a React child. This may happen if you return Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.

# Subtest: MapWithMarker Component

    # Subtest: MapWithMarker() bileşeni
        # Subtest: should_InitializeWithoutErrors_WhenRendered
        ok 1 - should_InitializeWithoutErrors_WhenRendered
          ---
          duration_ms: 16.80084
          ...
        1..1
    ok 1 - MapWithMarker() bileşeni
      ---
      duration_ms: 17.483805
      type: 'suite'
      ...
    1..1

ok 3 - MapWithMarker Component

---

duration_ms: 78.616323
type: 'suite'
...

# (node:7669) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# Subtest: maps Component

    # Subtest: GoogleMapDemo() bileşeni
        # Subtest: should_InitializeWithoutErrors_WhenRendered
        ok 1 - should_InitializeWithoutErrors_WhenRendered
          ---
          duration_ms: 19.154494
          ...
        1..1
    ok 1 - GoogleMapDemo() bileşeni
      ---
      duration_ms: 19.933027
      type: 'suite'
      ...
    1..1

ok 4 - maps Component

---

duration_ms: 90.361362
type: 'suite'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/how-it-works/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/how-it-works/TimelineSection.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338563501:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338563501:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338563501:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/how-it-works/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/how-it-works/TimelineSection.test.tsx

not ok 5 - /home/runner/work/logitrackv2/logitrackv2/app/components/how-it-works/TimelineSection.test.tsx

---

duration_ms: 664.790834
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/how-it-works/TimelineSection.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# (node:7745) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# Subtest: CustomTextArea Component

    # Subtest: CustomTextArea() bileşeni
        # Subtest: should_InitializeWithoutErrors_WhenRenderedAsTextField
        ok 1 - should_InitializeWithoutErrors_WhenRenderedAsTextField
          ---
          duration_ms: 3.287875
          ...
        # Subtest: should_InitializeWithoutErrors_WhenRenderedAsSelect
        ok 2 - should_InitializeWithoutErrors_WhenRenderedAsSelect
          ---
          duration_ms: 0.585572
          ...
        1..2
    ok 1 - CustomTextArea() bileşeni
      ---
      duration_ms: 4.658163
      type: 'suite'
      ...
    1..1

ok 6 - CustomTextArea Component

---

duration_ms: 51.872198
type: 'suite'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/landing/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/landing/FeaturesSection.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338563555:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338563555:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338563555:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/landing/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/landing/FeaturesSection.test.tsx

not ok 7 - /home/runner/work/logitrackv2/logitrackv2/app/components/landing/FeaturesSection.test.tsx

---

duration_ms: 624.782197
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/landing/FeaturesSection.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/landing/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/landing/HeroSection.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338563569:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338563569:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338563569:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/landing/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/landing/HeroSection.test.tsx

not ok 8 - /home/runner/work/logitrackv2/logitrackv2/app/components/landing/HeroSection.test.tsx

---

duration_ms: 607.658583
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/landing/HeroSection.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...
1..8

# tests 9

# suites 8

# pass 5

# fail 4

# cancelled 0

# skipped 0

# todo 0

════════════════════════════════════════════════════════════
📦 Batch 23 / 33 (8 dosya)
════════════════════════════════════════════════════════════
• app/components/landing/LandingFooter.test.tsx
• app/components/landing/LandingHeaderAuth.test.tsx
• app/components/landing/LandingNavbar.test.tsx
• app/components/landing/OperationsDashboard.test.tsx
• app/components/landing/SocialProof.test.tsx
• app/components/nav/LanguageSwitcher.test.tsx
• app/components/nav/UserAccountNav.test.tsx
• app/components/notifications/NotificationBell.test.tsx

TAP version 13

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/landing/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/landing/LandingFooter.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338564916:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338564916:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338564916:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/landing/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/landing/LandingFooter.test.tsx

not ok 1 - /home/runner/work/logitrackv2/logitrackv2/app/components/landing/LandingFooter.test.tsx

---

duration_ms: 619.368703
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/landing/LandingFooter.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/landing/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/landing/LandingHeaderAuth.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338564895:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338564895:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338564895:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/landing/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/landing/LandingHeaderAuth.test.tsx

not ok 2 - /home/runner/work/logitrackv2/logitrackv2/app/components/landing/LandingHeaderAuth.test.tsx

---

duration_ms: 619.192044
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/landing/LandingHeaderAuth.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/landing/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/landing/LandingNavbar.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338564889:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338564889:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338564889:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/landing/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/landing/LandingNavbar.test.tsx

not ok 3 - /home/runner/work/logitrackv2/logitrackv2/app/components/landing/LandingNavbar.test.tsx

---

duration_ms: 562.969329
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/landing/LandingNavbar.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/landing/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/landing/OperationsDashboard.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338564906:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338564906:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338564906:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/landing/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/landing/OperationsDashboard.test.tsx

not ok 4 - /home/runner/work/logitrackv2/logitrackv2/app/components/landing/OperationsDashboard.test.tsx

---

duration_ms: 595.145299
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/landing/OperationsDashboard.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/landing/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/landing/SocialProof.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338565475:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338565475:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338565475:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/landing/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/landing/SocialProof.test.tsx

not ok 5 - /home/runner/work/logitrackv2/logitrackv2/app/components/landing/SocialProof.test.tsx

---

duration_ms: 559.746662
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/landing/SocialProof.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/nav/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/nav/LanguageSwitcher.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338565511:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338565511:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338565511:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/nav/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/nav/LanguageSwitcher.test.tsx

not ok 6 - /home/runner/work/logitrackv2/logitrackv2/app/components/nav/LanguageSwitcher.test.tsx

---

duration_ms: 635.88056
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/nav/LanguageSwitcher.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/nav/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/nav/UserAccountNav.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338565499:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338565499:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338565499:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/nav/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/nav/UserAccountNav.test.tsx

not ok 7 - /home/runner/work/logitrackv2/logitrackv2/app/components/nav/UserAccountNav.test.tsx

---

duration_ms: 578.913033
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/nav/UserAccountNav.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/notifications/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/notifications/NotificationBell.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338565548:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338565548:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338565548:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/notifications/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/notifications/NotificationBell.test.tsx

not ok 8 - /home/runner/work/logitrackv2/logitrackv2/app/components/notifications/NotificationBell.test.tsx

---

duration_ms: 604.864018
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/notifications/NotificationBell.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...
1..8

# tests 8

# suites 0

# pass 0

# fail 8

# cancelled 0

# skipped 0

# todo 0

════════════════════════════════════════════════════════════
📦 Batch 24 / 33 (8 dosya)
════════════════════════════════════════════════════════════
• app/components/rating.test.tsx
• app/components/scrollbar.test.tsx
• app/components/sidebar/index.test.tsx
• app/components/sidebar/listItem.test.tsx
• app/components/skeletons/AnalyticsSkeleton.test.tsx
• app/components/skeletons/KpiSkeleton.test.tsx
• app/components/skeletons/TableSkeleton.test.tsx
• app/components/toast.test.tsx

TAP version 13

# Subtest: CustomRating Component

    # Subtest: CustomRating() bileşeni
        # Subtest: should_Return5Stars_WhenValueIs5
        ok 1 - should_Return5Stars_WhenValueIs5
          ---
          duration_ms: 1.994822
          ...
        # Subtest: should_Apply0.25Spacing_WhenSizeIssmall
        ok 2 - should_Apply0.25Spacing_WhenSizeIssmall
          ---
          duration_ms: 0.323835
          ...
        # Subtest: should_Apply0.5Spacing_WhenSizeIsmedium
        ok 3 - should_Apply0.5Spacing_WhenSizeIsmedium
          ---
          duration_ms: 0.217175
          ...
        # Subtest: should_Apply0.75Spacing_WhenSizeIslarge
        ok 4 - should_Apply0.75Spacing_WhenSizeIslarge
          ---
          duration_ms: 0.20904
          ...
        1..4
        ok 1 - CustomRating() bileşeni
      ---
      duration_ms: 3.370359
      type: 'suite'
      ...
    1..1

ok 1 - CustomRating Component

---

duration_ms: 1967.010329
type: 'suite'
...

# Subtest: Scrollbar Styles Service

    # Subtest: getScrollbarStyles() fonksiyonu
        # Subtest: should_ReturnEmptyObject_WhenThemeHasNoScrollPalette
        ok 1 - should_ReturnEmptyObject_WhenThemeHasNoScrollPalette
          ---
          duration_ms: 2.4546
          ...
        # Subtest: should_ReturnScrollbarStyles_WhenThemeIsValid
        ok 2 - should_ReturnScrollbarStyles_WhenThemeIsValid
          ---
          duration_ms: 0.788792
          ...
        1..2
    ok 1 - getScrollbarStyles() fonksiyonu
      ---
      duration_ms: 4.183287
      type: 'suite'
      ...
    1..1

ok 2 - Scrollbar Styles Service

---

duration_ms: 23.255517
type: 'suite'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/sidebar/@/app/lib/controllers/session' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/sidebar/index.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338566869:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338566869:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338566869:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/sidebar/@/app/lib/controllers/session'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/sidebar/index.test.tsx

not ok 3 - /home/runner/work/logitrackv2/logitrackv2/app/components/sidebar/index.test.tsx

---

duration_ms: 604.395201
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/sidebar/index.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/sidebar/@/app/lib/language/navigation' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/sidebar/listItem.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338566890:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338566890:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338566890:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/sidebar/@/app/lib/language/navigation'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/sidebar/listItem.test.tsx

not ok 4 - /home/runner/work/logitrackv2/logitrackv2/app/components/sidebar/listItem.test.tsx

---

duration_ms: 616.827912
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/sidebar/listItem.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/skeletons/@/app/components/cards/card' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/skeletons/AnalyticsSkeleton.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338567485:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338567485:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338567485:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/skeletons/@/app/components/cards/card'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/skeletons/AnalyticsSkeleton.test.tsx

not ok 5 - /home/runner/work/logitrackv2/logitrackv2/app/components/skeletons/AnalyticsSkeleton.test.tsx

---

duration_ms: 626.063057
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/skeletons/AnalyticsSkeleton.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# (node:8110) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# Subtest: KpiSkeleton Component

    # Subtest: KpiSkeleton() bileşeni
        # Subtest: should_CallUseThemeAndRender_WhenCalled
        ok 1 - should_CallUseThemeAndRender_WhenCalled
          ---
          duration_ms: 6.533171
          ...
        # Subtest: should_RenderSpecificCount_WhenCountPropProvided
        ok 2 - should_RenderSpecificCount_WhenCountPropProvided
          ---
          duration_ms: 1.071369
          ...
        1..2
    ok 1 - KpiSkeleton() bileşeni
      ---
      duration_ms: 8.79383
      type: 'suite'
      ...
    1..1

ok 6 - KpiSkeleton Component

---

duration_ms: 51.378506
type: 'suite'
...

# (node:8121) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# Subtest: TableSkeleton Component

    # Subtest: TableSkeleton() bileşeni
        # Subtest: should_CallUseThemeAndRender_WhenCalled
        ok 1 - should_CallUseThemeAndRender_WhenCalled
          ---
          duration_ms: 5.570956
          ...
        # Subtest: should_HandleCustomRowsAndColumns_WhenPropsProvided
        ok 2 - should_HandleCustomRowsAndColumns_WhenPropsProvided
          ---
          duration_ms: 1.681518
          ...
        1..2
    ok 1 - TableSkeleton() bileşeni
      ---
      duration_ms: 8.05982
      type: 'suite'
      ...
    1..1

ok 7 - TableSkeleton Component

---

duration_ms: 45.923887
type: 'suite'
...

# (node:8163) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# Subtest: Toast Component

    # Subtest: Toaster() bileşeni
        # Subtest: should_ApplyTheme_AndReturnSonnerToaster
        ok 1 - should_ApplyTheme_AndReturnSonnerToaster
          ---
          duration_ms: 2.831554
          ...
        1..1
    ok 1 - Toaster() bileşeni
      ---
      duration_ms: 3.41373
      type: 'suite'
      ...
    1..1

ok 8 - Toast Component

---

duration_ms: 470.757719
type: 'suite'
...
1..8

# tests 14

# suites 10

# pass 11

# fail 3

# cancelled 0

# skipped 0

# todo 0

════════════════════════════════════════════════════════════
📦 Batch 25 / 33 (8 dosya)
════════════════════════════════════════════════════════════
• app/components/ui/AuthButton.test.tsx
• app/components/ui/DataTable/index.test.tsx
• app/global-error.test.tsx
• app/hooks/useAnalytics.test.ts
• app/hooks/useCompany.test.ts
• app/hooks/useCurrency.test.ts
• app/hooks/useCustomers.test.ts
• app/hooks/useDateSettings.test.ts

TAP version 13

# (node:8220) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# Subtest: AuthButton Component

    # Subtest: AuthButton() bileşeni
        # Subtest: should_ReturnButtonWithChildren_WhenNotLoading
        ok 1 - should_ReturnButtonWithChildren_WhenNotLoading
          ---
          duration_ms: 8.347647
          ...
        # Subtest: should_ReturnDisabledButton_WhenLoadingIsTrue
        ok 2 - should_ReturnDisabledButton_WhenLoadingIsTrue
          ---
          duration_ms: 0.87887
          ...
        1..2
    ok 1 - AuthButton() bileşeni
      ---
      duration_ms: 10.430833
      type: 'suite'
      ...
    1..1

ok 1 - AuthButton Component

---

duration_ms: 59.122585
type: 'suite'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/components/ui/DataTable/@/app/lib/language/DictionaryContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/components/ui/DataTable/index.test.tsx

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338570221:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338570221:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338570221:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/components/ui/DataTable/@/app/lib/language/DictionaryContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/components/ui/DataTable/index.test.tsx

not ok 2 - /home/runner/work/logitrackv2/logitrackv2/app/components/ui/DataTable/index.test.tsx

---

duration_ms: 660.538472
location: '/home/runner/work/logitrackv2/logitrackv2/app/components/ui/DataTable/index.test.tsx:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# (node:8227) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# Subtest: GlobalError Component

    # Subtest: GlobalError() Render Testleri
        # Subtest: should_RenderGenericError_AndLogToConsole
        ok 1 - should_RenderGenericError_AndLogToConsole
          ---
          duration_ms: 32.024709
          ...
        1..1
    ok 1 - GlobalError() Render Testleri
      ---
      duration_ms: 32.485889
      type: 'suite'
      ...
    1..1

ok 3 - GlobalError Component

---

duration_ms: 55.423541
type: 'suite'
...

# (node:8228) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# Subtest: useAnalytics Hook

    # Subtest: useAnalyticsData() metodu
        # Subtest: should_ReturnInitialState_WhenQueryIsLoading
        not ok 1 - should_ReturnInitialState_WhenQueryIsLoading
          ---
          duration_ms: 0
          location: '/home/runner/work/logitrackv2/logitrackv2/app/hooks/useAnalytics.test.ts:1:1162'
          failureType: 'cancelledByParent'
          error: 'test did not finish before its parent and was cancelled'
          code: 'ERR_TEST_FAILURE'
          ...
        # Subtest: should_ReturnData_WhenQuerySucceeds
        not ok 2 - should_ReturnData_WhenQuerySucceeds
          ---
          duration_ms: 0
          location: '/home/runner/work/logitrackv2/logitrackv2/app/hooks/useAnalytics.test.ts:1:1537'
          failureType: 'cancelledByParent'
          error: 'test did not finish before its parent and was cancelled'
          code: 'ERR_TEST_FAILURE'
          ...
        # Subtest: should_CallInvalidateQueries_WhenFetchAnalyticsIsCalled
        not ok 3 - should_CallInvalidateQueries_WhenFetchAnalyticsIsCalled
          ---
          duration_ms: 0
          location: '/home/runner/work/logitrackv2/logitrackv2/app/hooks/useAnalytics.test.ts:1:1861'
          failureType: 'cancelledByParent'
          error: 'test did not finish before its parent and was cancelled'
          code: 'ERR_TEST_FAILURE'
          ...
        1..3
    not ok 1 - useAnalyticsData() metodu
      ---
      duration_ms: 0
      type: 'suite'
      location: '/home/runner/work/logitrackv2/logitrackv2/app/hooks/useAnalytics.test.ts:1:1120'
      failureType: 'cancelledByParent'
      error: 'test did not finish before its parent and was cancelled'
      code: 'ERR_TEST_FAILURE'
      ...
    1..1

not ok 4 - useAnalytics Hook

---

duration_ms: 20.245706
type: 'suite'
location: '/home/runner/work/logitrackv2/logitrackv2/app/hooks/useAnalytics.test.ts:1:674'
failureType: 'hookFailed'
error: "Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/hooks/@/app/lib/query-keys/analytics.keys' imported from /home/runner/work/logitrackv2/logitrackv2/app/hooks/useAnalytics.ts"
code: 'ERR_MODULE_NOT_FOUND'
stack: |-
finalizeResolution (node:internal/modules/esm/resolve:283:11)
moduleResolve (node:internal/modules/esm/resolve:952:10)
defaultResolve (node:internal/modules/esm/resolve:1188:11)
nextResolve (node:internal/modules/esm/hooks:864:28)
resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338570230:2:3744)
async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338570230:2:4237)
async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338570230:2:5355)
async nextResolve (node:internal/modules/esm/hooks:864:22)
async nextResolve (node:internal/modules/esm/hooks:864:22)
async Hooks.resolve (node:internal/modules/esm/hooks:306:24)
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/hooks/@/app/lib/controllers/company' imported from /home/runner/work/logitrackv2/logitrackv2/app/hooks/useCompany.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338570897:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338570897:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338570897:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/hooks/@/app/lib/controllers/company'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/hooks/useCompany.test.ts

not ok 5 - /home/runner/work/logitrackv2/logitrackv2/app/hooks/useCompany.test.ts

---

duration_ms: 634.750483
location: '/home/runner/work/logitrackv2/logitrackv2/app/hooks/useCompany.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/hooks/@/app/lib/context/UserContext' imported from /home/runner/work/logitrackv2/logitrackv2/app/hooks/useCurrency.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338570937:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338570937:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338570937:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/hooks/@/app/lib/context/UserContext'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/hooks/useCurrency.test.ts

not ok 6 - /home/runner/work/logitrackv2/logitrackv2/app/hooks/useCurrency.test.ts

---

duration_ms: 563.171035
location: '/home/runner/work/logitrackv2/logitrackv2/app/hooks/useCurrency.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/hooks/@/app/lib/controllers/customer' imported from /home/runner/work/logitrackv2/logitrackv2/app/hooks/useCustomers.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338570930:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338570930:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338570930:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/hooks/@/app/lib/controllers/customer'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/hooks/useCustomers.test.ts

not ok 7 - /home/runner/work/logitrackv2/logitrackv2/app/hooks/useCustomers.test.ts

---

duration_ms: 592.854072
location: '/home/runner/work/logitrackv2/logitrackv2/app/hooks/useCustomers.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# (node:8358) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# Subtest: useDateSettings Hook

    # Subtest: should_ReturnDateSettingsDerivedFromUserObject
    ok 1 - should_ReturnDateSettingsDerivedFromUserObject
      ---
      duration_ms: 1.924761
      ...
    1..1

ok 8 - useDateSettings Hook

---

duration_ms: 15.999896
type: 'suite'
...
1..8

# tests 11

# suites 7

# pass 4

# fail 4

# cancelled 3

# skipped 0

# todo 0

════════════════════════════════════════════════════════════
📦 Batch 26 / 33 (8 dosya)
════════════════════════════════════════════════════════════
• app/hooks/useDrivers.test.ts
• app/hooks/useInventory.test.ts
• app/hooks/useNotifications.test.ts
• app/hooks/useOverview.test.ts
• app/hooks/useReports.test.ts
• app/hooks/useRoutes.test.ts
• app/hooks/useShipments.test.ts
• app/hooks/useTableParams.test.ts

TAP version 13

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/hooks/@/app/lib/controllers/driver' imported from /home/runner/work/logitrackv2/logitrackv2/app/hooks/useDrivers.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338573577:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338573577:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338573577:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/hooks/@/app/lib/controllers/driver'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/hooks/useDrivers.test.ts

not ok 1 - /home/runner/work/logitrackv2/logitrackv2/app/hooks/useDrivers.test.ts

---

duration_ms: 616.583049
location: '/home/runner/work/logitrackv2/logitrackv2/app/hooks/useDrivers.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/hooks/@/app/lib/controllers/inventory' imported from /home/runner/work/logitrackv2/logitrackv2/app/hooks/useInventory.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338573568:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338573568:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338573568:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/hooks/@/app/lib/controllers/inventory'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/hooks/useInventory.test.ts

not ok 2 - /home/runner/work/logitrackv2/logitrackv2/app/hooks/useInventory.test.ts

---

duration_ms: 591.450553
location: '/home/runner/work/logitrackv2/logitrackv2/app/hooks/useInventory.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/hooks/@/app/lib/firebase' imported from /home/runner/work/logitrackv2/logitrackv2/app/hooks/useNotifications.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338573614:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338573614:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338573614:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/hooks/@/app/lib/firebase'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/hooks/useNotifications.test.ts

not ok 3 - /home/runner/work/logitrackv2/logitrackv2/app/hooks/useNotifications.test.ts

---

duration_ms: 627.043338
location: '/home/runner/work/logitrackv2/logitrackv2/app/hooks/useNotifications.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# (node:8424) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# Subtest: useOverview Hook

    # Subtest: should_CallUseQueryAndReturnFormattedData
    not ok 1 - should_CallUseQueryAndReturnFormattedData
      ---
      duration_ms: 0
      location: '/home/runner/work/logitrackv2/logitrackv2/app/hooks/useOverview.test.ts:1:659'
      failureType: 'cancelledByParent'
      error: 'test did not finish before its parent and was cancelled'
      code: 'ERR_TEST_FAILURE'
      ...
    1..1

not ok 4 - useOverview Hook

---

duration_ms: 30.134592
type: 'suite'
location: '/home/runner/work/logitrackv2/logitrackv2/app/hooks/useOverview.test.ts:1:357'
failureType: 'hookFailed'
error: "Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/hooks/@/app/lib/query-keys/overview.keys' imported from /home/runner/work/logitrackv2/logitrackv2/app/hooks/useOverview.ts"
code: 'ERR_MODULE_NOT_FOUND'
stack: |-
finalizeResolution (node:internal/modules/esm/resolve:283:11)
moduleResolve (node:internal/modules/esm/resolve:952:10)
defaultResolve (node:internal/modules/esm/resolve:1188:11)
nextResolve (node:internal/modules/esm/hooks:864:28)
resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338573587:2:3744)
async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338573587:2:4237)
async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338573587:2:5355)
async nextResolve (node:internal/modules/esm/hooks:864:22)
async nextResolve (node:internal/modules/esm/hooks:864:22)
async Hooks.resolve (node:internal/modules/esm/hooks:306:24)
...

# (node:8492) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# Subtest: useReports Hook

    # Subtest: should_CallUseQueryAndReturnStateAndActions
    not ok 1 - should_CallUseQueryAndReturnStateAndActions
      ---
      duration_ms: 0
      location: '/home/runner/work/logitrackv2/logitrackv2/app/hooks/useReports.test.ts:1:807'
      failureType: 'cancelledByParent'
      error: 'test did not finish before its parent and was cancelled'
      code: 'ERR_TEST_FAILURE'
      ...
    1..1

not ok 5 - useReports Hook

---

duration_ms: 19.261513
type: 'suite'
location: '/home/runner/work/logitrackv2/logitrackv2/app/hooks/useReports.test.ts:1:509'
failureType: 'hookFailed'
error: "Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/hooks/@/app/lib/query-keys/reports.keys' imported from /home/runner/work/logitrackv2/logitrackv2/app/hooks/useReports.ts"
code: 'ERR_MODULE_NOT_FOUND'
stack: |-
finalizeResolution (node:internal/modules/esm/resolve:283:11)
moduleResolve (node:internal/modules/esm/resolve:952:10)
defaultResolve (node:internal/modules/esm/resolve:1188:11)
nextResolve (node:internal/modules/esm/hooks:864:28)
resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338574171:2:3744)
async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338574171:2:4237)
async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338574171:2:5355)
async nextResolve (node:internal/modules/esm/hooks:864:22)
async nextResolve (node:internal/modules/esm/hooks:864:22)
async Hooks.resolve (node:internal/modules/esm/hooks:306:24)
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/hooks/@/app/lib/controllers/routes' imported from /home/runner/work/logitrackv2/logitrackv2/app/hooks/useRoutes.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338574175:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338574175:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338574175:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/hooks/@/app/lib/controllers/routes'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/hooks/useRoutes.test.ts

not ok 6 - /home/runner/work/logitrackv2/logitrackv2/app/hooks/useRoutes.test.ts

---

duration_ms: 539.319977
location: '/home/runner/work/logitrackv2/logitrackv2/app/hooks/useRoutes.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/hooks/@/app/lib/controllers/shipments' imported from /home/runner/work/logitrackv2/logitrackv2/app/hooks/useShipments.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338574225:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338574225:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338574225:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/hooks/@/app/lib/controllers/shipments'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/hooks/useShipments.test.ts

not ok 7 - /home/runner/work/logitrackv2/logitrackv2/app/hooks/useShipments.test.ts

---

duration_ms: 621.837177
location: '/home/runner/work/logitrackv2/logitrackv2/app/hooks/useShipments.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# (node:8512) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# Subtest: useTableParams Hook

    # Subtest: should_ParseInitialParamsFromURL
    ok 1 - should_ParseInitialParamsFromURL
      ---
      duration_ms: 2.090511
      ...
    # Subtest: should_UpdateURLParams_WhenSetPageIsCalled
    ok 2 - should_UpdateURLParams_WhenSetPageIsCalled
      ---
      duration_ms: 0.990137
      ...
    1..2

ok 8 - useTableParams Hook

---

duration_ms: 18.569721
type: 'suite'
...
1..8

# tests 9

# suites 3

# pass 2

# fail 5

# cancelled 2

# skipped 0

# todo 0

════════════════════════════════════════════════════════════
📦 Batch 27 / 33 (8 dosya)
════════════════════════════════════════════════════════════
• app/hooks/useTrailers.test.ts
• app/hooks/useUser.test.ts
• app/hooks/useVehicleTracking.test.ts
• app/hooks/useVehicles.test.ts
• app/hooks/useWarehouses.test.ts
• app/lib/actions/auth.test.ts
• app/lib/actions/notifications.test.ts
• app/lib/actions/profile.test.ts

TAP version 13

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/hooks/@/app/lib/controllers/trailer' imported from /home/runner/work/logitrackv2/logitrackv2/app/hooks/useTrailers.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338575587:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338575587:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338575587:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/hooks/@/app/lib/controllers/trailer'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/hooks/useTrailers.test.ts

not ok 1 - /home/runner/work/logitrackv2/logitrackv2/app/hooks/useTrailers.test.ts

---

duration_ms: 603.606506
location: '/home/runner/work/logitrackv2/logitrackv2/app/hooks/useTrailers.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# (node:8604) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# Subtest: useUser Hook

    # Subtest: should_ReturnUserFromContext
    ok 1 - should_ReturnUserFromContext
      ---
      duration_ms: 4.660978
      ...
    1..1

ok 2 - useUser Hook

---

duration_ms: 18.153856
type: 'suite'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/hooks/@/app/lib/vehicleTracking' imported from /home/runner/work/logitrackv2/logitrackv2/app/hooks/useVehicleTracking.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338575593:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338575593:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338575593:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/hooks/@/app/lib/vehicleTracking'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/hooks/useVehicleTracking.test.ts

not ok 3 - /home/runner/work/logitrackv2/logitrackv2/app/hooks/useVehicleTracking.test.ts

---

duration_ms: 613.934807
location: '/home/runner/work/logitrackv2/logitrackv2/app/hooks/useVehicleTracking.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/hooks/@/app/lib/controllers/vehicle' imported from /home/runner/work/logitrackv2/logitrackv2/app/hooks/useVehicles.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338575596:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338575596:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338575596:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/hooks/@/app/lib/controllers/vehicle'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/hooks/useVehicles.test.ts

not ok 4 - /home/runner/work/logitrackv2/logitrackv2/app/hooks/useVehicles.test.ts

---

duration_ms: 574.62766
location: '/home/runner/work/logitrackv2/logitrackv2/app/hooks/useVehicles.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/hooks/@/app/lib/controllers/warehouse' imported from /home/runner/work/logitrackv2/logitrackv2/app/hooks/useWarehouses.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338576184:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338576184:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338576184:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/hooks/@/app/lib/controllers/warehouse'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/hooks/useWarehouses.test.ts

not ok 5 - /home/runner/work/logitrackv2/logitrackv2/app/hooks/useWarehouses.test.ts

---

duration_ms: 604.355434
location: '/home/runner/work/logitrackv2/logitrackv2/app/hooks/useWarehouses.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# (node:8680) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# CRITICAL ERROR in getUserSession: Error: Not authenticated

# at <anonymous> (/home/runner/work/logitrackv2/logitrackv2/app/lib/actions/auth.test.ts:54:15)

# at Object.apply (node:internal/test_runner/mock/mock:586:20)

# at Module.getUserSession (/home/runner/work/logitrackv2/logitrackv2/app/lib/actions/auth.ts:9:24)

# at TestContext.<anonymous> (/home/runner/work/logitrackv2/logitrackv2/app/lib/actions/auth.test.ts:58:32)

# at Test.runInAsyncScope (node:async_hooks:206:9)

# at Test.run (node:internal/test_runner/test:796:25)

# at async Suite.processPendingSubtests (node:internal/test_runner/test:526:7)

# Subtest: Auth Actions

    # Subtest: getUserSession() metodu
        # Subtest: should_ReturnUser_WhenAuthenticated
        ok 1 - should_ReturnUser_WhenAuthenticated
          ---
          duration_ms: 2.391872
          ...
        # Subtest: should_ThrowError_WhenGetAuthenticatedUserFails
        ok 2 - should_ThrowError_WhenGetAuthenticatedUserFails
          ---
          duration_ms: 4.184896
          ...
        1..2
    ok 1 - getUserSession() metodu
      ---
      duration_ms: 7.254352
      type: 'suite'
      ...
    # Subtest: logoutAction() metodu
        # Subtest: should_CallLogoutUser
        ok 1 - should_CallLogoutUser
          ---
          duration_ms: 0.663929
          ...
        1..1
    ok 2 - logoutAction() metodu
      ---
      duration_ms: 0.871426
      type: 'suite'
      ...
    # Subtest: refreshSessionAction() metodu
        # Subtest: should_CallRefreshSession
        ok 1 - should_CallRefreshSession
          ---
          duration_ms: 0.717709
          ...
        1..1
    ok 3 - refreshSessionAction() metodu
      ---
      duration_ms: 0.982883
      type: 'suite'
      ...
    1..3

ok 6 - Auth Actions

---

duration_ms: 49.507775
type: 'suite'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/lib/actions/@/app/lib/firebase-admin' imported from /home/runner/work/logitrackv2/logitrackv2/app/lib/actions/notifications.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338576181:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338576181:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338576181:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/lib/actions/@/app/lib/firebase-admin'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/lib/actions/notifications.test.ts

not ok 7 - /home/runner/work/logitrackv2/logitrackv2/app/lib/actions/notifications.test.ts

---

duration_ms: 543.08743
location: '/home/runner/work/logitrackv2/logitrackv2/app/lib/actions/notifications.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# (node:8699) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# Subtest: Profile Actions

    # Subtest: getMyProfile() metodu
        # Subtest: should_ReturnProfile_WhenUserExists
        ok 1 - should_ReturnProfile_WhenUserExists
          ---
          duration_ms: 1.60837
          ...
        1..1
    ok 1 - getMyProfile() metodu
      ---
      duration_ms: 2.223007
      type: 'suite'
      ...
    # Subtest: updateMyProfile() metodu
        # Subtest: should_UpdateProfileAndRevalidatePath
        ok 1 - should_UpdateProfileAndRevalidatePath
          ---
          duration_ms: 0.506014
          ...
        1..1
    ok 2 - updateMyProfile() metodu
      ---
      duration_ms: 0.622892
      type: 'suite'
      ...
    # Subtest: changeMyPassword() metodu
        # Subtest: should_ChangePassword_WhenCurrentPasswordIsCorrect
        ok 1 - should_ChangePassword_WhenCurrentPasswordIsCorrect
          ---
          duration_ms: 0.760699
          ...
        # Subtest: should_ReturnError_WhenCurrentPasswordIsIncorrect
        ok 2 - should_ReturnError_WhenCurrentPasswordIsIncorrect
          ---
          duration_ms: 0.51507
          ...
        1..2
    ok 3 - changeMyPassword() metodu
      ---
      duration_ms: 1.438784
      type: 'suite'
      ...
    1..3

ok 8 - Profile Actions

---

duration_ms: 23.778076
type: 'suite'
...
1..8

# tests 14

# suites 9

# pass 9

# fail 5

# cancelled 0

# skipped 0

# todo 0

════════════════════════════════════════════════════════════
📦 Batch 28 / 33 (8 dosya)
════════════════════════════════════════════════════════════
• app/lib/actions/theme.test.ts
• app/lib/actions/upload.test.ts
• app/lib/actions/vehicleTracking.test.ts
• app/lib/auth-middleware.test.ts
• app/lib/context/UserContext.test.tsx
• app/lib/controllers/analytics.test.ts
• app/lib/controllers/company.test.ts
• app/lib/controllers/customer.test.ts

TAP version 13

# (node:8790) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# Subtest: Theme Actions

    # Subtest: saveUserTheme() metodu
        # Subtest: should_SaveThemeToCookieAndRedis_WhenUserIsAuthenticated
        ok 1 - should_SaveThemeToCookieAndRedis_WhenUserIsAuthenticated
          ---
          duration_ms: 3.013201
          ...
        # Subtest: should_ReturnError_WhenUserIsNotAuthenticated
        ok 2 - should_ReturnError_WhenUserIsNotAuthenticated
          ---
          duration_ms: 0.633351
          ...
        1..2
    ok 1 - saveUserTheme() metodu
      ---
      duration_ms: 4.756382
      type: 'suite'
      ...
    # Subtest: getUserTheme() metodu
        # Subtest: should_ReturnThemeFromCookie_WhenAvailable
        ok 1 - should_ReturnThemeFromCookie_WhenAvailable
          ---
          duration_ms: 0.903926
          ...
        # Subtest: should_ReturnThemeFromRedis_WhenCookieIsMissing
        ok 2 - should_ReturnThemeFromRedis_WhenCookieIsMissing
          ---
          duration_ms: 0.787228
          ...
        1..2
    ok 2 - getUserTheme() metodu
      ---
      duration_ms: 1.969915
      type: 'suite'
      ...
    1..2

ok 1 - Theme Actions

---

duration_ms: 45.810007
type: 'suite'
...

# (node:8791) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# Subtest: Upload Actions

    # Subtest: uploadImageAction() metodu
        # Subtest: should_UploadImageAndReturnPublicUrl_WhenValidBase64Provided
        ok 1 - should_UploadImageAndReturnPublicUrl_WhenValidBase64Provided
          ---
          duration_ms: 3.329
          ...
        # Subtest: should_ThrowError_WhenFileTypeIsUnsupported
        ok 2 - should_ThrowError_WhenFileTypeIsUnsupported
          ---
          duration_ms: 4.355485
          ...
        1..2
    ok 1 - uploadImageAction() metodu
      ---
      duration_ms: 8.53421
      type: 'suite'
      ...
    # Subtest: getSignedUrlAction() metodu
        # Subtest: should_GenerateSignedUrl_WhenValidUrlProvided
        ok 1 - should_GenerateSignedUrl_WhenValidUrlProvided
          ---
          duration_ms: 1.127493
          ...
        # Subtest: should_ThrowError_WhenUrlIsInvalid
        ok 2 - should_ThrowError_WhenUrlIsInvalid
          ---
          duration_ms: 0.801936
          ...
        1..2
    ok 2 - getSignedUrlAction() metodu
      ---
      duration_ms: 2.22481
      type: 'suite'
      ...
    1..2

ok 2 - Upload Actions

---

duration_ms: 38.832049
type: 'suite'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/lib/actions/@/app/lib/firebase-admin' imported from /home/runner/work/logitrackv2/logitrackv2/app/lib/actions/vehicleTracking.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338577608:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338577608:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338577608:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/lib/actions/@/app/lib/firebase-admin'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/lib/actions/vehicleTracking.test.ts

not ok 3 - /home/runner/work/logitrackv2/logitrackv2/app/lib/actions/vehicleTracking.test.ts

---

duration_ms: 550.356171
location: '/home/runner/work/logitrackv2/logitrackv2/app/lib/actions/vehicleTracking.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# (node:8799) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# Subtest: auth-middleware.ts

    # Subtest: getAuthenticatedUser
        # Subtest: should return the formatted user when validateSession succeeds
        ok 1 - should return the formatted user when validateSession succeeds
          ---
          duration_ms: 3.09316
          ...
        # Subtest: should return null when validateSession returns null
        ok 2 - should return null when validateSession returns null
          ---
          duration_ms: 0.540058
          ...
        # Subtest: should handle session check failure and return null
        ok 3 - should handle session check failure and return null
          ---
          duration_ms: 0.903045
          ...
        # Subtest: should throw DYNAMIC_SERVER_USAGE errors
        ok 4 - should throw DYNAMIC_SERVER_USAGE errors
          ---
          duration_ms: 7.480714
          ...
        1..4
    ok 1 - getAuthenticatedUser
      ---
      duration_ms: 13.018786
      type: 'suite'
      ...
    # Subtest: authenticatedAction
        # Subtest: should redirect if user is not authenticated (fallback locale)
        ok 1 - should redirect if user is not authenticated (fallback locale)
          ---
          duration_ms: 1.383461
          ...
        # Subtest: should redirect to correct locale if referer contains locale
        ok 2 - should redirect to correct locale if referer contains locale
          ---
          duration_ms: 1.354757
          ...
        # Subtest: should execute action with user if authenticated
        ok 3 - should execute action with user if authenticated
          ---
          duration_ms: 0.609136
          ...
        1..3
    ok 2 - authenticatedAction
      ---
      duration_ms: 3.718237
      type: 'suite'
      ...
    # Subtest: maybeAuthenticatedAction
        # Subtest: should execute action with user if authenticated
        ok 1 - should execute action with user if authenticated
          ---
          duration_ms: 0.799721
          ...
        # Subtest: should execute action with null if not authenticated
        ok 2 - should execute action with null if not authenticated
          ---
          duration_ms: 0.63251
          ...
        1..2
    ok 3 - maybeAuthenticatedAction
      ---
      duration_ms: 1.688599
      type: 'suite'
      ...
    1..3

ok 4 - auth-middleware.ts

---

duration_ms: 47.344119
type: 'suite'
...

# (node:8865) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# Subtest: UserContext

    # Subtest: useUserContext()
        # Subtest: should_ThrowError_WhenUsedOutsideProvider
        ok 1 - should_ThrowError_WhenUsedOutsideProvider
          ---
          duration_ms: 5.106626
          ...
        # Subtest: should_ReturnContext_WhenUsedWithinProvider
        ok 2 - should_ReturnContext_WhenUsedWithinProvider
          ---
          duration_ms: 2.027873
          ...
        1..2
    ok 1 - useUserContext()
      ---
      duration_ms: 8.120188
      type: 'suite'
      ...
    # Subtest: UserProvider()
        # Subtest: should_RenderProvider_WithCorrectValueAndLoadingStateFalse
        ok 1 - should_RenderProvider_WithCorrectValueAndLoadingStateFalse
          ---
          duration_ms: 0.644823
          ...
        1..1
    ok 2 - UserProvider()
      ---
      duration_ms: 0.792489
      type: 'suite'
      ...
    1..2

ok 5 - UserContext

---

duration_ms: 26.895221
type: 'suite'
...

# (node:8877) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# Subtest: Analytics Controller

    # Subtest: getOverviewStats() metodu
        # Subtest: should_ReturnOverviewStats
        ok 1 - should_ReturnOverviewStats
          ---
          duration_ms: 3.879807
          ...
        # Subtest: should_ReturnNull_WhenUserHasNoCompany
        ok 2 - should_ReturnNull_WhenUserHasNoCompany
          ---
          duration_ms: 0.380891
          ...
        1..2
    ok 1 - getOverviewStats() metodu
      ---
      duration_ms: 5.230948
      type: 'suite'
      ...
    1..1

ok 6 - Analytics Controller

---

duration_ms: 114.2992
type: 'suite'
...

# (node:8878) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# Subtest: Company Controller

    # Subtest: createCompany() metodu
        # Subtest: should_CreateCompanyAndUpdateUserRole_WhenNameIsUnique
        ok 1 - should_CreateCompanyAndUpdateUserRole_WhenNameIsUnique
          ---
          duration_ms: 5.158362
          ...
        # Subtest: should_ThrowError_WhenCompanyNameAlreadyExists
        ok 2 - should_ThrowError_WhenCompanyNameAlreadyExists
          ---
          duration_ms: 8.229402
          ...
        1..2
    ok 1 - createCompany() metodu
      ---
      duration_ms: 17.301114
      type: 'suite'
      ...
    1..1

ok 7 - Company Controller

---

duration_ms: 76.042733
type: 'suite'
...

# (node:8891) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# Failed to create customer: Error: Customer with this code already exists

# at Module.<anonymous> (/home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/customer.ts:48:15)

# at async TestContext.<anonymous> (/home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/customer.test.ts:111:7)

# at async Test.run (node:internal/test_runner/test:797:9)

# at async Suite.processPendingSubtests (node:internal/test_runner/test:526:7)

# Subtest: Customer Controller

    # Subtest: createCustomer() metodu
        # Subtest: should_CreateCustomer_WhenValidDataProvided
        ok 1 - should_CreateCustomer_WhenValidDataProvided
          ---
          duration_ms: 2.174727
          ...
        # Subtest: should_ThrowError_WhenCustomerCodeAlreadyExists
        ok 2 - should_ThrowError_WhenCustomerCodeAlreadyExists
          ---
          duration_ms: 6.008298
          ...
        1..2
    ok 1 - createCustomer() metodu
      ---
      duration_ms: 8.785429
      type: 'suite'
      ...
    1..1

ok 8 - Customer Controller

---

duration_ms: 45.042091
type: 'suite'
...
1..8

# tests 27

# suites 19

# pass 26

# fail 1

# cancelled 0

# skipped 0

# todo 0

════════════════════════════════════════════════════════════
📦 Batch 29 / 33 (8 dosya)
════════════════════════════════════════════════════════════
• app/lib/controllers/documents.test.ts
• app/lib/controllers/driver.test.ts
• app/lib/controllers/exchangeRate.test.ts
• app/lib/controllers/fuel.test.ts
• app/lib/controllers/inventory.test.ts
• app/lib/controllers/maintenance.test.ts
• app/lib/controllers/map.test.ts
• app/lib/controllers/overview.test.ts

TAP version 13

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/@/app/lib/actions/notifications' imported from /home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/documents.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338579739:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338579739:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338579739:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/@/app/lib/actions/notifications'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/documents.test.ts

not ok 1 - /home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/documents.test.ts

---

duration_ms: 583.3075
location: '/home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/documents.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/@/app/lib/actions/notifications' imported from /home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/driver.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338579746:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338579746:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338579746:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/@/app/lib/actions/notifications'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/driver.test.ts

not ok 2 - /home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/driver.test.ts

---

duration_ms: 671.400922
location: '/home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/driver.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/@/app/lib/auth-middleware' imported from /home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/exchangeRate.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338579741:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338579741:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338579741:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/@/app/lib/auth-middleware'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/exchangeRate.test.ts

not ok 3 - /home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/exchangeRate.test.ts

---

duration_ms: 587.451762
location: '/home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/exchangeRate.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/@/app/lib/services/exchangeRate' imported from /home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/fuel.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338579757:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338579757:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338579757:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/@/app/lib/services/exchangeRate'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/fuel.test.ts

not ok 4 - /home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/fuel.test.ts

---

duration_ms: 591.934555
location: '/home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/fuel.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# (node:9055) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# Failed to create inventory item: Error: Item with this SKU already exists in this warehouse

# at Module.<anonymous> (/home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/inventory.ts:68:15)

# at async TestContext.<anonymous> (/home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/inventory.test.ts:168:7)

# at async Test.run (node:internal/test_runner/test:797:9)

# at async Suite.processPendingSubtests (node:internal/test_runner/test:526:7)

# Subtest: Inventory Controller

    # Subtest: createInventoryItem() metodu
        # Subtest: should_CreateInventoryAndMovement_WhenValidDataProvided
        ok 1 - should_CreateInventoryAndMovement_WhenValidDataProvided
          ---
          duration_ms: 2.254636
          ...
        # Subtest: should_ThrowError_WhenSkuAlreadyExists
        ok 2 - should_ThrowError_WhenSkuAlreadyExists
          ---
          duration_ms: 7.287593
          ...
        1..2
    ok 1 - createInventoryItem() metodu
      ---
      duration_ms: 10.194546
      type: 'suite'
      ...
    # Subtest: adjustInventoryStock() metodu
        # Subtest: should_AdjustStockAndLogMovement_WhenValidRequest
        ok 1 - should_AdjustStockAndLogMovement_WhenValidRequest
          ---
          duration_ms: 1.286219
          ...
        1..1
    ok 2 - adjustInventoryStock() metodu
      ---
      duration_ms: 1.419338
      type: 'suite'
      ...
    1..2

ok 5 - Inventory Controller

---

duration_ms: 46.983964
type: 'suite'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/@/app/lib/actions/notifications' imported from /home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/maintenance.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338580340:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338580340:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338580340:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/@/app/lib/actions/notifications'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/maintenance.test.ts

not ok 6 - /home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/maintenance.test.ts

---

duration_ms: 643.88767
location: '/home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/maintenance.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# (node:9062) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# Failed to fetch directions Error: Directions API error: Not Found

# at Module.<anonymous> (/home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/map.ts:52:15)

# at async TestContext.<anonymous> (/home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/map.test.ts:98:22)

# at async Test.run (node:internal/test_runner/test:797:9)

# at async Suite.processPendingSubtests (node:internal/test_runner/test:526:7)

# Subtest: Map Controller

    # Subtest: getDirections() metodu
        # Subtest: should_ReturnNull_WhenOriginOrDestinationIsMissing
        ok 1 - should_ReturnNull_WhenOriginOrDestinationIsMissing
          ---
          duration_ms: 2.710086
          ...
        # Subtest: should_ReturnDirectionsData_WhenValidRequestIsMade
        ok 2 - should_ReturnDirectionsData_WhenValidRequestIsMade
          ---
          duration_ms: 1.551865
          ...
        # Subtest: should_ReturnNull_WhenFetchFails
        ok 3 - should_ReturnNull_WhenFetchFails
          ---
          duration_ms: 5.619614
          ...
        1..3
    ok 1 - getDirections() metodu
      ---
      duration_ms: 10.795649
      type: 'suite'
      ...
    1..1

ok 7 - Map Controller

---

duration_ms: 30.479626
type: 'suite'
...

# (node:9080) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# Subtest: Overview Controller

    # Subtest: getOverviewDashboardData() metodu
        # Subtest: should_ReturnEmptyStructure_WhenNoCompanyId
        ok 1 - should_ReturnEmptyStructure_WhenNoCompanyId
          ---
          duration_ms: 2.6482
          ...
        # Subtest: should_ReturnDashboardData_WhenUserHasCompanyId
        ok 2 - should_ReturnDashboardData_WhenUserHasCompanyId
          ---
          duration_ms: 8.802992
          ...
        1..2
    ok 1 - getOverviewDashboardData() metodu
      ---
      duration_ms: 12.083671
      type: 'suite'
      ...
    1..1

ok 8 - Overview Controller

---

duration_ms: 59.64241
type: 'suite'
...
1..8

# tests 13

# suites 7

# pass 8

# fail 5

# cancelled 0

# skipped 0

# todo 0

════════════════════════════════════════════════════════════
📦 Batch 30 / 33 (8 dosya)
════════════════════════════════════════════════════════════
• app/lib/controllers/reports.test.ts
• app/lib/controllers/roles.test.ts
• app/lib/controllers/routes.test.ts
• app/lib/controllers/session.test.ts
• app/lib/controllers/shipments.test.ts
• app/lib/controllers/trailer.test.ts
• app/lib/controllers/users.test.ts
• app/lib/controllers/utils/checkPermission.test.ts

TAP version 13

# (node:9166) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# Failed to get reports data: Error: Database error

# at Object.<anonymous> (/home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/reports.test.ts:151:15)

# at Object.apply (node:internal/test_runner/mock/mock:586:20)

# at Module.<anonymous> (/home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/reports.ts:12:52)

# at TestContext.<anonymous> (/home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/reports.test.ts:155:46)

# at Test.runInAsyncScope (node:async_hooks:206:9)

# at Test.run (node:internal/test_runner/test:796:25)

# at async Suite.processPendingSubtests (node:internal/test_runner/test:526:7)

# Subtest: Reports Controller

    # Subtest: getReportsDataAction() metodu
        # Subtest: should_ReturnNull_WhenUserHasNoCompanyId
        ok 1 - should_ReturnNull_WhenUserHasNoCompanyId
          ---
          duration_ms: 2.79722
          ...
        # Subtest: should_ReturnReportsData_WhenUserHasCompanyId
        ok 2 - should_ReturnReportsData_WhenUserHasCompanyId
          ---
          duration_ms: 2.469228
          ...
        # Subtest: should_ReturnNull_WhenDatabaseThrowsError
        ok 3 - should_ReturnNull_WhenDatabaseThrowsError
          ---
          duration_ms: 6.644069
          ...
        1..3
    ok 1 - getReportsDataAction() metodu
      ---
      duration_ms: 12.747408
      type: 'suite'
      ...
    1..1

ok 1 - Reports Controller

---

duration_ms: 30.41129
type: 'suite'
...

# (node:9167) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# Failed to create role: Error: Role name already exists

# at Module.<anonymous> (/home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/roles.ts:25:15)

# at async TestContext.<anonymous> (/home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/roles.test.ts:102:7)

# at async Test.run (node:internal/test_runner/test:797:9)

# at async Suite.processPendingSubtests (node:internal/test_runner/test:526:7)

# Failed to delete role: Error: Cannot delete role because it is assigned to one or more users

# at Module.<anonymous> (/home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/roles.ts:136:13)

# at async TestContext.<anonymous> (/home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/roles.test.ts:138:7)

# at async Test.run (node:internal/test_runner/test:797:9)

# at async Suite.processPendingSubtests (node:internal/test_runner/test:526:7)

# Subtest: Roles Controller

    # Subtest: createRole() metodu
        # Subtest: should_CreateRole_WhenNameDoesNotExist
        ok 1 - should_CreateRole_WhenNameDoesNotExist
          ---
          duration_ms: 3.510591
          ...
        # Subtest: should_ThrowError_WhenRoleNameAlreadyExists
        ok 2 - should_ThrowError_WhenRoleNameAlreadyExists
          ---
          duration_ms: 8.469586
          ...
        1..2
    ok 1 - createRole() metodu
      ---
      duration_ms: 12.939317
      type: 'suite'
      ...
    # Subtest: deleteRole() metodu
        # Subtest: should_DeleteRole_WhenNotInUse
        ok 1 - should_DeleteRole_WhenNotInUse
          ---
          duration_ms: 1.078944
          ...
        # Subtest: should_ThrowError_WhenRoleIsInUse
        ok 2 - should_ThrowError_WhenRoleIsInUse
          ---
          duration_ms: 1.490972
          ...
        1..2
    ok 2 - deleteRole() metodu
      ---
      duration_ms: 2.84016
      type: 'suite'
      ...
    1..2

ok 2 - Roles Controller

---

duration_ms: 46.202379
type: 'suite'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/@/app/lib/actions/notifications' imported from /home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/routes.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338581893:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338581893:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338581893:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/@/app/lib/actions/notifications'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/routes.test.ts

not ok 3 - /home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/routes.test.ts

---

duration_ms: 566.069777
location: '/home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/routes.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# (node:9174) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# Subtest: Session Controller

    # Subtest: createSession() metodu
        # Subtest: should_CreateSessionAndSetCookies_WhenValidUserProvided
        ok 1 - should_CreateSessionAndSetCookies_WhenValidUserProvided
          ---
          duration_ms: 4.667139
          ...
        1..1
    ok 1 - createSession() metodu
      ---
      duration_ms: 5.339063
      type: 'suite'
      ...
    # Subtest: validateSession() metodu
        # Subtest: should_ReturnSessionUser_WhenValidTokenExists
        ok 1 - should_ReturnSessionUser_WhenValidTokenExists
          ---
          duration_ms: 2.279344
          ...
        # Subtest: should_ReturnNullAndClearCookies_WhenTokenIsExpired
        ok 2 - should_ReturnNullAndClearCookies_WhenTokenIsExpired
          ---
          duration_ms: 1.187546
          ...
        1..2
    ok 2 - validateSession() metodu
      ---
      duration_ms: 3.821742
      type: 'suite'
      ...
    # Subtest: revokeSession() metodu
        # Subtest: should_MarkSessionAsRevoked_AndRemoveFromRedis
        ok 1 - should_MarkSessionAsRevoked_AndRemoveFromRedis
          ---
          duration_ms: 1.106535
          ...
        1..1
    ok 3 - revokeSession() metodu
      ---
      duration_ms: 1.341714
      type: 'suite'
      ...
    # Subtest: clearAuthCookies() metodu
        # Subtest: should_DeleteTokenAndRefreshTokenCookies
        ok 1 - should_DeleteTokenAndRefreshTokenCookies
          ---
          duration_ms: 4.031393
          ...
        1..1
    ok 4 - clearAuthCookies() metodu
      ---
      duration_ms: 4.417644
      type: 'suite'
      ...
    1..4

ok 4 - Session Controller

---

duration_ms: 89.74394
type: 'suite'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/@/app/lib/actions/notifications' imported from /home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/shipments.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338582444:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338582444:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338582444:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/@/app/lib/actions/notifications'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/shipments.test.ts

not ok 5 - /home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/shipments.test.ts

---

duration_ms: 557.815641
location: '/home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/shipments.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# (node:9248) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# Failed to create trailer: Error: Plate or Fleet Number already exists.

# at Module.<anonymous> (/home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/trailer.ts:74:15)

# at async TestContext.<anonymous> (/home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/trailer.test.ts:141:7)

# at async Test.run (node:internal/test_runner/test:797:9)

# at async Suite.processPendingSubtests (node:internal/test_runner/test:526:7)

# Failed to get trailer: Error: Trailer not found or unauthorized

# at Module.<anonymous> (/home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/trailer.ts:201:15)

# at async TestContext.<anonymous> (/home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/trailer.test.ts:177:7)

# at async Test.run (node:internal/test_runner/test:797:9)

# at async Suite.processPendingSubtests (node:internal/test_runner/test:526:7)

# Subtest: Trailer Controller

    # Subtest: createTrailer() metodu
        # Subtest: should_CreateTrailer_WhenValidDataProvided
        ok 1 - should_CreateTrailer_WhenValidDataProvided
          ---
          duration_ms: 3.194442
          ...
        # Subtest: should_ThrowError_WhenPlateOrFleetNoAlreadyExists
        ok 2 - should_ThrowError_WhenPlateOrFleetNoAlreadyExists
          ---
          duration_ms: 8.426414
          ...
        1..2
    ok 1 - createTrailer() metodu
      ---
      duration_ms: 12.540492
      type: 'suite'
      ...
    # Subtest: getTrailerById() metodu
        # Subtest: should_ReturnTrailer_WhenTrailerExistsAndBelongsToCompany
        ok 1 - should_ReturnTrailer_WhenTrailerExistsAndBelongsToCompany
          ---
          duration_ms: 1.135128
          ...
        # Subtest: should_ThrowError_WhenTrailerDoesNotExist
        ok 2 - should_ThrowError_WhenTrailerDoesNotExist
          ---
          duration_ms: 1.285428
          ...
        1..2
    ok 2 - getTrailerById() metodu
      ---
      duration_ms: 2.675912
      type: 'suite'
      ...
    1..2

ok 6 - Trailer Controller

---

duration_ms: 80.042194
type: 'suite'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/@/app/lib/actions/notifications' imported from /home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/users.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338582661:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338582661:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338582661:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/@/app/lib/actions/notifications'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/users.test.ts

not ok 7 - /home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/users.test.ts

---

duration_ms: 640.513223
location: '/home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/users.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/utils/@/roles.json' imported from /home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/utils/checkPermission.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338582654:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338582654:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338582654:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/utils/@/roles.json'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/utils/checkPermission.test.ts

not ok 8 - /home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/utils/checkPermission.test.ts

---

duration_ms: 562.780606
location: '/home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/utils/checkPermission.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...
1..8

# tests 20

# suites 13

# pass 16

# fail 4

# cancelled 0

# skipped 0

# todo 0

════════════════════════════════════════════════════════════
📦 Batch 31 / 33 (8 dosya)
════════════════════════════════════════════════════════════
• app/lib/controllers/utils/trendUtils.test.ts
• app/lib/controllers/utils/vehicleUtils.test.ts
• app/lib/controllers/vehicle.test.ts
• app/lib/controllers/warehouse.test.ts
• app/lib/db.test.ts
• app/lib/firebase-admin.test.ts
• app/lib/firebase.test.ts
• app/lib/language/language.test.ts

TAP version 13

# Subtest: Trend Utils

    # Subtest: calcTrend() metodu
        # Subtest: should_ReturnUndefined_WhenBothValuesAreZero
        ok 1 - should_ReturnUndefined_WhenBothValuesAreZero
          ---
          duration_ms: 2.194305
          ...
        # Subtest: should_Return100PercentUp_WhenPreviousIsZeroAndCurrentIsPositive
        ok 2 - should_Return100PercentUp_WhenPreviousIsZeroAndCurrentIsPositive
          ---
          duration_ms: 0.553553
          ...
        # Subtest: should_CalculatePositiveTrendCorrectly
        ok 3 - should_CalculatePositiveTrendCorrectly
          ---
          duration_ms: 0.405277
          ...
        # Subtest: should_CalculateNegativeTrendCorrectly
        ok 4 - should_CalculateNegativeTrendCorrectly
          ---
          duration_ms: 0.357036
          ...
        1..4
    ok 1 - calcTrend() metodu
      ---
      duration_ms: 4.765704
      type: 'suite'
      ...
    # Subtest: daysAgo() metodu
        # Subtest: should_ReturnStartOfDayForSpecifiedDaysAgo
        ok 1 - should_ReturnStartOfDayForSpecifiedDaysAgo
          ---
          duration_ms: 0.465959
          ...
        1..1
    ok 2 - daysAgo() metodu
      ---
      duration_ms: 0.614446
      type: 'suite'
      ...
    1..2

ok 1 - Trend Utils

---

duration_ms: 6.081018
type: 'suite'
...

# Subtest: Vehicle Utils

    # Subtest: VehicleKpiConverter()
        # Subtest: should_ConvertVehicleDataToKpis
        ok 1 - should_ConvertVehicleDataToKpis
          ---
          duration_ms: 2.187472
          ...
        1..1
    ok 1 - VehicleKpiConverter()
      ---
      duration_ms: 2.795236
      type: 'suite'
      ...
    # Subtest: VehicleCapacityConverter()
        # Subtest: should_ExtractCapacityInformation
        ok 1 - should_ExtractCapacityInformation
          ---
          duration_ms: 0.404304
          ...
        1..1
    ok 2 - VehicleCapacityConverter()
      ---
      duration_ms: 0.586134
      type: 'suite'
      ...
    # Subtest: VehicleDocumentConverter()
        # Subtest: should_ExtractDocumentsFromVehicles
        ok 1 - should_ExtractDocumentsFromVehicles
          ---
          duration_ms: 0.39123
          ...
        1..1
    ok 3 - VehicleDocumentConverter()
      ---
      duration_ms: 0.494523
      type: 'suite'
      ...
    # Subtest: VehicleServiceConverter()
        # Subtest: should_ExtractScheduledMaintenanceRecords
        ok 1 - should_ExtractScheduledMaintenanceRecords
          ---
          duration_ms: 0.481619
          ...
        1..1
    ok 4 - VehicleServiceConverter()
      ---
      duration_ms: 0.624936
      type: 'suite'
      ...
    1..4

ok 2 - Vehicle Utils

---

duration_ms: 5.336829
type: 'suite'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/@/app/lib/actions/notifications' imported from /home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/vehicle.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338583979:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338583979:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338583979:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/@/app/lib/actions/notifications'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/vehicle.test.ts

not ok 3 - /home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/vehicle.test.ts

---

duration_ms: 637.117956
location: '/home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/vehicle.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/@/app/lib/actions/notifications' imported from /home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/warehouse.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338583989:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338583989:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338583989:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/@/app/lib/actions/notifications'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/warehouse.test.ts

not ok 4 - /home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/warehouse.test.ts

---

duration_ms: 564.426248
location: '/home/runner/work/logitrackv2/logitrackv2/app/lib/controllers/warehouse.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# Subtest: db.ts Connection & Initialization

    # Subtest: should have DATABASE_URL defined in environment
    ok 1 - should have DATABASE_URL defined in environment
      ---
      duration_ms: 2.878692
      ...
    # Subtest: should properly instantiate the Prisma client
    ok 2 - should properly instantiate the Prisma client
      ---
      duration_ms: 0.368638
      ...
    # Subtest: should establish a direct connection to the database
    ok 3 - should establish a direct connection to the database
      ---
      duration_ms: 1904.577782
      ...
    # Subtest: should cache prisma instance in globalThis in development
    ok 4 - should cache prisma instance in globalThis in development
      ---
      duration_ms: 0.397762
      ...
    1..4

ok 5 - db.ts Connection & Initialization

---

duration_ms: 1918.310749
type: 'suite'
...

# [dotenv@17.3.1] injecting env (0) from .env -- tip: ⚙️ override existing env vars with { override: true }

# Subtest: firebase-admin.ts Admin Connection & Initialization

    # Subtest: should have Firebase Admin credentials in environment variables
    ok 1 - should have Firebase Admin credentials in environment variables
      ---
      duration_ms: 1.662202
      ...
    # Subtest: should properly instantiate the Firebase Admin SDK
    ok 2 - should properly instantiate the Firebase Admin SDK
      ---
      duration_ms: 0.274662
      ...
    # Subtest: should establish a direct connection using Admin Database
    ok 3 - should establish a direct connection using Admin Database
      ---
      duration_ms: 748.786157
      ...
    # Subtest: should establish a connection using Admin Auth
    ok 4 - should establish a connection using Admin Auth
      ---
      duration_ms: 2.392114
      ...
    1..4

ok 6 - firebase-admin.ts Admin Connection & Initialization

---

duration_ms: 756.653798
type: 'suite'
...

# Subtest: firebase.ts Client Connection & Initialization

    # Subtest: should have Firebase configuration in environment variables
    ok 1 - should have Firebase configuration in environment variables
      ---
      duration_ms: 2.37387
      ...
    # Subtest: should properly instantiate the Firebase Realtime Database client
    ok 2 - should properly instantiate the Firebase Realtime Database client
      ---
      duration_ms: 0.291274
      ...
    # Subtest: should establish a direct connection to the Firebase Database
    ok 3 - should establish a direct connection to the Firebase Database
      ---
      duration_ms: 579.00617
      ...
    1..3

ok 7 - firebase.ts Client Connection & Initialization

---

duration_ms: 590.441269
type: 'suite'
...

# (node:9445) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# Subtest: language utils

    # Subtest: getDictionary
        # Subtest: should load the English dictionary when lang is 'en'
        ok 1 - should load the English dictionary when lang is 'en'
          ---
          duration_ms: 82.229123
          ...
        # Subtest: should load the Turkish dictionary when lang is 'tr'
        ok 2 - should load the Turkish dictionary when lang is 'tr'
          ---
          duration_ms: 44.056662
          ...
        # Subtest: should fall back to English for an unsupported locale
        ok 3 - should fall back to English for an unsupported locale
          ---
          duration_ms: 7.805385
          ...
        # Subtest: should fall back to English for an empty string
        ok 4 - should fall back to English for an empty string
          ---
          duration_ms: 6.203256
          ...
        # Subtest: should fall back to English for a completely random locale string
        ok 5 - should fall back to English for a completely random locale string
          ---
          duration_ms: 8.433968
          ...
        # Subtest: English dictionary should contain expected top-level sections
        ok 6 - English dictionary should contain expected top-level sections
          ---
          duration_ms: 7.989888
          ...
        # Subtest: Turkish dictionary should contain the same top-level sections as English
        ok 7 - Turkish dictionary should contain the same top-level sections as English
          ---
          duration_ms: 6.532832
          ...
        # Subtest: English dictionary common section should have basic keys
        ok 8 - English dictionary common section should have basic keys
          ---
          duration_ms: 6.503875
          ...
        # Subtest: Turkish dictionary should have different values from English for common keys
        ok 9 - Turkish dictionary should have different values from English for common keys
          ---
          duration_ms: 3.236741
          ...
        1..9
    ok 1 - getDictionary
      ---
      duration_ms: 174.629697
      type: 'suite'
      ...
    # Subtest: formatMessage
        # Subtest: should replace a single placeholder
        ok 1 - should replace a single placeholder
          ---
          duration_ms: 0.422068
          ...
        # Subtest: should replace multiple placeholders
        ok 2 - should replace multiple placeholders
          ---
          duration_ms: 0.288769
          ...
        # Subtest: should replace a number value placeholder
        ok 3 - should replace a number value placeholder
          ---
          duration_ms: 0.260596
          ...
        # Subtest: should replace a boolean value placeholder
        ok 4 - should replace a boolean value placeholder
          ---
          duration_ms: 0.290883
          ...
        # Subtest: should leave any placeholders intact
        ok 5 - should leave any placeholders intact
          ---
          duration_ms: 0.295852
          ...
        # Subtest: should handle a template with no placeholders
        ok 6 - should handle a template with no placeholders
          ---
          duration_ms: 0.236652
          ...
        # Subtest: should handle an empty template string
        ok 7 - should handle an empty template string
          ---
          duration_ms: 5.81492
          ...
        # Subtest: should handle an empty values object
        ok 8 - should handle an empty values object
          ---
          duration_ms: 0.324576
          ...
        # Subtest: should handle multiple occurrences of the same placeholder
        ok 9 - should handle multiple occurrences of the same placeholder
          ---
          duration_ms: 0.207056
          ...
        # Subtest: should handle placeholder with value of 0 (falsy number)
        ok 10 - should handle placeholder with value of 0 (falsy number)
          ---
          duration_ms: 0.232464
          ...
        # Subtest: should handle placeholder with value of false (falsy boolean)
        ok 11 - should handle placeholder with value of false (falsy boolean)
          ---
          duration_ms: 0.1874
          ...
        # Subtest: should not replace placeholders with special regex characters in key
        ok 12 - should not replace placeholders with special regex characters in key
          ---
          duration_ms: 0.173724
          ...
        1..12
    ok 2 - formatMessage
      ---
      duration_ms: 9.266652
      type: 'suite'
      ...
    1..2

ok 8 - language utils

---

duration_ms: 204.711781
type: 'suite'
...
1..8

# tests 43

# suites 14

# pass 41

# fail 2

# cancelled 0

# skipped 0

# todo 0

════════════════════════════════════════════════════════════
📦 Batch 32 / 33 (8 dosya)
════════════════════════════════════════════════════════════
• app/lib/priorityColor.test.ts
• app/lib/rate-limiter.test.ts
• app/lib/redis.test.ts
• app/lib/services/exchangeRate.test.ts
• app/lib/supabase.test.ts
• app/lib/utils/currency.test.ts
• app/lib/utils/date.test.ts
• app/lib/utils/fileUtils.test.ts

TAP version 13

# Subtest: priorityColor Utils

    # Subtest: getPriorityColor
        # Subtest: should return 'error' for CRITICAL and HIGH priorities
        ok 1 - should return 'error' for CRITICAL and HIGH priorities
          ---
          duration_ms: 2.532015
          ...
        # Subtest: should return 'warning' for MEDIUM priority
        ok 2 - should return 'warning' for MEDIUM priority
          ---
          duration_ms: 0.357487
          ...
        # Subtest: should return 'info' for LOW priority
        ok 3 - should return 'info' for LOW priority
          ---
          duration_ms: 0.362867
          ...
        # Subtest: should return 'default' for any, null, or undefined priorities
        ok 4 - should return 'default' for any, null, or undefined priorities
          ---
          duration_ms: 0.591243
          ...
        1..4
    ok 1 - getPriorityColor
      ---
      duration_ms: 5.230381
      type: 'suite'
      ...
    # Subtest: getStatusMeta
        # Subtest: should return correct meta for info statuses
        ok 1 - should return correct meta for info statuses
          ---
          duration_ms: 1.524064
          ...
        # Subtest: should return correct meta for warning statuses
        ok 2 - should return correct meta for warning statuses
          ---
          duration_ms: 0.523257
          ...
        # Subtest: should return correct meta for error statuses
        ok 3 - should return correct meta for error statuses
          ---
          duration_ms: 0.363097
          ...
        # Subtest: should return correct meta for success statuses
        ok 4 - should return correct meta for success statuses
          ---
          duration_ms: 0.41753
          ...
        # Subtest: should fallback to secondary for any statuses
        ok 5 - should fallback to secondary for any statuses
          ---
          duration_ms: 0.414373
          ...
        # Subtest: should resolve specific mapped label from dictionary if available
        ok 6 - should resolve specific mapped label from dictionary if available
          ---
          duration_ms: 0.714022
          ...
        # Subtest: should resolve fallback color if dictionary color is missing
        ok 7 - should resolve fallback color if dictionary color is missing
          ---
          duration_ms: 0.461562
          ...
        # Subtest: should gracefully handle null/undefined status and provide default string response
        ok 8 - should gracefully handle null/undefined status and provide default string response
          ---
          duration_ms: 0.405517
          ...
        1..8
    ok 2 - getStatusMeta
      ---
      duration_ms: 5.646827
      type: 'suite'
      ...
    # Subtest: getStatusColor
        # Subtest: should return correct MUI status colors based on NotificationType
        ok 1 - should return correct MUI status colors based on NotificationType
          ---
          duration_ms: 0.713952
          ...
        # Subtest: should fallback to info.main for INFO or any notification types
        ok 2 - should fallback to info.main for INFO or any notification types
          ---
          duration_ms: 0.58427
          ...
        1..2
    ok 3 - getStatusColor
      ---
      duration_ms: 1.563878
      type: 'suite'
      ...
    # Subtest: resolveStatusAlpha
        # Subtest: should return correct MUI alpha colors based on NotificationType
        ok 1 - should return correct MUI alpha colors based on NotificationType
          ---
          duration_ms: 0.695138
          ...
        # Subtest: should fallback to info alpha variant for INFO or any notification types
        ok 2 - should fallback to info alpha variant for INFO or any notification types
          ---
          duration_ms: 0.515111
          ...
        1..2
    ok 4 - resolveStatusAlpha
      ---
      duration_ms: 1.434036
      type: 'suite'
      ...
    1..4

ok 1 - priorityColor Utils

---

duration_ms: 15.016632
type: 'suite'
...

# Rate limiting redis error: Error: Redis connection timeout

# at Proxy.<anonymous> (/home/runner/work/logitrackv2/logitrackv2/app/lib/rate-limiter.test.ts:70:13)

# at Object.apply (node:internal/test_runner/mock/mock:586:20)

# at rateLimit (/home/runner/work/logitrackv2/logitrackv2/app/lib/rate-limiter.ts:29:21)

# at TestContext.<anonymous> (/home/runner/work/logitrackv2/logitrackv2/app/lib/rate-limiter.test.ts:73:26)

# at Test.runInAsyncScope (node:async_hooks:206:9)

# at Test.run (node:internal/test_runner/test:796:25)

# at async Suite.processPendingSubtests (node:internal/test_runner/test:526:7)

# Subtest: Rate Limiter Utils

    # Subtest: should allow request when under limit (Limit altındaysa izin vermeli)
    ok 1 - should allow request when under limit (Limit altındaysa izin vermeli)
      ---
      duration_ms: 6.538581
      ...
    # Subtest: should block request when limit is exceeded (Limit aşıldıysa engellemeli)
    ok 2 - should block request when limit is exceeded (Limit aşıldıysa engellemeli)
      ---
      duration_ms: 3.828053
      ...
    # Subtest: should fail-open (allow) if redis throws an error (Redis çökerse sistemi kilitlememeli)
    ok 3 - should fail-open (allow) if redis throws an error (Redis çökerse sistemi kilitlememeli)
      ---
      duration_ms: 11.718637
      ...
    1..3

ok 2 - Rate Limiter Utils

---

duration_ms: 23.476739
type: 'suite'
...

# PONG

# Subtest: All redis tests

    # Subtest: Redis Connection (Integration Test)
        # Subtest: should connect to redis using real .env credentials
        ok 1 - should connect to redis using real .env credentials
          ---
          duration_ms: 341.688192
          ...
        1..1
    ok 1 - Redis Connection (Integration Test)
      ---
      duration_ms: 342.607468
      type: 'suite'
      ...
    # Subtest: Vehicle Cache
        # Subtest: should add vehicle to cache and retrieve it
        ok 1 - should add vehicle to cache and retrieve it
          ---
          duration_ms: 517.895314
          ...
        # Subtest: should generate correct cache keys for vehicles
        ok 2 - should generate correct cache keys for vehicles
          ---
          duration_ms: 0.926419
          ...
        1..2
    ok 2 - Vehicle Cache
      ---
      duration_ms: 519.103789
      type: 'suite'
      ...
    # Subtest: Trailer Cache
        # Subtest: Should add trailer to cache and get the cache
        ok 1 - Should add trailer to cache and get the cache
          ---
          duration_ms: 475.720322
          ...
        # Subtest: should generate correct cache key for trailer
        ok 2 - should generate correct cache key for trailer
          ---
          duration_ms: 0.867208
          ...
        1..2
    ok 3 - Trailer Cache
      ---
      duration_ms: 476.825915
      type: 'suite'
      ...
    # Subtest: Driver Cache
        # Subtest: Should add del get driver cache
        ok 1 - Should add del get driver cache
          ---
          duration_ms: 474.913309
          ...
        # Subtest: Shoul cache key generated well
        ok 2 - Shoul cache key generated well
          ---
          duration_ms: 0.808709
          ...
        1..2
    ok 4 - Driver Cache
      ---
      duration_ms: 475.95331
      type: 'suite'
      ...
    # Subtest: Route Cache
        # Subtest: Should add del get driver cache
        ok 1 - Should add del get driver cache
          ---
          duration_ms: 469.524161
          ...
        # Subtest: Shoul cache key generated well
        ok 2 - Shoul cache key generated well
          ---
          duration_ms: 2.447006
          ...
        1..2
    ok 5 - Route Cache
      ---
      duration_ms: 472.216566
      type: 'suite'
      ...
    # Subtest: Shipment Cache
        # Subtest: Should add del get driver cache
        ok 1 - Should add del get driver cache
          ---
          duration_ms: 468.569282
          ...
        # Subtest: Shoul cache key generated well
        ok 2 - Shoul cache key generated well
          ---
          duration_ms: 0.555377
          ...
        1..2
    ok 6 - Shipment Cache
      ---
      duration_ms: 469.3349
      type: 'suite'
      ...
    # Subtest: Overview Cache
        # Subtest: Should add del get overview cache
        ok 1 - Should add del get overview cache
          ---
          duration_ms: 473.230007
          ...
        # Subtest: Shoul cache key generated well
        ok 2 - Shoul cache key generated well
          ---
          duration_ms: 0.308135
          ...
        1..2
    ok 7 - Overview Cache
      ---
      duration_ms: 473.840065
      type: 'suite'
      ...
    # Subtest: Warehouse Cache
        # Subtest: Should add del get warehouse cache
        ok 1 - Should add del get warehouse cache
          ---
          duration_ms: 465.362425
          ...
        # Subtest: Shoul cache key generated well
        ok 2 - Shoul cache key generated well
          ---
          duration_ms: 1.202094
          ...
        1..2
    ok 8 - Warehouse Cache
      ---
      duration_ms: 466.75324
      type: 'suite'
      ...
    # Subtest: Inventory Cache
        # Subtest: Should add del get inventory cache
        ok 1 - Should add del get inventory cache
          ---
          duration_ms: 465.838935
          ...
        # Subtest: Shoul cache key generated well
        ok 2 - Shoul cache key generated well
          ---
          duration_ms: 0.688906
          ...
        1..2
    ok 9 - Inventory Cache
      ---
      duration_ms: 466.722885
      type: 'suite'
      ...
    # Subtest: Customer Cache
        # Subtest: Should add del get customer cache
        ok 1 - Should add del get customer cache
          ---
          duration_ms: 462.126864
          ...
        # Subtest: Shoul cache key generated well
        ok 2 - Shoul cache key generated well
          ---
          duration_ms: 0.579031
          ...
        1..2
    ok 10 - Customer Cache
      ---
      duration_ms: 462.850445
      type: 'suite'
      ...
    # Subtest: Company Cache
        # Subtest: Should add del get company cache
        ok 1 - Should add del get company cache
          ---
          duration_ms: 471.783765
          ...
        # Subtest: Shoul cache key generated well
        ok 2 - Shoul cache key generated well
          ---
          duration_ms: 0.758485
          ...
        1..2
    ok 11 - Company Cache
      ---
      duration_ms: 472.771488
      type: 'suite'
      ...
    # Subtest: Exchange Rate Cache
        # Subtest: Should add del get exchange rate cache
        ok 1 - Should add del get exchange rate cache
          ---
          duration_ms: 465.260592
          ...
        # Subtest: Shoul cache key generated well
        ok 2 - Shoul cache key generated well
          ---
          duration_ms: 0.262339
          ...
        1..2
    ok 12 - Exchange Rate Cache
      ---
      duration_ms: 465.711342
      type: 'suite'
      ...
    # Subtest: Utils
        # Subtest: Should hash filters well
        ok 1 - Should hash filters well
          ---
          duration_ms: 0.292195
          ...
        1..1
    ok 13 - Utils
      ---
      duration_ms: 0.375069
      type: 'suite'
      ...
    1..13

ok 3 - All redis tests

---

duration_ms: 5566.7474
type: 'suite'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/lib/services/@/app/lib/db' imported from /home/runner/work/logitrackv2/logitrackv2/app/lib/services/exchangeRate.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338587880:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338587880:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338587880:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/lib/services/@/app/lib/db'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/lib/services/exchangeRate.test.ts

not ok 4 - /home/runner/work/logitrackv2/logitrackv2/app/lib/services/exchangeRate.test.ts

---

duration_ms: 605.146637
location: '/home/runner/work/logitrackv2/logitrackv2/app/lib/services/exchangeRate.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...

# (node:9625) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# Subtest: Testing Supabase Connection & Upload Actions

    # Subtest: Should properly instantiate the Supabase client
    ok 1 - Should properly instantiate the Supabase client
      ---
      duration_ms: 1.757088
      ...
    # Subtest: uploadImageAction Validation
        # Subtest: Should reject empty file data
        ok 1 - Should reject empty file data
          ---
          duration_ms: 4.075965
          ...
        # Subtest: Should reject unsupported image types
        ok 2 - Should reject unsupported image types
          ---
          duration_ms: 0.750752
          ...
        # Subtest: Should reject oversized images
        ok 3 - Should reject oversized images
          ---
          duration_ms: 4.876882
          ...
        1..3
    ok 2 - uploadImageAction Validation
      ---
      duration_ms: 10.138721
      type: 'suite'
      ...
    # Subtest: getSignedUrlAction Validation (Unauthenticated)
        # Subtest: Should redirect because user is unauthenticated
        ok 1 - Should redirect because user is unauthenticated
          ---
          duration_ms: 0.923123
          ...
        1..1
    ok 3 - getSignedUrlAction Validation (Unauthenticated)
      ---
      duration_ms: 1.034921
      type: 'suite'
      ...
    1..3

ok 5 - Testing Supabase Connection & Upload Actions

---

duration_ms: 13.919316
type: 'suite'
...

# Subtest: currency utils

    # Subtest: CURRENCY_SYMBOLS
        # Subtest: should export correct symbols for all supported currencies
        ok 1 - should export correct symbols for all supported currencies
          ---
          duration_ms: 2.616051
          ...
        1..1
    ok 1 - CURRENCY_SYMBOLS
      ---
      duration_ms: 3.674036
      type: 'suite'
      ...
    # Subtest: formatCurrency
        # Subtest: should format USD with default settings (no rate conversion)
        ok 1 - should format USD with default settings (no rate conversion)
          ---
          duration_ms: 24.427864
          ...
        # Subtest: should multiply amount by rate when isDirectAmount is false
        ok 2 - should multiply amount by rate when isDirectAmount is false
          ---
          duration_ms: 0.530019
          ...
        # Subtest: should NOT multiply when isDirectAmount is true
        ok 3 - should NOT multiply when isDirectAmount is true
          ---
          duration_ms: 0.525251
          ...
        # Subtest: should apply decimal places
        ok 4 - should apply decimal places
          ---
          duration_ms: 0.628623
          ...
        # Subtest: should format EUR with European locale (dot as thousand sep)
        ok 5 - should format EUR with European locale (dot as thousand sep)
          ---
          duration_ms: 0.587376
          ...
        # Subtest: should format TRY with Turkish lira symbol
        ok 6 - should format TRY with Turkish lira symbol
          ---
          duration_ms: 0.593928
          ...
        # Subtest: should format GBP with pound symbol
        ok 7 - should format GBP with pound symbol
          ---
          duration_ms: 0.531081
          ...
        # Subtest: should handle zero amount
        ok 8 - should handle zero amount
          ---
          duration_ms: 0.422298
          ...
        # Subtest: should handle negative amounts
        ok 9 - should handle negative amounts
          ---
          duration_ms: 0.661695
          ...
        1..9
    ok 2 - formatCurrency
      ---
      duration_ms: 29.791462
      type: 'suite'
      ...
    # Subtest: formatCurrencyCompact
        # Subtest: should format millions with M suffix
        ok 1 - should format millions with M suffix
          ---
          duration_ms: 0.644903
          ...
        # Subtest: should format thousands with k suffix
        ok 2 - should format thousands with k suffix
          ---
          duration_ms: 0.343561
          ...
        # Subtest: should format small amounts with full currency format
        ok 3 - should format small amounts with full currency format
          ---
          duration_ms: 0.448928
          ...
        # Subtest: should apply exchange rate for millions
        ok 4 - should apply exchange rate for millions
          ---
          duration_ms: 0.37475
          ...
        # Subtest: should apply exchange rate for thousands
        ok 5 - should apply exchange rate for thousands
          ---
          duration_ms: 0.3433
          ...
        # Subtest: should handle negative millions
        ok 6 - should handle negative millions
          ---
          duration_ms: 0.332691
          ...
        # Subtest: should handle negative thousands
        ok 7 - should handle negative thousands
          ---
          duration_ms: 0.373987
          ...
        # Subtest: should handle exactly 1_000_000
        ok 8 - should handle exactly 1_000_000
          ---
          duration_ms: 0.509791
          ...
        # Subtest: should handle exactly 1_000
        ok 9 - should handle exactly 1_000
          ---
          duration_ms: 0.388806
          ...
        1..9
    ok 3 - formatCurrencyCompact
      ---
      duration_ms: 4.432221
      type: 'suite'
      ...
    # Subtest: createCurrencyFormatter
        # Subtest: should return a formatter object with all expected properties
        ok 1 - should return a formatter object with all expected properties
          ---
          duration_ms: 1.144315
          ...
        # Subtest: format() should apply rate multiplication
        ok 2 - format() should apply rate multiplication
          ---
          duration_ms: 0.454508
          ...
        # Subtest: formatDirect() should NOT apply rate multiplication
        ok 3 - formatDirect() should NOT apply rate multiplication
          ---
          duration_ms: 2.258264
          ...
        # Subtest: compact() should format large amounts compactly
        ok 4 - compact() should format large amounts compactly
          ---
          duration_ms: 0.47173
          ...
        # Subtest: should default to USD with rate 1
        ok 5 - should default to USD with rate 1
          ---
          duration_ms: 3.562698
          ...
        # Subtest: should correctly expose TRY symbol
        ok 6 - should correctly expose TRY symbol
          ---
          duration_ms: 0.291283
          ...
        1..6
    ok 4 - createCurrencyFormatter
      ---
      duration_ms: 8.60645
      type: 'suite'
      ...
    1..4

ok 6 - currency utils

---

duration_ms: 47.781652
type: 'suite'
...

# Subtest: date utils

    # Subtest: formatDisplayDate
        # Subtest: should return '-' for null input
        ok 1 - should return '-' for null input
          ---
          duration_ms: 2.672006
          ...
        # Subtest: should return '-' for undefined input
        ok 2 - should return '-' for undefined input
          ---
          duration_ms: 0.388985
          ...
        # Subtest: should format date in UTC with DD/MM/YYYY format
        ok 3 - should format date in UTC with DD/MM/YYYY format
          ---
          duration_ms: 26.58039
          ...
        # Subtest: should format date in Istanbul timezone (UTC+3)
        ok 4 - should format date in Istanbul timezone (UTC+3)
          ---
          duration_ms: 1.087579
          ...
        # Subtest: should format date in New York timezone (UTC-4)
        ok 5 - should format date in New York timezone (UTC-4)
          ---
          duration_ms: 0.725904
          ...
        # Subtest: should handle timezone date shift (near midnight)
        ok 6 - should handle timezone date shift (near midnight)
          ---
          duration_ms: 0.732176
          ...
        # Subtest: should accept a Date object
        ok 7 - should accept a Date object
          ---
          duration_ms: 0.587235
          ...
        # Subtest: should accept a Unix timestamp (number)
        ok 8 - should accept a Unix timestamp (number)
          ---
          duration_ms: 0.730042
          ...
        # Subtest: should use defaultSettings (UTC, DD/MM/YYYY, 24h) when none provided
        ok 9 - should use defaultSettings (UTC, DD/MM/YYYY, 24h) when none provided
          ---
          duration_ms: 0.726706
          ...
        1..9
    ok 1 - formatDisplayDate
      ---
      duration_ms: 35.928864
      type: 'suite'
      ...
    # Subtest: formatDisplayTime
        # Subtest: should return '-' for null
        ok 1 - should return '-' for null
          ---
          duration_ms: 0.575173
          ...
        # Subtest: should return '-' for undefined
        ok 2 - should return '-' for undefined
          ---
          duration_ms: 0.368427
          ...
        # Subtest: should format time in 24h format
        ok 3 - should format time in 24h format
          ---
          duration_ms: 0.593227
          ...
        # Subtest: should format time in 12h format
        ok 4 - should format time in 12h format
          ---
          duration_ms: 1.001779
          ...
        # Subtest: should correctly convert timezone offset in time
        ok 5 - should correctly convert timezone offset in time
          ---
          duration_ms: 0.736214
          ...
        # Subtest: should handle midnight correctly in 24h
        ok 6 - should handle midnight correctly in 24h
          ---
          duration_ms: 0.591834
          ...
        1..6
    ok 2 - formatDisplayTime
      ---
      duration_ms: 4.392036
      type: 'suite'
      ...
    # Subtest: formatDisplayDateTime
        # Subtest: should return '-' for null
        ok 1 - should return '-' for null
          ---
          duration_ms: 0.475167
          ...
        # Subtest: should return '-' for undefined
        ok 2 - should return '-' for undefined
          ---
          duration_ms: 0.376432
          ...
        # Subtest: should combine date and time in 24h with UTC
        ok 3 - should combine date and time in 24h with UTC
          ---
          duration_ms: 0.861267
          ...
        # Subtest: should combine date and time in 12h for New York
        ok 4 - should combine date and time in 12h for New York
          ---
          duration_ms: 0.687172
          ...
        # Subtest: should combine date and time for Istanbul
        ok 5 - should combine date and time for Istanbul
          ---
          duration_ms: 0.630307
          ...
        1..5
    ok 3 - formatDisplayDateTime
      ---
      duration_ms: 3.441562
      type: 'suite'
      ...
    # Subtest: getUserNow
        # Subtest: should return a dayjs object
        ok 1 - should return a dayjs object
          ---
          duration_ms: 0.947849
          ...
        # Subtest: should return current time (within 2 seconds)
        ok 2 - should return current time (within 2 seconds)
          ---
          duration_ms: 0.74497
          ...
        # Subtest: should return time in the specified timezone
        ok 3 - should return time in the specified timezone
          ---
          duration_ms: 0.725063
          ...
        # Subtest: should default to UTC if no timezone provided
        ok 4 - should default to UTC if no timezone provided
          ---
          duration_ms: 0.690298
          ...
        1..4
    ok 4 - getUserNow
      ---
      duration_ms: 3.417197
      type: 'suite'
      ...
    # Subtest: toUTC
        # Subtest: should convert Istanbul local time string to UTC Date
        ok 1 - should convert Istanbul local time string to UTC Date
          ---
          duration_ms: 1.782597
          ...
        # Subtest: should convert New York local time string to UTC Date
        ok 2 - should convert New York local time string to UTC Date
          ---
          duration_ms: 0.866838
          ...
        # Subtest: should return a JS Date instance
        ok 3 - should return a JS Date instance
          ---
          duration_ms: 0.741414
          ...
        # Subtest: should handle Date object input
        ok 4 - should handle Date object input
          ---
          duration_ms: 0.513337
          ...
        1..4
    ok 5 - toUTC
      ---
      duration_ms: 6.455306
      type: 'suite'
      ...
    # Subtest: utcToUserTz
        # Subtest: should return null for null input
        ok 1 - should return null for null input
          ---
          duration_ms: 0.441154
          ...
        # Subtest: should return null for undefined input
        ok 2 - should return null for undefined input
          ---
          duration_ms: 0.268602
          ...
        # Subtest: should convert UTC string to Istanbul timezone
        ok 3 - should convert UTC string to Istanbul timezone
          ---
          duration_ms: 4.374503
          ...
        # Subtest: should convert UTC string to New York timezone
        ok 4 - should convert UTC string to New York timezone
          ---
          duration_ms: 0.65345
          ...
        # Subtest: should accept a Date object as input
        ok 5 - should accept a Date object as input
          ---
          duration_ms: 0.65404
          ...
        # Subtest: should accept a Unix timestamp (number)
        ok 6 - should accept a Unix timestamp (number)
          ---
          duration_ms: 1.091947
          ...
        1..6
    ok 6 - utcToUserTz
      ---
      duration_ms: 7.905191
      type: 'suite'
      ...
    # Subtest: formatSmartTimestamp
        # Subtest: should return '-' for null
        ok 1 - should return '-' for null
          ---
          duration_ms: 0.429302
          ...
        # Subtest: should return '-' for undefined
        ok 2 - should return '-' for undefined
          ---
          duration_ms: 0.239687
          ...
        # Subtest: should return only time (HH:mm) if the date is today in 24h
        ok 3 - should return only time (HH:mm) if the date is today in 24h
          ---
          duration_ms: 1.359958
          ...
        # Subtest: should return full date+time if the date is NOT today
        ok 4 - should return full date+time if the date is NOT today
          ---
          duration_ms: 1.314262
          ...
        # Subtest: should return 12h time format for today if settings say 12h
        ok 5 - should return 12h time format for today if settings say 12h
          ---
          duration_ms: 1.233412
          ...
        # Subtest: should return full format for past date with 12h setting
        ok 6 - should return full format for past date with 12h setting
          ---
          duration_ms: 1.284247
          ...
        1..6
    ok 7 - formatSmartTimestamp
      ---
      duration_ms: 6.152381
      type: 'suite'
      ...
    1..7

ok 7 - date utils

---

duration_ms: 69.005808
type: 'suite'
...

# Subtest: fileUtils

    # Subtest: fileToBase64
        # Subtest: should return a data URL string for a given File
        ok 1 - should return a data URL string for a given File
          ---
          duration_ms: 2.437409
          ...
        # Subtest: returned string should contain base64 content
        ok 2 - returned string should contain base64 content
          ---
          duration_ms: 0.560846
          ...
        # Subtest: should resolve (not reject) on successful read
        ok 3 - should resolve (not reject) on successful read
          ---
          duration_ms: 0.592846
          ...
        # Subtest: should reject when FileReader fires onerror
        ok 4 - should reject when FileReader fires onerror
          ---
          duration_ms: 0.49788
          ...
        1..4
    ok 1 - fileToBase64
      ---
      duration_ms: 4.921433
      type: 'suite'
      ...
    1..1

ok 8 - fileUtils

---

duration_ms: 11.417165
type: 'suite'
...
1..8

# tests 118

# suites 38

# pass 117

# fail 1

# cancelled 0

# skipped 0

# todo 0

════════════════════════════════════════════════════════════
📦 Batch 33 / 33 (4 dosya)
════════════════════════════════════════════════════════════
• app/lib/vehicleTracking.test.ts
• app/manifest.test.ts
• app/robots.test.ts
• app/sitemap.test.ts

TAP version 13

# (node:9735) ExperimentalWarning: Module mocking is an experimental feature and might change at any time

# (Use `node --trace-warnings ...` to show where the warning was created)

# Subtest: Vehicle Tracking

    # Subtest: subscribeToVehicleLocation
        # Subtest: should subscribe to a specific vehicle and return unsubscribe function
        ok 1 - should subscribe to a specific vehicle and return unsubscribe function
          ---
          duration_ms: 15.121748
          ...
        1..1
    ok 1 - subscribeToVehicleLocation
      ---
      duration_ms: 15.981352
      type: 'suite'
      ...
    # Subtest: subscribeToAllVehicles
        # Subtest: should subscribe to all vehicles and return unsubscribe function
        ok 1 - should subscribe to all vehicles and return unsubscribe function
          ---
          duration_ms: 4.019901
          ...
        1..1
    ok 2 - subscribeToAllVehicles
      ---
      duration_ms: 4.294203
      type: 'suite'
      ...
    1..2

ok 1 - Vehicle Tracking

---

duration_ms: 20.843454
type: 'suite'
...

# Subtest: Manifest Generate

    # Subtest: should_ReturnCorrectManifestConfig
    ok 1 - should_ReturnCorrectManifestConfig
      ---
      duration_ms: 2.482964
      ...
    1..1

ok 2 - Manifest Generate

---

duration_ms: 13.448274
type: 'suite'
...

# Subtest: Robots Generate

    # Subtest: should_ReturnCorrectRobotsConfig
    ok 1 - should_ReturnCorrectRobotsConfig
      ---
      duration_ms: 2.775549
      ...
    1..1

ok 3 - Robots Generate

---

duration_ms: 10.500483
type: 'suite'
...

# node:internal/modules/run_main:123

# triggerUncaughtException(

# ^

# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/logitrackv2/logitrackv2/app/@/app/lib/language/navigation' imported from /home/runner/work/logitrackv2/logitrackv2/app/sitemap.test.ts

# at finalizeResolution (node:internal/modules/esm/resolve:283:11)

# at moduleResolve (node:internal/modules/esm/resolve:952:10)

# at defaultResolve (node:internal/modules/esm/resolve:1188:11)

# at nextResolve (node:internal/modules/esm/hooks:864:28)

# at resolveBase (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338594905:2:3744)

# at async resolveDirectory (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338594905:2:4237)

# at async resolve (file:///home/runner/work/logitrackv2/logitrackv2/node_modules/tsx/dist/esm/index.mjs?1780338594905:2:5355)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async nextResolve (node:internal/modules/esm/hooks:864:22)

# at async Hooks.resolve (node:internal/modules/esm/hooks:306:24) {

# code: 'ERR_MODULE_NOT_FOUND',

# url: 'file:///home/runner/work/logitrackv2/logitrackv2/app/@/app/lib/language/navigation'

# }

# Node.js v20.20.2

# Subtest: /home/runner/work/logitrackv2/logitrackv2/app/sitemap.test.ts

not ok 4 - /home/runner/work/logitrackv2/logitrackv2/app/sitemap.test.ts

---

duration_ms: 556.520659
location: '/home/runner/work/logitrackv2/logitrackv2/app/sitemap.test.ts:1:1'
failureType: 'testCodeFailure'
exitCode: 1
signal: ~
error: 'test failed'
code: 'ERR_TEST_FAILURE'
...
1..4

# tests 5

# suites 5

# pass 4

# fail 1

# cancelled 0

# skipped 0

# todo 0

════════════════════════════════════════════════════════════
❌ 33 / 33 batch hata ile bitti.
Error: Process completed with exit code 1.
