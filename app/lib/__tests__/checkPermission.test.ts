import test from "node:test";
import assert from "node:assert";
import { checkPermission } from "../controllers/utils/checkPermission";

test("checkPermission utility tests", async (t) => {
  await t.test("Happy Path: User with exact role in mapping allowed", async () => {
    const user = {
      id: "user-1",
      companyId: "company-1",
      roleName: "Warehouse Manager", // Mapped to role_manager in roles.json
    };

    const result = await checkPermission(user, "company-1", ["role_manager"]);
    assert.deepStrictEqual(result, {
      id: "user-1",
      companyId: "company-1",
      roleName: "Warehouse Manager",
    });
  });

  await t.test("Happy Path: User with alias role allowed (case-insensitive)", async () => {
    const user = {
      id: "user-2",
      companyId: "company-1",
      roleName: "fleet manager", // Alias of role_manager in roles.json
    };

    const result = await checkPermission(user, "company-1", ["ROLE_MANAGER"]);
    assert.deepStrictEqual(result, {
      id: "user-2",
      companyId: "company-1",
      roleName: "fleet manager",
    });
  });

  await t.test("Happy Path: User with admin role allowed", async () => {
    const user = {
      id: "user-3",
      companyId: "company-1",
      roleName: "Super Admin", // Mapped to role_admin in roles.json
    };

    const result = await checkPermission(user, "company-1", ["role_admin"]);
    assert.deepStrictEqual(result, {
      id: "user-3",
      companyId: "company-1",
      roleName: "Super Admin",
    });
  });

  await t.test("Sad Path: User has mismatched companyId", async () => {
    const user = {
      id: "user-4",
      companyId: "company-2",
      roleName: "Administrator",
    };

    await assert.rejects(
      async () => {
        await checkPermission(user, "company-1", ["role_admin"]);
      },
      {
        message: "User is not authorized to access this company",
      }
    );
  });

  await t.test("Sad Path: User has no company assigned", async () => {
    const user = {
      id: "user-5",
      companyId: null,
      roleName: "Administrator",
    };

    await assert.rejects(
      async () => {
        await checkPermission(user, null, ["role_admin"]);
      },
      {
        message: "No company assigned to this user",
      }
    );
  });

  await t.test("Sad Path: User has insufficient roles", async () => {
    const user = {
      id: "user-6",
      companyId: "company-1",
      roleName: "Driver", // roleName for Driver
    };

    await assert.rejects(
      async () => {
        await checkPermission(user, "company-1", ["role_admin", "role_manager"]);
      },
      {
        message: "Insufficient permissions. Required roles: role_admin, role_manager",
      }
    );
  });

  await t.test("Edge Case: allowNoCompany is true and companyId is null", async () => {
    const user = {
      id: "user-7",
      companyId: null,
      roleName: "Super Admin",
    };

    const result = await checkPermission(user, null, ["role_admin"], {
      allowNoCompany: true,
    });

    assert.deepStrictEqual(result, {
      id: "user-7",
      companyId: null,
      roleName: "Super Admin",
    });
  });
});
