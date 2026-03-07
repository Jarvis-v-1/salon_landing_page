const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL;

/**
 * Normalize phone to E.164. Assumes Indian 10-digit if starts with 6-9 and length 10.
 */
export function normalizePhoneToE164(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length <= 10 && /^[6-9]/.test(digits)) {
    return "+91" + digits;
  }
  if (digits.startsWith("91") && digits.length === 12) {
    return "+" + digits;
  }
  if (phone.startsWith("+")) return phone;
  return "+" + digits;
}

/**
 * Send SMS via backend POST /api/sms/send.
 * Does not throw; returns false on failure so booking is not failed.
 */
export async function sendSms(phoneNumber: string, message: string): Promise<boolean> {
  if (!BACKEND_URL) {
    console.warn("[SMS] BACKEND_URL not set, skipping SMS.");
    return false;
  }
  const normalized = normalizePhoneToE164(phoneNumber);
  try {
    const res = await fetch(`${BACKEND_URL}/api/sms/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone_number: normalized, message }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("[SMS] Send failed:", res.status, err);
      return false;
    }
    return true;
  } catch (e) {
    console.error("[SMS] Send error:", e);
    return false;
  }
}

export type EmployeesApiEmployee = {
  employee_id: string;
  name: string;
  phone_number: string | null;
  active?: boolean;
};

/**
 * Fetch employees from backend GET /api/employees?active_only=true.
 */
export async function fetchEmployeesFromBackend(): Promise<EmployeesApiEmployee[]> {
  if (!BACKEND_URL) return [];
  try {
    const res = await fetch(`${BACKEND_URL}/api/employees?active_only=true`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { employees?: EmployeesApiEmployee[] };
    return data.employees ?? [];
  } catch (e) {
    console.warn("[SMS] Failed to fetch employees:", e);
    return [];
  }
}

/**
 * Get employee phone number by employee_id from backend.
 */
export async function getEmployeePhone(employeeId: string): Promise<string | null> {
  const employees = await fetchEmployeesFromBackend();
  const emp = employees.find((e) => e.employee_id === employeeId);
  return emp?.phone_number ?? null;
}
