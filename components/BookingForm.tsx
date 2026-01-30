"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { format, parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { EMPLOYEES } from "../lib/employees";
import { SERVICES } from "../lib/services";
import { getEmployeesForService } from "../lib/serviceEmployeeMapping";
import { useCalendarInit } from "../lib/hooks/useCalendarInit";

const EST_TIMEZONE = "America/New_York";

type AvailabilityResponse =
  | {
      ok: true;
      closed: boolean;
      durationMin: number;
      availableSlots: Array<{
        startTimeISO: string;
        endTimeISO: string;
        availableEmployees: Array<keyof typeof EMPLOYEES>;
      }>;
    }
  | { ok: false; error: string; message?: string };

type BookingFormValues = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  notes?: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  employeeId: keyof typeof EMPLOYEES | "";
  startTimeISO: string;
};

function todayISODate(): string {
  const now = new Date();
  return format(now, "yyyy-MM-dd");
}

export function BookingForm() {
  const { calendarReady } = useCalendarInit();
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitState, setSubmitState] = useState<
    | { status: "idle" }
    | { status: "submitting" }
    | { status: "success"; startTimeISO: string; emailSent?: boolean; customerEmail?: string }
    | { status: "error"; message: string }
  >({ status: "idle" });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<BookingFormValues>({
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      notes: "",
      serviceId: "interview",
      date: todayISODate(),
      employeeId: "",
      startTimeISO: ""
    }
  });

  const date = watch("date");
  const serviceId = watch("serviceId");
  const employeeId = watch("employeeId");

  const service = useMemo(
    () => SERVICES.find((s) => s.id === serviceId) ?? SERVICES[0],
    [serviceId]
  );

  // Filter employees based on selected service
  const availableEmployees = useMemo(() => {
    if (!serviceId) return Object.values(EMPLOYEES);
    
    const allowedEmployeeIds = getEmployeesForService(serviceId);
    return Object.values(EMPLOYEES).filter((emp) =>
      allowedEmployeeIds.includes(emp.id)
    );
  }, [serviceId]);

  // Reset employee selection when service changes and current employee is not compatible
  useEffect(() => {
    if (!serviceId || !employeeId) return;
    
    const allowedEmployeeIds = getEmployeesForService(serviceId);
    if (!allowedEmployeeIds.includes(employeeId)) {
      setValue("employeeId", "");
    }
  }, [serviceId, employeeId, setValue]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoadingSlots(true);
      setAvailability(null);
      setSubmitState({ status: "idle" });
      setValue("startTimeISO", "");

      const qs = new URLSearchParams({ date, serviceId });
      // If user explicitly chooses employee, filter slots to that employee
      if (employeeId) qs.set("employeeId", employeeId);

      try {
        const res = await fetch(`/api/availability?${qs.toString()}`);
        
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const text = await res.text();
        if (!text) {
          throw new Error("Empty response from server");
        }

        let data: AvailabilityResponse;
        try {
          data = JSON.parse(text) as AvailabilityResponse;
        } catch (parseError) {
          console.error("Failed to parse JSON response:", parseError);
          console.error("Response text:", text);
          throw new Error("Invalid JSON response from server");
        }

        if (!cancelled) setAvailability(data);
      } catch (error) {
        console.error("Error loading availability:", error);
        if (!cancelled) {
          setAvailability({
            ok: false,
            error: error instanceof Error ? error.message : "Failed to load availability"
          });
        }
      } finally {
        if (!cancelled) setLoadingSlots(false);
      }
    }
    if (date && serviceId) void load();
    return () => {
      cancelled = true;
    };
  }, [date, serviceId, employeeId, setValue]);

  const slotOptions =
    availability && availability.ok
      ? availability.availableSlots.map((s) => ({
          value: s.startTimeISO,
          label: formatInTimeZone(parseISO(s.startTimeISO), EST_TIMEZONE, "h:mm a"),
          employees: s.availableEmployees
        }))
      : [];

  async function onSubmit(values: BookingFormValues) {
    setSubmitState({ status: "submitting" });
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: values.customerName,
          customerPhone: values.customerPhone,
          customerEmail: values.customerEmail,
          notes: values.notes,
          serviceId: values.serviceId,
          employeeId: values.employeeId,
          date: values.date,
          startTimeISO: values.startTimeISO
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitState({
          status: "error",
          message: data?.message ?? data?.error ?? "Unable to book this slot."
        });
        return;
      }
      setSubmitState({ 
        status: "success", 
        startTimeISO: data.startTimeISO,
        emailSent: data.emailSent,
        customerEmail: values.customerEmail
      });
    } catch (e) {
      setSubmitState({
        status: "error",
        message: e instanceof Error ? e.message : "Unexpected error"
      });
    }
  }

  // If user didn’t pick employee, we auto-suggest based on chosen slot (first available).
  useEffect(() => {
    if (!availability || !availability.ok) return;
    const chosenStart = watch("startTimeISO");
    if (!chosenStart) return;
    if (employeeId) return;
    const slot = availability.availableSlots.find((s) => s.startTimeISO === chosenStart);
    if (!slot) return;
    setValue("employeeId", slot.availableEmployees[0] ?? "");
  }, [availability, watch, employeeId, setValue]);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-elegant border border-gold/20 sm:p-10">
      {/* Decorative Corner Elements */}
      <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-gold/20 rounded-tl-2xl" />
      <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-gold/20 rounded-br-2xl" />

      <div className="relative flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-maroon/5 border border-maroon/20 px-4 py-1 text-xs font-medium uppercase tracking-[0.16em] text-maroon">
            Book online
          </p>
          <h3 className="mt-3 font-display text-2xl text-maroon sm:text-3xl font-bold">Schedule an appointment</h3>
          <p className="mt-1 text-sm text-maroon-700/70">
            Pick a date and time — we'll only show slots that are free for the selected stylist.
          </p>
        </div>
        <div className="text-xs text-maroon-700/60">
          <p className="font-medium text-maroon">Prefer WhatsApp?</p>
          <a
            className="underline decoration-gold underline-offset-4 hover:text-gold transition-colors"
            href="https://wa.me/17705591521"
            target="_blank"
            rel="noreferrer"
          >
            Book on WhatsApp
          </a>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-maroon">Service</span>
            <select
              className="rounded-xl border border-maroon/20 bg-cream px-4 py-3 text-sm text-maroon outline-none ring-0 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
              {...register("serviceId", { required: true })}
            >
              {SERVICES.map((s) => (
                <option key={s.id} value={s.id} className="bg-cream text-maroon">
                  {s.label} · {s.durationMin} min
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-maroon">Date</span>
            <input
              type="date"
              className="rounded-xl border border-maroon/20 bg-cream px-4 py-3 text-sm text-maroon outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
              {...register("date", { required: true })}
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-maroon">Preferred stylist (optional)</span>
            <select
              className="rounded-xl border border-maroon/20 bg-cream px-4 py-3 text-sm text-maroon outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
              {...register("employeeId")}
            >
              <option value="" className="bg-cream text-maroon">Auto-assign (recommended)</option>
              {availableEmployees.map((e) => (
                <option key={e.id} value={e.id} className="bg-cream text-maroon">
                  {e.name} · {e.role}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-maroon">
              Time <span className="text-xs font-normal text-maroon-700/60">(EST timezone)</span>
            </span>
            <select
              className="rounded-xl border border-maroon/20 bg-cream px-4 py-3 text-sm text-maroon outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
              {...register("startTimeISO", { required: true })}
              disabled={loadingSlots || !availability || (availability.ok && availability.closed)}
            >
              <option value="" className="bg-cream text-maroon">
                {loadingSlots
                  ? "Loading slots..."
                  : availability && availability.ok && availability.closed
                    ? "Closed on this day"
                    : "Select a time"}
              </option>
              {slotOptions.map((s) => (
                <option key={s.value} value={s.value} className="bg-cream text-maroon">
                  {s.label}
                </option>
              ))}
            </select>
            {availability && availability.ok && !availability.closed ? (
              <p className="text-xs text-maroon-700/60">
                Duration: <span className="font-medium text-maroon">{service.durationMin} min</span>
              </p>
            ) : null}
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-maroon">Your name</span>
            <input
              className="rounded-xl border border-maroon/20 bg-cream px-4 py-3 text-sm text-maroon placeholder:text-maroon/40 outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
              placeholder="Your full name"
              {...register("customerName", { required: "Name is required" })}
            />
            {errors.customerName ? (
              <span className="text-xs text-red-600">{errors.customerName.message}</span>
            ) : null}
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-maroon">Phone</span>
            <input
              className="rounded-xl border border-maroon/20 bg-cream px-4 py-3 text-sm text-maroon placeholder:text-maroon/40 outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
              placeholder="(770) 559-1521"
              {...register("customerPhone", { required: "Phone is required" })}
            />
            {errors.customerPhone ? (
              <span className="text-xs text-red-600">{errors.customerPhone.message}</span>
            ) : null}
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-maroon">Email (optional)</span>
            <input
              type="email"
              className="rounded-xl border border-maroon/20 bg-cream px-4 py-3 text-sm text-maroon placeholder:text-maroon/40 outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
              placeholder="you@example.com"
              {...register("customerEmail")}
            />
            <p className="text-xs text-maroon-700/60">
              We'll send you a confirmation email with your appointment details
            </p>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-maroon">Notes (optional)</span>
            <input
              className="rounded-xl border border-maroon/20 bg-cream px-4 py-3 text-sm text-maroon placeholder:text-maroon/40 outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
              placeholder="Anything we should know?"
              {...register("notes")}
            />
          </label>
        </div>

        {submitState.status === "error" ? (
          <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitState.message}
          </div>
        ) : null}

        {submitState.status === "success" ? (
          <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <p className="font-medium mb-2">✓ Appointment confirmed!</p>
            <p className="mb-2">
              Your appointment is scheduled for{" "}
              <span className="font-medium">
                {formatInTimeZone(parseISO(submitState.startTimeISO), EST_TIMEZONE, "MMM d, yyyy · h:mm a")}
              </span>
              .
            </p>
            {submitState.emailSent && submitState.customerEmail ? (
              <p className="mt-2 text-xs border-t border-emerald-200 pt-2">
                ✓ A confirmation email has been sent to{" "}
                <span className="font-medium">{submitState.customerEmail}</span>
              </p>
            ) : submitState.customerEmail ? (
              <p className="mt-2 text-xs border-t border-emerald-200 pt-2 text-emerald-600">
                Note: Email confirmation is not configured. Your appointment is still confirmed.
              </p>
            ) : null}
            <p className="mt-2 text-xs">
              If you need to reschedule, please contact us at least 24 hours in advance.
            </p>
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-maroon-700/60">
            We prevent double booking per stylist. Different stylists can be booked at the same time.
          </p>
          <button
            type="submit"
            className="rounded-full bg-gold px-8 py-3 text-sm font-bold text-maroon-900 shadow-gold transition-all hover:bg-gold-light hover:scale-105 disabled:opacity-50"
            disabled={submitState.status === "submitting"}
          >
            {submitState.status === "submitting" ? "Booking..." : "Confirm Booking"}
          </button>
        </div>
      </form>
    </div>
  );
}

