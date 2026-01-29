import type { EmployeeId } from "./employees";

/**
 * Maps service IDs to the employee IDs that can perform that service.
 * Based on business rules:
 * - Haircut services: Only Purvi and Hetvi
 * - Threading services: Purvi, Nirali, Varsha (not Hetvi)
 * - Other services: Varies by service
 */
export const SERVICE_EMPLOYEE_MAP: Record<string, EmployeeId[]> = {
  // Haircut services - Only Purvi and Hetvi
  haircut: ["purvi", "hetvi"],

  // Hair color services - Only Purvi and Hetvi
  color: ["purvi", "hetvi"],

  // Threading services - Purvi, Nirali, Varsha (not Hetvi)
  threading: ["purvi", "nirali", "varsha"],

  // Facial services - All employees
  facial: ["purvi", "hetvi", "nirali", "varsha"],

  // Manicure/Pedicure - All employees
  manicure: ["purvi", "hetvi", "nirali", "varsha"],
  pedicure: ["purvi", "hetvi", "nirali", "varsha"],

  // Bridal - Purvi and Hetvi
  bridal: ["purvi", "hetvi"],

  // Interview/Consultation - All employees
  interview: ["purvi", "hetvi", "nirali", "varsha"],
};

/**
 * Get the list of employee IDs that can perform a given service
 */
export function getEmployeesForService(serviceId: string | null | undefined): EmployeeId[] {
  if (!serviceId) return [];
  return SERVICE_EMPLOYEE_MAP[serviceId] || [];
}
