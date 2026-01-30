import { addMinutes, format, isAfter, isBefore, parse } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { SALON_TIMEZONE } from "./googleCalendar";

/**
 * Parse a date string (YYYY-MM-DD) as a date in EST timezone at midnight EST.
 * This ensures the date doesn't shift when converted between timezones.
 */
export function parseDateInEST(dateString: string): Date {
  // Parse the date string parts
  const [year, month, day] = dateString.split("-").map(Number);
  // Create a date object with the year/month/day
  // We'll create it at a neutral time (noon) to avoid DST edge cases at midnight
  const dateObj = new Date(year, month - 1, day, 12, 0, 0, 0);
  // Get what time this represents in EST
  const estTime = toZonedTime(dateObj, SALON_TIMEZONE);
  // Now set it to midnight in EST (same year/month/day, but 00:00:00)
  estTime.setFullYear(year, month - 1, day);
  estTime.setHours(0, 0, 0, 0);
  estTime.setMinutes(0, 0, 0);
  estTime.setSeconds(0, 0);
  estTime.setMilliseconds(0);
  // Convert from EST (midnight on the specified date) to UTC
  return fromZonedTime(estTime, SALON_TIMEZONE);
}

export function parseHHmm(date: Date, hhmm: string): Date {
  // Parses a local time (HH:mm) in Eastern Time zone onto the given date.
  // First, get the date in Eastern Time zone
  const dateInET = toZonedTime(date, SALON_TIMEZONE);
  // Parse the time string in the context of that date
  const parsed = parse(hhmm, "HH:mm", dateInET);
  // Convert back to UTC (which is what Date objects represent internally)
  return fromZonedTime(parsed, SALON_TIMEZONE);
}

export function formatHHmm(date: Date): string {
  return format(date, "HH:mm");
}

export function clampRange(
  start: Date,
  end: Date,
  minStart: Date,
  maxEnd: Date
): { start: Date; end: Date } | null {
  const s = isBefore(start, minStart) ? minStart : start;
  const e = isAfter(end, maxEnd) ? maxEnd : end;
  if (!isBefore(s, e)) return null;
  return { start: s, end: e };
}

export function overlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  // Overlap if aStart < bEnd && aEnd > bStart
  return aStart < bEnd && aEnd > bStart;
}

export function buildSlots(params: {
  windowStart: Date;
  windowEnd: Date;
  stepMin: number;
  durationMin: number;
}): Array<{ start: Date; end: Date }> {
  const { windowStart, windowEnd, stepMin, durationMin } = params;
  const slots: Array<{ start: Date; end: Date }> = [];
  let cursor = windowStart;
  while (true) {
    const end = addMinutes(cursor, durationMin);
    if (end > windowEnd) break;
    slots.push({ start: cursor, end });
    cursor = addMinutes(cursor, stepMin);
  }
  return slots;
}

