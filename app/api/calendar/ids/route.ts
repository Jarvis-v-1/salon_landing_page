import { NextResponse } from "next/server";
import { preloadCalendarIds, getAllCalendarIds } from "../../../../lib/calendarIds";

/**
 * GET /api/calendar/ids
 * 
 * Fetches calendar IDs from the external API and returns them.
 * This endpoint can be called from the frontend to initialize calendar IDs.
 * It also preloads the cache on the server side.
 */
export async function GET() {
  try {
    // Check if API URL is configured
    if (!process.env.CALENDAR_IDS_API_URL) {
      return NextResponse.json(
        {
          ok: false,
          error: "CALENDAR_IDS_API_URL not configured",
          message: "Please set CALENDAR_IDS_API_URL in .env.local to enable dynamic calendar ID loading"
        },
        { status: 500 }
      );
    }

    // Preload calendar IDs to warm up the cache
    await preloadCalendarIds();
    
    // Get all calendar IDs
    const calendarIds = await getAllCalendarIds();
    
    // Convert Map to object for JSON response
    const calendarIdsObject: Record<string, string> = {};
    calendarIds.forEach((calendarId, employeeId) => {
      calendarIdsObject[employeeId] = calendarId;
    });

    return NextResponse.json({
      ok: true,
      calendarIds: calendarIdsObject,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error fetching calendar IDs:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Failed to fetch calendar IDs from external API"
      },
      { status: 500 }
    );
  }
}
