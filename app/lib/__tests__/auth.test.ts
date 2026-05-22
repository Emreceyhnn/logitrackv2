import test from "node:test";
import assert from "node:assert";
import { SignJWT, jwtVerify } from "jose";

test("jose-based JWT authentication tests", async (t) => {
  const secretString = "super-secret-key-at-least-32-characters-long";
  const secret = new TextEncoder().encode(secretString);

  await t.test("Happy Path: Sign and verify a valid payload", async () => {
    const payload = {
      id: "user-123",
      role: "role_admin",
      companyId: "company-789",
    };

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setJti("test-jti-123")
      .setExpirationTime("1h")
      .sign(secret);

    assert.ok(token);
    assert.strictEqual(typeof token, "string");

    const { payload: verifiedPayload } = await jwtVerify(token, secret);

    assert.strictEqual(verifiedPayload.id, payload.id);
    assert.strictEqual(verifiedPayload.role, payload.role);
    assert.strictEqual(verifiedPayload.companyId, payload.companyId);
  });

  await t.test("Sad Path: Verify with incorrect secret throws error", async () => {
    const payload = { id: "user-123" };
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);

    const badSecret = new TextEncoder().encode("another-incorrect-secret-key-long-enough");

    await assert.rejects(
      async () => {
        await jwtVerify(token, badSecret);
      },
      (err: Error) => {
        return err.name === "JWTSignatureFailed" || err.message.includes("signature");
      }
    );
  });

  await t.test("Sad Path: Expired token throws error", async () => {
    const payload = { id: "user-123" };
    // Create token that is already expired
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("-1s") // expired 1 second ago
      .sign(secret);

    await assert.rejects(
      async () => {
        await jwtVerify(token, secret);
      },
      (err: Error) => {
        return err.name === "JWTExpired" || err.message.includes("expired");
      }
    );
  });

  await t.test("Sad Path: Malformed token throws error", async () => {
    await assert.rejects(
      async () => {
        await jwtVerify("not.a.valid.token", secret);
      },
      (err: Error) => {
        return err.name === "JWTInvalid" || err.message.includes("Invalid");
      }
    );
  });
});
