# SMTP Email Confirmation Implementation

## Overview

This document outlines the implementation of SMTP-based email confirmations for the Swapna Beauty Parlour booking system. When a customer books an appointment, they will automatically receive a confirmation email with their appointment details.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Booking Flow                              │
└─────────────────────────────────────────────────────────────┘

1. Customer submits booking form
   │
   ▼
2. POST /api/appointments
   │
   ├─> Validate booking data
   ├─> Check conflicts
   ├─> Create Google Calendar event
   ├─> Send confirmation email via SMTP  ← NEW
   └─> Return success response
```

---

## Technology Stack

- **Email Library**: `nodemailer` - Industry standard for Node.js email sending
- **SMTP Provider**: Gmail SMTP (smtp.gmail.com)
- **Port**: 587 (TLS/STARTTLS)
- **Authentication**: Username/Password (App Password for Gmail)

---

## Environment Variables

Add the following variables to your `.env.local` file:

```env
# Email Configuration (SMTP)
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=rakshitjan@gmail.com
SMTP_PASSWORD=sovfvgkgpjqumrcj
SMTP_FROM_EMAIL=rakshitjan@gmail.com
SMTP_FROM_NAME=Swapna Beauty Parlour
SMTP_USE_TLS=True
TEST_EMAIL_RECIPIENT=rakshit.jangid2022@vitstudent.ac.in
```

### Complete Environment Variables Reference

For reference, here are all environment variables used in the project:

```env
# Google Calendar Configuration (Required)
GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Optional: Employee-specific calendar IDs
GOOGLE_CALENDAR_ID_PURVI=purvi-calendar-id@group.calendar.google.com
GOOGLE_CALENDAR_ID_HETVI=hetvi-calendar-id@group.calendar.google.com
GOOGLE_CALENDAR_ID_NIRALI=nirali-calendar-id@group.calendar.google.com
GOOGLE_CALENDAR_ID_VARSHA=varsha-calendar-id@group.calendar.google.com

# Employee Availability API (Optional)
EMPLOYEE_AVAILABILITY_API_URL=https://your-api-endpoint.com/api/employees/availability

# Email Configuration (SMTP) - Required for email confirmations
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=your-email@gmail.com
SMTP_FROM_NAME=Swapna Beauty Parlour
SMTP_USE_TLS=True
TEST_EMAIL_RECIPIENT=test@example.com
```

### Environment Variable Descriptions

| Variable | Description | Example |
|----------|-------------|---------|
| `EMAIL_PROVIDER` | Email provider type (currently only 'smtp') | `smtp` |
| `SMTP_HOST` | SMTP server hostname | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port (587 for TLS, 465 for SSL) | `587` |
| `SMTP_USERNAME` | SMTP authentication username | `rakshitjan@gmail.com` |
| `SMTP_PASSWORD` | SMTP authentication password (App Password for Gmail) | `sovfvgkgpjqumrcj` |
| `SMTP_FROM_EMAIL` | Email address to send from | `rakshitjan@gmail.com` |
| `SMTP_FROM_NAME` | Display name for sender | `Swapna Beauty Parlour` |
| `SMTP_USE_TLS` | Whether to use TLS encryption | `True` |
| `TEST_EMAIL_RECIPIENT` | Email for testing (optional) | `rakshit.jangid2022@vitstudent.ac.in` |

---

## Implementation Details

### 1. Email Service Module (`lib/email.ts`)

A centralized email service that:
- Configures nodemailer with SMTP settings
- Provides a function to send booking confirmation emails
- Handles errors gracefully
- Validates email configuration

**Key Functions:**
- `sendBookingConfirmation()` - Sends appointment confirmation email
- `isEmailConfigured()` - Checks if email is properly configured
- `getEmailConfig()` - Retrieves and validates email configuration

### 2. Email Template

The confirmation email includes:
- **Subject**: "Appointment Confirmed - Swapna Beauty Parlour"
- **Body**: HTML formatted email with:
  - Customer name
  - Service name
  - Stylist name
  - Date and time
  - Duration
  - Contact information
  - Cancellation instructions (if applicable)

### 3. Integration Points

#### Backend (`app/api/appointments/route.ts`)

After successfully creating the Google Calendar event:
1. Send confirmation email to customer
2. Log email sending status (success/failure)
3. Continue even if email fails (graceful degradation)

```typescript
// After calendar event creation
try {
  await sendBookingConfirmation({
    to: input.customerEmail,
    customerName: input.customerName,
    serviceName: service.label,
    employeeName: employee.name,
    date: format(start, "EEEE, MMMM d, yyyy"),
    time: format(start, "h:mm a"),
    duration: service.durationMin,
    phone: input.customerPhone,
  });
} catch (emailError) {
  // Log error but don't fail the booking
  console.error("Failed to send confirmation email:", emailError);
}
```

#### Frontend (`components/BookingForm.tsx`)

Update the success message to indicate email confirmation:

```typescript
{submitState.status === "success" ? (
  <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
    <p className="font-medium mb-2">Appointment confirmed!</p>
    <p>
      Your appointment is scheduled for{" "}
      <span className="font-medium">
        {format(parseISO(submitState.startTimeISO), "MMM d, yyyy · h:mm a")}
      </span>
      .
    </p>
    {values.customerEmail && (
      <p className="mt-2 text-xs">
        ✓ A confirmation email has been sent to {values.customerEmail}
      </p>
    )}
  </div>
) : null}
```

---

## Email Template Structure

### HTML Email Template

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #8B4513; color: #fff; padding: 20px; text-align: center; }
    .content { background: #fff; padding: 30px; border: 1px solid #ddd; }
    .appointment-details { background: #f9f9f9; padding: 20px; margin: 20px 0; border-left: 4px solid #D4AF37; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Swapna Beauty Parlour</h1>
    </div>
    <div class="content">
      <h2>Appointment Confirmed!</h2>
      <p>Dear {customerName},</p>
      <p>Your appointment has been successfully booked. We look forward to seeing you!</p>
      
      <div class="appointment-details">
        <h3>Appointment Details</h3>
        <p><strong>Service:</strong> {serviceName}</p>
        <p><strong>Stylist:</strong> {employeeName}</p>
        <p><strong>Date:</strong> {date}</p>
        <p><strong>Time:</strong> {time}</p>
        <p><strong>Duration:</strong> {duration} minutes</p>
      </div>
      
      <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
      <p><strong>Contact Us:</strong><br>
      Phone: (770) 559-1521<br>
      WhatsApp: <a href="https://wa.me/17705591521">Click here</a></p>
    </div>
    <div class="footer">
      <p>Thank you for choosing Swapna Beauty Parlour!</p>
    </div>
  </div>
</body>
</html>
```

---

## Error Handling

### Email Sending Failures

The system is designed to be resilient:
- **Booking succeeds even if email fails**: The appointment is still created in Google Calendar
- **Errors are logged**: All email errors are logged to the console for debugging
- **No user-facing error**: Users don't see email failures (booking still succeeds)

### Common Issues and Solutions

1. **"Invalid login credentials"**
   - **Solution**: Verify SMTP_USERNAME and SMTP_PASSWORD are correct
   - For Gmail: Use App Password, not regular password

2. **"Connection timeout"**
   - **Solution**: Check SMTP_HOST and SMTP_PORT
   - Verify firewall/network allows outbound SMTP connections

3. **"TLS/SSL errors"**
   - **Solution**: Ensure SMTP_USE_TLS is set correctly
   - For port 587: Use TLS (SMTP_USE_TLS=True)
   - For port 465: Use SSL (different configuration)

4. **"Email not received"**
   - **Solution**: Check spam folder
   - Verify recipient email is correct
   - Test with TEST_EMAIL_RECIPIENT first

---

## Testing

### Manual Testing Checklist

- [ ] Send test email with valid configuration
- [ ] Verify email is received in inbox (not spam)
- [ ] Test booking with email address
- [ ] Verify confirmation email contains correct details
- [ ] Test booking without email address (should still work)
- [ ] Test with invalid SMTP credentials (should log error but booking succeeds)
- [ ] Test with network issues (should handle gracefully)

### Test Email Function

A test endpoint can be created for debugging:

```typescript
// app/api/email/test/route.ts
export async function POST() {
  try {
    await sendBookingConfirmation({
      to: process.env.TEST_EMAIL_RECIPIENT!,
      customerName: "Test Customer",
      serviceName: "Haircut & Styling",
      employeeName: "Purvi Thakkar",
      date: "Monday, January 30, 2026",
      time: "3:00 PM",
      duration: 60,
      phone: "(770) 559-1521",
    });
    return NextResponse.json({ ok: true, message: "Test email sent" });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
```

---

## Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control
2. **App Passwords**: Use Gmail App Passwords instead of regular passwords
3. **Rate Limiting**: Consider implementing rate limiting for email sending
4. **Email Validation**: Validate email addresses before sending
5. **Error Messages**: Don't expose sensitive SMTP details in error messages

---

## Gmail App Password Setup

If using Gmail SMTP, you need to create an App Password:

1. Go to Google Account settings
2. Enable 2-Step Verification (required for App Passwords)
3. Go to Security → App Passwords
4. Generate a new app password for "Mail"
5. Use this 16-character password as `SMTP_PASSWORD`

---

## Future Enhancements

1. **Email Templates**: Support for multiple email templates (confirmation, reminder, cancellation)
2. **Email Queue**: Queue emails for better reliability
3. **Email Service Providers**: Support for other providers (SendGrid, Mailgun, etc.)
4. **Email Analytics**: Track email open rates and delivery status
5. **Reminder Emails**: Send reminder emails 24 hours before appointment
6. **Cancellation Emails**: Send confirmation when appointment is cancelled

---

## File Structure

```
lib/
  email.ts              # Email service module
app/
  api/
    appointments/
      route.ts          # Updated to send emails
    email/
      test/
        route.ts        # Test endpoint (optional)
components/
  BookingForm.tsx       # Updated success message
.env.local             # Environment variables (not in git)
```

---

## Dependencies

Add to `package.json`:
```json
{
  "dependencies": {
    "nodemailer": "^6.9.7"
  },
  "devDependencies": {
    "@types/nodemailer": "^6.4.14"
  }
}
```

---

## Implementation Steps

1. ✅ Create documentation (this file)
2. ⏳ Install nodemailer package
3. ⏳ Create email service module (`lib/email.ts`)
4. ⏳ Integrate email sending into appointments route
5. ⏳ Update frontend to show email confirmation message
6. ⏳ Test email sending
7. ⏳ Update environment variables documentation

---

**Document Version**: 1.0  
**Last Updated**: January 2026  
**Status**: Ready for Implementation
