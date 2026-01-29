/**
 * Employee Availability API Integration
 * 
 * Fetches real-time employee availability status from external API.
 * This API indicates whether employees are currently available for booking
 * (e.g., on leave, sick, etc.)
 */

const EMPLOYEE_AVAILABILITY_API =
  process.env.EMPLOYEE_AVAILABILITY_API_URL ||
  "https://unauthoritatively-ruinous-niesha.ngrok-free.dev/api/employees/availability";

export interface EmployeeAvailabilityResponse {
  employees: Array<{
    employee_id: string;
    name: string;
    is_available: boolean;
    last_updated_at: string | null;
    updated_by: string | null;
    notes: string | null;
  }>;
  total_available: number;
  total_employees: number;
}

/**
 * Fetches employee availability from external API
 * @returns Employee availability data
 * @throws Error if API call fails
 */
export async function fetchEmployeeAvailability(): Promise<EmployeeAvailabilityResponse> {
  const response = await fetch(EMPLOYEE_AVAILABILITY_API, {
    headers: {
      "ngrok-skip-browser-warning": "true", // Bypass ngrok warning
    },
    // Add cache control to prevent stale data
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch employee availability: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}
