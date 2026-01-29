"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { format, parseISO } from "date-fns";
import { EMPLOYEES } from "../lib/employees";
import { SERVICES } from "../lib/services";
import { getEmployeesForService } from "../lib/serviceEmployeeMapping";
import { useCalendarInit } from "../lib/hooks/useCalendarInit";

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
    | { status: "success"; startTimeISO: string }
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

      const res = await fetch(`/api/availability?${qs.toString()}`);
      const data = (await res.json()) as AvailabilityResponse;
      if (!cancelled) setAvailability(data);
      setLoadingSlots(false);
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
          label: format(parseISO(s.startTimeISO), "h:mm a"),
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
      setSubmitState({ status: "success", startTimeISO: data.startTimeISO });
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
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-purple-dark/80 to-purple-black/80 p-8 backdrop-blur-sm shadow-xl sm:p-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs font-medium uppercase tracking-[0.16em] text-white/80 backdrop-blur-sm">
            Book online
          </p>
          <h3 className="mt-3 font-display text-2xl text-white sm:text-3xl">Schedule an appointment</h3>
          <p className="mt-1 text-sm text-white/70">
            Pick a date and time — we'll only show slots that are free for the selected stylist.
          </p>
        </div>
        <div className="text-xs text-white/60">
          <p className="font-medium text-white/80">Prefer WhatsApp?</p>
          <a
            className="underline decoration-soft-gold/40 underline-offset-4 hover:text-soft-gold"
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
            <span className="text-sm font-medium text-white">Service</span>
            <select
              className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none ring-0 backdrop-blur-sm focus:border-soft-gold/50 focus:bg-white/15"
              {...register("serviceId", { required: true })}
            >
              {SERVICES.map((s) => (
                <option key={s.id} value={s.id} className="bg-purple-black text-white">
                  {s.label} · {s.durationMin} min
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-white">Date</span>
            <input
              type="date"
              className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none backdrop-blur-sm focus:border-soft-gold/50 focus:bg-white/15 [&::-webkit-calendar-picker-indicator]:invert"
              {...register("date", { required: true })}
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-white">Preferred stylist (optional)</span>
            <select
              className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none backdrop-blur-sm focus:border-soft-gold/50 focus:bg-white/15"
              {...register("employeeId")}
            >
              <option value="" className="bg-purple-black text-white">Auto-assign (recommended)</option>
              {availableEmployees.map((e) => (
                <option key={e.id} value={e.id} className="bg-purple-black text-white">
                  {e.name} · {e.role}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-white">Time</span>
            <select
              className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none backdrop-blur-sm focus:border-soft-gold/50 focus:bg-white/15"
              {...register("startTimeISO", { required: true })}
              disabled={loadingSlots || !availability || (availability.ok && availability.closed)}
            >
              <option value="" className="bg-purple-black text-white">
                {loadingSlots
                  ? "Loading slots..."
                  : availability && availability.ok && availability.closed
                    ? "Closed on this day"
                    : "Select a time"}
              </option>
              {slotOptions.map((s) => (
                <option key={s.value} value={s.value} className="bg-purple-black text-white">
                  {s.label}
                </option>
              ))}
            </select>
            {availability && availability.ok && !availability.closed ? (
              <p className="text-xs text-white/60">
                Duration: <span className="font-medium text-white">{service.durationMin} min</span>
              </p>
            ) : null}
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-white">Your name</span>
            <input
              className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none backdrop-blur-sm focus:border-soft-gold/50 focus:bg-white/15"
              placeholder="Your full name"
              {...register("customerName", { required: "Name is required" })}
            />
            {errors.customerName ? (
              <span className="text-xs text-red-400">{errors.customerName.message}</span>
            ) : null}
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-white">Phone</span>
            <input
              className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none backdrop-blur-sm focus:border-soft-gold/50 focus:bg-white/15"
              placeholder="(770) 559-1521"
              {...register("customerPhone", { required: "Phone is required" })}
            />
            {errors.customerPhone ? (
              <span className="text-xs text-red-400">{errors.customerPhone.message}</span>
            ) : null}
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-white">Email (optional)</span>
            <input
              type="email"
              className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none backdrop-blur-sm focus:border-soft-gold/50 focus:bg-white/15"
              placeholder="you@example.com"
              {...register("customerEmail")}
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-white">Notes (optional)</span>
            <input
              className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none backdrop-blur-sm focus:border-soft-gold/50 focus:bg-white/15"
              placeholder="Anything we should know?"
              {...register("notes")}
            />
          </label>
        </div>

        {submitState.status === "error" ? (
          <div className="rounded-2xl border border-red-400/30 bg-red-500/20 px-4 py-3 text-sm text-red-200 backdrop-blur-sm">
            {submitState.message}
          </div>
        ) : null}

        {submitState.status === "success" ? (
          <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/20 px-4 py-3 text-sm text-emerald-200 backdrop-blur-sm">
            Appointment requested for{" "}
            <span className="font-medium">
              {format(parseISO(submitState.startTimeISO), "MMM d, yyyy · h:mm a")}
            </span>
            . If you don't see it confirmed, message us on WhatsApp.
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/60">
            We prevent double booking per stylist. Different stylists can be booked at the same time.
          </p>
          <button
            type="submit"
            className="rounded-full bg-soft-gold px-8 py-3 text-sm font-semibold text-purple-black transition-all hover:bg-soft-gold/90 hover:shadow-lg disabled:opacity-50"
            disabled={submitState.status === "submitting"}
          >
            {submitState.status === "submitting" ? "Booking..." : "Confirm Booking"}
          </button>
        </div>
      </form>
    </div>
  );
}

