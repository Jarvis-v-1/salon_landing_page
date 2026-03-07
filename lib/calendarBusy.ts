import { startOfDay, endOfDay } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { parseDateInEST } from "./time";
import { getCalendarIdForEmployee, hasCalendarConfig, SALON_TIMEZONE } from "./googleCalendar";
import { getCalendarClient } from "./googleCalendar";
import type { EmployeeId } from "./employees";
import { EMPLOYEES } from "./employees";
import { getRoomTypeForService } from "./roomTypes";
import type { RoomType } from "./services";

export type BusyBlock = {
  employeeId: EmployeeId;
  start: Date;
  end: Date;
  serviceId?: string;
  roomType: RoomType | null;
};

export async function fetchBusyBlocks(
  dateISO: string,
  employeeIds?: EmployeeId[]
): Promise<BusyBlock[]> {
  if (!hasCalendarConfig()) return [];
  const calendar = getCalendarClient();
  const dateInET = parseDateInEST(dateISO);
  const dayStartET = startOfDay(toZonedTime(dateInET, SALON_TIMEZONE));
  const dayEndET = endOfDay(toZonedTime(dateInET, SALON_TIMEZONE));
  const dayStart = fromZonedTime(dayStartET, SALON_TIMEZONE);
  const dayEnd = fromZonedTime(dayEndET, SALON_TIMEZONE);
  const blocks: BusyBlock[] = [];
  const employeesToCheck =
    employeeIds ?? (Object.keys(EMPLOYEES) as EmployeeId[]);

  for (const employeeId of employeesToCheck) {
    try {
      const calendarId = await getCalendarIdForEmployee(employeeId);
      const resp = await calendar.events.list({
        calendarId,
        timeMin: dayStart.toISOString(),
        timeMax: dayEnd.toISOString(),
        singleEvents: true,
        orderBy: "startTime",
        timeZone: SALON_TIMEZONE,
      });
      const items = resp.data.items ?? [];
      for (const ev of items) {
        const evEmployeeId = (ev.extendedProperties?.private?.employeeId ??
          employeeId) as EmployeeId;
        if (evEmployeeId !== employeeId) continue;
        const s = ev.start?.dateTime;
        const e = ev.end?.dateTime;
        if (!s || !e) continue;
        const serviceId = ev.extendedProperties?.private?.serviceId as string | undefined;
        const roomType = getRoomTypeForService(serviceId);
        blocks.push({
          employeeId: evEmployeeId,
          start: new Date(s),
          end: new Date(e),
          serviceId,
          roomType,
        });
      }
    } catch (error) {
      console.warn(`Failed to fetch calendar for employee ${employeeId}:`, error);
    }
  }
  return blocks;
}
