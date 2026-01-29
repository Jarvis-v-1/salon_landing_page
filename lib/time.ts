import { addMinutes, format, isAfter, isBefore, parse } from "date-fns";

export function parseHHmm(date: Date, hhmm: string): Date {
  // Parses a local time (HH:mm) onto the given date in server local timezone.
  return parse(hhmm, "HH:mm", date);
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

