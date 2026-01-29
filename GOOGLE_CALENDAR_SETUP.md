# Google Calendar API Setup Guide

## Why the Error Occurs

The error `ERR_OSSL_UNSUPPORTED` with "DECODER routines::unsupported" typically happens when:

1. **Private Key Format Issue**: The private key in your `.env.local` file is not properly formatted
2. **Newline Characters**: The private key needs actual newlines (`\n`), not the literal string `\n`
3. **Quotes**: Sometimes the key gets wrapped in extra quotes
4. **Missing Key Parts**: The key might be missing the BEGIN/END markers

## Step-by-Step: Getting Google Calendar API Keys

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click **"New Project"**
4. Enter project name: `Swapna Beauty Parlour Booking`
5. Click **"Create"**
6. Wait for the project to be created and select it

### Step 2: Enable Google Calendar API

1. In the Google Cloud Console, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google Calendar API"**
3. Click on it and click **"Enable"**
4. Wait for it to enable (may take a minute)

### Step 3: Create a Service Account

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"Service account"**
4. Fill in the details:
   - **Service account name**: `swapna-calendar-service`
   - **Service account ID**: (auto-generated, you can change it)
   - **Description**: `Service account for booking system calendar integration`
5. Click **"CREATE AND CONTINUE"**
6. Skip the optional steps (Grant access, Grant users access) and click **"DONE"**

### Step 4: Create and Download Service Account Key

1. In the **"Credentials"** page, find your service account in the **"Service accounts"** section
2. Click on the service account email (e.g., `swapna-calendar-service@your-project.iam.gserviceaccount.com`)
3. Go to the **"Keys"** tab
4. Click **"ADD KEY"** → **"Create new key"**
5. Select **"JSON"** format
6. Click **"CREATE"**
7. A JSON file will download automatically - **SAVE THIS FILE SECURELY** (you won't be able to download it again!)

### Step 5: Extract Information from JSON File

Open the downloaded JSON file. It will look like this:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n",
  "client_email": "swapna-calendar-service@your-project.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

You need these values:
- `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `private_key` → `GOOGLE_PRIVATE_KEY`

### Step 6: Create a Google Calendar

1. Go to [Google Calendar](https://calendar.google.com/)
2. On the left sidebar, click the **"+"** next to **"Other calendars"**
3. Select **"Create new calendar"**
4. Fill in:
   - **Name**: `Swapna Beauty Parlour Appointments`
   - **Description**: `Appointments booked through the website`
   - **Time zone**: `America/New_York` (or your timezone)
5. Click **"Create calendar"**

### Step 7: Share Calendar with Service Account

1. In Google Calendar, find your new calendar in the left sidebar
2. Click the **three dots** (⋮) next to the calendar name
3. Select **"Settings and sharing"**
4. Scroll down to **"Share with specific people"**
5. Click **"Add people"**
6. Paste the **service account email** (from Step 5, the `client_email` value)
7. Set permission to **"Make changes to events"**
8. Click **"Send"** (the service account won't receive an email, but it will have access)

### Step 8: Get Calendar ID

1. Still in the calendar settings, scroll to the top
2. Find the **"Integrate calendar"** section
3. Copy the **"Calendar ID"** (it looks like: `abc123def456@group.calendar.google.com` or just a long string)
4. This is your `GOOGLE_CALENDAR_ID`

### Step 9: Configure .env.local File

Create or update your `.env.local` file in the project root:

```env
# Google Calendar Configuration
GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com
GOOGLE_SERVICE_ACCOUNT_EMAIL=swapna-calendar-service@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

## Important: Private Key Format

The `GOOGLE_PRIVATE_KEY` must be formatted correctly:

### ✅ CORRECT Format:

```env
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

OR (without quotes, but with actual newlines):

```env
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
-----END PRIVATE KEY-----
```

### ❌ WRONG Formats:

```env
# Don't use literal \n without quotes
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n

# Don't use single quotes
GOOGLE_PRIVATE_KEY='-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n'
```

## Quick Copy-Paste Method

1. Open the downloaded JSON file
2. Copy the entire `private_key` value (including the quotes in the JSON)
3. In `.env.local`, paste it like this:

```env
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

Make sure:
- It's wrapped in double quotes `"`
- The `\n` characters are preserved (they represent newlines)
- The BEGIN and END markers are included

## Testing the Configuration

After setting up your `.env.local` file:

1. Restart your Next.js dev server (`npm run dev`)
2. The calendar verification should work without errors
3. You can test by visiting: `http://localhost:3000/api/calendar/verify`

## Troubleshooting

### Error: "Invalid private key format"
- Make sure the key includes `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- Check that `\n` characters are present (they should be literal backslash-n, not actual newlines in the .env file)

### Error: "Calendar connection failed"
- Verify the service account email has access to the calendar
- Check that the Calendar ID is correct
- Ensure Google Calendar API is enabled in your project

### Error: "Missing env var"
- Make sure `.env.local` is in the project root (same level as `package.json`)
- Restart the dev server after changing `.env.local`
- Check for typos in variable names

## Security Notes

⚠️ **IMPORTANT**: 
- Never commit `.env.local` to git (it should be in `.gitignore`)
- Never share your private key publicly
- The service account key gives full calendar access - keep it secure
- If the key is compromised, delete it and create a new one

## Next Steps

Once configured:
1. The calendar will automatically sync appointments
2. All bookings will appear in your Google Calendar
3. The system will check for conflicts before allowing bookings
4. Employees can view their schedules in Google Calendar
