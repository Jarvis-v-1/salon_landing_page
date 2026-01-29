import { z } from "zod";
import { EMPLOYEES } from "./employees";
import { SERVICES } from "./services";

export const employeeIdSchema = z.enum(
  Object.keys(EMPLOYEES) as [keyof typeof EMPLOYEES, ...(keyof typeof EMPLOYEES)[]]
);

export const serviceIdSchema = z.enum(
  SERVICES.map((s) => s.id) as [string, ...string[]]
);

export const availabilityQuerySchema = z.object({
  date: z.string().min(8), // YYYY-MM-DD
  serviceId: serviceIdSchema.optional(),
  employeeId: employeeIdSchema.optional()
});

export const createAppointmentSchema = z.object({
  customerName: z.string().min(2).max(80),
  customerPhone: z.string().min(7).max(24),
  customerEmail: z.string().email().optional().or(z.literal("")),
  notes: z.string().max(500).optional().or(z.literal("")),
  serviceId: serviceIdSchema,
  employeeId: employeeIdSchema,
  date: z.string().min(8), // YYYY-MM-DD
  startTimeISO: z.string().min(10) // ISO datetime string
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;

