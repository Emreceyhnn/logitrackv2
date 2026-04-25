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

export function formatDisplayDate(
  date: string | Date | null | undefined,
  settings: DateSettings = defaultSettings
): string {
  if (!date) return "-";

  const d = dayjs.utc(date).tz(settings.timezone);
  return d.format(settings.dateFormat);
}

export function formatDisplayTime(
  date: string | Date | null | undefined,
  settings: DateSettings = defaultSettings
): string {
  if (!date) return "-";

  const d = dayjs.utc(date).tz(settings.timezone);
  const format = settings.timeFormat === "12h" ? "hh:mm A" : "HH:mm";
  return d.format(format);
}

export function formatDisplayDateTime(
  date: string | Date | null | undefined,
  settings: DateSettings = defaultSettings
): string {
  if (!date) return "-";

  const d = dayjs.utc(date).tz(settings.timezone);
  const timeFormat = settings.timeFormat === "12h" ? "hh:mm A" : "HH:mm";
  return d.format(`${settings.dateFormat} ${timeFormat}`);
}

export function getUserNow(userTimezone: string = "UTC"): dayjs.Dayjs {
  return dayjs().tz(userTimezone);
}

export function toUTC(
  date: string | Date | dayjs.Dayjs,
  userTimezone: string
): Date {
  if (date instanceof Date) {
    const localStr = dayjs(date).format("YYYY-MM-DD HH:mm:ss");
    return dayjs.tz(localStr, userTimezone).utc().toDate();
  }
  return dayjs.tz(date, userTimezone).utc().toDate();
}

export function utcToUserTz(
  utcDate: string | Date | null | undefined,
  userTimezone: string
): dayjs.Dayjs | null {
  if (!utcDate) return null;
  return dayjs.utc(utcDate).tz(userTimezone);
}
