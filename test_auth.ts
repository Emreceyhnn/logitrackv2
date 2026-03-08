import { getUserSession } from "./app/lib/actions/auth";

async function test() {
  try {
    console.log("Calling getUserSession...");
    const session = await getUserSession();
    console.log("Session:", session);
  } catch (error) {
    console.error("getUserSession failed:", error);
  }
}

test();
