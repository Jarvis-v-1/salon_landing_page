/**
 * Employee Availability API Integration
 *
 * Fetches real-time employee availability status from external API.
 * API returns schedule timings (default_weekly_schedule + overrides) and is_available.
 * Weekday for a date is always computed in the salon timezone so Saturday/Sunday match the calendar.
 */

import { toZonedTime } from "date-fns-tz";
import { parseDateInEST } from "./time";
import { SALON_TIMEZONE } from "./googleCalendar";

const EMPLOYEE_AVAILABILITY_API =
  process.env.EMPLOYEE_AVAILABILITY_API_URL ||
  "https://unauthoritatively-ruinous-niesha.ngrok-free.dev/api/employees/availability";

export type DaySchedule = { start: string; end: string } | null;
export type OverrideValue =
  | { start?: string; end?: string; unavailable?: boolean }
  | { unavailable: true };

export interface EmployeeAvailabilityItem {
  employee_id: string;
  name: string;
  is_available: boolean;
  last_updated_at: string | null;
  updated_by: string | null;
  notes: string | null;
  default_weekly_schedule?: Record<string, DaySchedule>;
  overrides?: Record<string, OverrideValue>;
}

export interface EmployeeAvailabilityResponse {
  employees: EmployeeAvailabilityItem[];
  total_available: number;
  total_employees: number;
}

const WEEKDAY_KEYS: Record<number, string> = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

/**
 * Get the time window (start/end HH:mm) for an employee on a given date.
 * Uses default_weekly_schedule + overrides. Returns null if unavailable that day.
 */
export function getEmployeeWindowForDate(
  employee: EmployeeAvailabilityItem,
  dateISO: string
): { start: string; end: string } | null {
  const override = employee.overrides?.[dateISO];
  if (override && "unavailable" in override && override.unavailable) {
    return null;
  }
  if (override && "start" in override && "end" in override && override.start && override.end) {
    return { start: override.start, end: override.end };
  }
  // Use salon timezone so "Sunday" in the calendar is Sunday in the schedule (not server-local day)
  const dayStartInEst = parseDateInEST(dateISO);
  const dayInSalonTz = toZonedTime(dayStartInEst, SALON_TIMEZONE);
  const dayOfWeek = dayInSalonTz.getDay();
  const key = WEEKDAY_KEYS[dayOfWeek];
  const schedule = employee.default_weekly_schedule?.[key];
  if (!schedule || !schedule.start || !schedule.end) return null;
  return { start: schedule.start, end: schedule.end };
}

/**
 * Fetches employee availability from external API
 */
export async function fetchEmployeeAvailability(): Promise<EmployeeAvailabilityResponse> {
  const response = await fetch(EMPLOYEE_AVAILABILITY_API, {
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch employee availability: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}
