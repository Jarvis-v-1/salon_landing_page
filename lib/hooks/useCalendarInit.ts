"use client";

import { useEffect, useState } from "react";

/**
 * Hook to initialize Google Calendar connection on page load
 * Runs in the background without blocking the UI
 */
export function useCalendarInit() {
  const [calendarReady, setCalendarReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize calendar connection in background
    async function initCalendar() {
      try {
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

  return { calendarReady, error, loading };
}
