import { NextResponse } from "next/server";
import { addMinutes, startOfDay, endOfDay, format } from "date-fns";
import { formatInTimeZone, fromZonedTime, toZonedTime } from "date-fns-tz";
import { parseISO } from "date-fns";
import { createAppointmentSchema } from "../../../lib/validation";
import { EMPLOYEES, type EmployeeId } from "../../../lib/employees";
import { getServiceById } from "../../../lib/services";
import { getBusinessHoursForDay } from "../../../lib/businessHours";
import { overlap, parseHHmm, parseDateInEST } from "../../../lib/time";
import {
  getCalendarClient,
  getCalendarIdForEmployee,
  hasCalendarConfig,
  SALON_TIMEZONE
} from "../../../lib/googleCalendar";
import { fetchEmployeeAvailability } from "../../../lib/employeeAvailability";
import { sendBookingConfirmation, isEmailConfigured } from "../../../lib/email";

async function employeeHasConflict(params: {
  dateISO: string;
  employeeId: EmployeeId;
  start: Date;
  end: Date;
}): Promise<boolean> {
  const { dateISO, employeeId, start, end } = params;
  if (!hasCalendarConfig()) return false;

  const calendar = getCalendarClient();
  // Use the employee's specific calendar ID
  const calendarId = await getCalendarIdForEmployee(employeeId);

  // Parse date in EST timezone to avoid day shifts
  const dateInET = parseDateInEST(dateISO);
  const dayStartET = startOfDay(toZonedTime(dateInET, SALON_TIMEZONE));
  const dayEndET = endOfDay(toZonedTime(dateInET, SALON_TIMEZONE));
  // Convert back to UTC for Google Calendar API (which expects UTC)
  const dayStart = fromZonedTime(dayStartET, SALON_TIMEZONE);
  const dayEnd = fromZonedTime(dayEndET, SALON_TIMEZONE);

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
    // Since we're checking employee-specific calendar, all events are for that employee
    // But we still verify for safety
    const evEmp = (ev.extendedProperties?.private?.employeeId ?? employeeId) as EmployeeId;
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
    return NextResponse.json({ ok: false, error: "UNKNOWN_SERVICE" }, { status: 400 });
  }

  const employee = EMPLOYEES[input.employeeId];
  if (!employee.serviceTags.includes(service.tag)) {
    return NextResponse.json(
      { ok: false, error: "EMPLOYEE_NOT_COMPATIBLE_WITH_SERVICE" },
      { status: 400 }
    );
  }

  // Parse date in EST timezone to avoid day shifts
  const day = parseDateInEST(input.date);
  const hours = getBusinessHoursForDay(day.getDay());
  if (hours.closed) {
    return NextResponse.json({ ok: false, error: "SALON_CLOSED" }, { status: 400 });
  }

  const start = parseISO(input.startTimeISO);
  const end = addMinutes(start, service.durationMin);

  // Enforce business hours + employee hours server-side
  const salonStart = parseHHmm(day, hours.open);
  const salonEnd = parseHHmm(day, hours.close);
  if (start < salonStart || end > salonEnd) {
    return NextResponse.json({ ok: false, error: "OUTSIDE_BUSINESS_HOURS" }, { status: 400 });
  }

  const empStart = employee.availableAfter ? parseHHmm(day, employee.availableAfter) : salonStart;
  const empEnd = employee.availableUntil ? parseHHmm(day, employee.availableUntil) : salonEnd;
  if (start < empStart || end > empEnd) {
    return NextResponse.json({ ok: false, error: "OUTSIDE_EMPLOYEE_HOURS" }, { status: 400 });
  }

  // Critical: re-check conflicts at booking time (prevents double booking)
  const conflict = await employeeHasConflict({
    dateISO: input.date,
    employeeId: input.employeeId,
    start,
    end
  });
  if (conflict) {
    return NextResponse.json({ ok: false, error: "SLOT_UNAVAILABLE" }, { status: 409 });
  }

  // Step 2: Verify employee is still available (from external API)
  try {
    const employeeStatus = await fetchEmployeeAvailability();
    const employeeStatusData = employeeStatus.employees.find(
      (emp) => emp.employee_id === input.employeeId
    );

    if (!employeeStatusData || !employeeStatusData.is_available) {
      return NextResponse.json(
        {
          ok: false,
          error: "EMPLOYEE_UNAVAILABLE",
          message: `${employee.name} is currently unavailable. Please select another stylist.`,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    // If API fails, proceed with booking (graceful degradation)
    console.warn("Employee availability API failed, proceeding with booking:", error);
  }

  // If calendar is not configured yet, return a friendly error for now.
  if (!hasCalendarConfig()) {
    const isVercel = process.env.VERCEL === "1";
    const envHint = isVercel
      ? "Add them in Vercel Dashboard → Your Project → Settings → Environment Variables. Note: GitHub secrets are NOT automatically used by Vercel - you must add them separately in Vercel."
      : "Add them in your .env.local file for local development.";
    
    return NextResponse.json(
      {
        ok: false,
        error: "CALENDAR_NOT_CONFIGURED",
        message: `Google Calendar is not configured. Missing required environment variables: GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY${process.env.GOOGLE_CALENDAR_ID ? "" : ", GOOGLE_CALENDAR_ID"}. ${envHint}`
      },
      { status: 500 }
    );
  }

  const calendar = getCalendarClient();
  // Use the employee's specific calendar ID
  const calendarId = await getCalendarIdForEmployee(input.employeeId);

  const summary = `${input.customerName} - ${service.label}`;
  const descriptionLines = [
    `Customer: ${input.customerName}`,
    `Phone: ${input.customerPhone}`,
    input.customerEmail ? `Email: ${input.customerEmail}` : null,
    `Service: ${service.label}`,
    `Employee: ${employee.name}`,
    input.notes ? `Notes: ${input.notes}` : null
  ].filter(Boolean);

  // Format dates in Eastern Time zone for Google Calendar
  // Google Calendar expects the dateTime to represent the local time in the specified timezone
  const startDateTime = formatInTimeZone(start, SALON_TIMEZONE, "yyyy-MM-dd'T'HH:mm:ss");
  const endDateTime = formatInTimeZone(end, SALON_TIMEZONE, "yyyy-MM-dd'T'HH:mm:ss");

  const resp = await calendar.events.insert({
    calendarId,
    requestBody: {
      summary,
      description: descriptionLines.join("\n"),
      start: { dateTime: startDateTime, timeZone: SALON_TIMEZONE },
      end: { dateTime: endDateTime, timeZone: SALON_TIMEZONE },
      extendedProperties: {
        private: {
          employeeId: input.employeeId,
          serviceId: input.serviceId,
          customerPhone: input.customerPhone
        }
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 }, // 1 day before
          { method: "popup", minutes: 60 } // 1 hour before
        ]
      }
    }
  });

  // Send confirmation email if email is configured and customer provided email
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
      // Log error but don't fail the booking
      // The appointment is already created in Google Calendar
      console.error("Failed to send confirmation email:", emailError);
    }
  }

  return NextResponse.json({
    ok: true,
    eventId: resp.data.id,
    startTimeISO: start.toISOString(),
    endTimeISO: end.toISOString(),
    emailSent: isEmailConfigured() && !!input.customerEmail
  });
}

