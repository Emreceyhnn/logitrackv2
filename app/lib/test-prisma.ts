import { getAuthenticatedUser } from "./auth-middleware";
import { getWarehousesWithDashboardData } from "./controllers/warehouse";

async function test() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      console.log("No user found - are you logged in?");
      return;
    }
    console.log("Testing getWarehousesWithDashboardData...");
    const result = await getWarehousesWithDashboardData(1, 10);
    console.log("Success!", result.warehouses.length, "warehouses found.");
  } catch (error) {
    console.error("Prisma Error caught in test script:", error);
  }
}

test();
