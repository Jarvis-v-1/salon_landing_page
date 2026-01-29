# Booking System Implementation Documentation

## Overview

This document outlines the complete implementation plan for the Swapna Beauty Parlour booking system that integrates with Google Calendar and dynamically manages stylist availability based on service selection and real-time calendar data.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Landing Page (Frontend)                   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  On Page Load: Initialize Google Calendar Connection │  │
│  │  (Background - No UI blocking)                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Step 1: User Selects Service                        │  │
│  │  → Filter Stylists Based on Service                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Step 2: User Selects Date                          │  │
│  │  → Call Employee Availability API                    │  │
│  │  → Query Google Calendar for Selected Stylist        │  │
│  │  → Remove Booked Times from Available Slots          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Step 3: User Confirms Booking                       │  │
│  │  → Final Conflict Check                               │  │
│  │  → Create Event in Google Calendar                    │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js API Routes                       │
│                                                              │
│  /api/availability     → Get available time slots          │
│  /api/appointments     → Create appointment                │
│  /api/employees/status → Check employee availability       │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              External Services                              │
│                                                              │
│  ┌──────────────────────┐  ┌──────────────────────────┐   │
│  │  Google Calendar API │  │  Employee Availability   │   │
│  │                      │  │  API (ngrok endpoint)    │   │
│  └──────────────────────┘  └──────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation Flow

### Phase 1: Background Google Calendar Connection on Page Load

**Objective**: Establish Google Calendar connection when the landing page loads, without blocking the UI.

**Implementation Approach**:

1. **Create Calendar Initialization Hook** (`lib/hooks/useCalendarInit.ts`):
   ```typescript
   import { useEffect, useState } from 'react';
   
   export function useCalendarInit() {
     const [calendarReady, setCalendarReady] = useState(false);
     const [error, setError] = useState<string | null>(null);
     
     useEffect(() => {
       // Initialize calendar connection in background
       async function initCalendar() {
         try {
           // Call API endpoint to verify calendar connection
           const response = await fetch('/api/calendar/verify');
           if (response.ok) {
             setCalendarReady(true);
           } else {
             setError('Calendar connection failed');
           }
         } catch (err) {
           setError('Failed to initialize calendar');
         }
       }
       
       initCalendar();
     }, []);
     
     return { calendarReady, error };
   }
   ```

2. **Create Calendar Verification API Route** (`app/api/calendar/verify/route.ts`):
   ```typescript
   import { NextResponse } from 'next/server';
   import { hasCalendarConfig, getCalendarClient, getCalendarId } from '@/lib/googleCalendar';
   
   export async function GET() {
     if (!hasCalendarConfig()) {
       return NextResponse.json({ ready: false, error: 'Calendar not configured' });
     }
     
     try {
       const calendar = getCalendarClient();
       const calendarId = getCalendarId();
       
       // Test connection by fetching calendar metadata
       await calendar.calendars.get({ calendarId });
       
       return NextResponse.json({ ready: true });
     } catch (error) {
       return NextResponse.json({ 
         ready: false, 
         error: 'Calendar connection failed' 
       });
     }
   }
   ```

3. **Integrate into BookingForm Component**:
   ```typescript
   import { useCalendarInit } from '@/lib/hooks/useCalendarInit';
   
   export function BookingForm() {
     const { calendarReady } = useCalendarInit();
     // ... rest of component
   }
   ```

**Key Points**:
- Connection happens asynchronously in the background
- UI remains responsive during initialization
- Error handling is graceful (system can still work with limited functionality)

---

### Phase 2: Dynamic Stylist Filtering Based on Service Selection

**Objective**: Filter available stylists based on the selected service. Purvi and Hetvi handle haircuts; Nirali and Varsha do not.

**Service-to-Employee Mapping**:

```typescript
// lib/serviceEmployeeMapping.ts

export const SERVICE_EMPLOYEE_MAP: Record<string, string[]> = {
  // Haircut services - Only Purvi and Hetvi
  'haircut': ['purvi', 'hetvi'],
  
  // Hair color services - Only Purvi and Hetvi
  'color': ['purvi', 'hetvi'],
  
  // Threading services - Purvi, Nirali, Varsha (not Hetvi)
  'threading': ['purvi', 'nirali', 'varsha'],
  
  // Facial services - All employees
  'facial': ['purvi', 'hetvi', 'nirali', 'varsha'],
  
  // Manicure/Pedicure - All employees
  'manicure': ['purvi', 'hetvi', 'nirali', 'varsha'],
  'pedicure': ['purvi', 'hetvi', 'nirali', 'varsha'],
  
  // Bridal - Purvi and Hetvi
  'bridal': ['purvi', 'hetvi'],
  
  // Interview/Consultation - All employees
  'interview': ['purvi', 'hetvi', 'nirali', 'varsha'],
};
```

**Implementation in BookingForm**:

```typescript
// In BookingForm.tsx
const serviceId = watch('serviceId');

// Filter employees based on selected service
const availableEmployees = useMemo(() => {
  if (!serviceId) return Object.values(EMPLOYEES);
  
  const allowedEmployeeIds = SERVICE_EMPLOYEE_MAP[serviceId] || [];
  return Object.values(EMPLOYEES).filter(emp => 
    allowedEmployeeIds.includes(emp.id)
  );
}, [serviceId]);

// Update employee dropdown options
<select {...register('employeeId')}>
  <option value="">Auto-assign (recommended)</option>
  {availableEmployees.map((e) => (
    <option key={e.id} value={e.id}>
      {e.name} · {e.role}
    </option>
  ))}
</select>
```

**Key Points**:
- Stylist list updates immediately when service changes
- Only compatible stylists are shown
- Auto-assign option still available (system picks from filtered list)

---

### Phase 3: Date Selection Triggers Availability Check

**Objective**: When a date is selected, call the employee availability API and check Google Calendar for booked times.

**Employee Availability API Integration**:

**API Endpoint**: `https://unauthoritatively-ruinous-niesha.ngrok-free.dev/api/employees/availability`

**Response Format**:
```json
{
  "employees": [
    {
      "employee_id": "purvi",
      "name": "Purvi Thakkar",
      "is_available": true,
      "last_updated_at": "2026-01-29T19:56:52.300291",
      "updated_by": "admin",
      "notes": "Unavailable"
    },
    {
      "employee_id": "hetvi",
      "name": "Hetvi Thakkar",
      "is_available": false,
      "last_updated_at": "2026-01-28T20:42:19.987517",
      "updated_by": "admin",
      "notes": "Unavailable"
    }
  ],
  "total_available": 2,
  "total_employees": 4
}
```

**Implementation Steps**:

1. **Create Employee Availability Service** (`lib/employeeAvailability.ts`):
   ```typescript
   const EMPLOYEE_AVAILABILITY_API = 
     'https://unauthoritatively-ruinous-niesha.ngrok-free.dev/api/employees/availability';
   
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
   
   export async function fetchEmployeeAvailability(): Promise<EmployeeAvailabilityResponse> {
     const response = await fetch(EMPLOYEE_AVAILABILITY_API, {
       headers: {
         'ngrok-skip-browser-warning': 'true', // Bypass ngrok warning
       },
     });
     
     if (!response.ok) {
       throw new Error('Failed to fetch employee availability');
     }
     
     return response.json();
   }
   ```

2. **Update Availability API Route** (`app/api/availability/route.ts`):
   ```typescript
   import { fetchEmployeeAvailability } from '@/lib/employeeAvailability';
   
   export async function GET(req: Request) {
     const url = new URL(req.url);
     const date = url.searchParams.get('date');
     const serviceId = url.searchParams.get('serviceId');
     const employeeId = url.searchParams.get('employeeId');
     
     // Step 1: Fetch employee availability from external API
     let employeeAvailability: EmployeeAvailabilityResponse;
     try {
       employeeAvailability = await fetchEmployeeAvailability();
     } catch (error) {
       // Fallback: assume all employees available if API fails
       employeeAvailability = {
         employees: Object.values(EMPLOYEES).map(emp => ({
           employee_id: emp.id,
           name: emp.name,
           is_available: true,
           last_updated_at: null,
           updated_by: null,
           notes: null,
         })),
         total_available: Object.keys(EMPLOYEES).length,
         total_employees: Object.keys(EMPLOYEES).length,
       };
     }
     
     // Step 2: Filter employees by availability status
     const availableEmployeeIds = employeeAvailability.employees
       .filter(emp => emp.is_available)
       .map(emp => emp.employee_id as EmployeeId);
     
     // Step 3: Filter by service compatibility
     const service = getServiceById(serviceId ?? null);
     const serviceCompatibleEmployees = availableEmployeeIds.filter(id => {
       const emp = EMPLOYEES[id];
       return service ? emp.serviceTags.includes(service.tag) : true;
     });
     
     // Step 4: Fetch busy blocks from Google Calendar
     const busy = await fetchBusyBlocks(date);
     
     // Step 5: Generate available slots (existing logic)
     // ... rest of availability calculation
   }
   ```

3. **Update BookingForm to Handle Date Selection**:
   ```typescript
   const date = watch('date');
   const serviceId = watch('serviceId');
   const employeeId = watch('employeeId');
   
   useEffect(() => {
     let cancelled = false;
     
     async function loadAvailability() {
       if (!date || !serviceId) return;
       
       setLoadingSlots(true);
       setAvailability(null);
       
       // Build query string
       const qs = new URLSearchParams({ date, serviceId });
       if (employeeId) qs.set('employeeId', employeeId);
       
       try {
         const res = await fetch(`/api/availability?${qs.toString()}`);
         const data = await res.json() as AvailabilityResponse;
         
         if (!cancelled) {
           setAvailability(data);
         }
       } catch (error) {
         if (!cancelled) {
           setAvailability({
             ok: false,
             error: 'Failed to load availability',
           });
         }
       } finally {
         if (!cancelled) {
           setLoadingSlots(false);
         }
       }
     }
     
     loadAvailability();
     
     return () => {
       cancelled = true;
     };
   }, [date, serviceId, employeeId]);
   ```

**Key Points**:
- Date selection triggers availability check
- External API is called to get employee availability status
- Google Calendar is queried for booked times
- Only available employees are considered for time slots

---

### Phase 4: Google Calendar Integration for Booked Times

**Objective**: Query Google Calendar for the selected stylist on the selected date and remove booked times from available slots.

**Implementation in `fetchBusyBlocks` Function** (already exists in `app/api/availability/route.ts`):

```typescript
async function fetchBusyBlocks(
  dateISO: string,
  employeeId?: EmployeeId
): Promise<BusyBlock[]> {
  if (!hasCalendarConfig()) return [];
  
  const calendar = getCalendarClient();
  const calendarId = getCalendarId();
  
  const dayStart = startOfDay(parseISO(dateISO));
  const dayEnd = endOfDay(parseISO(dateISO));
  
  const resp = await calendar.events.list({
    calendarId,
    timeMin: dayStart.toISOString(),
    timeMax: dayEnd.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
    timeZone: SALON_TIMEZONE,
  });
  
  const items = resp.data.items ?? [];
  const blocks: BusyBlock[] = [];
  
  for (const ev of items) {
    const evEmployeeId = (ev.extendedProperties?.private?.employeeId ?? 
      '') as EmployeeId;
    
    // If specific employee requested, only return their blocks
    if (employeeId && evEmployeeId !== employeeId) continue;
    
    // If no employee specified, include all blocks
    if (!evEmployeeId || !(evEmployeeId in EMPLOYEES)) continue;
    
    const s = ev.start?.dateTime;
    const e = ev.end?.dateTime;
    if (!s || !e) continue;
    
    blocks.push({
      employeeId: evEmployeeId,
      start: new Date(s),
      end: new Date(e),
    });
  }
  
  return blocks;
}
```

**Slot Filtering Logic** (in availability route):

```typescript
// Generate candidate slots
const slots = buildSlots({
  windowStart: parseHHmm(day, hours.open),
  windowEnd: parseHHmm(day, hours.close),
  stepMin: 15,
  durationMin,
});

// Filter slots based on:
// 1. Employee availability (from external API)
// 2. Service compatibility
// 3. Google Calendar conflicts
const availableSlots = slots
  .map((slot) => {
    const availableEmployees = serviceCompatibleEmployees.filter((id) => {
      const emp = EMPLOYEES[id];
      
      // Check employee-specific availability hours
      const empStart = emp.availableAfter 
        ? parseHHmm(day, emp.availableAfter) 
        : windowStart;
      const empEnd = emp.availableUntil 
        ? parseHHmm(day, emp.availableUntil) 
        : windowEnd;
      
      if (slot.start < empStart || slot.end > empEnd) return false;
      
      // Check Google Calendar conflicts for this employee
      const conflicts = busy.some(
        (b) => b.employeeId === id && 
        overlap(slot.start, slot.end, b.start, b.end)
      );
      
      return !conflicts;
    });
    
    return {
      startTimeISO: slot.start.toISOString(),
      endTimeISO: slot.end.toISOString(),
      availableEmployees,
    };
  })
  .filter((s) => s.availableEmployees.length > 0);
```

**Key Points**:
- Google Calendar is queried for the selected date
- Events are filtered by employee ID (stored in extended properties)
- Overlapping time slots are removed from availability
- Only free slots are returned to the frontend

---

### Phase 5: Add Appointment to Calendar on Confirmation

**Objective**: When booking is confirmed, add the appointment to Google Calendar after final conflict check.

**Implementation in Appointment Route** (`app/api/appointments/route.ts`):

The existing implementation already handles this, but here's the enhanced flow:

```typescript
export async function POST(req: Request) {
  // ... validation code ...
  
  // Step 1: Final conflict check (race condition prevention)
  const conflict = await employeeHasConflict({
    dateISO: input.date,
    employeeId: input.employeeId,
    start,
    end,
  });
  
  if (conflict) {
    return NextResponse.json(
      { ok: false, error: 'SLOT_UNAVAILABLE' },
      { status: 409 }
    );
  }
  
  // Step 2: Verify employee is still available (from external API)
  try {
    const employeeStatus = await fetchEmployeeAvailability();
    const employee = employeeStatus.employees.find(
      emp => emp.employee_id === input.employeeId
    );
    
    if (!employee || !employee.is_available) {
      return NextResponse.json(
        { 
          ok: false, 
          error: 'EMPLOYEE_UNAVAILABLE',
          message: `${EMPLOYEES[input.employeeId].name} is currently unavailable. Please select another stylist.`
        },
        { status: 400 }
      );
    }
  } catch (error) {
    // If API fails, proceed with booking (graceful degradation)
    console.warn('Employee availability API failed, proceeding with booking');
  }
  
  // Step 3: Create calendar event
  if (!hasCalendarConfig()) {
    return NextResponse.json(
      {
        ok: false,
        error: 'CALENDAR_NOT_CONFIGURED',
        message: 'Google Calendar is not configured.',
      },
      { status: 500 }
    );
  }
  
  const calendar = getCalendarClient();
  const calendarId = getCalendarId();
  
  const summary = `${input.customerName} - ${service.label}`;
  const descriptionLines = [
    `Customer: ${input.customerName}`,
    `Phone: ${input.customerPhone}`,
    input.customerEmail ? `Email: ${input.customerEmail}` : null,
    `Service: ${service.label}`,
    `Employee: ${employee.name}`,
    input.notes ? `Notes: ${input.notes}` : null,
  ].filter(Boolean);
  
  const resp = await calendar.events.insert({
    calendarId,
    requestBody: {
      summary,
      description: descriptionLines.join('\n'),
      start: {
        dateTime: start.toISOString(),
        timeZone: SALON_TIMEZONE,
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: SALON_TIMEZONE,
      },
      extendedProperties: {
        private: {
          employeeId: input.employeeId,
          serviceId: input.serviceId,
          customerPhone: input.customerPhone,
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 60 }, // 1 hour before
        ],
      },
    },
  });
  
  return NextResponse.json({
    ok: true,
    eventId: resp.data.id,
    startTimeISO: start.toISOString(),
    endTimeISO: end.toISOString(),
  });
}
```

**Key Points**:
- Final conflict check prevents race conditions
- Employee availability is verified before booking
- Calendar event is created with all appointment details
- Extended properties store employee ID for future queries

---

## Complete Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    User Interaction Flow                         │
└─────────────────────────────────────────────────────────────────┘

1. Page Load
   └─> Background: Initialize Google Calendar Connection
       └─> Verify calendar access
       └─> Set calendarReady state

2. User Selects Service (e.g., "Haircut")
   └─> Filter Employees Based on Service
       └─> Show only: Purvi, Hetvi
       └─> Hide: Nirali, Varsha

3. User Selects Date (e.g., "2026-01-30")
   └─> Trigger Availability Check
       ├─> Call External API: /api/employees/availability
       │   └─> Get employee availability status
       │       ├─> Purvi: is_available = true
       │       ├─> Hetvi: is_available = false
       │       ├─> Nirali: is_available = false
       │       └─> Varsha: is_available = true
       │
       ├─> Filter by Service Compatibility
       │   └─> Only Purvi available (Hetvi unavailable)
       │
       ├─> Query Google Calendar for Selected Date
       │   └─> Fetch events for Purvi on 2026-01-30
       │       ├─> Event 1: 10:00 AM - 11:00 AM
       │       ├─> Event 2: 2:00 PM - 3:00 PM
       │       └─> Event 3: 4:30 PM - 5:30 PM
       │
       └─> Generate Available Time Slots
           ├─> Business Hours: 11:00 AM - 7:00 PM
           ├─> Remove Booked Times:
           │   ├─> 10:00-11:00 (before business hours)
           │   ├─> 2:00-3:00 PM (blocked)
           │   └─> 4:30-5:30 PM (blocked)
           └─> Return Available Slots:
               ├─> 11:00 AM - 12:00 PM (Purvi available)
               ├─> 11:15 AM - 12:15 PM (Purvi available)
               ├─> 11:30 AM - 12:30 PM (Purvi available)
               ├─> ... (all slots until 2:00 PM)
               ├─> 3:00 PM - 4:00 PM (Purvi available)
               ├─> ... (all slots until 4:30 PM)
               └─> 5:30 PM - 6:30 PM (Purvi available)

4. User Selects Time Slot (e.g., "3:00 PM")
   └─> Auto-assign Employee (Purvi)
   └─> Fill Customer Details

5. User Clicks "Confirm Booking"
   └─> Final Validation
       ├─> Re-check Employee Availability (external API)
       ├─> Re-check Google Calendar Conflicts
       └─> Validate Business Hours
   │
   └─> Create Appointment
       ├─> Create Google Calendar Event
       │   ├─> Title: "John Doe - Haircut & Styling"
       │   ├─> Time: 2026-01-30T15:00:00 - 2026-01-30T16:00:00
       │   ├─> Employee: Purvi Thakkar
       │   └─> Extended Properties: { employeeId: "purvi", ... }
       │
       └─> Return Success Response
           └─> Show Confirmation Message
```

---

## Service-to-Employee Mapping Reference

| Service ID | Service Name | Available Employees | Notes |
|------------|--------------|---------------------|-------|
| `haircut` | Haircut & Styling | Purvi, Hetvi | Only these two do haircuts |
| `color` | Hair Color & Highlights | Purvi, Hetvi | Hair services only |
| `threading` | Waxing / Threading | Purvi, Nirali, Varsha | Hetvi does not do threading |
| `facial` | Facial & Skincare | All employees | Everyone does facials |
| `manicure` | Manicure | All employees | Everyone does manicure |
| `pedicure` | Pedicure | All employees | Everyone does pedicure |
| `bridal` | Bridal Makeup | Purvi, Hetvi | Specialized service |
| `interview` | Interview / Consultation | All employees | All employees available |

---

## API Endpoints Summary

### 1. GET `/api/calendar/verify`
**Purpose**: Verify Google Calendar connection on page load

**Response**:
```json
{
  "ready": true
}
```

### 2. GET `/api/availability`
**Purpose**: Get available time slots for a date

**Query Parameters**:
- `date`: ISO date string (required)
- `serviceId`: Service ID (optional)
- `employeeId`: Specific employee (optional)

**Response**:
```json
{
  "ok": true,
  "closed": false,
  "durationMin": 60,
  "availableSlots": [
    {
      "startTimeISO": "2026-01-30T15:00:00.000Z",
      "endTimeISO": "2026-01-30T16:00:00.000Z",
      "availableEmployees": ["purvi"]
    }
  ]
}
```

### 3. POST `/api/appointments`
**Purpose**: Create a new appointment

**Request Body**:
```json
{
  "customerName": "John Doe",
  "customerPhone": "770-559-1521",
  "customerEmail": "john@example.com",
  "serviceId": "haircut",
  "employeeId": "purvi",
  "date": "2026-01-30",
  "startTimeISO": "2026-01-30T15:00:00.000Z",
  "notes": "First time customer"
}
```

**Response**:
```json
{
  "ok": true,
  "eventId": "google-event-id-xyz",
  "startTimeISO": "2026-01-30T15:00:00.000Z",
  "endTimeISO": "2026-01-30T16:00:00.000Z"
}
```

---

## Error Handling

### Employee Availability API Failure
- **Fallback**: Assume all employees are available
- **Log**: Warning message for monitoring
- **User Impact**: Minimal (system continues to work)

### Google Calendar Connection Failure
- **On Page Load**: Show warning but allow booking
- **On Availability Check**: Return slots without calendar filtering
- **On Booking**: Return error with message to contact salon

### Conflict Detection
- **During Availability Check**: Slots with conflicts are filtered out
- **During Booking**: Final check prevents double booking
- **Response**: 409 Conflict with available alternatives

---

## Environment Variables

```env
# Google Calendar Configuration
GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Employee Availability API (optional - can be hardcoded)
EMPLOYEE_AVAILABILITY_API_URL=https://unauthoritatively-ruinous-niesha.ngrok-free.dev/api/employees/availability
```

---

## Testing Checklist

### Phase 1: Calendar Connection
- [ ] Calendar connection initializes on page load
- [ ] Connection happens in background (no UI blocking)
- [ ] Error handling works if calendar is not configured
- [ ] Connection status is tracked correctly

### Phase 2: Service-Based Employee Filtering
- [ ] Selecting "Haircut" shows only Purvi and Hetvi
- [ ] Selecting "Threading" shows Purvi, Nirali, Varsha (not Hetvi)
- [ ] Selecting "Facial" shows all employees
- [ ] Employee list updates immediately on service change

### Phase 3: Date Selection & Availability
- [ ] Date selection triggers availability API call
- [ ] Employee availability API is called correctly
- [ ] Google Calendar is queried for selected date
- [ ] Booked times are removed from available slots
- [ ] Only available employees appear in time slots

### Phase 4: Booking Confirmation
- [ ] Final conflict check prevents double booking
- [ ] Employee availability is verified before booking
- [ ] Calendar event is created successfully
- [ ] Event includes all required information
- [ ] Extended properties are set correctly

### Integration Tests
- [ ] Book appointment for Purvi (haircut service)
- [ ] Book appointment for Hetvi (haircut service)
- [ ] Try to book Nirali for haircut (should fail)
- [ ] Book overlapping appointments for different employees (should succeed)
- [ ] Book overlapping appointments for same employee (should fail)
- [ ] Test with employee marked as unavailable in external API

---

## Implementation Priority

1. **High Priority** (Core Functionality):
   - Service-based employee filtering
   - Date selection triggers availability check
   - Google Calendar integration for booked times
   - Appointment creation in calendar

2. **Medium Priority** (Enhanced Features):
   - Background calendar connection on page load
   - Employee availability API integration
   - Enhanced error handling

3. **Low Priority** (Nice to Have):
   - Real-time calendar updates
   - Calendar sync status indicator
   - Advanced conflict resolution

---

## Security Considerations

1. **API Key Protection**: Google Calendar credentials stored in environment variables only
2. **External API**: Employee availability API uses ngrok (ensure HTTPS in production)
3. **Input Validation**: All user inputs validated server-side
4. **Rate Limiting**: Implement rate limiting on API endpoints
5. **Error Messages**: Don't expose sensitive information in error messages

---

## Future Enhancements

1. **Real-time Updates**: WebSocket connection for live availability updates
2. **Calendar Sync Status**: Visual indicator showing calendar connection status
3. **Multiple Calendar Support**: Support for individual employee calendars
4. **Appointment Modifications**: Allow rescheduling and cancellation
5. **Notification System**: Email/SMS confirmations and reminders
6. **Analytics Dashboard**: Track booking patterns and employee utilization

---

## Support & Troubleshooting

### Common Issues

1. **Calendar Not Connecting**:
   - Check environment variables are set correctly
   - Verify service account has calendar access
   - Check calendar ID is correct

2. **Employee Availability API Failing**:
   - Check ngrok URL is accessible
   - Verify API response format matches expected structure
   - Check network connectivity

3. **Double Booking Occurring**:
   - Ensure final conflict check is running
   - Verify Google Calendar events have correct employee ID in extended properties
   - Check timezone settings match

---

**Document Version**: 1.0  
**Last Updated**: January 2026  
**Status**: Ready for Implementation
