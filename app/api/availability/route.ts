import { NextResponse } from "next/server";
import { parseISO, startOfDay, endOfDay } from "date-fns";
import { availabilityQuerySchema } from "../../../lib/validation";
import { getServiceById } from "../../../lib/services";
import { EMPLOYEES, type EmployeeId } from "../../../lib/employees";
import { getBusinessHoursForDay } from "../../../lib/businessHours";
import { buildSlots, overlap, parseHHmm } from "../../../lib/time";
import {
  getCalendarClient,
  getCalendarId,
  getCalendarIdForEmployee,
  hasCalendarConfig,
  SALON_TIMEZONE
} from "../../../lib/googleCalendar";
import {
  fetchEmployeeAvailability,
  type EmployeeAvailabilityResponse,
} from "../../../lib/employeeAvailability";
import { getEmployeesForService } from "../../../lib/serviceEmployeeMapping";

type BusyBlock = { employeeId: EmployeeId; start: Date; end: Date };

async function fetchBusyBlocks(
  dateISO: string,
  employeeIds?: EmployeeId[]
): Promise<BusyBlock[]> {
  if (!hasCalendarConfig()) return [];
  const calendar = getCalendarClient();

  const dayStart = startOfDay(parseISO(dateISO));
  const dayEnd = endOfDay(parseISO(dateISO));

  const blocks: BusyBlock[] = [];
  
  // If specific employees requested, only check their calendars
  const employeesToCheck = employeeIds ?? (Object.keys(EMPLOYEES) as EmployeeId[]);

  // Check each employee's calendar separately
  for (const employeeId of employeesToCheck) {
    try {
      const calendarId = getCalendarIdForEmployee(employeeId);
      
      const resp = await calendar.events.list({
        calendarId,
        timeMin: dayStart.toISOString(),
        timeMax: dayEnd.toISOString(),
        singleEvents: true,
        orderBy: "startTime",
        timeZone: SALON_TIMEZONE
      });

      const items = resp.data.items ?? [];
      
      for (const ev of items) {
        // Since we're checking employee-specific calendars, we can assume all events belong to that employee
        // But we still check extendedProperties for consistency
        const evEmployeeId = (ev.extendedProperties?.private?.employeeId ??
          employeeId) as EmployeeId;
        
        // Only add if it matches the employee we're checking
        if (evEmployeeId !== employeeId) continue;
        
        const s = ev.start?.dateTime;
        const e = ev.end?.dateTime;
        if (!s || !e) continue;
        
        blocks.push({ 
          employeeId: evEmployeeId, 
          start: new Date(s), 
          end: new Date(e) 
        });
      }
    } catch (error) {
      // If a specific employee's calendar fails, log but continue with others
      console.warn(`Failed to fetch calendar for employee ${employeeId}:`, error);
    }
  }

  return blocks;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = availabilityQuerySchema.safeParse({
    date: url.searchParams.get("date"),
    serviceId: url.searchParams.get("serviceId") ?? undefined,
    employeeId: url.searchParams.get("employeeId") ?? undefined
  });

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "INVALID_QUERY", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { date, serviceId, employeeId } = parsed.data;
  const day = parseISO(date);
  const hours = getBusinessHoursForDay(day.getDay());
  if (hours.closed) {
    return NextResponse.json({
      ok: true,
      closed: true,
      businessHours: hours,
      availableSlots: []
    });
  }

  const service = getServiceById(serviceId ?? null);
  const durationMin = service?.durationMin ?? 30;

  // Step 1: Fetch employee availability from external API
  let employeeAvailability: EmployeeAvailabilityResponse;
  try {
    employeeAvailability = await fetchEmployeeAvailability();
  } catch (error) {
    // Fallback: assume all employees available if API fails
    console.warn("Employee availability API failed, assuming all available:", error);
    employeeAvailability = {
      employees: Object.values(EMPLOYEES).map((emp) => ({
        employee_id: emp.id,
        name: emp.name,
        is_available: true,
        last_updated_at: null,
        updated_by: null,
        notes: null,
      })),
      total_available: Object.keys(EMPLOYEES).length,
      total_employees: Object.keys(EMPLOYEES).length,
    };
  }

  // Step 2: Filter employees by availability status from external API
  const availableEmployeeIds = employeeAvailability.employees
    .filter((emp) => emp.is_available)
    .map((emp) => emp.employee_id as EmployeeId);

  // Step 3: Filter by service compatibility
  // If service is selected, use service-to-employee mapping
  // Otherwise, use serviceTags from employee config
  let serviceCompatibleEmployees: EmployeeId[];
  if (serviceId && service) {
    // Use service-to-employee mapping for more precise filtering
    const serviceEmployees = getEmployeesForService(serviceId);
    serviceCompatibleEmployees = availableEmployeeIds.filter((id) =>
      serviceEmployees.includes(id)
    );
  } else if (service) {
    // Fallback to serviceTags if mapping doesn't exist
    serviceCompatibleEmployees = availableEmployeeIds.filter((id) => {
      const emp = EMPLOYEES[id];
      return emp.serviceTags.includes(service.tag);
    });
  } else {
    // No service selected, show all available employees
    serviceCompatibleEmployees = availableEmployeeIds;
  }

  // Step 4: If specific employee requested, filter to that employee
  const employeesToConsider = employeeId
    ? (serviceCompatibleEmployees.includes(employeeId)
        ? [employeeId]
        : [])
    : serviceCompatibleEmployees;

  // Salon business window for the day
  const windowStart = parseHHmm(day, hours.open);
  const windowEnd = parseHHmm(day, hours.close);

  // Generate candidate slots (15-min granularity)
  const slots = buildSlots({ windowStart, windowEnd, stepMin: 15, durationMin });
  
  // Step 5: Fetch busy blocks from Google Calendar for the employees we're considering
  const busy = await fetchBusyBlocks(date, employeesToConsider);

  // Step 6: Generate available slots, filtering by:
  // - Employee availability (from external API)
  // - Service compatibility
  // - Employee-specific hours
  // - Google Calendar conflicts
  const availableSlots = slots
    .map((slot) => {
      const availableEmployees = employeesToConsider.filter((id) => {
        const emp = EMPLOYEES[id];

        // Appointment-only employees only appear if explicitly requested
        if (!employeeId && emp.appointmentOnly) return false;

        // Respect employee specific availability hours
        const empStart = emp.availableAfter
          ? parseHHmm(day, emp.availableAfter)
          : windowStart;
        const empEnd = emp.availableUntil
          ? parseHHmm(day, emp.availableUntil)
          : windowEnd;
        if (slot.start < empStart || slot.end > empEnd) return false;

        // Check Google Calendar conflicts for this employee
        const conflicts = busy.some(
          (b) => b.employeeId === id && overlap(slot.start, slot.end, b.start, b.end)
        );
        return !conflicts;
      });

      return {
        startTimeISO: slot.start.toISOString(),
        endTimeISO: slot.end.toISOString(),
        availableEmployees,
      };
    })
    .filter((s) => s.availableEmployees.length > 0);

  return NextResponse.json({
    ok: true,
    closed: false,
    businessHours: hours,
    durationMin,
    service: service ? { id: service.id, label: service.label } : null,
    availableSlots
  });
}

