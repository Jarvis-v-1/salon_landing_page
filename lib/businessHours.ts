export type BusinessHours = { open: string; close: string; closed?: boolean };

// 0=Sun ... 6=Sat
export function getBusinessHoursForDay(dayOfWeek: number): BusinessHours {
  // Closed Tuesdays
  if (dayOfWeek === 2) return { open: "00:00", close: "00:00", closed: true };
  // Sunday
  if (dayOfWeek === 0) return { open: "12:00", close: "18:00" };
  // Mon-Sat
  return { open: "11:00", close: "19:00" };
}

