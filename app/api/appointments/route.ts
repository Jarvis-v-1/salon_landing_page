import { NextResponse } from "next/server";
import { addMinutes, startOfDay, endOfDay, format } from "date-fns";
import { formatInTimeZone, fromZonedTime, toZonedTime } from "date-fns-tz";
import { parseISO } from "date-fns";
import { randomUUID } from "crypto";
import { createAppointmentSchema } from "../../../lib/validation";
import { EMPLOYEES, type EmployeeId } from "../../../lib/employees";
import {
  getServiceById,
  isProcessTimeService,
} from "../../../lib/services";
import { getRoomTypeForService } from "../../../lib/roomTypes";
import { getBusinessHoursForDay } from "../../../lib/businessHours";
import { overlap, parseHHmm, parseDateInEST, getProcessTimeSegments } from "../../../lib/time";
import {
  getCalendarClient,
  getCalendarIdForEmployee,
  hasCalendarConfig,
  SALON_TIMEZONE,
} from "../../../lib/googleCalendar";
import {
  fetchEmployeeAvailability,
  getEmployeeWindowForDate,
} from "../../../lib/employeeAvailability";
import { getRoomUsageAtTime, roomAllowsAdding } from "../../../lib/roomTypes";
import { fetchBusyBlocks } from "../../../lib/calendarBusy";
import { sendBookingConfirmation, isEmailConfigured } from "../../../lib/email";
import { sendSms, getEmployeePhone } from "../../../lib/sms";

async function employeeHasConflict(params: {
  dateISO: string;
  employeeId: EmployeeId;
  start: Date;
  end: Date;
}): Promise<boolean> {
  const { dateISO, employeeId, start, end } = params;
  if (!hasCalendarConfig()) return false;
  const calendar = getCalendarClient();
  const calendarId = await getCalendarIdForEmployee(employeeId);
  const dateInET = parseDateInEST(dateISO);
  const dayStartET = startOfDay(toZonedTime(dateInET, SALON_TIMEZONE));
  const dayEndET = endOfDay(toZonedTime(dateInET, SALON_TIMEZONE));
  const dayStart = fromZonedTime(dayStartET, SALON_TIMEZONE);
  const dayEnd = fromZonedTime(dayEndET, SALON_TIMEZONE);
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
    const evEmp = (ev.extendedProperties?.private?.employeeId ??
      employeeId) as EmployeeId;
    if (evEmp !== employeeId) continue;
    const s = ev.start?.dateTime;
    const e = ev.end?.dateTime;
    if (!s || !e) continue;
    if (overlap(start, end, new Date(s), new Date(e))) return true;
  }
  return false;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = createAppointmentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "INVALID_BODY", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const input = parsed.data;
  const service = getServiceById(input.serviceId);
  if (!service) {
    return NextResponse.json(
      { ok: false, error: "UNKNOWN_SERVICE" },
      { status: 400 }
    );
  }

  const employee = EMPLOYEES[input.employeeId];
  if (!employee.serviceTags.includes(service.tag)) {
    return NextResponse.json(
      { ok: false, error: "EMPLOYEE_NOT_COMPATIBLE_WITH_SERVICE" },
      { status: 400 }
    );
  }

  const day = parseDateInEST(input.date);
  const hours = getBusinessHoursForDay(day.getDay());
  if (hours.closed) {
    return NextResponse.json(
      { ok: false, error: "SALON_CLOSED" },
      { status: 400 }
    );
  }

  const start = parseISO(input.startTimeISO);
  const isProcessTime = isProcessTimeService(service);
  const end = isProcessTime
    ? addMinutes(
        start,
        service.phases.applicationMin +
          service.phases.processMin +
          service.phases.washStyleMax
      )
    : addMinutes(start, service.durationMin);

  const salonStart = parseHHmm(day, hours.open);
  const salonEnd = parseHHmm(day, hours.close);
  if (start < salonStart || end > salonEnd) {
    return NextResponse.json(
      { ok: false, error: "OUTSIDE_BUSINESS_HOURS" },
      { status: 400 }
    );
  }

  let employeeAvailability: Awaited<ReturnType<typeof fetchEmployeeAvailability>>;
  try {
    employeeAvailability = await fetchEmployeeAvailability();
  } catch (error) {
    console.warn("Employee availability API failed, proceeding with booking:", error);
    employeeAvailability = { employees: [], total_available: 0, total_employees: 0 };
  }
  const empApi = employeeAvailability.employees.find(
    (e) => e.employee_id === input.employeeId
  );
  const todayInSalon = format(toZonedTime(new Date(), SALON_TIMEZONE), "yyyy-MM-dd");
  const isBookingDateToday = input.date === todayInSalon;
  if (isBookingDateToday && empApi && !empApi.is_available) {
    return NextResponse.json(
      {
        ok: false,
        error: "EMPLOYEE_UNAVAILABLE",
        message: `${employee.name} is currently unavailable. Please select another stylist.`,
      },
      { status: 400 }
    );
  }
  const apiWindow = empApi ? getEmployeeWindowForDate(empApi, input.date) : null;
  const empStart = apiWindow
    ? parseHHmm(day, apiWindow.start)
    : employee.availableAfter
      ? parseHHmm(day, employee.availableAfter)
      : salonStart;
  const empEnd = apiWindow
    ? parseHHmm(day, apiWindow.end)
    : employee.availableUntil
      ? parseHHmm(day, employee.availableUntil)
      : salonEnd;
  const effectiveStart = empStart < salonStart ? salonStart : empStart;
  const effectiveEnd = empEnd > salonEnd ? salonEnd : empEnd;
  if (start < effectiveStart || end > effectiveEnd) {
    return NextResponse.json(
      { ok: false, error: "OUTSIDE_EMPLOYEE_HOURS" },
      { status: 400 }
    );
  }

  if (isProcessTime) {
    const { block1, block2 } = getProcessTimeSegments(start, service.phases);
    const c1 = await employeeHasConflict({
      dateISO: input.date,
      employeeId: input.employeeId,
      start: block1.start,
      end: block1.end,
    });
    const c2 = await employeeHasConflict({
      dateISO: input.date,
      employeeId: input.employeeId,
      start: block2.start,
      end: block2.end,
    });
    if (c1 || c2) {
      return NextResponse.json(
        { ok: false, error: "SLOT_UNAVAILABLE" },
        { status: 409 }
      );
    }
  } else {
    const conflict = await employeeHasConflict({
      dateISO: input.date,
      employeeId: input.employeeId,
      start,
      end,
    });
    if (conflict) {
      return NextResponse.json(
        { ok: false, error: "SLOT_UNAVAILABLE" },
        { status: 409 }
      );
    }
  }

  const roomType = getRoomTypeForService(input.serviceId);
  if (roomType) {
    const busy = await fetchBusyBlocks(input.date);
    const slotEnd = isProcessTime
      ? addMinutes(
          start,
          service.phases.applicationMin +
            service.phases.processMin +
            service.phases.washStyleMax
        )
      : addMinutes(start, service.durationMin);
    const usage = getRoomUsageAtTime(start, slotEnd, busy);
    if (!roomAllowsAdding(roomType, usage)) {
      return NextResponse.json(
        { ok: false, error: "ROOM_UNAVAILABLE", message: "No room available at this time." },
        { status: 409 }
      );
    }
  }

  if (!hasCalendarConfig()) {
    const isVercel = process.env.VERCEL === "1";
    const envHint = isVercel
      ? "Add them in Vercel Dashboard → Your Project → Settings → Environment Variables."
      : "Add them in your .env.local file for local development.";
    return NextResponse.json(
      {
        ok: false,
        error: "CALENDAR_NOT_CONFIGURED",
        message: `Google Calendar is not configured. ${envHint}`,
      },
      { status: 500 }
    );
  }

  const calendar = getCalendarClient();
  const calendarId = await getCalendarIdForEmployee(input.employeeId);
  const extendedBase = {
    employeeId: input.employeeId,
    serviceId: input.serviceId,
    customerPhone: input.customerPhone,
    ...(roomType ? { roomType } : {}),
  };
  const descriptionLines = [
    `Customer: ${input.customerName}`,
    `Phone: ${input.customerPhone}`,
    input.customerEmail ? `Email: ${input.customerEmail}` : null,
    `Service: ${service.label}`,
    `Employee: ${employee.name}`,
    input.notes ? `Notes: ${input.notes}` : null,
  ].filter(Boolean);

  let eventId: string;
  let startTimeISO = start.toISOString();
  let endTimeISO = end.toISOString();

  if (isProcessTime) {
    const groupId = randomUUID();
    const { block1, block2 } = getProcessTimeSegments(start, service.phases);
    const fmt = (d: Date) =>
      formatInTimeZone(d, SALON_TIMEZONE, "yyyy-MM-dd'T'HH:mm:ss");
    const insert1 = await calendar.events.insert({
      calendarId,
      requestBody: {
        summary: `Application – ${service.label} – ${input.customerName}`,
        description: descriptionLines.join("\n"),
        start: { dateTime: fmt(block1.start), timeZone: SALON_TIMEZONE },
        end: { dateTime: fmt(block1.end), timeZone: SALON_TIMEZONE },
        extendedProperties: {
          private: { ...extendedBase, appointmentGroupId: groupId },
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: "email", minutes: 24 * 60 },
            { method: "popup", minutes: 60 },
          ],
        },
      },
    });
    const insert2 = await calendar.events.insert({
      calendarId,
      requestBody: {
        summary: `Wash & style – ${service.label} – ${input.customerName}`,
        description: descriptionLines.join("\n"),
        start: { dateTime: fmt(block2.start), timeZone: SALON_TIMEZONE },
        end: { dateTime: fmt(block2.end), timeZone: SALON_TIMEZONE },
        extendedProperties: {
          private: { ...extendedBase, appointmentGroupId: groupId },
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: "email", minutes: 24 * 60 },
            { method: "popup", minutes: 60 },
          ],
        },
      },
    });
    eventId = insert1.data.id!;
    startTimeISO = block1.start.toISOString();
    endTimeISO = block2.end.toISOString();
  } else {
    const startDateTime = formatInTimeZone(
      start,
      SALON_TIMEZONE,
      "yyyy-MM-dd'T'HH:mm:ss"
    );
    const endDateTime = formatInTimeZone(
      addMinutes(start, service.durationMin),
      SALON_TIMEZONE,
      "yyyy-MM-dd'T'HH:mm:ss"
    );
    const resp = await calendar.events.insert({
      calendarId,
      requestBody: {
        summary: `${input.customerName} - ${service.label}`,
        description: descriptionLines.join("\n"),
        start: { dateTime: startDateTime, timeZone: SALON_TIMEZONE },
        end: { dateTime: endDateTime, timeZone: SALON_TIMEZONE },
        extendedProperties: { private: extendedBase },
        reminders: {
          useDefault: false,
          overrides: [
            { method: "email", minutes: 24 * 60 },
            { method: "popup", minutes: 60 },
          ],
        },
      },
    });
    eventId = resp.data.id!;
    endTimeISO = addMinutes(start, service.durationMin).toISOString();
  }

  if (isEmailConfigured() && input.customerEmail) {
    try {
      await sendBookingConfirmation({
        to: input.customerEmail,
        customerName: input.customerName,
        serviceName: service.label,
        employeeName: employee.name,
        date: format(start, "EEEE, MMMM d, yyyy"),
        time: format(start, "h:mm a"),
        duration: service.durationMin,
        phone: input.customerPhone,
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
    }
  }

  let smsSentToEmployee = false;
  let smsSentToCustomer = false;
  try {
    const empPhone = await getEmployeePhone(input.employeeId);
    if (empPhone) {
      const empMsg = `New booking: ${input.customerName} – ${service.label} on ${format(start, "MMM d, yyyy")} at ${format(start, "h:mm a")}. – Swapna Beauty Parlour.`;
      smsSentToEmployee = await sendSms(empPhone, empMsg);
    }
    const custMsg = `Your appointment at Swapna Beauty Parlour is confirmed for ${format(start, "MMM d, yyyy")} at ${format(start, "h:mm a")} (${service.label}). See you soon!`;
    smsSentToCustomer = await sendSms(input.customerPhone, custMsg);
  } catch (smsErr) {
    console.error("SMS send error (booking still succeeded):", smsErr);
  }

  return NextResponse.json({
    ok: true,
    eventId,
    startTimeISO,
    endTimeISO,
    emailSent: isEmailConfigured() && !!input.customerEmail,
    smsSentToEmployee,
    smsSentToCustomer,
  });
}
