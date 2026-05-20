import test from "node:test";
import assert from "node:assert";
import dayjs from "dayjs";
import {
  formatDisplayDate,
  formatDisplayTime,
  formatDisplayDateTime,
  getUserNow,
  toUTC,
  utcToUserTz,
  formatSmartTimestamp,
  DateSettings,
} from "../utils/date";

const istanbulSettings: DateSettings = {
  timezone: "Europe/Istanbul",
  dateFormat: "DD/MM/YYYY",
  timeFormat: "24h",
};

const nycSettings12h: DateSettings = {
  timezone: "America/New_York",
  dateFormat: "YYYY-MM-DD",
  timeFormat: "12h",
};

test("date and timezone utilities", async (t) => {
  const utcTestTime = "2026-05-19T12:00:00Z"; // Noon UTC

  await t.test("formatDisplayDate formats correctly based on timezone and pattern", () => {
    // Noon UTC is 3 PM in Istanbul (UTC+3) -> 19/05/2026
    assert.strictEqual(formatDisplayDate(utcTestTime, istanbulSettings), "19/05/2026");
    
    // Noon UTC is 8 AM in New York (UTC-4 in May due to DST) -> 2026-05-19
    assert.strictEqual(formatDisplayDate(utcTestTime, nycSettings12h), "2026-05-19");

    // Null/undefined values
    assert.strictEqual(formatDisplayDate(null), "-");
    assert.strictEqual(formatDisplayDate(undefined), "-");
  });

  await t.test("formatDisplayTime formats correctly with 12h/24h formats and timezone conversion", () => {
    // 3 PM in Istanbul -> 15:00
    assert.strictEqual(formatDisplayTime(utcTestTime, istanbulSettings), "15:00");
    
    // 8 AM in New York -> 08:00 AM
    assert.strictEqual(formatDisplayTime(utcTestTime, nycSettings12h), "08:00 AM");

    // Null/undefined values
    assert.strictEqual(formatDisplayTime(null), "-");
  });

  await t.test("formatDisplayDateTime formats full string", () => {
    assert.strictEqual(formatDisplayDateTime(utcTestTime, istanbulSettings), "19/05/2026 15:00");
    assert.strictEqual(formatDisplayDateTime(utcTestTime, nycSettings12h), "2026-05-19 08:00 AM");
    assert.strictEqual(formatDisplayDateTime(null), "-");
  });

  await t.test("getUserNow returns current timezone dayjs instance", () => {
    const nowIstanbul = getUserNow("Europe/Istanbul");
    const nowUTC = getUserNow("UTC");
    
    // The difference in hours should match timezone offsets
    const diffHours = nowIstanbul.hour() - nowUTC.hour();
    // Istanbul is UTC+3. Account for day wrap-around by using modulo
    assert.strictEqual((diffHours + 24) % 24, 3);
  });

  await t.test("toUTC parses timezone-local input to UTC Date", () => {
    // Passing "2026-05-19 15:00:00" local time in Istanbul (which is 12:00:00 UTC)
    const localStr = "2026-05-19 15:00:00";
    const resultDate = toUTC(localStr, "Europe/Istanbul");
    assert.strictEqual(resultDate.toISOString(), "2026-05-19T12:00:00.000Z");

    const jsDate = new Date("2026-05-19T15:00:00");
    // Passing Date object which represents machine local time (or parsed as local)
    // toUTC will extract the local date components and convert from Istanbul to UTC
    const resultFromDate = toUTC(jsDate, "Europe/Istanbul");
    // Should successfully return a JS Date instance
    assert.ok(resultFromDate instanceof Date);
  });

  await t.test("utcToUserTz parses UTC date and converts to local Dayjs instance", () => {
    const localDayjs = utcToUserTz(utcTestTime, "Europe/Istanbul");
    assert.ok(localDayjs !== null);
    assert.strictEqual(localDayjs!.hour(), 15);
    
    assert.strictEqual(utcToUserTz(null, "UTC"), null);
  });

  await t.test("formatSmartTimestamp formats dynamically based on relative day", () => {
    // Smart timestamp for "now" should return only the time format
    const nowISO = dayjs().utc().toISOString();
    const formattedToday = formatSmartTimestamp(nowISO, istanbulSettings);
    // Should be in HH:mm format, so matches a regex of \d{2}:\d{2} and does not contain "/"
    assert.match(formattedToday, /^\d{2}:\d{2}$/);
    assert.ok(!formattedToday.includes("/"));

    // Smart timestamp for 2 days ago should return date and time
    const pastISO = dayjs().subtract(2, "day").utc().toISOString();
    const formattedPast = formatSmartTimestamp(pastISO, istanbulSettings);
    // Should contain date structure DD/MM/YYYY and time HH:mm
    assert.match(formattedPast, /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/);

    // Empty value fallback
    assert.strictEqual(formatSmartTimestamp(null), "-");
  });
});
