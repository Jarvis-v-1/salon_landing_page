import { google } from "googleapis";
import type { EmployeeId } from "./employees";
import { EMPLOYEES } from "./employees";

export const SALON_TIMEZONE = "America/Los_Angeles";

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
      process.env.GOOGLE_PRIVATE_KEY &&
      // At least one calendar ID must be configured
      (process.env.GOOGLE_CALENDAR_ID ||
        process.env.GOOGLE_CALENDAR_ID_PURVI ||
        process.env.GOOGLE_CALENDAR_ID_HETVI ||
        process.env.GOOGLE_CALENDAR_ID_NIRALI ||
        process.env.GOOGLE_CALENDAR_ID_VARSHA)
  );
}

/**
 * Get the default calendar ID (fallback)
 */
export function getCalendarId(): string {
  return getEnv("GOOGLE_CALENDAR_ID");
}

/**
 * Get the calendar ID for a specific employee
 * Falls back to default calendar ID if employee-specific one is not set
 */
export function getCalendarIdForEmployee(employeeId: EmployeeId): string {
  const employee = EMPLOYEES[employeeId];
  
  // First check if employee has calendarId in their config
  if (employee.calendarId) {
    return employee.calendarId;
  }
  
  // Then check environment variable for this employee
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
      `No calendar ID configured for employee ${employeeId} and no default calendar ID set. ` +
      `Please set GOOGLE_CALENDAR_ID_${employeeId.toUpperCase()} or GOOGLE_CALENDAR_ID in .env.local`
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

