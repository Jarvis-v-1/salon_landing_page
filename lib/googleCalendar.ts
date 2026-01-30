import { google } from "googleapis";
import type { EmployeeId } from "./employees";
import { EMPLOYEES } from "./employees";
import { getCalendarIdForEmployee as getDynamicCalendarId } from "./calendarIds";

export const SALON_TIMEZONE = "America/New_York";

function getEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function getEnvOptional(name: string): string | undefined {
  return process.env[name];
}

export function hasCalendarConfig(): boolean {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY
  );
}

/**
 * Get the default calendar ID (fallback) - deprecated, use getCalendarIdForEmployee instead
 * @deprecated Calendar IDs are now loaded dynamically from API
 */
export function getCalendarId(): string {
  return getEnv("GOOGLE_CALENDAR_ID");
}

/**
 * Get the calendar ID for a specific employee
 * Now fetches dynamically from the calendar IDs API
 * Falls back to employee config or ENV variables if API is unavailable
 */
export async function getCalendarIdForEmployee(employeeId: EmployeeId): Promise<string> {
  const employee = EMPLOYEES[employeeId];
  
  // First check if employee has calendarId in their config (for backward compatibility)
  if (employee.calendarId) {
    return employee.calendarId;
  }
  
  // Try to get from dynamic API
  try {
    const calendarId = await getDynamicCalendarId(employeeId);
    if (calendarId) {
      return calendarId;
    }
  } catch (error) {
    console.warn(`Failed to fetch calendar ID from API for ${employeeId}, falling back to ENV:`, error);
  }
  
  // Fallback to environment variable for this employee (for backward compatibility)
  const envVarName = `GOOGLE_CALENDAR_ID_${employeeId.toUpperCase()}`;
  const employeeCalendarId = getEnvOptional(envVarName);
  if (employeeCalendarId) {
    return employeeCalendarId;
  }
  
  // Fall back to default calendar ID
  try {
    return getCalendarId();
  } catch {
    throw new Error(
      `No calendar ID found for employee ${employeeId}. ` +
      `Please ensure CALENDAR_IDS_API_URL is set in .env.local and the API is accessible, ` +
      `or set GOOGLE_CALENDAR_ID_${employeeId.toUpperCase()} or GOOGLE_CALENDAR_ID as fallback.`
    );
  }
}

export function getCalendarClient() {
  const clientEmail = getEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  // Private key often contains literal \n in env; normalize.
  // Also handle cases where the key might be wrapped in quotes or have extra whitespace
  let privateKey = getEnv("GOOGLE_PRIVATE_KEY")
    .replace(/\\n/g, "\n") // Replace literal \n with actual newlines
    .replace(/^["']|["']$/g, "") // Remove surrounding quotes if present
    .trim(); // Remove leading/trailing whitespace

  // Ensure the private key has proper BEGIN/END markers
  if (!privateKey.includes("BEGIN PRIVATE KEY") && !privateKey.includes("BEGIN RSA PRIVATE KEY")) {
    throw new Error("Invalid private key format. Key must include BEGIN/END markers.");
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/calendar"]
  });

  return google.calendar({ version: "v3", auth });
}

