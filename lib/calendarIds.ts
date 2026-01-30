import type { EmployeeId } from "./employees";

type EmployeeCalendarResponse = {
  employee_id: EmployeeId;
  name: string;
  google_calendar_id: string | null;
};

type CalendarIdsApiResponse = {
  connected: boolean;
  connected_at?: string;
  connected_account_email?: string | null;
  employees: EmployeeCalendarResponse[];
  total: number;
};

// In-memory cache for calendar IDs
let calendarIdsCache: Map<EmployeeId, string> | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get the base URL for the calendar IDs API
 * Returns null if not set (allows fallback to ENV variables)
 */
function getCalendarIdsApiUrl(): string | null {
  return process.env.CALENDAR_IDS_API_URL || null;
}

/**
 * Fetch calendar IDs from the external API
 */
async function fetchCalendarIdsFromApi(): Promise<Map<EmployeeId, string>> {
  const apiUrl = getCalendarIdsApiUrl();
  
  if (!apiUrl) {
    throw new Error(
      "CALENDAR_IDS_API_URL is not set in environment variables. " +
      "Please set it in .env.local (e.g., CALENDAR_IDS_API_URL=http://localhost:8000/api/calendar/employee-calendars)"
    );
  }
  
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Add cache control to prevent stale data
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch calendar IDs: ${response.status} ${response.statusText}`
      );
    }

    const data = (await response.json()) as CalendarIdsApiResponse;

    const calendarMap = new Map<EmployeeId, string>();

    for (const employee of data.employees) {
      if (employee.google_calendar_id) {
        calendarMap.set(employee.employee_id, employee.google_calendar_id);
      }
    }

    return calendarMap;
  } catch (error) {
    console.error("Error fetching calendar IDs from API:", error);
    throw error;
  }
}

/**
 * Get calendar ID for an employee, fetching from API if needed
 * This function caches the results for 5 minutes
 */
export async function getCalendarIdForEmployee(
  employeeId: EmployeeId
): Promise<string | null> {
  const now = Date.now();

  // Check if cache is valid
  if (
    calendarIdsCache === null ||
    now - cacheTimestamp > CACHE_TTL
  ) {
    try {
      calendarIdsCache = await fetchCalendarIdsFromApi();
      cacheTimestamp = now;
    } catch (error) {
      // If fetch fails and we have stale cache, use it
      if (calendarIdsCache !== null) {
        console.warn(
          "Failed to refresh calendar IDs, using stale cache:",
          error
        );
        const cached = calendarIdsCache.get(employeeId);
        if (cached) return cached;
      }
      // If no cache and fetch fails, throw error
      throw new Error(
        `Failed to fetch calendar ID for employee ${employeeId}: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  return calendarIdsCache.get(employeeId) ?? null;
}

/**
 * Get all calendar IDs for all employees
 */
export async function getAllCalendarIds(): Promise<Map<EmployeeId, string>> {
  const now = Date.now();

  // Check if cache is valid
  if (
    calendarIdsCache === null ||
    now - cacheTimestamp > CACHE_TTL
  ) {
    try {
      calendarIdsCache = await fetchCalendarIdsFromApi();
      cacheTimestamp = now;
    } catch (error) {
      // If fetch fails and we have stale cache, use it
      if (calendarIdsCache !== null) {
        console.warn(
          "Failed to refresh calendar IDs, using stale cache:",
          error
        );
        return new Map(calendarIdsCache);
      }
      throw error;
    }
  }

  return new Map(calendarIdsCache);
}

/**
 * Clear the cache (useful for testing or manual refresh)
 */
export function clearCalendarIdsCache(): void {
  calendarIdsCache = null;
  cacheTimestamp = 0;
}

/**
 * Pre-fetch calendar IDs to warm up the cache
 * This can be called on app initialization
 */
export async function preloadCalendarIds(): Promise<void> {
  try {
    calendarIdsCache = await fetchCalendarIdsFromApi();
    cacheTimestamp = Date.now();
  } catch (error) {
    console.error("Failed to preload calendar IDs:", error);
    // Don't throw - allow the app to continue
  }
}
