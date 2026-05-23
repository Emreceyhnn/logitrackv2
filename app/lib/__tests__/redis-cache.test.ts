import test from "node:test";
import assert from "node:assert";

// Set environment variables before importing redis.ts to ensure Redis class initialization succeeds
process.env.KV_REST_API_URL = "https://mock-url.upstash.io";
process.env.KV_REST_API_TOKEN = "mock-token";

test("redis caching and lock logic", async (t) => {
  // Dynamically import to ensure environment variables are populated first
  const { withCache, invalidatePattern } = await import("../redis");

  const originalFetch = globalThis.fetch;
  let dbState: Record<string, unknown> = {};
  let setDbState: Record<string, Set<string>> = {};
  let fetcherCalledTimes = 0;

  t.beforeEach(() => {
    dbState = {};
    setDbState = {};
    fetcherCalledTimes = 0;
    
    // Set up global fetch mock
    globalThis.fetch = (async (url: string, init?: RequestInit) => {
      const body = init?.body ? JSON.parse(init.body as string) : null;
      if (!Array.isArray(body)) {
        return {
          ok: true,
          status: 200,
          text: async () => JSON.stringify({ error: "Invalid command body" })
        } as Response;
      }

      // Check if nested (pipeline/auto-pipeline) or flat (single command)
      const isNested = Array.isArray(body[0]);
      const commands = isNested ? body : [body];

      const results = commands.map((cmdArray: string[]) => {
        const cmd = cmdArray[0].toLowerCase();

        if (cmd === "get") {
          const key = cmdArray[1];
          return { result: dbState[key] !== undefined ? dbState[key] : null };
        }

        if (cmd === "set") {
          const key = cmdArray[1];
          const val = cmdArray[2];
          
          const hasNx = cmdArray.includes("nx") || cmdArray.includes("NX");
          if (hasNx) {
            if (dbState[key] !== undefined && dbState[key] !== null) {
              return { result: null };
            }
          }
          dbState[key] = val;
          return { result: "OK" };
        }

        if (cmd === "eval") {
          const lockKey = cmdArray[3];
          const lockValue = cmdArray[4];
          if (dbState[lockKey] === lockValue) {
            delete dbState[lockKey];
            return { result: 1 };
          }
          return { result: 0 };
        }

        if (cmd === "sadd") {
          const setKey = cmdArray[1];
          const val = cmdArray[2];
          if (!setDbState[setKey]) {
            setDbState[setKey] = new Set();
          }
          setDbState[setKey].add(val);
          return { result: 1 };
        }

        if (cmd === "expire") {
          return { result: 1 };
        }

        if (cmd === "smembers") {
          const setKey = cmdArray[1];
          return { result: setDbState[setKey] ? Array.from(setDbState[setKey]) : [] };
        }

        if (cmd === "del") {
          const key = cmdArray[1];
          let count = 0;
          if (dbState[key] !== undefined) {
            delete dbState[key];
            count = 1;
          }
          if (setDbState[key] !== undefined) {
            delete setDbState[key];
            count = 1;
          }
          return { result: count };
        }

        if (cmd === "scan") {
          return { result: ["0", ["unrecognized:pattern:key"]] };
        }

        return { result: null };
      });

      const responsePayload = isNested ? results : results[0];

      return {
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        text: async () => JSON.stringify(responsePayload)
      } as Response;
    }) as never;
  });

  t.afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  await t.test("withCache hits cache directly when value exists", async () => {
    dbState["test:existing"] = "cached-value";

    const mockFetcher = async () => {
      fetcherCalledTimes++;
      return "fresh-data";
    };

    const res = await withCache("test:existing", mockFetcher, 100);
    assert.strictEqual(res, "cached-value");
    assert.strictEqual(fetcherCalledTimes, 0);
  });

  await t.test("withCache acquires lock, fetches and caches on cache miss", async () => {
    const mockFetcher = async () => {
      fetcherCalledTimes++;
      return "fresh-data";
    };

    const res = await withCache("vehicles:123:list:test", mockFetcher, 100);
    assert.strictEqual(res, "fresh-data");
    assert.strictEqual(fetcherCalledTimes, 1);
    
    // Verify it is cached and tracked
    assert.strictEqual(dbState["vehicles:123:list:test"], "fresh-data");
    assert.ok(setDbState["keysSet:vehicles:123"]?.has("vehicles:123:list:test"));
  });

  await t.test("withCache stampede protection: concurrent requests queue and reuse single fetcher execution", async () => {
    const mockFetcher = async () => {
      fetcherCalledTimes++;
      await new Promise((resolve) => setTimeout(resolve, 150));
      return "concurrent-result";
    };

    // Run concurrent queries
    const [res1, res2] = await Promise.all([
      withCache("vehicles:123:list:concurrent", mockFetcher, 100),
      withCache("vehicles:123:list:concurrent", mockFetcher, 100)
    ]);

    assert.strictEqual(res1, "concurrent-result");
    assert.strictEqual(res2, "concurrent-result");
    assert.strictEqual(fetcherCalledTimes, 1, "Fetcher must only be called once");
  });

  await t.test("invalidatePattern uses tracked keys set and deletes via pipeline", async () => {
    dbState["vehicles:456:list:1"] = "val1";
    dbState["vehicles:456:list:2"] = "val2";
    setDbState["keysSet:vehicles:456"] = new Set(["vehicles:456:list:1", "vehicles:456:list:2"]);

    await invalidatePattern("vehicles:456:*");
    
    assert.strictEqual(dbState["vehicles:456:list:1"], undefined);
    assert.strictEqual(dbState["vehicles:456:list:2"], undefined);
    assert.strictEqual(setDbState["keysSet:vehicles:456"], undefined);
  });

  await t.test("invalidatePattern falls back to SCAN if pattern tracking set cannot be parsed", async () => {
    dbState["unrecognized:pattern:key"] = "some-val";

    await invalidatePattern("unrecognized");

    assert.strictEqual(dbState["unrecognized:pattern:key"], undefined);
  });
});
