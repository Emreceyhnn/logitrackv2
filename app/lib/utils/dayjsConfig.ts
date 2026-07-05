import dayjs from "dayjs";
import trLocale from "dayjs/locale/tr";
import enLocale from "dayjs/locale/en";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";

/**
 * Centralised dayjs configuration. Import this module for its side effects
 * anywhere dayjs is used (date formatting, MUI x-date-pickers, calendars) so
 * every entry point configures the shared singleton identically.
 *
 * The `localizedFormat` plugin is what gives each locale a `formats.LT` entry.
 * MUI's AdapterDayjs.is12HourCycleInCurrentLocale() reads that value; without
 * it every DatePicker/DateTimePicker throws
 *   "Cannot read properties of undefined (reading 'LT')"
 * on render and gets swallowed by the nearest error boundary.
 */

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);

// Register the locales. `dayjs.locale("en", ...)` re-registers a fresh locale
// object; the built-in tree-shaking guard is preserved by keeping these imports.
dayjs.locale("tr", trLocale);
dayjs.locale("en", enLocale);

// `dayjs/locale/en` ships WITHOUT a `formats` block, so registering it above
// overwrites the defaults that `localizedFormat` attached to the built-in
// English locale — leaving AdapterDayjs to read `undefined.LT`. (The Turkish
// locale ships its own `formats`, so only English needs patching.) Re-attach
// the standard English long-date formats so the pickers render everywhere.
if (dayjs.Ls.en && !dayjs.Ls.en.formats) {
  dayjs.Ls.en.formats = {
    LT: "h:mm A",
    LTS: "h:mm:ss A",
    L: "MM/DD/YYYY",
    LL: "MMMM D, YYYY",
    LLL: "MMMM D, YYYY h:mm A",
    LLLL: "dddd, MMMM D, YYYY h:mm A",
  };
}

export default dayjs;
