# Cloud Run Deployment Guide

This guide will help you deploy the Swapna Beauty Parlour landing page to Google Cloud Run using GitHub repository connection.

## Prerequisites

1. **Google Cloud Project**: You need a Google Cloud Project with billing enabled
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Google Cloud CLI** (optional, for local testing): Install from [here](https://cloud.google.com/sdk/docs/install)

## Environment Variables Required

Before deploying, you'll need to set up the following environment variables in Cloud Run:

### Google Calendar Integration
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` - Your Google Service Account email
- `GOOGLE_PRIVATE_KEY` - Your Google Service Account private key (with `\n` preserved)
- `GOOGLE_CALENDAR_ID` - Default calendar ID (optional, if using employee-specific calendars)
- `GOOGLE_PROJECT_ID` - Your Google Cloud Project ID

### Optional: Employee-Specific Calendar IDs
- `GOOGLE_CALENDAR_ID_PURVI` - Calendar ID for Purvi
- `GOOGLE_CALENDAR_ID_HETVI` - Calendar ID for Hetvi
- `GOOGLE_CALENDAR_ID_NIRALI` - Calendar ID for Nirali
- `GOOGLE_CALENDAR_ID_VARSHA` - Calendar ID for Varsha

### Optional: Calendar IDs API
- `CALENDAR_IDS_API_URL` - URL to external API for fetching calendar IDs

### Optional: Employee Availability API
- `EMPLOYEE_AVAILABILITY_API_URL` - URL to external API for employee availability

### Optional: Email Configuration (SMTP)
- `EMAIL_PROVIDER` - Set to `smtp` to enable email
- `SMTP_HOST` - SMTP server hostname
- `SMTP_PORT` - SMTP server port (e.g., `587` or `465`)
- `SMTP_USERNAME` - SMTP username
- `SMTP_PASSWORD` - SMTP password
- `SMTP_USE_TLS` - Set to `True` for TLS (usually for port 587)
- `SMTP_FROM_EMAIL` - Email address to send from (optional, defaults to SMTP_USERNAME)
- `SMTP_FROM_NAME` - Display name for sender (optional, defaults to "Swapna Beauty Parlour")

## Deployment Methods

### Method 1: GitHub Repository Connection (Recommended)

This is the easiest method and enables automatic deployments on push.

#### Step 1: Enable Required APIs

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Enable the following APIs:
   - Cloud Run API
   - Cloud Build API
   - Container Registry API (or Artifact Registry API)

#### Step 2: Connect GitHub Repository

1. Go to [Cloud Run Console](https://console.cloud.google.com/run)
2. Click **"Create Service"**
3. Select **"Deploy from source repository"**
4. Click **"Set up with Cloud Build"**
5. Authenticate with GitHub if prompted
6. Select your repository and branch
7. Choose **"Dockerfile"** as the build type
8. Set the service name: `swapna-beauty-parlour`
9. Select region: `us-central1` (or your preferred region)
10. Click **"Next"**

#### Step 3: Configure Service Settings

1. **Container Port**: `3000`
2. **Memory**: `512Mi` (minimum recommended)
3. **CPU**: `1` (minimum recommended)
4. **Min instances**: `0` (to save costs when not in use)
5. **Max instances**: `10` (adjust based on expected traffic)
6. **Timeout**: `300` seconds (5 minutes)
7. **Concurrency**: `80` (default)

#### Step 4: Set Environment Variables

1. Click **"Variables & Secrets"** tab
2. Click **"Add Variable"** for each environment variable
3. Add all required variables from the list above
4. **Important**: For `GOOGLE_PRIVATE_KEY`, make sure to:
   - Keep the `\n` characters as literal newlines
   - Or use the format: `-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n`
   - Cloud Run will handle the newlines correctly

#### Step 5: Deploy

1. Click **"Create"** or **"Deploy"**
2. Wait for the build and deployment to complete (5-10 minutes)
3. Once deployed, you'll get a URL like: `https://swapna-beauty-parlour-xxxxx-uc.a.run.app`

### Method 2: Manual Deployment with Cloud Build

If you prefer more control or want to use the `cloudbuild.yaml` file:

#### Step 1: Build and Push Image

```bash
# Set your project ID
export PROJECT_ID=your-project-id
export SERVICE_NAME=swapna-beauty-parlour
export REGION=us-central1

# Submit build to Cloud Build
gcloud builds submit --config cloudbuild.yaml
```

#### Step 2: Deploy to Cloud Run

```bash
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME:latest \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --set-env-vars NODE_ENV=production
```

#### Step 3: Set Environment Variables

```bash
gcloud run services update $SERVICE_NAME \
  --region $REGION \
  --update-env-vars GOOGLE_SERVICE_ACCOUNT_EMAIL=your-email@project.iam.gserviceaccount.com \
  --update-env-vars GOOGLE_PRIVATE_KEY="$(cat path/to/private-key.txt)" \
  --update-env-vars GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com
```

### Method 3: Local Docker Build and Push

For testing locally before deploying:

```bash
# Set variables
export PROJECT_ID=your-project-id
export SERVICE_NAME=swapna-beauty-parlour
export REGION=us-central1

# Build Docker image
docker build -t gcr.io/$PROJECT_ID/$SERVICE_NAME:latest .

# Push to Container Registry
docker push gcr.io/$PROJECT_ID/$SERVICE_NAME:latest

# Deploy to Cloud Run
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME:latest \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --port 3000
```

## Post-Deployment Configuration

### 1. Set Up Custom Domain (Optional)

1. Go to Cloud Run service settings
2. Click **"Manage Custom Domains"**
3. Add your domain
4. Follow the DNS configuration instructions

### 2. Configure Environment Variables

After initial deployment, you can update environment variables:

**Via Console:**
1. Go to Cloud Run service
2. Click **"Edit & Deploy New Revision"**
3. Go to **"Variables & Secrets"** tab
4. Add or update variables
5. Click **"Deploy"**

**Via CLI:**
```bash
gcloud run services update swapna-beauty-parlour \
  --region us-central1 \
  --update-env-vars KEY1=value1,KEY2=value2
```

### 3. Set Up Secrets (Recommended for Sensitive Data)

For sensitive data like private keys, use Cloud Secret Manager:

```bash
# Create secret
echo -n "your-private-key" | gcloud secrets create google-private-key --data-file=-

# Grant Cloud Run access
gcloud secrets add-iam-policy-binding google-private-key \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Use in Cloud Run
gcloud run services update swapna-beauty-parlour \
  --region us-central1 \
  --update-secrets GOOGLE_PRIVATE_KEY=google-private-key:latest
```

## Continuous Deployment

### Automatic Deployments on Push

If you connected via GitHub:
- Every push to the connected branch will trigger a new build and deployment
- You can configure which branch to deploy from in Cloud Build settings

### Manual Trigger

You can also trigger builds manually:
1. Go to [Cloud Build Triggers](https://console.cloud.google.com/cloud-build/triggers)
2. Click **"Run Trigger"** for your repository

## Monitoring and Logs

### View Logs

```bash
gcloud run services logs read swapna-beauty-parlour --region us-central1
```

Or via Console:
1. Go to Cloud Run service
2. Click **"Logs"** tab

### Set Up Monitoring

1. Go to [Cloud Monitoring](https://console.cloud.google.com/monitoring)
2. Create alerts for:
   - High error rates
   - High latency
   - Low availability

## Troubleshooting

### Build Fails

1. Check Cloud Build logs for errors
2. Ensure all dependencies are in `package.json`
3. Verify Dockerfile syntax

### Deployment Fails

1. Check Cloud Run logs
2. Verify environment variables are set correctly
3. Ensure port 3000 is exposed in Dockerfile

### Application Errors

1. Check application logs in Cloud Run
2. Verify all environment variables are set
3. Test Google Calendar API credentials
4. Check SMTP configuration if using email

### High Costs

1. Set `min-instances` to `0` (scales to zero when not in use)
2. Reduce `max-instances` if not needed
3. Use appropriate memory/CPU settings

## Cost Optimization

- **Min Instances = 0**: Saves money when no traffic
- **Memory**: Start with 512Mi, increase only if needed
- **CPU**: Start with 1, increase only if needed
- **Max Instances**: Set based on expected traffic
- **Timeout**: Keep reasonable (300s default is good)

## Security Best Practices

1. **Use Secret Manager** for sensitive data (private keys, passwords)
2. **Enable IAM** authentication if needed (currently set to allow unauthenticated)
3. **Use HTTPS**: Cloud Run provides HTTPS by default
4. **Regular Updates**: Keep dependencies updated
5. **Environment Variables**: Don't commit secrets to Git

## Next Steps

1. Test the deployed application
2. Set up monitoring and alerts
3. Configure custom domain (if needed)
4. Set up backup/restore procedures
5. Document any custom configurations

## Support

For issues:
1. Check Cloud Run logs
2. Review Cloud Build logs
3. Verify environment variables
4. Test locally with Docker first

---

**Last Updated**: 2024
**Deployment Method**: Cloud Run with GitHub Integration
