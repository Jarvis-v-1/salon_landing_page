"use client";

import { useEffect, useState } from "react";

/**
 * Hook to initialize Google Calendar connection and load calendar IDs on page load
 * Runs in the background without blocking the UI
 */
export function useCalendarInit() {
  const [calendarReady, setCalendarReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [calendarIdsLoaded, setCalendarIdsLoaded] = useState(false);

  useEffect(() => {
    // Initialize calendar connection and load calendar IDs in background
    async function initCalendar() {
      try {
        // First, load calendar IDs from the API
        try {
          const calendarIdsResponse = await fetch("/api/calendar/ids");
          const calendarIdsData = await calendarIdsResponse.json();
          
          if (calendarIdsData.ok) {
            setCalendarIdsLoaded(true);
            console.log("Calendar IDs loaded successfully");
          } else {
            console.warn("Failed to load calendar IDs:", calendarIdsData.error);
            // Don't fail completely, just log a warning
          }
        } catch (calendarIdsError) {
          console.warn("Error loading calendar IDs:", calendarIdsError);
          // Don't fail completely, just log a warning
        }

        // Then verify calendar connection
        const response = await fetch("/api/calendar/verify");
        const data = await response.json();

        if (data.ready) {
          setCalendarReady(true);
          setError(null);
        } else {
          setError(data.error || "Calendar connection failed");
          setCalendarReady(false);
        }
      } catch (err) {
        setError("Failed to initialize calendar");
        setCalendarReady(false);
      } finally {
        setLoading(false);
      }
    }

    initCalendar();
  }, []);

  return { calendarReady, error, loading, calendarIdsLoaded };
}
