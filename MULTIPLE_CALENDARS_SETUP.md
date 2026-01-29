# Multiple Employee Calendars Setup Guide

## Overview

The booking system now supports **separate Google Calendar IDs for each employee** (Purvi, Hetvi, Nirali, Varsha). This allows each employee to have their own calendar where appointments are automatically added.

## Benefits

1. **Better Organization**: Each employee can see only their appointments
2. **Individual Access**: Employees can share their calendar with their personal Google account
3. **Clear Separation**: No confusion about which appointments belong to which employee
4. **Flexible Setup**: Can use individual calendars or a shared calendar

## Setup Instructions

### 1. Create Calendars for Each Employee

For each employee, create a separate Google Calendar:

1. Go to [Google Calendar](https://calendar.google.com/)
2. Click **"+"** next to "Other calendars"
3. Select **"Create new calendar"**
4. Name it: `[Employee Name] - Appointments`
   - Example: `Purvi Thakkar - Appointments`
   - Example: `Hetvi Thakkar - Appointments`
   - Example: `Nirali Dave - Appointments`
   - Example: `Varsha Patel - Appointments`
5. Set timezone: `America/New_York` (or your timezone)
6. Click **"Create calendar"**

### 2. Share Each Calendar with Service Account

For each calendar:

1. Click the **three dots (⋮)** next to the calendar name
2. Select **"Settings and sharing"**
3. Scroll to **"Share with specific people"**
4. Click **"Add people"**
5. Paste your **service account email** (from the JSON file)
6. Set permission to **"Make changes to events"**
7. Click **"Send"**

### 3. Get Calendar IDs

For each calendar:

1. In calendar settings, find **"Integrate calendar"** section
2. Copy the **"Calendar ID"**
3. Save it for the `.env.local` file

### 4. Configure Environment Variables

Update your `.env.local` file:

```env
# Service Account Credentials (same for all calendars)
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# Individual Employee Calendar IDs
GOOGLE_CALENDAR_ID_PURVI=purvi-calendar-id@group.calendar.google.com
GOOGLE_CALENDAR_ID_HETVI=hetvi-calendar-id@group.calendar.google.com
GOOGLE_CALENDAR_ID_NIRALI=nirali-calendar-id@group.calendar.google.com
GOOGLE_CALENDAR_ID_VARSHA=varsha-calendar-id@group.calendar.google.com
```

## How It Works

### When Booking an Appointment

1. User selects an employee (e.g., Purvi)
2. System checks **Purvi's calendar** for conflicts
3. When booking is confirmed, appointment is added to **Purvi's calendar**

### When Checking Availability

1. System checks each employee's **individual calendar**
2. Only shows time slots that are free in that employee's calendar
3. Each employee's calendar is checked independently

### Fallback Behavior

- If an employee's calendar ID is not configured, the system falls back to `GOOGLE_CALENDAR_ID`
- If no calendars are configured, the system gracefully handles the error

## Example .env.local

```env
# Service Account (one for all calendars)
GOOGLE_SERVICE_ACCOUNT_EMAIL=swapna-calendar-service@my-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKjMzEfYyPWAa2XMyMS\n...\n-----END PRIVATE KEY-----\n"

# Purvi's Calendar
GOOGLE_CALENDAR_ID_PURVI=purvi123@group.calendar.google.com

# Hetvi's Calendar
GOOGLE_CALENDAR_ID_HETVI=hetvi456@group.calendar.google.com

# Nirali's Calendar
GOOGLE_CALENDAR_ID_NIRALI=nirali789@group.calendar.google.com

# Varsha's Calendar
GOOGLE_CALENDAR_ID_VARSHA=varsha012@group.calendar.google.com
```

## Testing

After configuration:

1. Restart your dev server: `npm run dev`
2. Visit: `http://localhost:3000/api/calendar/verify`
3. You should see:
   ```json
   {
     "ready": true,
     "calendars": {
       "purvi": true,
       "hetvi": true,
       "nirali": true,
       "varsha": true
     }
   }
   ```

## Troubleshooting

### Error: "No calendar ID configured for employee X"

**Solution**: Make sure you've set `GOOGLE_CALENDAR_ID_[EMPLOYEE]` in `.env.local`

### Error: "Calendar connection failed for employee X"

**Solution**: 
- Verify the calendar ID is correct
- Check that the service account has access to that calendar
- Ensure the calendar is shared with the service account email

### Some employees work, others don't

**Solution**: Check each employee's calendar individually:
- Verify calendar ID is correct
- Check sharing permissions
- Ensure service account has "Make changes to events" permission

## Migration from Single Calendar

If you're currently using a single shared calendar (`GOOGLE_CALENDAR_ID`):

1. The system will continue to work with the shared calendar
2. To migrate to individual calendars:
   - Create separate calendars for each employee
   - Add the individual calendar IDs to `.env.local`
   - The system will automatically use individual calendars when available
   - Old appointments remain in the shared calendar

## Benefits for Employees

Each employee can:

1. **View their own calendar** in Google Calendar app
2. **Share their calendar** with their personal Google account
3. **See only their appointments** without seeing other employees' schedules
4. **Get notifications** for their own appointments
5. **Sync to mobile devices** using their personal Google account

## Security Notes

- Each calendar is separate, so employees can't see each other's appointments
- The service account has access to all calendars (required for the system to work)
- Employees can share their calendar with their personal account for viewing only
- Never share the service account credentials with employees
