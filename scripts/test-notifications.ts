import { createNotification } from "../app/lib/notifications";

/**
 * RED ALPHABET TEST: This script runs purely on Firebase RTDB.
 * No Prisma dependency.
 */

async function main() {
  console.log("🚀 Testing Notification Engine (Firebase-Only Mode)");

  // Test Settings
  const testUserId = "user-123";
  const testCompanyId = "company-logi";
  const testRole = "DRIVER";

  console.log(`\nConfigured Targets:`);
  console.log(`- User ID: ${testUserId}`);
  console.log(`- Company ID: ${testCompanyId}`);
  console.log(`- Role: ${testRole}`);

  try {
    // 1. Test Individual Notification
    console.log("\n--- Testing Individual Notification ---");
    const res1 = await createNotification(
      { userId: testUserId },
      {
        title: "Personal Alert",
        message: "This is a direct-to-inbox notification.",
        type: "INFO",
        link: "/profile"
      }
    );
    console.log(`✅ Sent. Path: ${res1?.path}`);

    // 2. Test Company-wide Notification
    console.log("\n--- Testing Company-wide Notification ---");
    const res2 = await createNotification(
      { companyId: testCompanyId },
      {
        title: "Company Bulletin",
        message: "Attention all personnel in this company!",
        type: "WARNING"
      }
    );
    console.log(`✅ Sent. Path: ${res2?.path}`);

    // 3. Test Role-based Notification
    console.log(`\n--- Testing Role-based Notification (${testRole}) ---`);
    const res3 = await createNotification(
      { companyId: testCompanyId, roleName: testRole },
      {
        title: "Role Mission",
        message: `Dispatching to all ${testRole}s. Check your routes.`,
        type: "SUCCESS"
      }
    );
    console.log(`✅ Sent. Path: ${res3?.path}`);

    console.log("\n🏁 Done! Real-time nodes updated in Firebase.");
    console.log("Check the Realtime Database console to see the new entries.");
  } catch (err) {
    console.error("❌ Notification failed:", err);
  }
}

main();
