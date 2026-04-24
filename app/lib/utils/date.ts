import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/tr";
import "dayjs/locale/en";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

export interface DateSettings {
  timezone: string;
  dateFormat: string;
  timeFormat: string;
}

const defaultSettings: DateSettings = {
  timezone: "UTC",
  dateFormat: "DD/MM/YYYY",
  timeFormat: "24h",
};

/**
 * Formats a date string or object according to user settings.
 * All input dates are assumed to be in UTC.
 */
export function formatDisplayDate(
  date: string | Date | null | undefined,
  settings: DateSettings = defaultSettings
): string {
  if (!date) return "-";

  const d = dayjs.utc(date).tz(settings.timezone);
  return d.format(settings.dateFormat);
}

/**
 * Formats a time according to user settings.
 */
export function formatDisplayTime(
  date: string | Date | null | undefined,
  settings: DateSettings = defaultSettings
): string {
  if (!date) return "-";

  const d = dayjs.utc(date).tz(settings.timezone);
  const format = settings.timeFormat === "12h" ? "hh:mm A" : "HH:mm";
  return d.format(format);
}

/**
 * Formats both date and time.
 */
export function formatDisplayDateTime(
  date: string | Date | null | undefined,
  settings: DateSettings = defaultSettings
): string {
  if (!date) return "-";

  const d = dayjs.utc(date).tz(settings.timezone);
  const timeFormat = settings.timeFormat === "12h" ? "hh:mm A" : "HH:mm";
  return d.format(`${settings.dateFormat} ${timeFormat}`);
}

/**
 * Gets the current time in the user's timezone.
 */
export function getUserNow(userTimezone: string = "UTC"): dayjs.Dayjs {
  return dayjs().tz(userTimezone);
}

/**
 * Converts a local date/time to UTC for storage.
 * The date is interpreted as being in the given timezone (wall-clock time).
 * Use this when saving user-input times to the database.
 *
 * @param date - A JS Date, dayjs object, or ISO string representing
 *               a wall-clock time in `userTimezone`
 * @param userTimezone - IANA timezone string, e.g. "Europe/Istanbul"
 */
export function toUTC(date: string | Date | dayjs.Dayjs, userTimezone: string): Date {
  if (date instanceof Date) {
    // If it's a JS Date, we treat it as a "wall-clock" time in the user's local timezone.
    // dayjs(date) would treat it as absolute UTC/System moment.
    // So we format it first to get the YYYY-MM-DD HH:mm:ss representation.
    const localStr = dayjs(date).format("YYYY-MM-DD HH:mm:ss");
    return dayjs.tz(localStr, userTimezone).utc().toDate();
  }
  return dayjs.tz(date, userTimezone).utc().toDate();
}

/**
 * Converts a UTC date from the database to a dayjs object in the user's timezone.
 * Use this when pre-filling datetime pickers with existing data.
 *
 * @param utcDate - UTC date from the database
 * @param userTimezone - IANA timezone string, e.g. "Europe/Istanbul"
 */
export function utcToUserTz(
  utcDate: string | Date | null | undefined,
  userTimezone: string
): dayjs.Dayjs | null {
  if (!utcDate) return null;
  return dayjs.utc(utcDate).tz(userTimezone);
}
