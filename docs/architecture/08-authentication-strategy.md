## 8. Authentication Strategy

### JWT Architecture

```
┌────────────────────────────────────────────────────┐
│                   AUTH FLOW                         │
│                                                     │
│  Client ─── Login ──→ Server                        │
│                         │                           │
│                    Validate Credentials             │
│                         │                           │
│                    Generate Token Pair              │
│                    ┌────┴────┐                      │
│                    │ Access  │ ← 15 min expiry      │
│                    │ Token   │   (httpOnly cookie)   │
│                    └─────────┘                      │
│                    ┌─────────┐                      │
│                    │Refresh  │ ← 7 days expiry      │
│                    │ Token   │   (httpOnly cookie)   │
│                    └─────────┘                      │
│                         │                           │
│                    Set-Cookie: Secure, HttpOnly,    │
│                    SameSite=Lax, Path=/             │
│                                                     │
│  ──── Subsequent Requests ────                      │
│                                                     │
│  Client ─── Request + Cookie ──→ Server             │
│                         │                           │
│                    Extract access_token             │
│                         │                           │
│                    Verify JWT signature             │
│                         │                           │
│                    Attach user to request           │
│                         │                           │
│                    Process & Respond                │
│                                                     │
│  ──── Token Refresh ────                            │
│                                                     │
│  Client ─── /auth/refresh ──→ Server                │
│                         │                           │
│                    Extract refresh_token            │
│                         │                           │
│                    Verify refresh token             │
│                         │                           │
│                    Check token not revoked          │
│                         │                           │
│                    Generate new access token        │
│                    (refresh token stays same)       │
│                         │                           │
│                    Set new access_token cookie      │
│                                                     │
└────────────────────────────────────────────────────┘
```

### Token Details

**Access Token Payload:**
```javascript
{
  sub: ObjectId,         // user ID
  role: String,          // "CUSTOMER"
  iat: Number,           // issued at
  exp: Number,           // expires (15 min)
  jti: String,           // unique token ID
}
```

**Refresh Token Payload:**
```javascript
{
  sub: ObjectId,         // user ID
  type: "refresh",
  iat: Number,
  exp: Number,           // 7 days
  jti: String,
  device: String,        // user agent fingerprint
}
```

### Token Storage

| Token | Storage | Security |
|---|---|---|
| Access Token | HttpOnly Cookie | Cannot be accessed by JavaScript |
| Refresh Token | HttpOnly Cookie | Separate cookie, longer expiry |
| CSRF Token | Double Submit Cookie | Custom header validation |

### Cookie Configuration

```javascript
// Access Token Cookie
{
  name: 'access_token',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 15 * 60 * 1000,     // 15 minutes
  path: '/',
}

// Refresh Token Cookie
{
  name: 'refresh_token',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
  path: '/api/v1/auth',        // only sent to auth endpoints
}
```

### Email Verification Flow

```
1. User registers → account created with isEmailVerified: false
2. Server generates verification token (crypto.randomBytes)
3. Token stored as emailVerificationToken (bcrypt hashed)
4. Verification email sent with link: /verify-email?token=xxx
5. User clicks link → server validates token → sets isEmailVerified: true
6. Token deleted after use
7. Token expires after 24 hours
```

### Password Reset Flow

```
1. User requests reset → server validates email exists
2. Server generates reset token (crypto.randomBytes)
3. Token stored as passwordResetToken (bcrypt hashed)
4. Reset email sent with link: /reset-password?token=xxx
5. User submits new password → server validates token
6. Password updated, passwordChangedAt set
7. All refresh tokens revoked (force re-login on all devices)
8. Token deleted after use
9. Token expires after 1 hour
```

### OTP Login Flow

```
1. User enters phone number
2. Server generates 6-digit OTP
3. OTP stored in Redis with 5-minute TTL: otp:{phone}: { code, attempts: 0 }
4. OTP sent via MSG91
5. User enters OTP → server validates against Redis
6. If valid: create/find user by phone, generate tokens
7. If invalid: increment attempts, block after 5 failed attempts (15-min lockout)
8. OTP deleted after use or expiry
```

### Google OAuth Flow

```
1. Client redirects to Google OAuth consent screen
2. Google returns authorization code
3. Client sends code to server
4. Server exchanges code for Google tokens
5. Server fetches user info from Google
6. Server finds/creates user by email
7. If new user: create account, set isEmailVerified: true
8. Generate JWT tokens
9. Set cookies and redirect to client
```

### Session Management

- Store active sessions in user document: `refreshTokens[]`
- Maximum 5 concurrent sessions (devices)
- Each session tracks: device info, IP, creation time, expiry
- User can view and revoke individual sessions
- Old sessions auto-cleaned on refresh

### Account Lockout

```
Redis key: lockout:{userId}
Rules:
  - 5 failed login attempts → lock for 15 minutes
  - 15 total failures in 24 hours → lock for 1 hour
  - Successful login → reset failure counter
  - Lockout notification email sent to user
```

### Remember Me

```
If "remember me" checked:
  - Access token: 7 days
  - Refresh token: 30 days
  - Stored in separate cookie: remember_me=true

If not checked:
  - Access token: 15 minutes (session cookie — browser close clears it)
  - Refresh token: 7 days
```
