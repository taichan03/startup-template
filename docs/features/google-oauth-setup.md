# Google OAuth SSO Setup Guide

This guide will walk you through setting up Google OAuth authentication for the Startup Template application.

## Prerequisites

- A Google account
- Access to [Google Cloud Console](https://console.cloud.google.com/)
- The application running locally (backend on port 8000, frontend on port 5173)

---

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)

2. Click on the project dropdown at the top of the page (next to "Google Cloud")

3. Click **"New Project"** in the dialog that appears

4. Fill in the project details:
   - **Project name**: `Startup-Template-OAuth` (or any name you prefer)
   - **Organization**: Leave as default (No organization)
   - **Location**: Leave as default

5. Click **"Create"**

6. Wait for the project to be created (you'll see a notification when complete)

7. Select your new project from the project dropdown to make it active

---

## Step 2: Enable Required APIs

Google OAuth requires the Google+ API or People API to be enabled.

1. In the left sidebar, click **"APIs & Services"** → **"Library"**

2. In the search bar, type: `People API`

3. Click on **"Google People API"** from the results

4. Click the blue **"Enable"** button

5. Wait for the API to be enabled (you'll see a green checkmark when complete)

---

## Step 3: Configure OAuth Consent Screen

Before creating credentials, you must configure the OAuth consent screen.

1. In the left sidebar, go to **"APIs & Services"** → **"OAuth consent screen"**

2. Choose **"External"** as the user type (for testing/development)
   - Note: "External" allows anyone with a Google account to test. You can restrict this later.

3. Click **"Create"**

4. Fill in the **App information** section:
   - **App name**: `Startup Template` (or your preferred name)
   - **User support email**: Select your email from the dropdown
   - **App logo**: (Optional) You can skip this for now

5. Fill in the **App domain** section (optional for development):
   - Leave blank for now (only needed for production)

6. Fill in the **Developer contact information**:
   - **Email addresses**: Enter your email address

7. Click **"Save and Continue"**

8. **Scopes** section:
   - Click **"Add or Remove Scopes"**
   - In the filter box, search for `userinfo.email`
   - Check the boxes for:
     - `.../auth/userinfo.email` - View your email address
     - `.../auth/userinfo.profile` - See your personal info, including any personal info you've made publicly available
     - `openid` - Associate you with your personal info on Google
   - Click **"Update"** at the bottom
   - Click **"Save and Continue"**

9. **Test users** section (IMPORTANT for development):
   - Click **"Add Users"**
   - Enter the email addresses that will be testing the OAuth flow
   - Add at least your own Gmail address
   - Click **"Add"**
   - Click **"Save and Continue"**

10. Review the summary and click **"Back to Dashboard"**

---

## Step 4: Create OAuth Credentials

Now you'll create the OAuth client ID and secret.

1. In the left sidebar, go to **"APIs & Services"** → **"Credentials"**

2. Click **"Create Credentials"** at the top

3. Select **"OAuth client ID"** from the dropdown

4. Choose application type:
   - Select **"Web application"**

5. Fill in the **Name**:
   - Enter: `Startup Template Web Client` (or any descriptive name)

6. Configure **Authorized JavaScript origins**:
   - Click **"Add URI"**
   - Add: `http://localhost:5173` (frontend)
   - Click **"Add URI"** again
   - Add: `http://localhost:8000` (backend)

7. Configure **Authorized redirect URIs**:
   - Click **"Add URI"**
   - Add: `http://localhost:8000/api/v1/auth/google/callback`
   - This is where Google will redirect after authentication

8. Click **"Create"**

9. A dialog will appear with your credentials:
   - **Client ID**: Something like `123456789-abcdefg.apps.googleusercontent.com`
   - **Client Secret**: Something like `GOCSPX-AbCdEfGhIjKlMnOpQrStUvWxYz`

   **IMPORTANT**: Copy both of these values now. You'll need them in the next step.

10. Click **"OK"** to close the dialog

---

## Step 5: Configure Backend Environment Variables

Now you'll add the OAuth credentials to your backend configuration.

1. Open the file: `backend/.env`

2. Add the following lines at the end of the file:

```bash
# Google OAuth Settings
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
GOOGLE_REDIRECT_URI=http://localhost:8000/api/v1/auth/google/callback
FRONTEND_URL=http://localhost:5173
```

3. Replace `your-client-id-here` with the **Client ID** you copied in Step 4

4. Replace `your-client-secret-here` with the **Client Secret** you copied in Step 4

5. Save the file

### Example .env file section:
```bash
# Google OAuth Settings
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-AbCdEfGhIjKlMnOpQrStUvWxYz
GOOGLE_REDIRECT_URI=http://localhost:8000/api/v1/auth/google/callback
FRONTEND_URL=http://localhost:5173
```

---

## Step 6: Restart the Application

After configuring the environment variables, you need to restart the backend for the changes to take effect.

### If using Docker Compose:
```bash
docker-compose down
docker-compose up --build
```

### If running locally:
```bash
# Stop the backend server (Ctrl+C)
cd backend
uvicorn app.main:app --reload
```

---

## Verification

To verify the setup is working:

1. Navigate to `http://localhost:5173/login`

2. You should see a **"Continue with Google"** button

3. Click the button - you should be redirected to Google's consent screen

4. Select your test user account

5. Grant permissions when prompted

6. You should be redirected back to your application dashboard

---

## Troubleshooting

### Error: "Access blocked: This app's request is invalid"

**Cause**: The OAuth consent screen is not configured correctly or the redirect URI doesn't match.

**Solution**:
- Double-check that the redirect URI in Google Cloud Console exactly matches: `http://localhost:8000/api/v1/auth/google/callback`
- Ensure you've added test users in the OAuth consent screen configuration
- Make sure your email is added as a test user

### Error: "redirect_uri_mismatch"

**Cause**: The redirect URI in your backend doesn't match what's configured in Google Cloud Console.

**Solution**:
- Check `backend/.env` - ensure `GOOGLE_REDIRECT_URI=http://localhost:8000/api/v1/auth/google/callback`
- Restart the backend after changing `.env`
- Verify the URI in Google Cloud Console matches exactly (including http://, not https://)

### Error: "The OAuth client was not found"

**Cause**: The Client ID in your `.env` file is incorrect.

**Solution**:
- Go back to Google Cloud Console → Credentials
- Copy the correct Client ID
- Update `GOOGLE_CLIENT_ID` in `backend/.env`
- Restart the backend

### Can't see "Continue with Google" button

**Cause**: The OAuth implementation may not be complete yet, or the backend is not running.

**Solution**:
- Ensure the backend migration has been applied
- Check backend logs for errors
- Verify the backend is running on port 8000

---

## Production Deployment

When deploying to production, you'll need to update:

1. **Google Cloud Console**:
   - Add your production domain to Authorized JavaScript origins
   - Add your production callback URI to Authorized redirect URIs
   - Example: `https://yourdomain.com/api/v1/auth/google/callback`
   - Change OAuth consent screen from "Testing" to "In production"

2. **Backend Environment**:
   - Update `GOOGLE_REDIRECT_URI` to your production callback URL
   - Update `FRONTEND_URL` to your production frontend URL
   - Use HTTPS for all URLs in production

3. **Security**:
   - Never commit `.env` files to version control
   - Use environment variables or secret management services
   - Rotate credentials periodically

---

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [People API Reference](https://developers.google.com/people)

---

## Support

If you encounter issues not covered in this guide, check:
- Backend logs: `docker-compose logs backend`
- Frontend console in browser DevTools
- Google Cloud Console error messages
