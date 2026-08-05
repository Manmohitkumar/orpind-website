## 16. Security Review

### OWASP Top 10 Mitigation

| Threat | Mitigation | Implementation |
|---|---|---|
| **A01: Broken Access Control** | RBAC + Ownership middleware | Every route checks auth + role + permission |
| **A02: Cryptographic Failures** | bcrypt (cost 12), AES-256 for secrets | Never store plaintext passwords |
| **A03: Injection** | Mongoose parameterized queries + validation | No raw queries, Joi/Zod validation |
| **A04: Insecure Design** | Threat modeling, secure architecture | Rate limiting, input validation |
| **A05: Security Misconfiguration** | Helmet, CORS, security headers | Production config audit |
| **A06: Vulnerable Components** | npm audit, Snyk scanning | CI pipeline dependency check |
| **A07: Auth Failures** | Account lockout, rate limiting | 5 attempts → lockout |
| **A08: Data Integrity** | Input validation, webhook verification | Razorpay HMAC verification |
| **A09: Logging Failures** | Comprehensive audit logging | All mutations logged |
| **A10: SSRF** | URL validation, allowlist | No user-supplied URLs server-side |

### Security Headers

```javascript
Helmet configuration:
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://js.razorpay.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https:", "*.cloudinary.com"],
      connectSrc: ["'self'", "https://api.razorpay.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
    }
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  frameguard: { action: "deny" },
  noSniff: true,
  xssFilter: true,
```

### CORS Configuration

```javascript
{
  origin: [
    'https://orpind.com',
    'https://www.orpind.com',
    'https://admin.orpind.com',
    'http://localhost:3000',
    'http://localhost:5173',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID', 'X-Idempotency-Key'],
  maxAge: 86400,
}
```

### Rate Limiting

```javascript
{
  global: { windowMs: 60000, max: 100 },        // 100 req/min/IP
  auth: { windowMs: 900000, max: 10 },          // 10 req/15min/IP
  otp: { windowMs: 300000, max: 3 },            // 3 req/5min/phone
  api: { windowMs: 60000, max: 60 },            // 60 req/min/user
  upload: { windowMs: 60000, max: 10 },         // 10 req/min/user
}
```

### Secrets Management

```
Development: .env.development (gitignored)
Staging: Environment variables in CI/CD
Production: AWS Secrets Manager / Railway env vars

Rules:
  - Never commit secrets to git
  - Rotate JWT secrets every 90 days
  - Rotate API keys every 180 days
  - Use different secrets per environment
  - Audit secret access
```

### Password Security

```
Hashing: bcrypt with cost factor 12
Minimum length: 8 characters
Required: uppercase, lowercase, number
Maximum length: 128 characters (prevent bcrypt DoS)
Banned: common passwords (HaveIBeenPwned API check)
```

### Input Sanitization

```javascript
// All user input sanitized before storage
sanitizeHtml(userInput, {
  allowedTags: [],           // no HTML allowed in most fields
  allowedAttributes: {},
});

// MongoDB query sanitization
// Mongoose prevents $ operators in user input
// Additional: reject fields starting with $
```

### Audit Trail

```
Every data mutation logged:
  - Who: userId
  - What: entity, entityId, action
  - When: timestamp
  - Where: IP address, user agent
  - Change diff: before → after

Stored in: audit_logs collection
Retention: 365 days (TTL index)
Queryable by: admin UI
```
