export type EmployeeId = "purvi" | "hetvi" | "nirali" | "varsha";

export type ServiceTag =
  | "hair"
  | "threading"
  | "waxing"
  | "facial"
  | "manicure"
  | "pedicure"
  | "bridal"
  | "interview";

export type Employee = {
  id: EmployeeId;
  name: string;
  role: string;
  // Local business-hour availability overrides (24h, HH:mm)
  availableAfter?: string; // inclusive
  availableUntil?: string; // exclusive
  // If true, only bookable when explicitly selected (no auto-assignment)
  appointmentOnly?: boolean;
  serviceTags: ServiceTag[];
  // Google Calendar ID for this employee (optional, falls back to default)
  calendarId?: string;
};

export const EMPLOYEES: Record<EmployeeId, Employee> = {
  purvi: {
    id: "purvi",
    name: "Purvi Thakkar",
    role: "Owner",
    availableAfter: "12:30",
    serviceTags: [
      "hair",
      "threading",
      "waxing",
      "facial",
      "manicure",
      "pedicure",
      "bridal",
      "interview"
    ]
  },
  hetvi: {
    id: "hetvi",
    name: "Hetvi Thakkar",
    role: "Owner",
    appointmentOnly: true,
    // works on most services, not face threading/waxing per notes
    serviceTags: ["hair", "facial", "manicure", "pedicure", "bridal", "interview"]
  },
  nirali: {
    id: "nirali",
    name: "Nirali Dave",
    role: "Employee",
    availableAfter: "11:00",
    availableUntil: "17:30",
    serviceTags: ["threading", "waxing", "facial", "manicure", "pedicure", "interview"]
  },
  varsha: {
    id: "varsha",
    name: "Varsha Patel",
    role: "Employee",
    availableAfter: "13:00",
    availableUntil: "19:00",
    serviceTags: ["threading", "waxing", "facial", "manicure", "pedicure", "interview"]
  }
};

