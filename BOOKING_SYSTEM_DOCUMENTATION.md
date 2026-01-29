# Google Calendar Booking System Documentation

## Overview
This document outlines the implementation of an appointment booking system integrated with Google Calendar for Swapna Beauty Parlour. The system allows customers to book appointments directly from the landing page, with automatic calendar synchronization and conflict prevention.

---

## Key Requirements

### Core Functionality
1. **Dynamic Time Slot Filtering**: Based on selected date, show only available time slots
2. **Employee Conflict Prevention**: Same employee cannot have overlapping appointments
3. **Multi-Employee Support**: Different employees can have overlapping appointments
4. **Google Calendar Integration**: All appointments sync to Google Calendar
5. **Real-time Availability**: Check calendar in real-time before showing slots

### Business Rules
- **No Overlaps for Same Employee**: If Employee A has an appointment from 2:00 PM - 3:00 PM, they cannot be booked again during that time
- **Overlaps Allowed for Different Employees**: Employee A can be busy while Employee B is available for the same time slot
- **Service Duration**: Each service has a specific duration (from the price list provided)
- **Business Hours**: Respect salon hours (Mon-Sat: 11am-7pm, Sun: 12pm-6pm, Closed Tuesdays)

---

## Architecture Overview

```
┌─────────────────┐
│  Landing Page   │
│   (Frontend)    │
└────────┬────────┘
         │
         │ HTTP Requests
         ▼
┌─────────────────┐
│  Next.js API    │
│     Routes      │
└────────┬────────┘
         │
         ├─────────────────┬──────────────────┐
         ▼                 ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Google     │  │   Database  │  │  Validation  │
│   Calendar   │  │  (Optional) │  │    Logic     │
│     API      │  │             │  │              │
└──────────────┘  └──────────────┘  └──────────────┘
```

---

## Technology Stack

### Frontend
- **Next.js 14** (App Router)
- **React Hook Form** - Form handling and validation
- **Date-fns** - Date manipulation
- **React Date Picker** - Date selection UI
- **Tailwind CSS** - Styling

### Backend
- **Next.js API Routes** - Server-side endpoints
- **Google Calendar API v3** - Calendar integration
- **googleapis** - Official Google API client
- **Zod** - Schema validation

### Storage (Optional)
- **JSON File** - Simple storage for appointments (development)
- **SQLite/PostgreSQL** - Production database (if needed)
- **Google Calendar** - Primary source of truth

---

## Google Calendar Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: "Swapna Beauty Parlour Booking"
3. Enable **Google Calendar API**

### Step 2: Create Service Account

1. Navigate to **IAM & Admin** → **Service Accounts**
2. Click **Create Service Account**
3. Name: `swapna-calendar-service`
4. Grant role: **Editor** (or custom role with Calendar permissions)
5. Click **Done**

### Step 3: Generate Service Account Key

1. Click on the created service account
2. Go to **Keys** tab
3. Click **Add Key** → **Create new key**
4. Choose **JSON** format
5. Download the JSON file
6. **Save securely** - This contains private credentials

### Step 4: Create Calendar & Share

1. Create a new Google Calendar: "Swapna Beauty Parlour Appointments"
2. Go to Calendar Settings → **Share with specific people**
3. Add the service account email (from JSON file: `client_email`)
4. Grant permission: **Make changes to events**
5. Copy the **Calendar ID** (found in Calendar Settings → Integrate calendar)

### Step 5: Environment Variables

Create `.env.local` file:
```env
GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_PROJECT_ID=your-project-id
```

---

## Database Schema (Optional - For Local Tracking)

If you want to store appointments locally (in addition to Google Calendar):

```typescript
interface Appointment {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  service: string;
  employeeId: string; // "purvi", "hetvi", "nirali", "varsha"
  date: string; // ISO date string
  startTime: string; // ISO datetime
  endTime: string; // ISO datetime
  duration: number; // minutes
  status: "confirmed" | "pending" | "cancelled";
  googleEventId?: string; // ID from Google Calendar
  createdAt: string;
  notes?: string;
}
```

---

## API Endpoints

### 1. GET `/api/availability`
**Purpose**: Fetch available time slots for a given date

**Query Parameters**:
- `date`: ISO date string (e.g., "2024-01-15")
- `service`: Service name (optional, for duration calculation)
- `employeeId`: Specific employee (optional, if not provided, checks all)

**Response**:
```json
{
  "availableSlots": [
    {
      "startTime": "2024-01-15T11:00:00",
      "endTime": "2024-01-15T11:45:00",
      "availableEmployees": ["purvi", "nirali"]
    },
    {
      "startTime": "2024-01-15T11:30:00",
      "endTime": "2024-01-15T12:15:00",
      "availableEmployees": ["nirali", "varsha"]
    }
  ],
  "businessHours": {
    "open": "11:00",
    "close": "19:00"
  }
}
```

### 2. POST `/api/appointments`
**Purpose**: Create a new appointment

**Request Body**:
```json
{
  "customerName": "John Doe",
  "customerPhone": "770-559-1521",
  "customerEmail": "john@example.com",
  "service": "Haircut & Styling",
  "employeeId": "purvi",
  "date": "2024-01-15",
  "startTime": "2024-01-15T14:00:00",
  "duration": 60,
  "notes": "First time customer"
}
```

**Response**:
```json
{
  "success": true,
  "appointmentId": "abc123",
  "googleEventId": "google-event-id-xyz",
  "message": "Appointment confirmed for January 15, 2024 at 2:00 PM"
}
```

### 3. GET `/api/appointments/:id`
**Purpose**: Get appointment details

### 4. DELETE `/api/appointments/:id`
**Purpose**: Cancel an appointment

---

## Service Duration Mapping

Based on the provided price list, here are estimated durations:

```typescript
const SERVICE_DURATIONS = {
  "Face Threading": {
    "Eyebrows": 15,
    "Upperlip": 10,
    "Lower lip": 10,
    "Chin": 10,
    "Full face (jawline)": 30,
    "Full face & neck": 35
  },
  "Face Waxing": {
    "Eyebrows": 20,
    "Upperlip": 10,
    "Lower lip": 10,
    "Full face (jawline)": 35,
    "Full face & neck": 40
  },
  "Haircut & Styling": {
    "Kids basic haircut": 30,
    "Mens haircut": 30,
    "Womens haircut": 60,
    "Shampoo, cut, blowdry style": 90
  },
  "Hair Color": {
    "Full haircolor": 180,
    "Root-touchup haircolor": 120,
    "Hair highlights": 240
  },
  "Facials": {
    "Quick facial": 45,
    "Basic cleanup": 60,
    "Mix fruit": 60,
    "Professional cleanup": 90,
    "Gold": 90,
    "Diamond": 120
  },
  "Manicure": 45,
  "Pedicure": 60,
  "Hair spa": 90,
  "Deep conditioning": 75,
  "Keratin treatment": 240,
  "Perms": 240
};
```

---

## Employee Information

```typescript
const EMPLOYEES = {
  purvi: {
    id: "purvi",
    name: "Purvi Thakkar",
    role: "Owner",
    availableAfter: "12:30", // Usually available after 12:30pm
    services: ["all"], // Works on every service
    calendarId: "purvi-calendar-id@group.calendar.google.com" // Optional: separate calendar
  },
  hetvi: {
    id: "hetvi",
    name: "Hetvi Thakkar",
    role: "Owner",
    availableAfter: null, // By appointment only
    services: ["haircut", "hair-color", "hair-styling", "facials", "waxing", "threading"], // Not face threading/waxing
    calendarId: null
  },
  nirali: {
    id: "nirali",
    name: "Nirali Dave",
    role: "Employee",
    availableAfter: "11:00", // Full time from open
    availableUntil: "17:30", // Until 5:30pm
    services: ["facials", "waxing", "threading", "manicure", "pedicure"], // Not hair services
    calendarId: null
  },
  varsha: {
    id: "varsha",
    name: "Varsha Patel",
    role: "Employee",
    availableAfter: "13:00", // From 1pm
    availableUntil: "19:00", // Until closing
    services: ["facials", "waxing", "threading", "manicure", "pedicure"], // Not hair services
    calendarId: null
  }
};
```

---

## Implementation Flow

### Frontend Flow

1. **User selects date** → Trigger API call to `/api/availability`
2. **System fetches available slots** → Filter by:
   - Business hours
   - Employee availability
   - Existing appointments (from Google Calendar)
   - Service duration
3. **User selects time slot** → Show available employees for that slot
4. **User selects service** → Calculate duration, filter compatible employees
5. **User fills form** → Name, phone, email, notes
6. **Submit appointment** → POST to `/api/appointments`
7. **Confirmation** → Show success message with appointment details

### Backend Flow

1. **Availability Check** (`GET /api/availability`):
   ```
   - Parse date and service
   - Get business hours for that day
   - Query Google Calendar for existing events
   - Filter employees by:
     * Service compatibility
     * Availability hours
     * No overlapping appointments
   - Generate time slots (e.g., every 15-30 minutes)
   - Return available slots
   ```

2. **Create Appointment** (`POST /api/appointments`):
   ```
   - Validate request data
   - Check if slot is still available (race condition prevention)
   - Create event in Google Calendar with:
     * Title: "Customer Name - Service Name"
     * Description: Phone, Email, Notes
     * Start/End time
     * Attendees: Employee email (if available)
     * Extended properties: employeeId, service, customerPhone
   - Store appointment locally (optional)
   - Send confirmation (email/SMS - optional)
   - Return success response
   ```

---

## Conflict Detection Algorithm

```typescript
function isSlotAvailable(
  employeeId: string,
  startTime: Date,
  endTime: Date,
  existingEvents: GoogleCalendarEvent[]
): boolean {
  // Check if employee has any overlapping events
  const hasConflict = existingEvents.some(event => {
    const eventStart = new Date(event.start.dateTime);
    const eventEnd = new Date(event.end.dateTime);
    
    // Check for overlap
    return (
      (startTime < eventEnd && endTime > eventStart) &&
      event.extendedProperties?.private?.employeeId === employeeId
    );
  });
  
  return !hasConflict;
}
```

---

## Google Calendar Event Structure

When creating an appointment, the event should include:

```typescript
{
  summary: "John Doe - Haircut & Styling",
  description: `
    Customer: John Doe
    Phone: 770-559-1521
    Email: john@example.com
    Service: Haircut & Styling
    Duration: 60 minutes
    Notes: First time customer
  `,
  start: {
    dateTime: "2024-01-15T14:00:00-05:00",
    timeZone: "America/New_York"
  },
  end: {
    dateTime: "2024-01-15T15:00:00-05:00",
    timeZone: "America/New_York"
  },
  extendedProperties: {
    private: {
      employeeId: "purvi",
      customerPhone: "770-559-1521",
      service: "Haircut & Styling",
      appointmentId: "abc123"
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
```

---

## Security Considerations

1. **API Key Protection**: Never expose Google API credentials in frontend code
2. **Rate Limiting**: Implement rate limiting on API endpoints
3. **Input Validation**: Validate all user inputs server-side
4. **CORS**: Configure CORS properly for API routes
5. **Error Handling**: Don't expose sensitive error messages to clients
6. **HTTPS**: Always use HTTPS in production

---

## Error Handling

### Common Errors

1. **Slot Already Booked**: Return 409 Conflict
2. **Invalid Date**: Return 400 Bad Request
3. **Google API Error**: Return 500 with generic message
4. **Employee Not Available**: Return 400 with available employees list

### Error Response Format

```json
{
  "success": false,
  "error": "SLOT_UNAVAILABLE",
  "message": "This time slot is no longer available. Please select another time.",
  "availableSlots": [...]
}
```

---

## Testing Strategy

### Unit Tests
- Service duration calculation
- Conflict detection logic
- Date/time parsing
- Employee filtering

### Integration Tests
- Google Calendar API calls
- Appointment creation flow
- Availability checking

### Manual Testing
- Book overlapping appointments (should fail for same employee)
- Book non-overlapping appointments (should succeed)
- Test with different employees
- Test edge cases (end of day, closed days)

---

## Future Enhancements

1. **Email/SMS Confirmations**: Send confirmation messages to customers
2. **Reminder Notifications**: Automated reminders before appointment
3. **Cancellation**: Allow customers to cancel appointments
4. **Rescheduling**: Allow customers to reschedule appointments
5. **Employee Calendar Sync**: Sync with individual employee calendars
6. **Waitlist**: Queue system for popular time slots
7. **Recurring Appointments**: Support for regular customers
8. **Payment Integration**: Collect payment during booking
9. **Customer Portal**: Login to view/manage appointments

---

## Deployment Checklist

- [ ] Set up Google Cloud Project
- [ ] Create Service Account and download credentials
- [ ] Create and configure Google Calendar
- [ ] Set environment variables in production
- [ ] Test API endpoints
- [ ] Test appointment creation
- [ ] Test conflict detection
- [ ] Set up error monitoring
- [ ] Configure rate limiting
- [ ] Set up backup/restore process

---

## File Structure

```
app/
  api/
    availability/
      route.ts          # GET available time slots
    appointments/
      route.ts          # POST create appointment
      [id]/
        route.ts        # GET/DELETE specific appointment
components/
  BookingForm.tsx       # Main booking form component
  DatePicker.tsx        # Date selection component
  TimeSlotSelector.tsx # Time slot selection
  ServiceSelector.tsx  # Service selection
  EmployeeSelector.tsx # Employee selection (optional)
lib/
  googleCalendar.ts     # Google Calendar API client
  employees.ts          # Employee configuration
  services.ts           # Service duration mapping
  validation.ts         # Zod schemas
types/
  appointment.ts        # TypeScript types
.env.local             # Environment variables (gitignored)
```

---

## Next Steps

1. **Review this documentation** - Ensure all requirements are understood
2. **Set up Google Calendar** - Follow the setup steps above
3. **Install dependencies** - Install required npm packages
4. **Implement API routes** - Start with availability endpoint
5. **Build frontend components** - Create booking form
6. **Test thoroughly** - Test all scenarios
7. **Deploy** - Deploy to production

---

## Questions to Clarify

Before implementation, please confirm:

1. **Employee Assignment**: Should customers choose an employee, or should the system auto-assign based on availability?
2. **Service Duration**: Are the estimated durations accurate, or should we adjust them?
3. **Buffer Time**: Should there be buffer time between appointments (e.g., 15 minutes)?
4. **Cancellation Policy**: What's the cancellation policy? Can customers cancel online?
5. **Notifications**: Do you want email/SMS confirmations? If yes, which service?
6. **Payment**: Should payment be collected during booking, or is it pay-at-salon?
7. **Multiple Services**: Can customers book multiple services in one appointment?

---

## Support & Maintenance

- **Monitoring**: Set up error tracking (e.g., Sentry)
- **Logging**: Log all appointment creations and API calls
- **Backup**: Regular backups of appointment data
- **Updates**: Keep Google API client library updated
- **Documentation**: Keep this documentation updated as system evolves

---

**Document Version**: 1.0  
**Last Updated**: January 2024  
**Author**: AI Assistant  
**Status**: Ready for Implementation Review
