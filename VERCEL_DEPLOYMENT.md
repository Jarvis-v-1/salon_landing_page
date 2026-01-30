# Vercel Deployment Guide

## Environment Variables Setup

**IMPORTANT**: Environment variables must be added in **Vercel Dashboard**, not just GitHub. GitHub secrets are NOT automatically used by Vercel.

### Step 1: Access Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**

### Step 2: Add Required Environment Variables

Add the following environment variables for **Production**, **Preview**, and **Development** environments:

#### Required Variables:

1. **GOOGLE_SERVICE_ACCOUNT_EMAIL**
   - Value: Your Google Service Account email (e.g., `swapna-calendar-service@your-project.iam.gserviceaccount.com`)
   - Example: `swapna-calendar-service@my-project-123456.iam.gserviceaccount.com`

2. **GOOGLE_PRIVATE_KEY**
   - Value: Your Google Service Account private key
   - **IMPORTANT**: The private key must include the full key with `\n` characters preserved
   - Format: `-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n`
   - **Tip**: Copy the entire private key from your JSON file, including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` markers
   - The `\n` characters will be automatically converted to actual newlines by the application

3. **GOOGLE_CALENDAR_ID** (Optional but recommended)
   - Value: Your default Google Calendar ID
   - Example: `your-calendar-id@group.calendar.google.com`
   - Note: If using employee-specific calendars, you can also add:
     - `GOOGLE_CALENDAR_ID_PURVI`
     - `GOOGLE_CALENDAR_ID_HETVI`
     - `GOOGLE_CALENDAR_ID_NIRALI`
     - `GOOGLE_CALENDAR_ID_VARSHA`

### Step 3: Private Key Formatting Tips

When adding `GOOGLE_PRIVATE_KEY` in Vercel:

**Option 1: Single Line with \n (Recommended)**
```
-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n
```

**Option 2: Multi-line (if Vercel supports it)**
```
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
-----END PRIVATE KEY-----
```

The application will automatically handle the `\n` conversion, so either format should work.

### Step 4: Redeploy

After adding environment variables:

1. Go to **Deployments** tab
2. Click the **⋯** (three dots) on the latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger a new deployment

### Step 5: Verify

After redeployment, test the booking form. The error message should disappear if the variables are correctly configured.

## Troubleshooting

### Error: "Google Calendar is not configured"

**Possible causes:**
1. Environment variables not added in Vercel (only added in GitHub)
2. Variables added to wrong environment (e.g., only Development, not Production)
3. Private key formatting issue
4. Variable names misspelled

**Solutions:**
1. ✅ Verify variables are in Vercel Dashboard → Settings → Environment Variables
2. ✅ Make sure variables are added for **Production** environment (or all environments)
3. ✅ Check that `GOOGLE_PRIVATE_KEY` includes the full key with BEGIN/END markers
4. ✅ Verify variable names match exactly (case-sensitive):
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
   - `GOOGLE_CALENDAR_ID`

### Private Key Issues

If you're getting authentication errors:

1. **Check the key format**: It should start with `-----BEGIN PRIVATE KEY-----` and end with `-----END PRIVATE KEY-----`
2. **Verify newlines**: The key should have `\n` characters between lines (the app handles conversion)
3. **No extra quotes**: Don't wrap the key in quotes in Vercel (unless it's part of the key itself)
4. **Full key**: Make sure you copied the entire key from the JSON file

### Testing Locally

For local development, create a `.env.local` file:

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com
```

**Note**: `.env.local` is gitignored and only works locally. For Vercel, you must add variables in the dashboard.

## Additional Resources

- [Vercel Environment Variables Documentation](https://vercel.com/docs/concepts/projects/environment-variables)
- [Google Calendar Setup Guide](./GOOGLE_CALENDAR_SETUP.md)
- [Multiple Calendars Setup](./MULTIPLE_CALENDARS_SETUP.md)
