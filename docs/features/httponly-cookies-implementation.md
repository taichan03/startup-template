# httpOnly Cookies Implementation

## Overview

This application now uses **httpOnly cookies** for storing authentication tokens instead of localStorage, providing better security against XSS attacks.

## Security Benefits

### Previous Implementation (localStorage)
❌ **Vulnerable to XSS**: Any injected JavaScript could steal tokens with `localStorage.getItem('access_token')`
✅ **Persists across refreshes**: User stays logged in

### New Implementation (httpOnly Cookies)
✅ **Protected from XSS**: Cookies marked `httpOnly` cannot be accessed by JavaScript
✅ **Persists across refreshes**: Cookies are sent automatically with requests
✅ **CSRF Protection**: Using `samesite="lax"` to prevent CSRF attacks
✅ **Secure in production**: `secure` flag ensures cookies only sent over HTTPS

## Backend Changes

### 1. Auth Endpoints Updated

**[backend/app/api/v1/routers/auth.py](../backend/app/api/v1/routers/auth.py)**

- `/api/v1/auth/login` - Sets httpOnly cookies in response
- `/api/v1/auth/refresh` - Reads refresh token from cookie, sets new cookies
- `/api/v1/auth/logout` - Clears cookies
- `/api/v1/auth/google/callback` - Sets cookies after OAuth flow

### 2. Token Reading from Cookies

**[backend/app/api/deps.py](../backend/app/api/deps.py)**

The `get_current_user` dependency now:
1. Tries to read access token from `access_token` cookie first
2. Falls back to Authorization header (for backward compatibility)
3. Validates token and returns user

### 3. Cookie Configuration

**[backend/app/core/config.py](../backend/app/core/config.py)**

New setting: `SECURE_COOKIES` (default: `False` for development)

**Development (.env):**
```env
SECURE_COOKIES=False  # Allows cookies over HTTP
```

**Production (.env.production):**
```env
SECURE_COOKIES=True  # Requires HTTPS
```

### 4. CORS Configuration

**[backend/app/main.py](../backend/app/main.py)**

CORS already configured with:
```python
allow_credentials=True  # Required for cookies
```

## Frontend Changes

### 1. API Client Updated

**[frontend/src/services/api.ts](../frontend/src/services/api.ts)**

**Removed:**
- All localStorage calls
- Token storage in memory
- `saveTokens()`, `loadTokens()`, `clearTokens()` methods

**Added:**
- `credentials: 'include'` to all fetch requests (sends cookies)
- Automatic token refresh using cookie-based refresh token

### 2. OAuth Callback Updated

**[frontend/src/pages/OAuthCallback.tsx](../frontend/src/pages/OAuthCallback.tsx)**

- No longer extracts tokens from URL parameters
- Cookies are already set by backend redirect
- Simply redirects to dashboard

### 3. Auth Hook Updated

**[frontend/src/hooks/useAuth.tsx](../frontend/src/hooks/useAuth.tsx)**

- Checks authentication by attempting to fetch current user
- No longer checks localStorage for tokens

## Cookie Details

### Access Token Cookie
- **Name:** `access_token`
- **HttpOnly:** `true` (not accessible via JavaScript)
- **Secure:** `true` in production (HTTPS only)
- **SameSite:** `lax` (CSRF protection)
- **Max-Age:** 30 minutes (1800 seconds)

### Refresh Token Cookie
- **Name:** `refresh_token`
- **HttpOnly:** `true`
- **Secure:** `true` in production
- **SameSite:** `lax`
- **Max-Age:** 7 days (604800 seconds)

## Testing

### Manual Testing

1. **Login Flow:**
   ```bash
   # Start services
   docker-compose up

   # Open browser to http://localhost:5173
   # Login with credentials
   # Open DevTools > Application > Cookies
   # Verify 'access_token' and 'refresh_token' cookies exist
   # Verify cookies are marked 'HttpOnly'
   ```

2. **Token Refresh:**
   - Wait 30 minutes or manually delete `access_token` cookie
   - Make an authenticated request
   - New `access_token` cookie should be automatically set

3. **Logout:**
   - Click logout
   - Verify both cookies are deleted

4. **XSS Protection:**
   - Open browser console
   - Try: `document.cookie` - should NOT show access_token or refresh_token
   - This confirms httpOnly protection

### API Testing with cURL

```bash
# Login (get cookies)
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin@example.com&password=admin123" \
  -c cookies.txt

# Make authenticated request (send cookies)
curl -X GET http://localhost:8000/api/v1/users/me \
  -b cookies.txt

# Logout (clear cookies)
curl -X POST http://localhost:8000/api/v1/auth/logout \
  -b cookies.txt \
  -c cookies.txt
```

## Migration Notes

### For Existing Users

Users with tokens in localStorage will be automatically logged out after this update. They need to log in again to get httpOnly cookies.

### Clearing Old Tokens (Optional)

Add this one-time cleanup to your app startup:
```typescript
// In App.tsx or main.tsx (run once on app load)
if (localStorage.getItem('access_token') || localStorage.getItem('refresh_token')) {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  console.log('Migrated to httpOnly cookies - please log in again')
}
```

## Production Deployment

### Environment Variables

Ensure these are set in production:

```env
# .env.production
SECURE_COOKIES=True  # Requires HTTPS
BACKEND_CORS_ORIGINS=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

### HTTPS Requirement

With `SECURE_COOKIES=True`, cookies will ONLY be sent over HTTPS. Ensure:
1. Your production server uses HTTPS
2. Your domain has a valid SSL certificate
3. HTTP requests redirect to HTTPS

### Cookie Domain (Advanced)

For subdomain configurations, add to config.py:

```python
COOKIE_DOMAIN: Optional[str] = None  # e.g., ".yourdomain.com"
```

And update cookie settings:
```python
response.set_cookie(
    key="access_token",
    value=access_token,
    domain=settings.COOKIE_DOMAIN,  # Share across subdomains
    # ... other settings
)
```

## Troubleshooting

### Cookies Not Being Set

**Problem:** Login succeeds but no cookies in browser

**Solutions:**
1. Check CORS origins include your frontend URL
2. Verify `allow_credentials=True` in CORS middleware
3. Check browser console for CORS errors
4. Ensure `credentials: 'include'` in fetch requests

### Cookies Not Being Sent

**Problem:** API returns 401 even after login

**Solutions:**
1. Verify `credentials: 'include'` in all fetch calls
2. Check cookies exist in DevTools > Application > Cookies
3. Verify same domain (or CORS configured correctly)
4. Check cookie hasn't expired

### Development HTTPS Issues

**Problem:** `SECURE_COOKIES=True` doesn't work in development

**Solution:**
Set `SECURE_COOKIES=False` for development (HTTP). Only use `True` in production with HTTPS.

## Additional Security Considerations

### CSRF Tokens (Optional Enhancement)

While `samesite="lax"` provides good CSRF protection, for extra security you can add CSRF tokens:

1. Generate CSRF token on login
2. Store in non-httpOnly cookie (readable by JS)
3. Require CSRF token header on state-changing requests (POST, PUT, DELETE)

### Token Rotation

Current implementation rotates refresh tokens on every refresh. This provides:
- Single-use refresh tokens
- Automatic token family invalidation if old refresh token used

### Rate Limiting

Consider adding rate limiting to:
- `/api/v1/auth/login` - Prevent brute force
- `/api/v1/auth/refresh` - Prevent refresh token abuse

## References

- [OWASP httpOnly Cookie](https://owasp.org/www-community/HttpOnly)
- [MDN Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
- [SameSite Cookies Explained](https://web.dev/samesite-cookies-explained/)
