import { addMinutes, format, isAfter, isBefore, parse } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { SALON_TIMEZONE } from "./googleCalendar";

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

