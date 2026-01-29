import { NextResponse } from "next/server";
import {
  hasCalendarConfig,
  getCalendarClient,
  getCalendarIdForEmployee,
} from "../../../../lib/googleCalendar";
import { EMPLOYEES } from "../../../../lib/employees";

/**
 * GET /api/calendar/verify
 * 
 * Verifies Google Calendar connection on page load.
 * This endpoint is called in the background to ensure
 * calendar integration is working properly.
 * Verifies all employee calendars if configured.
 */
export async function GET() {
  if (!hasCalendarConfig()) {
    return NextResponse.json({
      ready: false,
      error: "Calendar not configured",
    });
  }

  try {
    const calendar = getCalendarClient();
    const employeeIds = Object.keys(EMPLOYEES) as Array<keyof typeof EMPLOYEES>;
    const results: Record<string, boolean> = {};
    let allReady = true;

    // Test connection for each employee's calendar
    for (const employeeId of employeeIds) {
      try {
        const calendarId = getCalendarIdForEmployee(employeeId);
        await calendar.calendars.get({ calendarId });
        results[employeeId] = true;
      } catch (error) {
        console.warn(`Calendar verification failed for ${employeeId}:`, error);
        results[employeeId] = false;
        allReady = false;
      }
    }

    return NextResponse.json({ 
      ready: allReady,
      calendars: results
    });
  } catch (error) {
    console.error("Calendar verification failed:", error);
    return NextResponse.json(
      {
        ready: false,
        error: "Calendar connection failed",
      },
      { status: 500 }
    );
  }
}
