import { NextResponse } from "next/server";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { availabilityQuerySchema } from "../../../lib/validation";
import {
  getServiceById,
  isProcessTimeService,
} from "../../../lib/services";
import {
  getRoomTypeForService,
  getRoomUsageAtTime,
  roomAllowsAdding,
} from "../../../lib/roomTypes";
import { fetchBusyBlocks } from "../../../lib/calendarBusy";
import { EMPLOYEES, type EmployeeId } from "../../../lib/employees";
import { getBusinessHoursForDay } from "../../../lib/businessHours";
import {
  buildSlots,
  overlap,
  parseHHmm,
  parseDateInEST,
  getProcessTimeSegments,
} from "../../../lib/time";
import {
  fetchEmployeeAvailability,
  getEmployeeWindowForDate,
  type EmployeeAvailabilityItem,
} from "../../../lib/employeeAvailability";
import { getEmployeesForService } from "../../../lib/serviceEmployeeMapping";
import { SALON_TIMEZONE } from "../../../lib/googleCalendar";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = availabilityQuerySchema.safeParse({
    date: url.searchParams.get("date"),
    serviceId: url.searchParams.get("serviceId") ?? undefined,
    employeeId: url.searchParams.get("employeeId") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "INVALID_QUERY", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { date, serviceId, employeeId } = parsed.data;
  const day = parseDateInEST(date);
  const hours = getBusinessHoursForDay(day.getDay());
  if (hours.closed) {
    return NextResponse.json({
      ok: true,
      closed: true,
      businessHours: hours,
      availableSlots: [],
    });
  }

  const service = getServiceById(serviceId ?? null);
  const serviceRoomType = getRoomTypeForService(serviceId ?? null);

  // Duration for slot generation: total for process-time (application + process + wash), else durationMin
  let durationMin = service?.durationMin ?? 30;
  if (service && isProcessTimeService(service)) {
    const p = service.phases;
    durationMin = p.applicationMin + p.processMin + p.washStyleMax;
  }

  let employeeAvailability: Awaited<ReturnType<typeof fetchEmployeeAvailability>>;
  try {
    employeeAvailability = await fetchEmployeeAvailability();
  } catch (error) {
    console.warn("Employee availability API failed, assuming all available:", error);
    employeeAvailability = {
      employees: Object.values(EMPLOYEES).map((emp) => ({
        employee_id: emp.id,
        name: emp.name,
        is_available: true,
        last_updated_at: null,
        updated_by: null,
        notes: null,
      })) as EmployeeAvailabilityItem[],
      total_available: Object.keys(EMPLOYEES).length,
      total_employees: Object.keys(EMPLOYEES).length,
    };
  }

  const windowStart = parseHHmm(day, hours.open);
  const windowEnd = parseHHmm(day, hours.close);

  const todayInSalon = format(toZonedTime(new Date(), SALON_TIMEZONE), "yyyy-MM-dd");
  const isSelectedDateToday = date === todayInSalon;

  const employeesToConsiderRaw = employeeId
    ? (() => {
        const serviceEmployees = serviceId && service
          ? getEmployeesForService(serviceId)
          : (Object.keys(EMPLOYEES) as EmployeeId[]);
        return serviceEmployees.includes(employeeId) ? [employeeId] : [];
      })()
    : (() => {
        const list = employeeAvailability.employees;
        const availableIds = (isSelectedDateToday
          ? list.filter((e) => e.is_available)
          : list
        ).map((e) => e.employee_id as EmployeeId);
        const serviceEmployees =
          serviceId && service
            ? getEmployeesForService(serviceId)
            : (Object.keys(EMPLOYEES) as EmployeeId[]);
        return availableIds.filter((id) => serviceEmployees.includes(id));
      })();

  const employeeMap = new Map(
    employeeAvailability.employees.map((e) => [e.employee_id, e])
  );

  const employeesToConsider: EmployeeId[] = [];
  for (const id of employeesToConsiderRaw) {
    const empApi = employeeMap.get(id);
    const window = empApi ? getEmployeeWindowForDate(empApi, date) : null;
    if (window === null) continue;
    if (isSelectedDateToday && empApi && !empApi.is_available) continue;
    const empStart = window
      ? parseHHmm(day, window.start)
      : (EMPLOYEES[id].availableAfter
          ? parseHHmm(day, EMPLOYEES[id].availableAfter!)
          : windowStart);
    const empEnd = window
      ? parseHHmm(day, window.end)
      : (EMPLOYEES[id].availableUntil
          ? parseHHmm(day, EMPLOYEES[id].availableUntil!)
          : windowEnd);
    const effectiveStart =
      empStart < windowStart ? windowStart : empStart;
    const effectiveEnd = empEnd > windowEnd ? windowEnd : empEnd;
    if (effectiveStart >= effectiveEnd) continue;
    employeesToConsider.push(id);
  }

  const slots = buildSlots({
    windowStart,
    windowEnd,
    stepMin: 15,
    durationMin,
  });
  const busy = await fetchBusyBlocks(date, employeesToConsider);

  const availableSlots = slots
    .map((slot) => {
      const availableEmployees = employeesToConsider.filter((id) => {
        const emp = EMPLOYEES[id];
        if (!employeeId && emp.appointmentOnly) return false;

        const empApi = employeeMap.get(id);
        const window = empApi ? getEmployeeWindowForDate(empApi, date) : null;
        const empStart = window
          ? parseHHmm(day, window.start)
          : (emp.availableAfter
              ? parseHHmm(day, emp.availableAfter)
              : windowStart);
        const empEnd = window
          ? parseHHmm(day, window.end)
          : (emp.availableUntil
              ? parseHHmm(day, emp.availableUntil)
              : windowEnd);
        if (slot.start < empStart || slot.end > empEnd) return false;

        if (service && isProcessTimeService(service)) {
          const { block1, block2 } = getProcessTimeSegments(
            slot.start,
            service.phases
          );
          const conflict1 = busy.some(
            (b) =>
              b.employeeId === id &&
              overlap(block1.start, block1.end, b.start, b.end)
          );
          const conflict2 = busy.some(
            (b) =>
              b.employeeId === id &&
              overlap(block2.start, block2.end, b.start, b.end)
          );
          if (conflict1 || conflict2) return false;
        } else {
          const conflicts = busy.some(
            (b) =>
              b.employeeId === id &&
              overlap(slot.start, slot.end, b.start, b.end)
          );
          if (conflicts) return false;
        }
        return true;
      });

      const usage = getRoomUsageAtTime(slot.start, slot.end, busy);
      const roomOk = roomAllowsAdding(serviceRoomType, usage);
      const finalEmployees = roomOk ? availableEmployees : [];

      return {
        startTimeISO: slot.start.toISOString(),
        endTimeISO: slot.end.toISOString(),
        availableEmployees: finalEmployees,
      };
    })
    .filter((s) => s.availableEmployees.length > 0);

  return NextResponse.json({
    ok: true,
    closed: false,
    businessHours: hours,
    durationMin,
    service: service ? { id: service.id, label: service.label } : null,
    availableSlots,
  });
}
